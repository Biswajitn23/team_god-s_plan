import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Mic, MicOff, Trash2, BrainCircuit } from 'lucide-react';
import { useTranslation } from '../../context/useTranslation';
import { generateAIAnswer } from '../../services/ai';
import { useTTS } from '../../context/TTSContext';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const PROJECT_SYSTEM_PROMPT = `
You are the AyuSetu Assistant. Your GOAL is to provide extremely focused and direct answers.

STRICT RULES:
1. Start with "Namaste!".
2. Answer the user's question in 2-3 short sentences maximum.
3. Use bullet points for any lists.
4. If asked about the dashboard, tell them exactly which tab to click.
5. NEVER write long paragraphs.
6. Only provide information relevant requested by the farmer.

KNOWLEDGEBASE:
- AyuSetu = Blockchain Traceability for Herbs.
- Home Tab = Overview & Stats.
- Collection Tab = Registering new crops.
- History Tab = Past records & QR codes.
- Profile = Your unique Farmer ID.
`;

const FormattedMessage = ({ text }: { text: string }) => {
  // Simple "Markdown-lite" renderer
  const lines = text.split('\n');
  
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        let content = line.trim();
        if (!content) return <div key={i} className="h-2" />;
        
        // Handle Bold
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const formattedLine = parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-extrabold text-emerald-950 underline decoration-emerald-500/30 underline-offset-2">{part.slice(2, -2)}</strong>;
          }
          return part;
        });

        // Handle Lists
        if (content.startsWith('- ') || content.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 items-start pl-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>{formattedLine}</span>
            </div>
          );
        }
        
        // Handle Numbered Lists
        if (/^\d+\./.test(content)) {
          const match = content.match(/^(\d+\.)\s*(.*)/);
          if (match) {
            return (
              <div key={i} className="flex gap-2 items-start pl-2">
                <span className="font-black text-emerald-600 min-w-[1.2rem]">{match[1]}</span>
                <span>{match[2]}</span>
              </div>
            );
          }
        }

        return <p key={i} className="leading-relaxed">{formattedLine}</p>;
      })}
    </div>
  );
};

