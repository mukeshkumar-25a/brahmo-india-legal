import { NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';
import { supabase } from '@/lib/supabase';
import { ClassifyQueryRequest, ClassifyQueryResponse } from '@/lib/types';

const SYSTEM_PROMPT = `You are an expert legal case classifier for India.
Given a natural language query from a lawyer, classify it into the appropriate legal template categories.
Your response MUST be a valid JSON object with the following schema:
{
  "practice_area": "criminal" | "corporate" | "family" | "property",
  "document_type": "anticipatory_bail" | "fir_quashing" | "nda_review" | "nclt_petition" | "unknown",
  "court_type": "high_court" | "sessions_court" | "tribunal" | "na" | "unknown"
}

Guidance:
- "bail" or "anticipatory bail" typically maps to criminal -> anticipatory_bail. For Delhi, usually high_court or sessions_court depending on severity/facts, default to high_court if unspecified but check context.
- "quashing" maps to criminal -> fir_quashing -> high_court.
- "nda" or "non-disclosure" maps to corporate -> nda_review -> na.
- "nclt", "oppression", "minority shareholder" maps to corporate -> nclt_petition -> tribunal.
Output ONLY JSON.`;

export async function POST(req: Request) {
  try {
    const body: ClassifyQueryRequest = await req.json();
    
    // Use LLM to classify
    const classificationText = await callLLM(SYSTEM_PROMPT, body.query, true);
    
    // Parse JSON
    let classification: ClassifyQueryResponse;
    try {
      // Handle potential markdown block formatting from LLM
      const cleanedText = classificationText.replace(/```json/g, '').replace(/```/g, '').trim();
      classification = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse classification JSON", classificationText);
      return NextResponse.json({ error: "Failed to classify query." }, { status: 500 });
    }

    // Try to find matching template in DB
    const { data: templates, error } = await supabase
      .from('legal_templates')
      .select('template_id, practice_area, document_type, court_type')
      .eq('practice_area', classification.practice_area)
      .eq('document_type', classification.document_type)
      .eq('court_type', classification.court_type);

    if (error) {
      console.error("Supabase error fetching templates:", error);
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
    }

    if (templates && templates.length > 0) {
      classification.template_id = templates[0].template_id;
    } else {
      // Fallback matching if exact court_type doesn't match but others do
      const { data: fallbackTemplates, error: fallbackError } = await supabase
        .from('legal_templates')
        .select('template_id')
        .eq('practice_area', classification.practice_area)
        .eq('document_type', classification.document_type)
        .limit(1);
        
      if (fallbackError) {
        return NextResponse.json({ error: `Database fallback error: ${fallbackError.message}` }, { status: 500 });
      }
        
      if (fallbackTemplates && fallbackTemplates.length > 0) {
        classification.template_id = fallbackTemplates[0].template_id;
      } else {
        // Return a detailed error if no template is found at all
        return NextResponse.json({ 
          error: `No template matched in DB. LLM classified as: Practice Area='${classification.practice_area}', Document Type='${classification.document_type}', Court Type='${classification.court_type}'. Please check if a matching row exists in the legal_templates table.` 
        }, { status: 400 });
      }
    }

    return NextResponse.json(classification);
  } catch (err: any) {
    console.error("Error in classify-query:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
