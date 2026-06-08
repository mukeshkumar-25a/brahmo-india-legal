import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { NormalizeSectionsRequest, NormalizeSectionsResponse } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body: NormalizeSectionsRequest = await req.json();
    let { text } = body;

    // Fetch mappings
    const { data: mappings, error } = await supabase
      .from('section_mappings')
      .select('old_section, new_section');

    if (error) {
      throw new Error("Failed to fetch section mappings");
    }

    const replacements: { old: string; new: string }[] = [];

    // Simple string replacement for normalization.
    // In a production system, this could be a more robust regex or NLP matcher.
    mappings?.forEach(mapping => {
      // Create a regex to match the exact old section to avoid partial word matches
      // e.g., "Section 420 IPC"
      const regex = new RegExp(mapping.old_section, 'gi');
      if (regex.test(text)) {
        replacements.push({ old: mapping.old_section, new: mapping.new_section });
        text = text.replace(regex, mapping.new_section);
      }
    });

    const response: NormalizeSectionsResponse = {
      normalized_text: text,
      replacements
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Error in normalize-sections:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
