import { useContext } from 'react';
import { LanguageContext } from './LanguageContext';

export const useTranslation = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  const { translations } = context;

  const t = (key: string) => {
    return translations[key] || key;
  };

  return { ...context, t };
};
