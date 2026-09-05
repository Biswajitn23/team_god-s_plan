import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  LogOut,
  Clock,
  User,
  LayoutDashboard,
  ShieldAlert,
  ChevronRight,
  Database,
  Bell,
  Home,
  FileText,
  Lock,
  Radio,
  Calendar,
  Layers,
  Phone,
  Globe,
  Leaf,
  Sparkles
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/integrations/firebase/client';

// View imports
import AggregatorView from './roles/AggregatorView';
import ProcessorView from './roles/ProcessorView';
import ManufacturerView from './roles/ManufacturerView';
import DistributorView from './roles/DistributorView';
import FarmerView from './roles/FarmerView';

interface DashboardProps {
  userRole: string;
  userId: string;
  onLogout: () => void;
}

const Dashboard = ({ userRole, userId, onLogout }: DashboardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const q = query(collection(firestore, 'business_nodes'), where('id', '==', userId));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setProfileData(snapshot.docs[0].data());
        }
      } catch (err) {
        console.error("Error fetching profile details from Firebase:", err);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const roleDisplayNames: Record<string, string> = {
    aggregator: 'Aggregator / Collection',
    processor: 'Processor / Refinement',
    manufacturer: 'Manufacturer / Formulation',
    distributor: 'Distributor / Logistics',
    farmer: 'Farmer / Grower Portal'
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] flex flex-col font-sans text-slate-800 select-none relative overflow-x-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. OFFICIAL GOVT OF INDIA & AYUSH TOP HEADER                              */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-slate-200/90 relative z-30 px-4 sm:px-8 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          
          {/* Left: Emblem of India + Ministry of Ayush + AyuSetu Brand */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <svg
                className="w-8 h-10 sm:w-9 sm:h-11 text-slate-800"
                viewBox="0 0 100 120"
                fill="currentColor"
                aria-label="Emblem of India"
              >
                <path d="M50 5 C40 5 35 15 35 25 C35 32 38 38 42 42 C30 45 20 55 20 70 C20 78 25 85 32 90 L32 96 C30 98 25 100 20 102 L20 106 L80 106 L80 102 C75 100 70 98 68 96 L68 90 C75 85 80 78 80 70 C80 55 70 45 58 42 C62 38 65 32 65 25 C65 15 60 5 50 5 Z M50 12 C55 12 58 18 58 25 C58 32 55 38 50 38 C45 38 42 32 42 25 C42 18 45 12 50 12 Z M35 70 C35 60 42 50 50 50 C58 50 65 60 65 70 C65 78 58 86 50 86 C42 86 35 78 35 70 Z" />
                <circle cx="50" cy="98" r="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <rect x="25" y="110" width="50" height="3" rx="1.5" fill="currentColor" />
              </svg>
              <div className="flex flex-col leading-tight border-r border-slate-300 pr-3 sm:pr-4">
                <span className="text-xs sm:text-sm font-black tracking-tight text-slate-900 font-serif">
                  भारत सरकार
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-800">
                  Government of India
                </span>
                <span className="text-[8px] sm:text-[9px] text-slate-500 font-serif tracking-wide mt-0.5">
                  आयुष मंत्रालय / Ministry of Ayush
                </span>
              </div>
            </div>

            {/* AyuSetu Brand */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#0d5c3a]">
                    AyuSetu
                  </span>
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#0d5c3a] flex items-center justify-center">
                    <Leaf className="w-3 h-3" />
                  </div>
                </div>
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 tracking-wider uppercase">
                  TRADITIONAL KNOWLEDGE FOR A HEALTHIER INDIA
                </span>
              </div>
            </div>
          </div>

          {/* Right: Digital India, Viksit Bharat, Live Clock & Logout */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Digital India */}
            <div className="hidden md:flex items-center gap-2">
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full border-[2.5px] border-[#FF9933] border-t-[#138808] border-r-[#000080] flex items-center justify-center transform -rotate-45">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#000080] via-[#FF9933] to-[#138808]" />
                </div>
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-black tracking-tight text-slate-900">Digital India</span>
                <span className="text-[8px] text-slate-500 tracking-wide">Power To Empower</span>
              </div>
            </div>

            {/* Viksit Bharat @2047 */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white/90 border border-slate-200/80 rounded-xl px-2.5 py-1 shadow-sm">
              <div className="flex flex-col text-right leading-none">
                <span className="text-[11px] font-black text-slate-800">Viksit Bharat</span>
                <span className="text-[9px] font-bold text-[#FF9933]">@2047</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="w-3 h-0.5 rounded-full bg-[#FF9933]" />
                <span className="w-3 h-0.5 rounded-full bg-slate-300" />
                <span className="w-3 h-0.5 rounded-full bg-[#138808]" />
              </div>
            </div>

            {/* Realtime Clock */}
            <div className="hidden lg:flex flex-col text-right pr-2">
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-900">
                {currentTime.toLocaleTimeString('en-IN', { hour12: true })}
              </span>
              <span className="text-[9px] font-semibold text-slate-500">
                {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Notification Bell */}
            <button 
              aria-label="Notifications"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-sm"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Logout Button */}
            <Button
              onClick={onLogout}
              className="bg-[#e8f5e9] hover:bg-emerald-700 text-[#0d5c3a] hover:text-white border border-emerald-200/80 hover:border-emerald-700 px-4 py-2 font-bold text-xs rounded-xl shadow-sm transition-all duration-200 flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SUB-HEADER RIBBON (DEEP AYUSH GREEN)                                  */}
      {/* ========================================================================= */}
      <div className="bg-[#1b4d3e] text-emerald-100 py-2.5 px-4 sm:px-8 shadow-inner relative z-20">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-medium">
            <Home className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-emerald-300/60 font-mono">&gt;</span>
            <span className="text-white font-semibold tracking-wide">
              {roleDisplayNames[userRole] || userRole}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#0f3d2e] border border-emerald-600/40 text-emerald-300 px-3 py-1 rounded-full text-[11px] font-semibold">
              <Database className="w-3 h-3" />
              <span>Blockchain Synced</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE AREA                                                   */}
      {/* ========================================================================= */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ------------------------------------------------------------------- */}
          {/* LEFT SIDEBAR: PROFILE & SYSTEM VERIFICATION (3 COLS)                */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
              <div className="flex flex-col items-center text-center">
                {/* Avatar Badge */}
                <div className="w-20 h-20 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center text-3xl font-black shadow-md border-4 border-emerald-50 mb-3">
                  {userId ? userId.charAt(0).toUpperCase() : 'A'}
                </div>

                <h2 className="text-xl font-bold font-mono text-slate-900 tracking-tight">
                  {userId}
                </h2>
                
                <span className="inline-block mt-1 px-3.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#0d5c3a] capitalize">
                  {userRole}
                </span>

                {profileData && (
                  <div className="mt-2 text-center">
                    <p className="text-xs font-bold text-slate-800">{profileData.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">📍 {profileData.location}</p>
                  </div>
                )}

                {/* Metadata Table */}
                <div className="w-full mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-left text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Terminal ID</span>
                    </div>
                    <span className="font-mono font-bold text-slate-800">
                      ST-{userId.split('-')[1] || '1001'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Clearance</span>
                    </div>
                    <span className="font-bold text-slate-800 uppercase text-[11px]">
                      ALPHA
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Joined On</span>
                    </div>
                    <span className="font-medium text-slate-800">
                      Feb 2024
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>Integrity Sync</span>
                    </div>
                    <span className="font-bold text-emerald-700">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Encryption</span>
                    </div>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">
                      AES-256
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-slate-400" />
                      <span>Node Status</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Government Verified Node Card */}
            <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-sm flex items-center justify-between gap-3 hover:border-emerald-400 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0d5c3a] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    Government Verified Node
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Authorized under Ministry of Ayush
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
            </div>

            {/* Ayush Aatmanirbhar Bharat Poster Card */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 p-4 border border-orange-200/60 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wide">
                    आयुष से
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 font-serif leading-tight">
                    आत्मनिर्भर भारत
                  </h4>
                  <p className="text-[9px] text-slate-600 font-medium">
                    Our Herbs. Our Heritage. A Healthier Future.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100/80 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-[#0d5c3a]" />
                </div>
              </div>
            </div>

          </div>

          {/* ------------------------------------------------------------------- */}
          {/* RIGHT MAIN WORKSPACE (9 COLS)                                       */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-7 relative overflow-hidden">
              {/* Render Selected Role View */}
              {userRole === 'aggregator' && <AggregatorView userId={userId} />}
              {userRole === 'processor' && <ProcessorView userId={userId} />}
              {userRole === 'manufacturer' && <ManufacturerView userId={userId} />}
              {userRole === 'distributor' && <DistributorView userId={userId} />}
              {userRole === 'farmer' && <FarmerView userId={userId} />}
            </div>
          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. OFFICIAL FOOTER (AYUSH GOVERNMENT OF INDIA)                           */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-slate-200/90 py-5 px-4 sm:px-8 relative z-20 text-slate-600 text-xs mt-auto">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Ministry of Ayush */}
          <div className="flex items-center gap-3">
            <svg
              className="w-7 h-9 text-slate-700"
              viewBox="0 0 100 120"
              fill="currentColor"
            >
              <path d="M50 5 C40 5 35 15 35 25 C35 32 38 38 42 42 C30 45 20 55 20 70 C20 78 25 85 32 90 L32 96 C30 98 25 100 20 102 L20 106 L80 106 L80 102 C75 100 70 98 68 96 L68 90 C75 85 80 78 80 70 C80 55 70 45 58 42 C62 38 65 32 65 25 C65 15 60 5 50 5 Z M50 12 C55 12 58 18 58 25 C58 32 55 38 50 38 C45 38 42 32 42 25 C42 18 45 12 50 12 Z M35 70 C35 60 42 50 50 50 C58 50 65 60 65 70 C65 78 58 86 50 86 C42 86 35 78 35 70 Z" />
            </svg>
            <div className="flex flex-col text-left leading-tight">
              <span className="font-bold text-slate-900">Ministry of Ayush</span>
              <span className="text-[10px] text-slate-500">Government of India</span>
            </div>
          </div>

          {/* Center: Legal & Help Links */}
          <div className="flex items-center gap-5 text-slate-600 font-medium text-xs">
            <a href="#" className="hover:text-emerald-800 transition-colors">Terms of Use</a>
            <span>|</span>
            <a href="#" className="hover:text-emerald-800 transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-emerald-800 transition-colors">Help & Support</a>
          </div>

          {/* Right: Toll Free & Official Website */}
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#0d5c3a]" />
              <div className="flex flex-col text-left leading-tight">
                <span className="font-mono font-bold text-slate-800">1800-120-8040</span>
                <span className="text-[9px] text-slate-500">(Toll Free)</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700">
              <Globe className="w-4 h-4 text-[#0d5c3a]" />
              <span className="font-semibold text-slate-800">www.ayush.gov.in</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Dashboard;