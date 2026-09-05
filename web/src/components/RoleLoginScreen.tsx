import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, ShieldCheck, Leaf, Users, Sprout, 
  Lock, Eye, EyeOff, User, Phone, HelpCircle, Check, Loader2, Sparkles, Trees
} from 'lucide-react';
import ayuestufrontpage from '@/assets/ayuestufrontpage.png';

interface RoleLoginScreenProps {
  selectedRole: string;
  onBackToRoles: () => void;
  credentials: any;
  onChangeCredential: (field: string, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  farmerTab: 'new' | 'search';
  setFarmerTab: (tab: 'new' | 'search') => void;
  onFarmerSearch: () => void;
  onPincodeChange: (pincode: string) => void;
  onJanParichayLogin?: () => void;
}

export const RoleLoginScreen: React.FC<RoleLoginScreenProps> = ({
  selectedRole,
  onBackToRoles,
  credentials,
  onChangeCredential,
  onSubmit,
  isLoading,
  farmerTab,
  setFarmerTab,
  onFarmerSearch,
  onPincodeChange,
  onJanParichayLogin
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');

  // Role metadata mapping
  const roleConfigMap: Record<string, {
    title: string;
    description: string;
    idField: string;
    idLabel: string;
    idPlaceholder: string;
    iconBg: string;
    iconColor: string;
    icon: string;
  }> = {
    'aggregator': {
      title: 'Aggregator',
      description: 'Manage collection and consolidation of Ayurvedic herbs from verified sources',
      idField: 'aggregatorId',
      idLabel: 'Aggregator ID',
      idPlaceholder: 'Enter your Aggregator ID (e.g. AGG-1001)',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-800',
      icon: '📦'
    },
    'processor': {
      title: 'Processor',
      description: 'Refine herbal extractions, standardize quality, and record pharmacopoeia testing',
      idField: 'organizationId',
      idLabel: 'Processor / Organization ID',
      idPlaceholder: 'Enter your Organization ID (e.g. PROC-2001)',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-800',
      icon: '⚙️'
    },
    'manufacturer': {
      title: 'Manufacturer',
      description: 'Oversee GMP product formulation, batch QR serialization, and tamper verification',
      idField: 'companyId',
      idLabel: 'Company / License ID',
      idPlaceholder: 'Enter your Company ID (e.g. MFG-3001)',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-800',
      icon: '🏭'
    },
    'distributor': {
      title: 'Distributor',
      description: 'Coordinate GPS-tracked logistics, e-Waybills, and distribution to Vaidyas & pharmacies',
      idField: 'distributorId',
      idLabel: 'Distributor ID',
      idPlaceholder: 'Enter your Distributor ID (e.g. DIST-4001)',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-800',
      icon: '🚚'
    },
    'farmer': {
      title: 'Farmer / Collector',
      description: 'Register herbal resource batches, track geo-location, and view direct MSP payouts',
      idField: 'mobile',
      idLabel: 'Mobile Number',
      idPlaceholder: 'Enter 10-digit mobile number',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-800',
      icon: '🌿'
    }
  };

  const currentRole = roleConfigMap[selectedRole] || roleConfigMap['aggregator'];

  return (
    <div className="relative min-h-screen w-full bg-[#faf9f5] text-slate-800 flex flex-col justify-between overflow-x-hidden font-sans select-none">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Decorative India Map Silhouette in Top Right Background */}
      <div className="absolute right-[-2%] top-12 w-80 h-96 opacity-[0.06] pointer-events-none -z-0 hidden xl:block">
        <svg viewBox="0 0 400 500" className="w-full h-full text-slate-900" fill="currentColor">
          <path d="M180 20 C190 25 210 20 220 35 C230 50 240 70 230 90 C220 110 250 120 260 140 C280 160 300 170 320 190 C340 210 330 240 310 260 C290 280 270 300 250 330 C230 360 210 400 190 450 C180 430 160 380 150 350 C140 320 120 290 110 260 C90 240 70 220 80 190 C90 160 110 140 120 120 C130 100 140 70 150 50 C160 30 170 20 180 20 Z" />
        </svg>
      </div>

      {/* Decorative Rashtrapati Bhavan / Parliament Silhouette in Bottom Right Background */}
      <div className="absolute bottom-10 right-0 opacity-[0.07] pointer-events-none -z-0 hidden lg:block">
        <svg className="w-96 h-56 text-amber-950" viewBox="0 0 300 150" fill="currentColor">
          <path d="M150 15 C135 15 130 30 130 45 L170 45 C170 30 165 15 150 15 Z M120 45 L180 45 L180 55 L120 55 Z M40 55 L260 55 L260 70 L40 70 Z M50 70 L50 120 L65 120 L65 70 Z M80 70 L80 120 L95 120 L95 70 Z M110 70 L110 120 L125 120 L125 70 Z M140 70 L140 120 L160 120 L160 70 Z M175 70 L175 120 L190 120 L190 70 Z M205 70 L205 120 L220 120 L220 70 Z M235 70 L235 120 L250 120 L250 70 Z M20 120 L280 120 L280 145 L20 145 Z" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR                                                         */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full px-4 sm:px-8 md:px-12 py-3 sm:py-4 flex items-center justify-between">
        {/* Left: Emblem of India + Ministry of Ayush + AYUSH Logo */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3">
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
              <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 font-serif">
                Government of India
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-slate-600">
                Ministry of Ayush
              </span>
              <span className="text-[8px] sm:text-[9px] text-slate-500 font-serif tracking-wider mt-0.5">
                आयुष मंत्रालय
              </span>
            </div>
          </div>

          {/* AYUSH Brand */}
          <div className="flex items-center gap-1.5">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-base sm:text-lg font-black tracking-wider text-[#0d5c3a] font-serif">
                  AYUSH
                </span>
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700">
                  <Leaf className="w-2.5 h-2.5" />
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-semibold text-emerald-800 leading-none">
                आयुष्मान भारत
              </span>
              <span className="text-[7px] sm:text-[8px] text-slate-600 leading-none mt-0.5">
                स्वस्थ भारत
              </span>
            </div>
          </div>
        </div>

        {/* Right: Digital India, Viksit Bharat, Language Switcher & Tagline */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Digital India */}
          <div className="hidden sm:flex items-center gap-2">
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
          <div className="flex items-center gap-1.5 bg-white/80 border border-slate-200/80 rounded-xl px-2.5 py-1 shadow-sm">
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

          {/* Language Switcher Pill */}
          <div className="flex items-center bg-white border border-slate-200 rounded-full p-0.5 shadow-sm">
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${selectedLanguage === 'en' ? 'bg-[#0d5c3a] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLanguage('hi')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${selectedLanguage === 'hi' ? 'bg-[#0d5c3a] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
            >
              हिंदी
            </button>
          </div>

          {/* Right vertical tagline */}
          <div className="hidden lg:flex flex-col text-right text-[8px] font-bold text-slate-400 tracking-[0.2em] leading-tight border-l border-slate-200 pl-3">
            <span>OUR HERITAGE</span>
            <span>OUR HEALTH</span>
            <span>OUR FUTURE</span>
            <div className="flex items-center justify-end gap-0.5 mt-1 w-10 ml-auto h-0.5 rounded-full overflow-hidden">
              <span className="w-1/3 h-full bg-[#FF9933]" />
              <span className="w-1/3 h-full bg-slate-300" />
              <span className="w-1/3 h-full bg-[#138808]" />
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN SECTION: Left Photo Card + Center Login Card                      */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
        
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT PHOTO CARD                                                         */}
        {/* ----------------------------------------------------------------------- */}
        <motion.div 
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full lg:w-[44%] xl:w-[42%] relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 min-h-[520px] lg:min-h-[620px] flex flex-col justify-between p-6 sm:p-7"
        >
          {/* Background Image of Farmer */}
          <img 
            src={ayuestufrontpage} 
            alt="AyuSetu - Empowering Herbal Communities" 
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/75 pointer-events-none" />

          {/* Top Branding Section */}
          <div className="relative z-10 space-y-1.5">
            {/* AyuSetu logo with leaf accent */}
            <div className="flex items-center gap-2">
              <h1 className="text-4xl sm:text-5xl font-serif font-black text-white tracking-tight drop-shadow-md">
                AyuSetu
              </h1>
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-emerald-300" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-emerald-100/90 leading-snug">
              Bridging Tradition with Trusted Supply Chains
            </p>

            <div className="pt-2">
              <span className="text-xs sm:text-sm font-semibold text-white/95">
                For a Healthier India
              </span>
              {/* Tricolor Bar */}
              <div className="flex items-center gap-1 mt-1.5 w-16 h-1 rounded-full overflow-hidden">
                <span className="w-1/3 h-full bg-[#FF9933]" />
                <span className="w-1/3 h-full bg-white" />
                <span className="w-1/3 h-full bg-[#138808]" />
              </div>
            </div>
          </div>

          {/* 4 Frosted Badges on Left */}
          <div className="relative z-10 space-y-2.5 my-auto py-4 max-w-[260px]">
            <div className="flex items-center gap-3 bg-emerald-950/85 backdrop-blur-md border border-emerald-500/20 rounded-2xl px-3 py-2 text-white shadow-lg">
              <div className="w-7 h-7 rounded-full bg-emerald-700/60 flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="text-xs font-semibold leading-tight">
                Authentic Indian Herbs
              </span>
            </div>

            <div className="flex items-center gap-3 bg-emerald-950/85 backdrop-blur-md border border-emerald-500/20 rounded-2xl px-3 py-2 text-white shadow-lg">
              <div className="w-7 h-7 rounded-full bg-emerald-700/60 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="text-xs font-semibold leading-tight">
                Transparent Supply Chain
              </span>
            </div>

            <div className="flex items-center gap-3 bg-emerald-950/85 backdrop-blur-md border border-emerald-500/20 rounded-2xl px-3 py-2 text-white shadow-lg">
              <div className="w-7 h-7 rounded-full bg-emerald-700/60 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="text-xs font-semibold leading-tight">
                Stronger Rural Livelihoods
              </span>
            </div>

            <div className="flex items-center gap-3 bg-emerald-950/85 backdrop-blur-md border border-emerald-500/20 rounded-2xl px-3 py-2 text-white shadow-lg">
              <div className="w-7 h-7 rounded-full bg-emerald-700/60 flex items-center justify-center shrink-0">
                <Trees className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="text-xs font-semibold leading-tight">
                Sustainable Ayurveda Ecosystem
              </span>
            </div>
          </div>

          {/* Bottom Quote Box */}
          <div className="relative z-10 bg-emerald-950/90 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-3 flex items-center gap-3 shadow-lg">
            <div className="w-7 h-7 rounded-full bg-emerald-800/80 flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs font-serif italic text-emerald-100/90 leading-tight">
              &ldquo;Empowering our farmers, Preserving our heritage&rdquo;
            </p>
          </div>
        </motion.div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT CARD: Official Login Container matching Image 2                  */}
        {/* ----------------------------------------------------------------------- */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="w-full lg:w-[50%] xl:w-[48%] bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-100 relative"
        >
          {/* Top Back Navigation Pill */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBackToRoles}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d5c3a] hover:text-emerald-900 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/70 rounded-full px-3 py-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Roles</span>
            </button>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              SECURE PORTAL
            </span>
          </div>

          {/* Center Role Icon & Header */}
          <div className="text-center space-y-1 mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100/90 border border-amber-200/80 text-3xl shadow-inner mb-2">
              {currentRole.icon}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Login as
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0d5c3a] tracking-tight">
              {currentRole.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-sm mx-auto leading-relaxed pt-1">
              {currentRole.description}
            </p>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* FORM: Standard Business Nodes (Aggregator, Processor, Mfg, Dist)    */}
          {/* ------------------------------------------------------------------- */}
          {selectedRole !== 'farmer' ? (
            <div className="space-y-4">
              {/* ID Input Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {currentRole.idLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={credentials[currentRole.idField] || ''}
                    onChange={(e) => onChangeCredential(currentRole.idField, e.target.value.toUpperCase())}
                    placeholder={currentRole.idPlaceholder}
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d5c3a]/20 focus:border-[#0d5c3a] transition-all shadow-sm"
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-medium pl-1">
                  Provided by State Ayush Department
                </p>
              </div>

              {/* Password Input Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password || ''}
                    onChange={(e) => onChangeCredential('password', e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 pl-10 pr-11 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d5c3a]/20 focus:border-[#0d5c3a] transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0d5c3a] focus:ring-[#0d5c3a]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert(`Password reset request sent to State Ayush Department for ${credentials[currentRole.idField] || 'your account'}.`)}
                  className="text-slate-600 hover:text-[#0d5c3a] font-semibold"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary Login Button */}
              <button
                onClick={onSubmit}
                disabled={isLoading}
                className="w-full h-12 sm:h-13 rounded-xl bg-[#0d5c3a] hover:bg-[#09462b] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(13,92,58,0.3)] hover:shadow-[0_6px_20px_rgba(13,92,58,0.4)] transition-all duration-200 mt-2 disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Authenticating Node...</span>
                  </>
                ) : (
                  <>
                    <span>Login as {currentRole.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  OR
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Government of India Single Sign-On: Jan Parichay */}
              <button
                type="button"
                onClick={() => {
                  if (onJanParichayLogin) {
                    onJanParichayLogin();
                  } else {
                    onChangeCredential(currentRole.idField, currentRole.idField === 'aggregatorId' ? 'AGG-1001' : currentRole.idField === 'organizationId' ? 'PROC-2001' : currentRole.idField === 'companyId' ? 'MFG-3001' : 'DIST-4001');
                    onChangeCredential('password', 'password123');
                    onSubmit();
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center gap-3 transition-all shadow-sm group"
              >
                {/* Jan Parichay Tricolor 'JP' Emblem */}
                <div className="w-6 h-6 rounded-full border border-orange-400 bg-white flex items-center justify-center shrink-0">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#000080] via-[#FF9933] to-[#138808] flex items-center justify-center text-[7px] text-white font-black">
                    JP
                  </div>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    Login with Jan Parichay
                  </span>
                  <span className="text-[9px] text-slate-500 leading-none">
                    Government of India Single Sign-On
                  </span>
                </div>
              </button>

            </div>
          ) : (
            /* ------------------------------------------------------------------- */
            /* FARMER / COLLECTOR SPECIFIC WORKFLOW                                */
            /* ------------------------------------------------------------------- */
            <div className="space-y-4">
              {/* Farmer Sub-Tabs */}
              <div className="flex p-1 bg-emerald-50/80 rounded-xl border border-emerald-100">
                <button
                  type="button"
                  onClick={() => setFarmerTab('new')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${farmerTab === 'new' ? 'bg-[#0d5c3a] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  NEW REGISTRY
                </button>
                <button
                  type="button"
                  onClick={() => setFarmerTab('search')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${farmerTab === 'search' ? 'bg-[#0d5c3a] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  IDENTITY SEEKER / PIN
                </button>
              </div>

              {farmerTab === 'new' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Rajesh Kumar"
                        value={credentials.fullName || ''}
                        onChange={(e) => onChangeCredential('fullName', e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0d5c3a]/20 focus:border-[#0d5c3a] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit number"
                        value={credentials.mobile || ''}
                        onChange={(e) => onChangeCredential('mobile', e.target.value.replace(/\D/g, ''))}
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0d5c3a]/20 focus:border-[#0d5c3a] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Aadhar Number</label>
                      <input
                        type="text"
                        maxLength={14}
                        placeholder="XXXX XXXX XXXX"
                        value={credentials.aadharId || ''}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                          onChangeCredential('aadharId', val);
                        }}
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0d5c3a]/20 focus:border-[#0d5c3a] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="6-digit pincode"
                        value={credentials.pincode || ''}
                        onChange={(e) => onPincodeChange(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0d5c3a]/20 focus:border-[#0d5c3a] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Village / Location</label>
                    <input
                      type="text"
                      placeholder="Auto-detected or enter location"
                      value={credentials.location || ''}
                      onChange={(e) => onChangeCredential('location', e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0d5c3a]/20 focus:border-[#0d5c3a] outline-none"
                    />
                  </div>

                  <button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl bg-[#0d5c3a] hover:bg-[#09462b] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Register & Verify OTP →</span>}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Enter Identity Access PIN</label>
                    <input
                      type="text"
                      placeholder="e.g. FARM-1001"
                      value={credentials.aggregatorId || ''}
                      onChange={(e) => onChangeCredential('aggregatorId', e.target.value.toUpperCase())}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 font-mono font-bold text-slate-800 text-base focus:ring-2 focus:ring-[#0d5c3a]/20 focus:border-[#0d5c3a] outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Lookup your existing registered herbal grower identity card
                    </p>
                  </div>

                  <button
                    onClick={onFarmerSearch}
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl bg-[#0d5c3a] hover:bg-[#09462b] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Verify Existing Farmer PIN →</span>}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Need Help Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <Phone className="w-3.5 h-3.5 text-[#0d5c3a]" />
              <span>Need help? Contact your State Ayush Department</span>
            </div>
          </div>

        </motion.div>

      </main>

      {/* ========================================================================= */}
      {/* 3. BOTTOM FOOTER BAR (4 VERIFIED PILLARS)                                */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full bg-[#f4f2eb] border-t border-slate-200/80 py-3 px-4 sm:px-8 text-slate-700">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center sm:text-left">
          {/* Pillar 1 */}
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#0d5c3a] shrink-0" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-slate-900">Secure & Verified Access</span>
              <span className="text-[10px] text-slate-500">Government Authorized</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-center justify-center sm:justify-start gap-2.5 border-l border-slate-200/60 pl-3">
            <Check className="w-5 h-5 text-[#0d5c3a] shrink-0" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-slate-900">Data Privacy Assured</span>
              <span className="text-[10px] text-slate-500">Your Information is Safe</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-center justify-center sm:justify-start gap-2.5 border-l border-slate-200/60 pl-3">
            <Phone className="w-5 h-5 text-[#0d5c3a] shrink-0" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-slate-900">For Technical Support</span>
              <span className="text-[10px] font-mono text-slate-600 font-bold">1800-120-8040 (Toll Free)</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-center justify-center sm:justify-start gap-2.5 border-l border-slate-200/60 pl-3">
            <Leaf className="w-5 h-5 text-[#0d5c3a] shrink-0" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-slate-900">Aatmanirbhar Bharat</span>
              <span className="text-[10px] text-slate-500">Through Ayurveda</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
