import { generateOpenRouterAnswer } from './openrouter';

export const translateText = async (text: string, targetLang: string = 'hi', sourceLang: string = 'en') => {
  if (!text || sourceLang === targetLang) return text;
  
  // 1. Try LibreTranslate (Primary + Mirror Fallback)
  // Using local proxies defined in vite.config.ts to avoid CORS and SSL issues
  const servers = [
    "/api-translate/translate",
    "/api-translate-mirror/translate"
  ];

  for (const url of servers) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: "text"
        }),
        signal: AbortSignal.timeout(10000) // 10s timeout for stability
      });

      if (response.ok) {
        const data = await response.json();
        if (data.translatedText) return data.translatedText;
      }
    } catch (error) {
      console.warn(`Translation attempt failed at ${url}:`, error);
    }
  }

  console.warn("All LibreTranslate servers failed, falling back to AI...");

  // 2. Fallback to Smart AI (Resilient Backup)
  try {
    const prompt = `Translate to ${targetLang}: "${text}". Respond with only translated text.`;
    // We only use OpenRouter for translation; we DO NOT use the Mock Assistant fallback here
    const res = await generateOpenRouterAnswer(prompt, "You are a professional agricultural translator.");
    return res.text.trim();
  } catch (aiError) {
    console.error("All translation services failed, returning original text:", aiError);
    return text; // Final fallback: showing the original English is better than showing an error message
  }
};
