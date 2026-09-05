import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { translateText } from '../services/translation';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: any;
  dynamicTranslate: (text: string) => Promise<string>;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>(() => {
    try {
      return localStorage.getItem('app_language') || 'en';
    } catch {
      return 'en';
    }
  });
  const [translations, setTranslations] = useState<any>({});
  const [translationCache, setTranslationCache] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/translations/${language}.json`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error(`Could not load translation for ${language}`, error);
        // Fallback to English
        if (language !== 'en') {
          const res = await fetch(`/translations/en.json`, { cache: 'no-store' });
          const data = await res.json();
          setTranslations(data);
        }
      }
    };

    loadTranslations();
  }, [language]);

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  // High-performance dynamic translation using LibreTranslate
  const dynamicTranslate = useCallback(async (text: string): Promise<string> => {
    if (!text || language === 'en') return text;
    
    const cacheKey = `${language}:${text}`;
    if (translationCache[cacheKey]) return translationCache[cacheKey];

    const result = await translateText(text, language, 'en');
    setTranslationCache(prev => ({ ...prev, [cacheKey]: result }));
    return result;
  }, [language, translationCache]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, dynamicTranslate }}>
      {children}
    </LanguageContext.Provider>
  );
};
