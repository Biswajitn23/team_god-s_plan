/**
 * Bhashini Translation Service Adapter
 * Automatically routes all translation requests to Sarvam AI (sk_ati8d224_5sYLv3Wg0JyltcDiF9N35wig)
 * Eliminates all 401 Unauthorized errors from Dhruva Bhashini API.
 */

import { translateText as sarvamTranslate } from './translation';

export const translateText = async (
  text: string,
  targetLang: string = 'hi',
  sourceLang: string = 'en'
): Promise<string> => {
  return sarvamTranslate(text, targetLang, sourceLang);
};

export const bhashiniTranslate = async (
  text: string,
  targetLang: string = 'hi',
  sourceLang: string = 'en'
): Promise<string> => {
  return sarvamTranslate(text, targetLang, sourceLang);
};

export const translate = translateText;

export default {
  translateText,
  bhashiniTranslate,
  translate,
};
