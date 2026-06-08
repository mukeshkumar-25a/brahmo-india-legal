import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { InjectKnowledgeRequest, InjectKnowledgeResponse, KnowledgeNode } from '@/lib/types';

// Rough token estimation (1 token ≈ 4 chars)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function rankNodes(nodes: KnowledgeNode[], query: string): KnowledgeNode[] {
  // A simple relevance ranking algorithm:
  // 1. Tag matching against query
  // 2. Keyword matching in content
  const lowerQuery = query.toLowerCase();
  
  return nodes.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    a.tags.forEach(tag => { if (lowerQuery.includes(tag.toLowerCase())) scoreA += 2; });
    b.tags.forEach(tag => { if (lowerQuery.includes(tag.toLowerCase())) scoreB += 2; });

    if (lowerQuery.includes(a.title.toLowerCase())) scoreA += 1;
    if (lowerQuery.includes(b.title.toLowerCase())) scoreB += 1;

    // We also want to group by type priority conceptually, but priority is handled during truncation
    return scoreB - scoreA;
  });
}

export async function POST(req: Request) {
  try {
    const body: InjectKnowledgeRequest = await req.json();
    const { query, template_id, client_id, matter_id } = body;

    // 1. Fetch template
    const { data: templateData, error: templateError } = await supabase
      .from('legal_templates')
      .select('*')
      .eq('template_id', template_id)
      .single();

    if (templateError || !templateData) {
      throw new Error(`Template not found: ${template_id}`);
    }

    // 2. Fetch knowledge nodes for the practice area or specific client/matter
    // To handle overlap, we should also fetch client specific nodes regardless of practice area
    const { data: nodesData, error: nodesError } = await supabase
      .from('knowledge_nodes')
      .select('*')
      .or(`practice_area.eq.${templateData.practice_area},client_id.eq.${client_id},matter_id.eq.${matter_id}`);

    if (nodesError) {
      throw new Error("Failed to fetch knowledge nodes");
    }

    let allNodes: KnowledgeNode[] = nodesData || [];
    
    // 3. Rank by relevance
    allNodes = rankNodes(allNodes, query);

    // 4. Enforce Token Budget (3000 max)
    const MAX_TOKENS = 3000;
    let currentTokens = estimateTokens(templateData.system_prompt); // Base cost

    // Separate nodes by type
    const constraints = allNodes.filter(n => n.node_type === 'CONSTRAINT');
    const antiPatterns = allNodes.filter(n => n.node_type === 'ANTI_PATTERN');
    const decisions = allNodes.filter(n => n.node_type === 'DECISION');
    const clientFacts = allNodes.filter(n => n.node_type === 'CLIENT_FACT');

    const selectedNodes: KnowledgeNode[] = [];
    const groupedInjections = {
      CONSTRAINTS: [] as string[],
      ANTI_PATTERNS: [] as string[],
      DECISIONS: [] as string[],
      CLIENT_FACTS: [] as string[]
    };

    // Helper to add nodes by priority
    const addNodes = (nodes: KnowledgeNode[], group: string[]) => {
      for (const node of nodes) {
        const nodeText = `- [${node.title}] ${node.content}`;
        const nodeTokens = estimateTokens(nodeText);
        if (currentTokens + nodeTokens <= MAX_TOKENS) {
          group.push(nodeText);
          selectedNodes.push(node);
          currentTokens += nodeTokens;
        } else {
          // If we hit limit on lower priority, we stop.
          // Note: CONSTRAINTs are priority 1, they are added first so they never truncate unless constraints alone > 3000.
        }
      }
    };

    // Priority: CONSTRAINT > ANTI_PATTERN > DECISION > CLIENT_FACT
    addNodes(constraints, groupedInjections.CONSTRAINTS);
    addNodes(antiPatterns, groupedInjections.ANTI_PATTERNS);
    addNodes(decisions, groupedInjections.DECISIONS);
    addNodes(clientFacts, groupedInjections.CLIENT_FACTS);

    // 5. Replace markers in template
    let enrichedPrompt = templateData.system_prompt;
    enrichedPrompt = enrichedPrompt.replace('{INJECTION_CONSTRAINTS}', groupedInjections.CONSTRAINTS.join('\n') || 'None');
    enrichedPrompt = enrichedPrompt.replace('{INJECTION_ANTI_PATTERNS}', groupedInjections.ANTI_PATTERNS.join('\n') || 'None');
    enrichedPrompt = enrichedPrompt.replace('{INJECTION_DECISIONS}', groupedInjections.DECISIONS.join('\n') || 'None');
    enrichedPrompt = enrichedPrompt.replace('{INJECTION_CLIENT_FACTS}', groupedInjections.CLIENT_FACTS.join('\n') || 'None');

    const response: InjectKnowledgeResponse = {
      enriched_prompt: enrichedPrompt,
      injected_nodes: selectedNodes,
      token_usage: {
        used: currentTokens,
        total: MAX_TOKENS
      }
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Error in inject-knowledge:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
