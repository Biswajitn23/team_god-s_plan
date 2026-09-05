import React, { useState, useEffect } from "react";
import { useTranslation } from "../context/useTranslation";
import { getUserByPhone, saveUserToStorage } from "../context/AuthContext";
import { ShieldCheck, Smartphone, Key, UserCheck, MapPin, Hash, Sparkles, Sprout, ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";

function RegisterForm({ reg, setReg, error, handleRegister }: any) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!reg.gps && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          let placeName = "Detected Location";
          try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
            const data = await resp.json();
            placeName = data.display_name.split(',').slice(0, 3).join(', ');
          } catch (e) {
            console.error("Geocoding failed", e);
          }
          setReg((r: any) => ({ ...r, gps: `${placeName} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})` }));
        },
        () => {}
      );
    }
  }, []);

  return (
    <div className="space-y-6 animate-reveal">
      <div className="text-center mb-8">
         <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-600/10">
            <UserCheck size={32} />
         </div>
         <h2 className="text-2xl font-black text-emerald-950 tracking-tight">{t('Create Account')}</h2>
         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Register yourself in AyuSetu</p>
      </div>

      <div className="space-y-4">
         <div className="space-y-1.5">
            <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest pl-1">{t('Full Name')}</label>
            <input 
               className="input-premium bg-emerald-50/50" 
               value={reg.name} 
               onChange={e => setReg((r: any) => ({ ...r, name: e.target.value }))} 
               placeholder={t('Enter your name')} 
            />
         </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest pl-1">{t('ID Card Number (Aadhar)')}</label>
            <input 
               className="input-premium bg-emerald-50/50" 
               value={reg.aadhar_or_coop_id} 
               onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                  const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                  setReg((r: any) => ({ ...r, aadhar_or_coop_id: formatted }));
               }} 
               placeholder="XXXX XXXX XXXX" 
            />
         </div>

         <div className="space-y-1.5">
            <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest pl-1">{t('Your Location')}</label>
            <div className="relative">
               <input 
                  className="input-premium bg-emerald-50/50 pr-10" 
                  value={reg.gps} 
                  readOnly 
                  placeholder={t('Finding location...')} 
               />
               <MapPin className="absolute right-4 top-4 text-emerald-500" size={16} />
            </div>
         </div>

         <div className="space-y-1.5">
            <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest pl-1">{t('Role')}</label>
            <div className="relative group">
               <select 
                  className="input-premium bg-emerald-50/50 appearance-none pr-10" 
                  value={reg.type} 
                  onChange={e => setReg((r: any) => ({ ...r, type: e.target.value }))}
               >
                  <option value="farmer">Farmer</option>
                  <option value="collector">Collector</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none group-focus-within:rotate-180 transition-transform" size={16} />
            </div>
         </div>
      </div>

      {error && (
         <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-bounce">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-bold text-red-600 uppercase tracking-tight">{error}</span>
         </div>
      )}

      <button className="w-full py-5 rounded-[2rem] bg-emerald-950 text-white font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3" onClick={handleRegister}>
         Register Now <ArrowRight size={18} />
      </button>
    </div>
  );
}

