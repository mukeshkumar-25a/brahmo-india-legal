import { NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';

export async function POST(req: Request) {
  try {
    const { system_prompt, query } = await req.json();
    
    // Fallback to basic assistant prompt if no system prompt provided (Level 1)
    const promptToUse = system_prompt || "You are a helpful legal assistant.";
    
    const result = await callLLM(promptToUse, query);
    
    return NextResponse.json({ result });
  } catch (err: any) {
    console.error("Error in claude route:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
