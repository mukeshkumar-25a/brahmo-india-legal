import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { IndianKanoonRequest, IndianKanoonResponse, IKCase } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body: IndianKanoonRequest = await req.json();
    const { query } = body;

    // 1. Check cache first
    const { data: cached, error: cacheError } = await supabase
      .from('ik_case_cache')
      .select('*')
      .eq('search_query', query)
      .single();

    if (!cacheError && cached) {
      return NextResponse.json({ cases: cached.results as IKCase[] });
    }

    // 2. Fetch from IK API
    const apiKey = process.env.INDIAN_KANOON_API_KEY;
    if (!apiKey) {
      // Mock mode if no key provided
      const mockCases: IKCase[] = [
        { docid: 195847623, title: "Siddharth vs State Of Uttar Pradesh", headline: "...anticipatory bail should not be denied as a matter of course...", citation: "(2021) 10 SCC 1" },
        { docid: 198234567, title: "Satender Kumar Antil vs Central Bureau Of Investigation", headline: "...classification of offences for bail purposes...", citation: "(2022) 10 SCC 51" },
        { docid: 123456789, title: "Mock Case - Please Add Real API Key", headline: "This is a mock response because INDIAN_KANOON_API_KEY is not set in .env.local" }
      ];
      return NextResponse.json({ cases: mockCases });
    }

    const response = await fetch('https://api.indiankanoon.org/search/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formInput: query, pagenum: 0 })
    });

    if (!response.ok) {
      throw new Error(`IK API responded with ${response.status}`);
    }

    const data = await response.json();
    
    // 3. Process top 5 results
    const cases: IKCase[] = (data.docs || []).slice(0, 5).map((doc: any) => ({
      docid: doc.docid,
      title: doc.title,
      headline: doc.headline,
      date: doc.publishdate
    }));

    // Optionally, could call /docmeta/ here to get exact citations, but to save time/cost we just cache the basic results
    
    // 4. Cache results
    if (cases.length > 0) {
      await supabase.from('ik_case_cache').insert({
        search_query: query,
        results: cases
      });
    }

    return NextResponse.json({ cases });
  } catch (err: any) {
    console.error("Error in indian-kanoon:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