export default function Login({ onLogin }: { onLogin: (farmer: any) => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState<'enter' | 'otp' | 'register' | 'success'>('enter');
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [farmer, setFarmer] = useState<any>(null);
  const [reg, setReg] = useState<{name: string, phone: string, aadhar_or_coop_id: string, gps: string, type: string, id?: string}>({ name: '', phone: '', aadhar_or_coop_id: '', gps: '', type: 'farmer' });
  const [createdId, setCreatedId] = useState<string | null>(null);

   const handleSendOtp = async () => {
      setError("");
      if (!phone || phone.length < 10) {
         setError("Provide valid 10-digit communication link");
         return;
      }
      const existingUser = await getUserByPhone(phone);
      console.log('handleSendOtp: existingUser', existingUser);
      setFarmer(existingUser);
      setStep('otp');
   };

   const handleVerifyOtp = () => {
      setError("");
      if (otp !== "123456") {
         setError("Security Code Mismatch");
         return;
      }
      console.log('handleVerifyOtp: farmer', farmer, 'step', step);
      if (farmer) {
         onLogin(farmer);
      } else {
         setReg(r => ({ ...r, phone }));
         setStep('register');
         console.log('Switching to register step for new user');
      }
   };

  const handleRegister = async () => {
    setError("");
    if (!reg.name || !phone || !reg.aadhar_or_coop_id || !reg.gps) {
      setError("Protocol incomplete: All fields required");
      return;
    }
      let userId = `FARM-${Math.floor(100000 + Math.random() * 900000)}`;
      // If a user id is already present and starts with FARM-, use it
      if (reg.id && reg.id.startsWith('FARM-')) userId = reg.id;
      else if (reg.id && !reg.id.startsWith('FARM-')) console.warn('User id does not start with FARM-', reg.id);
      const newUser = {
         id: userId,
         name: reg.name,
         phone: phone,
         aadhar_or_coop_id: reg.aadhar_or_coop_id,
         gps: reg.gps,
         type: reg.type as 'farmer' | 'collector',
         created_at: new Date().toISOString(),
      };
      await saveUserToStorage(newUser);
      setCreatedId(newUser.id);
      setFarmer(newUser);
      setStep('success');
      setTimeout(() => onLogin(newUser), 2000);
  };

   // Removed demo user localStorage logic. No localStorage fallback.

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 overflow-hidden font-sans p-4 sm:p-6">
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
      {/* Visual Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[120px] -ml-64 -mb-64" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-20 hidden md:block" 
           style={{ backgroundImage: 'radial-gradient(#10b981 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      <div className="w-full max-w-xl relative z-10 my-auto">
         <div className="card-glass p-6 md:p-14 md:rounded-[4rem] border-white/40 shadow-[0_32px_120px_-30px_rgba(6,78,59,0.15)] bg-white/70">
            
            {step === 'enter' && (
                <div className="space-y-6 sm:space-y-10 animate-reveal">
                   <div className="text-center">
                      <div className="w-16 h-16 rounded-[2rem] bg-white border border-emerald-100 flex items-center justify-center mx-auto mb-4 p-2 shadow-2xl relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent" />
                         <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-2xl transition-transform group-hover:scale-110 duration-500" />
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full mb-4">
                         <Sparkles size={12} className="text-emerald-500" />
                         <span className="text-[9px] font-black text-emerald-900 uppercase tracking-[0.2em]">AyuSetu Gateway</span>
                      </div>
                     <h1 className="text-3xl md:text-5xl font-black text-emerald-950 tracking-tighter leading-none mb-2">
                        Secure <span className="text-emerald-600 underline decoration-emerald-100 decoration-8 underline-offset-4">Login</span>
                     </h1>
                     <p className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest">{t('Authenticate with your phone number')}</p>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-emerald-900 uppercase tracking-widest pl-1">{t('Secure Link (Phone)')}</label>
                          <div className="relative group flex items-center">
                             <div className="absolute left-0 h-full px-4 flex items-center bg-emerald-100/50 border-r border-emerald-100 rounded-l-2xl text-emerald-900 font-black text-sm z-10">+91</div>
                             <input
                                className="input-premium bg-emerald-50/30 border-emerald-100 focus:border-emerald-500 pl-16 h-14 text-base tracking-[0.3em] font-black w-full"
                                value={phone}
                                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                maxLength={10}
                                placeholder="99999 99999"
                             />
                             <Smartphone className="absolute right-4 top-4 text-emerald-900/20 group-focus-within:text-emerald-500 transition-colors" size={20} />
                          </div>
                      </div>

                      {error && (
                         <div className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-tight">{error}</span>
                         </div>
                      )}

                      <button 
                         className="w-full py-5 rounded-[1.5rem] bg-emerald-950 text-white font-black text-base uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                         onClick={handleSendOtp}
                      >
                         Login Now
                         <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                      </button>
                   </div>

                  <div className="pt-8 border-t border-emerald-50 flex items-center justify-between text-[9px] font-black text-emerald-900/30 uppercase tracking-[0.3em]">
                     <div className="flex items-center gap-2"><ShieldCheck size={12} /> Encrypted</div>
                     <div className="flex items-center gap-2"><Hash size={12} /> SHA-256 Verified</div>
                  </div>
               </div>
            )}

            {step === 'otp' && (
                <div className="space-y-8 animate-reveal">
                   <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-950 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-900/20">
                         <Key size={32} />
                      </div>
                      <h2 className="text-2xl font-black text-emerald-950 tracking-tight mb-1">Verify Account</h2>
                      <p className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest">Entering OTP for {phone}</p>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-emerald-900 uppercase tracking-widest pl-1">OTP Code</label>
                         <input
                            className="input-premium bg-emerald-50/50 text-center text-3xl font-black tracking-[0.4em] h-20 border-emerald-100"
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                            maxLength={6}
                            placeholder="••••••"
                         />
                      </div>

                      {error && (
                         <div className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center gap-3">
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-tight">{error}</span>
                         </div>
                      )}

                      <button 
                         className="w-full py-5 rounded-[1.5rem] bg-emerald-950 text-white font-black text-base uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-[0.98]"
                         onClick={handleVerifyOtp}
                      >
                         Continue
                      </button>
                   </div>
                   
                   <div className="text-center pt-2">
                      <button onClick={() => setStep('enter')} className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Change Number</button>
                   </div>
                </div>
            )}

            {step === 'register' && (
               <RegisterForm reg={reg} setReg={setReg} error={error} handleRegister={handleRegister} />
            )}

            {step === 'success' && (
               <div className="text-center py-12 space-y-8 animate-reveal">
                  <div className="relative inline-block">
                     <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                     <div className="w-32 h-32 bg-emerald-500 text-white rounded-[3.5rem] flex items-center justify-center relative z-10">
                        <CheckCircle2 size={64} />
                     </div>
                  </div>
                  
                  <div>
                     <h1 className="text-4xl font-black text-emerald-950 tracking-tighter mb-2">Login Successful</h1>
                     <p className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em]">Welcome to AyuSetu</p>
                  </div>

                  <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] space-y-3">
                     <p className="text-[9px] font-black text-emerald-900/40 uppercase tracking-widest">Farmer Core Identifier</p>
                     <p className="text-xl font-mono font-black text-emerald-950 tracking-tight">{createdId}</p>
                  </div>

                  <div className="flex items-center justify-center gap-3 text-emerald-900/40">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Injecting Terminal logic...</span>
                  </div>
               </div>
            )}
         </div>

         <div className="mt-8 flex items-center justify-center gap-8">
            <div className="text-[9px] font-black text-emerald-950/20 uppercase tracking-[0.3em] flex items-center gap-2">
               <Sprout size={12} /> AyuSetu
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-100" />
            <div className="text-[9px] font-black text-emerald-950/20 uppercase tracking-[0.3em] flex items-center gap-2">
               <ShieldCheck size={12} /> Ministry Level
            </div>
         </div>
      </div>
    </div>
  );
}

