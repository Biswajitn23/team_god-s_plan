import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface TTSContextType {
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
  speak: (text: string, lang?: string) => void;
}

export const TTSEnabledContext = createContext<TTSContextType>({
  ttsEnabled: false,
  setTtsEnabled: () => {},
  speak: () => {}
});

export function TTSProvider({ children }: { children: React.ReactNode }) {
  const [ttsEnabled, setTtsEnabledState] = useState(() => {
    try {
      return localStorage.getItem('tts_enabled') === 'true';
    } catch {
      return false;
    }
  });

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Initialize voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    // Some browsers need a second call
    setTimeout(loadVoices, 100);
  }, []);

  const speak = useCallback((text: string, lang: string = '') => {
    if (!ttsEnabled && !text.includes("Voice assistance")) return;
    
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const hasHindi = lang === 'hi' || /[\u0900-\u097F]/.test(text);
      utterance.lang = hasHindi ? 'hi-IN' : 'en-US';
      
      // Find suitable "Female Calm" voice
      const preferredVoices = voices.filter(v => v.lang.startsWith(hasHindi ? 'hi' : 'en'));
      const femaleVoice = preferredVoices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('samantha') || 
        v.name.toLowerCase().includes('google hindi') || 
        v.name.toLowerCase().includes('microsoft zira') ||
        v.name.toLowerCase().includes('natural')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else if (preferredVoices.length > 0) {
        utterance.voice = preferredVoices[0];
      }

      // Calm parameters: slower rate, natural pitch
      utterance.rate = 0.85; 
      utterance.pitch = 1.05; 
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS Speak Error:", e);
    }
  }, [ttsEnabled, voices]);

  const setTtsEnabled = useCallback((enabled: boolean) => {
    setTtsEnabledState(enabled);
    localStorage.setItem('tts_enabled', enabled ? 'true' : 'false');
    if (enabled) {
      speak("Voice assistance is now active. I will help you navigate and interact with Ayu-Setu.");
    }
  }, [speak]);

  // Global Interaction Reader (Maximum Accessibility)
  useEffect(() => {
    const handleInteraction = (e: MouseEvent | FocusEvent) => {
      if (!ttsEnabled) return;
      
      const target = e.target as HTMLElement;
      if (!target) return;

      // Handle Clicks/Taps (Universal Coverage)
      if (e.type === 'click') {
        // Find text content starting from target up to reasonable depth
        let current: HTMLElement | null = target;
        let textToSpeak = "";
        
        // 1. Try ARIA or Title first
        textToSpeak = target.getAttribute('aria-label') || target.getAttribute('title') || "";
        
        // 2. If no ARIA, check for inner text or alt
        if (!textToSpeak) {
          if (target.tagName === 'IMG') {
            textToSpeak = (target as HTMLImageElement).alt;
          } else if (target.innerText && target.innerText.trim().length > 0 && target.innerText.length < 100) {
            textToSpeak = target.innerText;
          }
        }

        // 3. Fallback to nearest ancestor with text if target is empty (like an icon/svg/empty-div)
        if (!textToSpeak || textToSpeak.trim().length === 0) {
          const ancestor = target.closest('button, a, [role="button"], [role="menuitem"], label');
          if (ancestor) {
            const val = (ancestor as HTMLElement).innerText || ancestor.getAttribute('aria-label') || ancestor.getAttribute('title');
            if (val && val.trim().length > 0) {
              textToSpeak = val;
            }
          }
        }

        if (textToSpeak && textToSpeak.trim().length > 0) {
          // PREVENT "SAY ALL" ISSUE:
          // If the text contains multiple lines (common in containers/dropdowns), 
          // we only speak the first meaningful line to be specific to the clicked context.
          const lines = textToSpeak.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          if (lines.length > 0) {
            // If it's a single short line, speak it all. 
            // If it's multiple lines, only speak the first one (most likely the specific item clicked).
            speak(lines[0]);
          }
        }
      }

      // Handle Input Focus (Guided Entry)
      if (e.type === 'focusin') {
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
        if (isInput) {
           const labelText = document.querySelector(`label[for="${target.id}"]`)?.textContent || 
                             target.getAttribute('placeholder') || 
                             target.getAttribute('aria-label') || 
                             (target as HTMLInputElement).name;
           
           if (labelText && labelText.trim().length > 0) {
             speak(`Please enter ${labelText}`);
           }
        }
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('focusin', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('focusin', handleInteraction);
    };
  }, [ttsEnabled, speak]);

  return (
    <TTSEnabledContext.Provider value={{ ttsEnabled, setTtsEnabled, speak }}>
      {children}
    </TTSEnabledContext.Provider>
  );
}

export const useTTS = () => useContext(TTSEnabledContext);