export const SimpleChatbot = () => {
  const { t, language } = useTranslation();
  const { speak } = useTTS();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const styleId = 'chatbot-blur-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        body.chatbot-open main, 
        body.chatbot-open .tabs-list {
          filter: blur(8px);
          pointer-events: none;
          transition: all 0.4s ease;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
     if (isOpen) document.body.classList.add('chatbot-open');
     else document.body.classList.remove('chatbot-open');
     return () => document.body.classList.remove('chatbot-open');
  }, [isOpen]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handleOpen);
    return () => window.removeEventListener('open-chatbot', handleOpen);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true; // Stay on until user clicks stop
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        
        recognitionInstance.onstart = () => {
          setIsListening(true);
          console.log("Listening...");
        };

        recognitionInstance.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          
          if (currentTranscript) {
            setInputValue(prev => {
              // Only append if it's new text or replace if we want pure sync
              // For "type with sync", we replace the input with the current session's transcript
              return currentTranscript;
            });
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech Recognition Error:", event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
          console.log("Stopped Listening.");
        };

        setRecognition(recognitionInstance);
      } catch (err) {
        console.error("Failed to initialize Speech Recognition:", err);
      }
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (recognition) recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
  }, [language, recognition]);

  const botResponses = {
    en: {
      welcome: "Namaste! I am your AyuSetu helper. How can I assist you today, dear farmer?",
      help: "I can help you with:\n- Registering crops\n- Batch QR codes\n- Plant names\n- Farm location",
      default: "Namaste! I didn't quite catch that. Try asking for 'help' or about 'registration'."
    },
    hi: {
      welcome: "नमस्ते! मैं आपका आयुसेतु सहायक हूँ। मैं आपकी कैसे सहायता कर सकता हूँ?",
      help: "मैं आपकी मदद कर सकता हूँ:\n- फसल पंजीकरण\n- बैच क्यूआर कोड\n- पौधों के नाम\n- खेत की स्थिति",
      default: "नमस्ते! मुझे समझ नहीं आया। 'मदद' या 'पंजीकरण' के बारे में पूछें।"
    }
  };

  const getCurrentResponses = () => botResponses[language as keyof typeof botResponses] || botResponses.en;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: '1', text: getCurrentResponses().welcome, sender: 'bot', timestamp: new Date() }]);
    }
  }, [isOpen]);

  const detectIntent = (message: string): string => {
    const lower = message.toLowerCase();
    const responses = getCurrentResponses();
    if (lower.includes('help') || lower.includes('मदद') || lower.includes('सहायता')) return responses.help;
    return responses.default;
  };

  const handleSendMessage = async (overrideText?: string) => {
    const text = (overrideText !== undefined ? overrideText : inputValue).trim();
    if (!text) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() }]);
    setInputValue('');
    setIsTyping(true);

    const isHelpIntent = text.toLowerCase().includes('help') || text.toLowerCase().includes('मदद') || text.toLowerCase().includes('सहायता');

    if (isHelpIntent) {
      const intentResponse = detectIntent(text);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: intentResponse, sender: 'bot', timestamp: new Date() }]);
        setIsTyping(false);
      }, 800);
      return;
    }

    setIsAIThinking(true);
    const intentResponse = detectIntent(text);

    try {
      console.log("Chatbot: Sending message to AI...", text);
      const historyContext = messages.slice(-4).map(m => `${m.sender === 'user' ? 'Farmer' : 'Assistant'}: ${m.text}`).join('\n');
      const languageInstruction = language === 'hi' ? 'Respond in Hindi.' : 'Respond in English.';
      const prompt = `${languageInstruction}\n\nContext:\n${historyContext}\n\nQuery: ${text}\n\nReply:`;
      
      const res = await generateAIAnswer(prompt, PROJECT_SYSTEM_PROMPT);
      const aiResponse = res.text;
      let finalResponse = aiResponse;

      console.log("Chatbot: AI responded:", aiResponse);

      // Use LibreTranslate for high-quality Hindi translation if needed
      if (language === 'hi') {
        console.log("Chatbot: Translating response to Hindi...");
        const { translateText } = await import('../../services/translation');
        finalResponse = await translateText(aiResponse, 'hi', 'en');
        console.log("Chatbot: Translation complete.");
      }

      setMessages(prev => [...prev, { id: (Date.now() + 2).toString(), text: finalResponse, sender: 'bot', timestamp: new Date() }]);
      
      // Auto-speak responses
      speak(finalResponse);

    } catch (e) {
      console.error("Chatbot: Error in handleSendMessage:", e);
      const errorMsg = "I'm having a little trouble connecting. Please try again.\n" + intentResponse;
      setMessages(prev => [...prev, { id: (Date.now() + 3).toString(), text: errorMsg, sender: 'bot', timestamp: new Date() }]);
      speak(errorMsg);
    } finally {
      setIsTyping(false);
      setIsAIThinking(false);
    }
  };

  const clearChat = () => {
    setMessages([{ id: '1', text: getCurrentResponses().welcome, sender: 'bot', timestamp: new Date() }]);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-48 sm:bottom-24 right-6 left-6 md:left-auto z-[100] md:w-96 h-[60vh] max-h-[600px] animate-in slide-in-from-bottom-8 duration-500">
           <div className="card-glass h-full flex flex-col overflow-hidden bg-white/95 border-emerald-100 shadow-[0_40px_100px_-20px_rgba(6,78,59,0.2)]">
              {/* Header */}
              <div className="p-6 bg-emerald-950 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-emerald-500/30 overflow-hidden">
                       <img src="/logo.jpg" alt="AyuSetu Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <h3 className="text-sm font-black uppercase tracking-widest leading-none">AyuSetu Assistant</h3>
                       <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-black text-emerald-400/60 uppercase">Online</span>
                       </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={clearChat} className="p-2 bg-white/5 text-white/40 rounded-lg hover:text-white transition-colors" title="Clear Chat">
                       <Trash2 size={16} />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors" title="Close Chat">
                       <X size={16} />
                    </button>
                  </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-premium">
                 {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-reveal`}>
                       <div className={`max-w-[85%] p-4 rounded-3xl text-xs font-bold leading-relaxed shadow-sm ${
                          m.sender === 'user' 
                          ? 'bg-emerald-600 text-white rounded-tr-sm' 
                          : 'bg-emerald-50 text-emerald-950 rounded-tl-sm border border-emerald-100'
                       }`}>
                          <FormattedMessage text={m.text} />
                          <div className={`text-[9px] mt-2 font-black uppercase tracking-tighter opacity-40 ${m.sender === 'user' ? 'text-white' : 'text-emerald-900'}`}>
                             {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                       </div>
                    </div>
                 ))}
                 {(isTyping || isAIThinking) && (
                    <div className="flex justify-start animate-reveal">
                       <div className="p-4 bg-emerald-50 rounded-3xl rounded-tl-sm border border-emerald-100 italic text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                          {isAIThinking ? 'AyuSetu is thinking...' : 'Typing...'}
                       </div>
                    </div>
                 )}
                 <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 bg-slate-50 border-t border-emerald-50">
                 <div className="relative group">
                    <input
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                       placeholder="Type your message..."
                       className="input-premium bg-white border-emerald-100 pr-24 h-14 text-xs font-bold"
                    />
                    <div className="absolute right-2 top-2 flex items-center gap-1">
                       <button 
                         onClick={isListening ? () => { recognition?.stop(); setIsListening(false); } : () => { recognition?.start(); setIsListening(true); }}
                         className={`p-2.5 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white' : 'text-emerald-900/40 hover:text-emerald-600 hover:bg-emerald-50'}`}
                       >
                          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                       </button>
                       <button 
                         onClick={() => handleSendMessage()}
                         disabled={!inputValue.trim() || isTyping || isAIThinking}
                         className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
                       >
                          <Send size={16} />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
};