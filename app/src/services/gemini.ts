export async function generateGeminiAnswer(prompt: string, systemPrompt: string = ""): Promise<{ text: string }> {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  // Variations to try if one fails with 404
  const variations = [
    { ver: 'v1beta', mod: 'gemini-1.5-flash' },
    { ver: 'v1', mod: 'gemini-1.5-flash' },
    { ver: 'v1beta', mod: 'gemini-pro' },
    { ver: 'v1', mod: 'gemini-pro' },
  ];

  let lastError: any = null;

  for (const variant of variations) {
    try {
      const url = `https://generativelanguage.googleapis.com/${variant.ver}/models/${variant.mod}:generateContent?key=${API_KEY}`;
      console.log(`Gemini Switcher: Trying ${variant.ver}/${variant.mod}...`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}` }] }]
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";
        return { text: text.trim() };
      }
      
      const errorBody = await response.json().catch(() => ({}));
      lastError = new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorBody)}`);
      
      // If not a 404, or if it's a 429/500, we might want to stop early, but for 404 let's keep trying
      if (response.status !== 404) break; 
      
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to connect to any Gemini model variation.");
}
