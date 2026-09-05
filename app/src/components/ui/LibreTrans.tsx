import { useState, useEffect } from 'react';
import { useTranslation } from '../../context/useTranslation';

interface LibreTransProps {
  text: string;
  className?: string;
  isTitle?: boolean;
}

export const LibreTrans = ({ text, className = "", isTitle = false }: LibreTransProps) => {
  const { language, dynamicTranslate, translations } = useTranslation();
  // INSTANT: Use static translation as initial state to avoid flicker
  const [translated, setTranslated] = useState(translations[text] || text);
  const [loading, setLoading] = useState(false);
  const [hasTranslated, setHasTranslated] = useState(!!translations[text]);

  useEffect(() => {
    const performTranslation = async () => {
      // 1. Check if it's already in the static translations
      if (translations[text]) {
        setTranslated(translations[text]);
        setHasTranslated(true);
        return;
      }

      // 2. If it's English, just show it
      if (language === 'en') {
        setTranslated(text);
        setHasTranslated(true);
        return;
      }

      // 3. Dynamic translation for non-English
      setLoading(true);
      try {
        const result = await dynamicTranslate(text);
        setTranslated(result);
        setHasTranslated(true);
      } catch (err) {
        console.error("LibreTrans failure:", err);
        setTranslated(text);
      } finally {
        setLoading(false);
      }
    };

    performTranslation();
  }, [text, language, translations, dynamicTranslate]);

  // While loading and not using English, show a beautiful skeleton instead of English text to avoid confusion
  const displayContent = (loading && !hasTranslated && language !== 'en') ? (
    <span className="inline-block h-[1em] w-16 bg-emerald-100 dark:bg-white/10 rounded animate-pulse align-middle" />
  ) : translated;

  return (
    <span className={`${className} transition-opacity duration-300`}>
      {displayContent}
    </span>
  );
};
