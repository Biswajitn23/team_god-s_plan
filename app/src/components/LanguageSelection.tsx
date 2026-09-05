import { useState, useEffect } from 'react';
import { useTranslation } from '../context/useTranslation';
import { Languages, ArrowRight, Sparkles, Sprout } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English', sub: 'Global' },
    { code: 'hi', name: 'हिन्दी', sub: 'Hindi' },
    { code: 'bn', name: 'বাংলা', sub: 'Bengali' },
    { code: 'te', name: 'తెలుగు', sub: 'Telugu' },
    { code: 'mr', name: 'मराठी', sub: 'Marathi' },
    { code: 'ta', name: 'தமிழ்', sub: 'Tamil' },
    { code: 'kn', name: 'ಕನ್ನಡ', sub: 'Kannada' },
    { code: 'ml', name: 'മലയാളം', sub: 'Malayalam' },
    { code: 'gu', name: 'ગુજરાતી', sub: 'Gujarati' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', sub: 'Punjabi' },
];

export default function LanguageSelection({ onLanguageSelect }: { onLanguageSelect: () => void }) {
    const { t, setLanguage, language } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(language || 'en');

    const handleSelect = (code: string) => {
        setLanguage(code);
        onLanguageSelect();
    };

    useEffect(() => {
        // Show install prompt during language selection after a short delay
        const timer = setTimeout(() => {
            if (typeof (window as any).showAyuSetuInstallPrompt === 'function') {
                (window as any).showAyuSetuInstallPrompt();
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 overflow-hidden p-4 sm:p-6 font-sans select-none">
            <style dangerouslySetInnerHTML={{ __html: `
                body, html { 
                    overflow: hidden !important; 
                    height: 100% !important; 
                    position: fixed !important; 
                    width: 100% !important;
                    touch-action: none !important;
                    -webkit-overflow-scrolling: none !important;
                }
                #root {
                    height: 100% !important;
                    overflow: hidden !important;
                }
            ` }} />
            {/* Visual Background */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[120px] -ml-64 -mt-64" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[120px] -mr-64 -mb-64" />
            
            <div className="w-full max-w-xl relative z-10 my-auto">
                <div className="card-glass p-6 md:p-12 border-white/40 shadow-[0_32px_120px_-30px_rgba(6,78,59,0.1)] bg-white/70 backdrop-blur-3xl animate-reveal">
                   <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-[2rem] bg-white border border-emerald-100 flex items-center justify-center mx-auto mb-4 p-2 shadow-2xl relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent" />
                         <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-2xl transition-transform group-hover:scale-110 duration-500" />
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full mb-4">
                         <Sparkles size={12} className="text-emerald-500" />
                         <span className="text-[9px] font-black text-emerald-900 uppercase tracking-widest">AyuSetu Gateway</span>
                      </div>
                      <h1 className="text-3xl md:text-5xl font-black text-emerald-950 tracking-tighter leading-none mb-2">
                         Choose <span className="text-emerald-600">Language</span>
                      </h1>
                      <p className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest">Select your preferred language</p>
                   </div>

                   <div className="grid grid-cols-2 gap-2 mb-6 max-h-[40vh] overflow-y-auto pr-2 scroll-premium">
                      {languages.map((lang) => (
                         <button
                            key={lang.code}
                            onClick={() => setSelectedLanguage(lang.code)}
                            className={`p-3 rounded-2xl border-2 text-left transition-all duration-300 group relative overflow-hidden ${
                               selectedLanguage === lang.code 
                               ? 'bg-emerald-950 border-emerald-950 shadow-lg shadow-emerald-900/10' 
                               : 'bg-white/50 border-emerald-50 hover:border-emerald-200 hover:bg-white'
                            }`}
                         >
                            <div className={`text-sm font-black tracking-tight ${selectedLanguage === lang.code ? 'text-white' : 'text-emerald-950'}`}>
                               {lang.name}
                            </div>
                            <div className={`text-[7px] font-black uppercase tracking-widest mt-0.5 ${selectedLanguage === lang.code ? 'text-emerald-400' : 'text-emerald-900/30'}`}>
                               {lang.sub}
                            </div>
                         </button>
                      ))}
                   </div>

                   <div className="pt-6 border-t border-emerald-50">
                      <button 
                         onClick={() => handleSelect(selectedLanguage)}
                         className="w-full py-5 rounded-[1.5rem] bg-emerald-600 text-white font-black text-base uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                      >
                         Continue <ArrowRight size={18} />
                      </button>
                   </div>
               </div>

               <div className="mt-8 flex items-center justify-center gap-8">
                  <div className="text-[9px] font-black text-emerald-950/20 uppercase tracking-[0.3em] flex items-center gap-2">
                     <Sprout size={12} /> AyuSetu
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-100" />
                  <div className="text-[9px] font-black text-emerald-950/20 uppercase tracking-[0.3em] flex items-center gap-2">
                     <Languages size={12} /> Easy to Use
                  </div>
               </div>
            </div>
        </div>
    );
}
