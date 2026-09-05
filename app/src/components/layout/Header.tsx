import { Menu, LogOut, User, Bell, X, ShieldCheck, Smartphone, MapPin, Hash, Languages, Volume2, VolumeX, Check, ChevronDown } from "lucide-react";
import { useTTS } from "../../context/TTSContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import { useTranslation } from "../../context/useTranslation";


interface HeaderProps {
  onMenuClick?: () => void;
  onLogout?: () => void;
  user?: {
    name: string;
    phone?: string;
    aadhar_or_coop_id?: string;
    gps?: string;
    type?: string;
    id?: string;
    role?: string;
  };
}

const languagesList = [
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

export const Header = ({ onMenuClick, onLogout, user }: HeaderProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<number[]>([]);
  const { toast } = useToast();
  const { language, setLanguage, t } = useTranslation();

  const { ttsEnabled, setTtsEnabled } = useTTS() as any;
  
  useEffect(() => {
    const styleId = 'profile-blur-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        body.profile-open main, 
        body.profile-open .tabs-list {
          filter: blur(12px) grayscale(20%);
          pointer-events: none;
          transition: all 0.4s ease;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
     if (profileOpen) document.body.classList.add('profile-open');
     else document.body.classList.remove('profile-open');
     
     return () => document.body.classList.remove('profile-open');
  }, [profileOpen]);
  
  const notifications = [



    {
      id: 1,
      title: "Collection Verified",
      message: "Your batch #BTH001 has been verified",
      time: "2 hours ago",
      type: "success"
    },
    {
      id: 2,
      title: "New Species Added",
      message: "Ashwagandha has been added to available species",
      time: "1 day ago",
      type: "info"
    },
    {
      id: 3,
      title: "Quality Check Required",
      message: "Batch #BTH002 requires quality verification",
      time: "2 days ago",
      type: "warning"
    }
  ];

  const unreadNotifications = notifications.filter(n => !readNotifications.includes(n.id));

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    setTimeout(() => {
      if (onLogout) {
        onLogout();
      }
    }, 1000);
  };

  const markAsRead = (notificationId: number) => {
    setReadNotifications(prev => [...prev, notificationId]);
  };

  const markAllAsRead = () => {
    setReadNotifications(notifications.map(n => n.id));
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-emerald-950/70 backdrop-blur-2xl border-b border-emerald-200/60 dark:border-white/10 shadow-sm transition-colors duration-500">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">

        {/* Left: Logo and Menu */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-xl bg-white border border-emerald-100 flex items-center justify-center p-1.5 shadow-sm overflow-hidden shrink-0 group">
             <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-2xl transition-transform group-hover:scale-110 duration-500" />
          </div>
          <div className="flex flex-col leading-none min-w-0">
             <div className="flex items-baseline gap-1">
                <h1 className="text-xl md:text-2xl font-black tracking-tighter text-emerald-950 dark:text-white transition-colors">
                  AyuSetu<span className="text-emerald-500">.</span>
                </h1>

                {language === 'hi' && (
                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hidden sm:inline ml-1">किसान पोर्टल</span>
                )}
             </div>
             <p className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-[0.2em] mt-1 hidden sm:block truncate">
                Farmer Portal
             </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          

          {/* Notifications */}
          <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
            <DropdownMenuTrigger asChild>
              <button className="relative w-11 h-11 rounded-xl bg-white border border-emerald-100 text-emerald-900 flex items-center justify-center hover:bg-emerald-50 transition-colors shadow-sm active:scale-95">
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-600 text-white border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black animate-in zoom-in">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-2xl border-emerald-100 shadow-2xl bg-white/95 backdrop-blur-xl">
              <div className="bg-emerald-50/50 px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
                <span className="text-xs font-black text-emerald-900 uppercase tracking-widest">Notifications ({unreadNotifications.length})</span>
                {unreadNotifications.length > 0 && (
                  <button onClick={markAllAsRead} className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-wider">Mark all read</button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className={`flex flex-col items-start px-4 py-3 cursor-pointer border-b border-slate-50 last:border-0 hover:bg-emerald-50/40 transition-colors ${readNotifications.includes(notification.id) ? 'opacity-50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${notification.type === 'success' ? 'bg-emerald-500' : notification.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                      <span className="text-sm font-black text-emerald-950">{notification.title}</span>
                    </div>
                    <p className="text-xs text-emerald-700/70 font-medium leading-relaxed">{notification.message}</p>
                    <span className="text-[10px] text-emerald-500 font-bold mt-1 uppercase">{notification.time}</span>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-emerald-950 text-white hover:bg-black transition-all shadow-lg active:scale-95 group">
                <div className="w-8 h-8 rounded-lg bg-white overflow-hidden flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white/20">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || '001'}`} 
                    alt="P" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none">
                   <span className="text-xs font-black truncate max-w-24 uppercase tracking-[0.05em]">
                     {user?.name || t('farmer')}
                   </span>
                   <span className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-widest mt-0.5">Verified</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-emerald-100 shadow-2xl bg-white/95 backdrop-blur-xl">
              <DropdownMenuItem onClick={() => setProfileOpen(true)} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><User size={16} /></div>
                <span className="text-sm font-bold text-emerald-950 leading-none">{t('profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-emerald-50 my-1" />
              <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-red-50 text-red-600 transition-colors" onClick={handleLogout}>
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center"><LogOut size={16} /></div>
                <span className="text-sm font-bold leading-none">{t('logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Overlay */}
          {profileOpen && (
            <div className="fixed inset-0 z-[100] flex items-start justify-end bg-emerald-950/60 backdrop-blur-2xl p-4 sm:p-6 animate-in fade-in duration-300">

               <div className="bg-white rounded-[2.5rem] border border-emerald-200/60 shadow-2xl w-full max-w-[320px] mt-20 overflow-hidden flex flex-col animate-reveal relative">

                  <div className="bg-emerald-950 p-6 text-center relative overflow-hidden shrink-0">
                     <button 
                       onClick={() => setProfileOpen(false)}
                       className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                     >
                        <X size={16} />
                     </button>
                     <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={160} /></div>

                     <div className="w-20 h-20 rounded-3xl bg-white overflow-hidden flex items-center justify-center mx-auto mb-4 shadow-2xl relative z-10 border-2 border-emerald-500/20">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || '001'}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                        />
                     </div>
                     <h2 className="text-2xl font-black text-white relative z-10 leading-none mb-2">{user?.name || t('farmer')}</h2>
                     <Badge className="bg-emerald-500 text-white font-black px-3 py-1 rounded-lg border-none relative z-10 shadow-lg">ID: FARM-{(user?.id || '001').split('-').pop()}</Badge>

                  </div>
                  <div className="p-6 space-y-3 overflow-y-auto">
                     {[
                        { label: 'Role', value: user?.type || 'Farmer', icon: ShieldCheck },
                        { label: 'Phone', value: user?.phone || 'Not provided', icon: Smartphone },
                        { label: 'Aadhar/ID', value: user?.aadhar_or_coop_id || 'Not provided', icon: Hash },
                        { label: 'Location', value: user?.gps || 'Not provided', icon: MapPin }
                     ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 transition-colors hover:bg-emerald-50">
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{item.label}</span>
                              <span className="text-sm font-bold text-emerald-950 mt-0.5">{item.value}</span>
                           </div>
                           <item.icon size={16} className="text-emerald-500/50" />
                        </div>
                     ))}
                     <button
                        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-[0_8px_20px_-4px_rgba(5,150,105,0.4)] transition-all active:scale-95 mt-2"
                        onClick={() => setProfileOpen(false)}
                     >
                        CLOSE
                     </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
