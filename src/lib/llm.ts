export async function callLLM(systemPrompt: string, userPrompt: string, isJson: boolean = false): Promise<string> {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    throw new Error('LLM_API_KEY is not set');
  }

  // To make this robust, we'll try to detect the provider based on the key prefix or default to Anthropic
  // Anthropic keys start with 'sk-ant'
  // OpenAI keys start with 'sk-proj' or 'sk-'
  // Gemini keys typically don't have a standard prefix, but usually shorter.

  if (apiKey.startsWith('sk-ant')) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        system: systemPrompt,
        max_tokens: 1500,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text;
  } else if (apiKey.startsWith('sk-')) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: isJson ? { type: "json_object" } : { type: "text" },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  } else {
    // Array of Gemini models to try in order of preference
    const fallbackModels = [
      'gemini-flash-latest',
      'gemini-2.5-flash',
      'gemini-pro-latest',
      'gemini-2.0-flash-lite'
    ];

    let lastError = new Error('No Gemini models available');

    for (const model of fallbackModels) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemPrompt }]
            },
            contents: [{
              role: 'user',
              parts: [{ text: userPrompt }]
            }],
            generationConfig: isJson ? { responseMimeType: "application/json" } : {}
          })
        });
        
        const data = await response.json();
        
        // If the API returns an error (like quota exceeded or high demand), throw it so the catch block moves to the next model
        if (data.error) {
          throw new Error(`[${model}] ${data.error.message}`);
        }
        
        // If successful, return the text immediately
        return data.candidates[0].content.parts[0].text;
      } catch (err: any) {
        console.warn(`Failed with ${model}:`, err.message);
        lastError = err; // Save the error and continue to the next model
      }
    }

    // If we exhaust all fallback models, throw the last error we received
    throw lastError;
  }
}
