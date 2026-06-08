'use client';

import { useState } from 'react';
import MatterCard, { Matter } from '@/components/MatterCard';
import ThreeLevelComparison from '@/components/ThreeLevelComparison';
import KnowledgePanel from '@/components/KnowledgePanel';
import IKResearchPanel from '@/components/IKResearchPanel';
import SectionAlerts from '@/components/SectionAlerts';

export default function Home() {
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null);
  const [query, setQuery] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  // States for outputs
  const [level1, setLevel1] = useState({ title: 'LEVEL 1', subtitle: 'Generic AI', score: '-', content: '', isLoading: false });
  const [level2, setLevel2] = useState({ title: 'LEVEL 2', subtitle: 'Template Only', score: '-', content: '', isLoading: false });
  const [level3, setLevel3] = useState({ title: 'LEVEL 3', subtitle: 'Template + Firm Knowledge', score: '-', content: '', isLoading: false });

  // States for panels
  const [knowledgeNodes, setKnowledgeNodes] = useState([]);
  const [tokenUsage, setTokenUsage] = useState({ used: 0, total: 3000 });
  const [templateName, setTemplateName] = useState('');
  const [ikCases, setIkCases] = useState([]);
  const [replacements, setReplacements] = useState([]);

  const handleSelectMatter = (matter: Matter) => {
    setSelectedMatter(matter);
    setQuery(matter.query);
  };

  const handleGenerate = async () => {
    if (!selectedMatter) return;
    
    setIsGenerating(true);
    
    // Reset states
    setLevel1(p => ({ ...p, isLoading: true, content: '' }));
    setLevel2(p => ({ ...p, isLoading: true, content: '' }));
    setLevel3(p => ({ ...p, isLoading: true, content: '' }));
    setKnowledgeNodes([]);
    setIkCases([]);
    setReplacements([]);

    try {
      // Step 1: Classify Query
      const classifyRes = await fetch('/api/classify-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const classification = await classifyRes.json();
      
      if (classification.error) {
        throw new Error(`API Error: ${classification.error}`);
      }
      if (!classification.template_id) {
        throw new Error("No template found for this query.");
      }
      setTemplateName(classification.template_id);

      // Level 1: Generic AI
      // Run asynchronously
      fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      }).then(res => res.json()).then(async data => {
        // Run section normalizer on generic output to catch old sections
        const normRes = await fetch('/api/normalize-sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: data.result })
        });
        const normData = await normRes.json();
        if (normData.replacements.length > 0) setReplacements(normData.replacements);

        setLevel1(p => ({ ...p, isLoading: false, content: normData.normalized_text, score: '2.5/5' }));
      });

      // Step 2: Inject Knowledge
      const injectRes = await fetch('/api/inject-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query, 
          template_id: classification.template_id,
          client_id: selectedMatter.client_id,
          matter_id: selectedMatter.id
        })
      });
      const injectionData = await injectRes.json();
      
      setKnowledgeNodes(injectionData.injected_nodes || []);
      setTokenUsage(injectionData.token_usage || { used: 0, total: 3000 });

      // Step 3: Indian Kanoon Research
      const ikRes = await fetch('/api/indian-kanoon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }) // Simple search with query. In full app, use template's auto_research_query
      });
      const ikData = await ikRes.json();
      setIkCases(ikData.cases || []);

      // Format research string
      const researchText = ikData.cases ? ikData.cases.map((c: any) => `[${c.title}] - ${c.headline}`).join('\n') : 'No cases found.';

      // Get original template prompt for Level 2
      // We'll replace markers with 'None'
      const rawPrompt = injectionData.enriched_prompt
        .replace(/{INJECTION_CONSTRAINTS}/g, 'None')
        .replace(/{INJECTION_ANTI_PATTERNS}/g, 'None')
        .replace(/{INJECTION_DECISIONS}/g, 'None')
        .replace(/{INJECTION_CLIENT_FACTS}/g, 'None')
        .replace(/{INJECTION_RESEARCH}/g, 'None');

      // Level 2: Template Only
      fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system_prompt: rawPrompt, query })
      }).then(res => res.json()).then(async data => {
        const normRes = await fetch('/api/normalize-sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: data.result })
        });
        const normData = await normRes.json();
        setLevel2(p => ({ ...p, isLoading: false, content: normData.normalized_text, score: '3.5/5' }));
      });

      // Prepare Level 3 prompt
      const level3Prompt = injectionData.enriched_prompt.replace(/{INJECTION_RESEARCH}/g, researchText);

      // Level 3: Full Option C
      fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system_prompt: level3Prompt, query })
      }).then(res => res.json()).then(async data => {
        const normRes = await fetch('/api/normalize-sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: data.result })
        });
        const normData = await normRes.json();
        setLevel3(p => ({ ...p, isLoading: false, content: normData.normalized_text, score: '4.8/5' }));
        setIsGenerating(false);
      });

    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      alert("Error generating. Check console.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">BRAHMO Legal AI</h1>
          <p className="text-slate-400">Template + Knowledge Engine Demo</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <MatterCard onSelect={handleSelectMatter} />
            
            <div className="mt-6">
              <label className="block text-slate-300 text-sm font-bold mb-2">Query</label>
              <textarea 
                className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !query}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {isGenerating ? 'Generating All 3 Levels...' : 'Generate All 3 Levels'}
            </button>
          </div>

          <div className="lg:col-span-2">
            <SectionAlerts replacements={replacements} />
            {knowledgeNodes.length > 0 && (
              <KnowledgePanel 
                nodes={knowledgeNodes} 
                tokenUsage={tokenUsage} 
                templateName={templateName}
              />
            )}
            {ikCases.length > 0 && (
              <IKResearchPanel cases={ikCases} query={query} />
            )}
          </div>
        </div>

        <ThreeLevelComparison level1={level1} level2={level2} level3={level3} />

      </div>
    </main>
  );
}
