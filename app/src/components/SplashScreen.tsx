import { useState, useEffect } from 'react';
import { Sprout, ShieldCheck, Zap } from 'lucide-react';

interface SplashScreenProps {
  onFinished: () => void;
  minimumDurationMs?: number;
}

export default function SplashScreen({ onFinished, minimumDurationMs = 2500 }: SplashScreenProps) {
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
      setTimeout(() => setShow(false), 500);
      setTimeout(onFinished, 1000);
    }, minimumDurationMs);
    return () => clearTimeout(timer);
  }, [minimumDurationMs, onFinished]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-slate-950 transition-all duration-1000 ${ready ? 'opacity-0 scale-110' : 'opacity-100'}`}>
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] -ml-64 -mb-64 animate-pulse" style={{animationDelay: '1s'}} />

      <div className="relative flex flex-col items-center gap-12 text-center px-6">
         {/* Logo Animation */}
         <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-[3rem] blur-3xl opacity-20 animate-pulse" />
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 flex items-center justify-center relative z-10 shadow-2xl overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent" />
               <img src="/logo.jpg" alt="AyuSetu Logo" className="w-full h-full object-cover animate-reveal" />
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan z-20" />
            </div>
         </div>

         {/* Text Identity */}
         <div className="space-y-4 animate-reveal" style={{animationDelay: '0.2s'}}>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
               AyuSetu<span className="text-emerald-500">.</span>
            </h1>
            <div className="flex items-center justify-center gap-6">
               <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">
                  <ShieldCheck size={14} /> Safe & Secure
               </div>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-900" />
               <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">
                  <Zap size={14} /> Fast
               </div>
            </div>
         </div>

         {/* Loading Logic */}
          <div className="w-64 h-0.5 bg-white/5 rounded-full overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-full animate-progress-fast" />
          </div>

         <div className="flex flex-col gap-1 items-center">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Starting AyuSetu</span>
            <div className="flex gap-1">
               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce" />
               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce" style={{animationDelay: '0.1s'}} />
               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce" style={{animationDelay: '0.2s'}} />
            </div>
         </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 left-0 right-0 text-center animate-reveal" style={{animationDelay: '0.5s'}}>
         <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Herb Tracking Made Simple</p>
      </div>
    </div>
  );
}

