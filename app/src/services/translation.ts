import { generateOpenRouterAnswer } from './openrouter';

const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY || "sk_ati8d224_5sYLv3Wg0JyltcDiF9N35wig";

// BCP-47 language codes mapping for Sarvam AI
const sarvamLanguageMap: Record<string, string> = {
  'en': 'en-IN',
  'hi': 'hi-IN',
  'bn': 'bn-IN',
  'te': 'te-IN',
  'mr': 'mr-IN',
  'ta': 'ta-IN',
  'kn': 'kn-IN',
  'ml': 'ml-IN',
  'gu': 'gu-IN',
  'pa': 'pa-IN',
  'or': 'od-IN',
  'od': 'od-IN',
};

// In-memory cache to prevent duplicate API hits
const memoryTranslationCache: Record<string, string> = {};

/**
 * Translate text using Sarvam AI (Primary) with fallback to LibreTranslate & OpenRouter
 */
export const translateText = async (
  text: string, 
  targetLang: string = 'hi', 
  sourceLang: string = 'en'
): Promise<string> => {
  if (!text || sourceLang === targetLang) return text;
  
  const cacheKey = `${sourceLang}->${targetLang}:${text}`;
  if (memoryTranslationCache[cacheKey]) {
    return memoryTranslationCache[cacheKey];
  }

  const srcCode = sarvamLanguageMap[sourceLang] || `${sourceLang}-IN`;
  const tgtCode = sarvamLanguageMap[targetLang] || `${targetLang}-IN`;

  // 1. PRIMARY: Sarvam AI High-Quality Indic Translation
  const endpoints = [
    "/api-sarvam/translate",
    "https://api.sarvam.ai/translate"
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": SARVAM_API_KEY
        },
        body: JSON.stringify({
          input: text,
          source_language_code: srcCode,
          target_language_code: tgtCode,
          model: "sarvam-translate:v1",
          mode: "formal"
        }),
        signal: AbortSignal.timeout(8000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.translated_text) {
          const result = data.translated_text.trim();
          memoryTranslationCache[cacheKey] = result;
          return result;
        }
      } else {
        const err = await response.json().catch(() => ({}));
        console.warn(`Sarvam AI error on ${endpoint} (${response.status}):`, err);
      }
    } catch (err) {
      console.warn(`Sarvam AI connection failed on ${endpoint}:`, err);
    }
  }

  // 2. SECONDARY: LibreTranslate Fallback
  const libreServers = [
    "/api-translate/translate",
    "/api-translate-mirror/translate",
    "https://translate.terraprint.co/translate"
  ];

  for (const url of libreServers) {
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
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.translatedText) {
          const result = data.translatedText.trim();
          memoryTranslationCache[cacheKey] = result;
          return result;
        }
      }
    } catch {
      // Continue to next fallback
    }
  }

  // 3. TERTIARY: OpenRouter AI Fallback
  try {
    const prompt = `Translate to ${targetLang}: "${text}". Respond with only translated text.`;
    const res = await generateOpenRouterAnswer(prompt, "You are an expert agricultural translator.");
    const result = res.text.trim();
    memoryTranslationCache[cacheKey] = result;
    return result;
  } catch (aiError) {
    console.error("All translation services failed, returning original text:", aiError);
    return text;
  }
};
