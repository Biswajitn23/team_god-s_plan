export async function generateOpenRouterAnswer(prompt: string, systemPrompt: string = ""): Promise<{ text: string }> {
  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!API_KEY) {
    throw new Error("OPENROUTER_API_KEY_MISSING");
  }

  // Comprehensive list of models (auto router + top free & fast models)
  const modelsList = [
    "openrouter/auto",
    "google/gemini-2.0-flash-exp:free",
    "google/gemini-2.0-flash-thinking-exp:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "qwen/qwen-2.5-7b-instruct:free",
    "mistralai/mistral-small-24b-instruct-2501:free",
    "deepseek/deepseek-r1:free",
    "deepseek/deepseek-chat:free"
  ];

  // 1. First attempt: Use OpenRouter's native multi-model fallback array
  try {
    console.log("OpenRouter: Attempting multi-model fallback routing...");
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "AyuSetu",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        models: modelsList,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        return { text: content };
      }
    }
  } catch (err) {
    console.warn("OpenRouter multi-model payload attempt failed, falling back to sequential iteration:", err);
  }

  // 2. Second attempt: Iterate through each model individually
  let lastError: any = null;

  for (const model of modelsList) {
    try {
      console.log(`OpenRouter Switcher: Trying ${model}...`);
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "AyuSetu",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return { text: content };
        }
      }
      
      const errorBody = await response.json().catch(() => ({}));
      lastError = new Error(`OpenRouter API error: ${response.status} - ${JSON.stringify(errorBody)}`);
      console.warn(`OpenRouter model ${model} returned ${response.status}, trying next model...`);

    } catch (err: any) {
      lastError = err;
      console.warn(`OpenRouter model ${model} network error, trying next...`, err);
    }
  }

  throw lastError || new Error("All OpenRouter models failed to respond.");
}
