import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, Sparkles, Users, Sprout, Leaf, ArrowRight, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ayuestufrontpage from '@/assets/ayuestufrontpage.png';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-[#faf9f5] text-slate-800 flex flex-col justify-between overflow-x-hidden select-none font-sans">
      {/* Background Decorative Grid / Warm Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR                                                         */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full px-6 py-4 sm:px-10 md:px-14 flex items-center justify-between">
        {/* Left: Emblem of India + Ministry of Ayush + AYUSH Logo */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Lion Capital of Ashoka (State Emblem of India) */}
          <div className="flex items-center gap-2.5">
            <svg
              className="w-9 h-11 sm:w-10 sm:h-12 text-slate-800"
              viewBox="0 0 100 120"
              fill="currentColor"
              aria-label="Emblem of India"
            >
              {/* Stylized Lion Capital SVG */}
              <path d="M50 5 C40 5 35 15 35 25 C35 32 38 38 42 42 C30 45 20 55 20 70 C20 78 25 85 32 90 L32 96 C30 98 25 100 20 102 L20 106 L80 106 L80 102 C75 100 70 98 68 96 L68 90 C75 85 80 78 80 70 C80 55 70 45 58 42 C62 38 65 32 65 25 C65 15 60 5 50 5 Z M50 12 C55 12 58 18 58 25 C58 32 55 38 50 38 C45 38 42 32 42 25 C42 18 45 12 50 12 Z M35 70 C35 60 42 50 50 50 C58 50 65 60 65 70 C65 78 58 86 50 86 C42 86 35 78 35 70 Z" />
              {/* Ashoka Chakra in base */}
              <circle cx="50" cy="98" r="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
              {/* Satyameva Jayate text line placeholder */}
              <rect x="25" y="110" width="50" height="3" rx="1.5" fill="currentColor" />
            </svg>
            <div className="flex flex-col leading-tight border-r border-slate-300 pr-4">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 font-serif">
                Government of India
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-slate-600">
                Ministry of Ayush
              </span>
              <span className="text-[8px] sm:text-[9px] text-slate-500 font-serif tracking-widest mt-0.5">
                सत्यमेव जयते
              </span>
            </div>
          </div>

          {/* AYUSH Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-base sm:text-lg font-black tracking-wider text-[#0d5c3a] font-serif">
                  AYUSH
                </span>
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-700">
                  <Leaf className="w-2.5 h-2.5" />
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-800 leading-none">
                आयुष्मान भारत
              </span>
              <span className="text-[8px] sm:text-[9px] text-slate-600 leading-none mt-0.5">
                स्वस्थ भारत
              </span>
            </div>
          </div>
        </div>

        {/* Right: Digital India Logo & Heritage Text */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Digital India Official Mark */}
          <div className="flex items-center gap-2">
            {/* Digital India 'd' logo representation */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-[3px] border-[#FF9933] border-t-[#138808] border-r-[#000080] flex items-center justify-center transform -rotate-45">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#000080] via-[#FF9933] to-[#138808]" />
              </div>
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-xs sm:text-sm font-black tracking-tight text-slate-900 font-sans">
                Digital India
              </span>
              <span className="text-[8px] sm:text-[9px] font-medium text-slate-500 tracking-wide">
                Power To Empower
              </span>
            </div>
          </div>

          {/* Right vertical tagline */}
          <div className="hidden lg:flex flex-col text-right text-[9px] font-bold text-slate-400 tracking-[0.2em] leading-relaxed border-l border-slate-200 pl-4">
            <span>OUR HERITAGE</span>
            <span>OUR HEALTH</span>
            <span>OUR FUTURE</span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN HERO SECTION                                                      */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-4 md:py-6 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

        {/* ----------------------------------------------------------------------- */}
        {/* LEFT CARD: Indian Herbal Farmer Landscape + Badges                      */}
        {/* ----------------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full lg:w-[46%] xl:w-[45%] relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 aspect-[4/5] sm:aspect-[16/17] lg:aspect-[4/5] max-h-[640px] flex flex-col justify-between p-6 sm:p-7"
        >
          {/* Background Image of Farmer & Herbal Plantation */}
          <img
            src={ayuestufrontpage}
            alt="Empowering Traditional Wisdom - Indian Herbal Farmer"
            className="absolute inset-0 w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Gradient Overlay for Top & Bottom readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />

          {/* Top Overlay Text */}
          <div className="relative z-10 max-w-xs sm:max-w-sm">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-medium text-white drop-shadow-md leading-snug">
              Empowering <br />
              <span className="font-semibold italic text-emerald-200">Traditional Wisdom</span> <br />
              for a Healthier India
            </h2>
            {/* Indian Tricolor Bar */}
            <div className="flex items-center gap-1 mt-3 w-16 h-1.5 rounded-full overflow-hidden">
              <span className="w-1/3 h-full bg-[#FF9933]" />
              <span className="w-1/3 h-full bg-white" />
              <span className="w-1/3 h-full bg-[#138808]" />
            </div>
          </div>

          {/* Bottom Overlay Badges */}
          <div className="relative z-10 space-y-4">
            {/* 3 Glassmorphism Pill Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {/* Badge 1: Government Verified System */}
              <div className="bg-emerald-950/75 backdrop-blur-md border border-emerald-500/20 rounded-xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-center shadow-lg transition-all hover:bg-emerald-900/85 hover:border-emerald-400/40">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold text-white leading-tight">
                  Government
                </span>
                <span className="text-[8px] sm:text-[9px] text-emerald-200/90 leading-tight">
                  Verified System
                </span>
              </div>

              {/* Badge 2: End-to-End Traceability */}
              <div className="bg-emerald-950/75 backdrop-blur-md border border-emerald-500/20 rounded-xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-center shadow-lg transition-all hover:bg-emerald-900/85 hover:border-emerald-400/40">
                <Leaf className="w-5 h-5 text-emerald-400 mb-1 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold text-white leading-tight">
                  End-to-End
                </span>
                <span className="text-[8px] sm:text-[9px] text-emerald-200/90 leading-tight">
                  Traceability
                </span>
              </div>

              {/* Badge 3: Supporting Farmers & Vaidyas */}
              <div className="bg-emerald-950/75 backdrop-blur-md border border-emerald-500/20 rounded-xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-center shadow-lg transition-all hover:bg-emerald-900/85 hover:border-emerald-400/40">
                <Users className="w-5 h-5 text-emerald-400 mb-1 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold text-white leading-tight">
                  Supporting
                </span>
                <span className="text-[8px] sm:text-[9px] text-emerald-200/90 leading-tight">
                  Farmers & Vaidyas
                </span>
              </div>
            </div>

            {/* Bottom Sub-ribbon */}
            <div className="text-center pt-1 border-t border-white/10">
              <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-white/70 uppercase">
                PRESERVING OUR HERITAGE | PROMOTING A HEALTHIER BHARAT
              </span>
            </div>
          </div>
        </motion.div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT CANVAS: Typography, Ashoka Watermark & CTA                         */}
        {/* ----------------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="w-full lg:w-[54%] xl:w-[55%] relative flex flex-col justify-center py-4 lg:py-6 pl-0 lg:pl-6"
        >
          {/* Decorative Ashoka Chakra Watermark */}
          <div className="absolute top-[-10%] right-[-5%] sm:right-[5%] w-72 h-72 sm:w-96 sm:h-96 opacity-[0.06] pointer-events-none -z-0">
            <svg viewBox="0 0 200 200" className="w-full h-full text-slate-900 animate-[spin_120s_linear_infinite]" fill="currentColor">
              <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="100" cy="100" r="6" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1="100"
                  y1="100"
                  x2={100 + 95 * Math.cos((i * 15 * Math.PI) / 180)}
                  y2={100 + 95 * Math.sin((i * 15 * Math.PI) / 180)}
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
              ))}
            </svg>
          </div>

          {/* Decorative Botanical Leaf Silhouettes in background */}
          <div className="absolute right-4 top-1/3 opacity-[0.07] pointer-events-none -z-0">
            <svg className="w-48 h-48 text-emerald-900" viewBox="0 0 200 200" fill="currentColor">
              <path d="M100 20 C60 50 30 110 50 160 C70 140 85 100 100 70 C115 100 130 140 150 160 C170 110 140 50 100 20 Z" />
              <path d="M140 60 C170 80 190 120 180 160 C160 145 145 120 135 100 C140 85 140 70 140 60 Z" opacity="0.6" />
            </svg>
          </div>

          {/* Decorative Rashtrapati Bhavan / Parliament Silhouette in Bottom Right */}
          <div className="absolute bottom-0 right-0 opacity-[0.08] pointer-events-none -z-0 hidden md:block">
            <svg className="w-72 h-44 text-amber-900" viewBox="0 0 300 150" fill="currentColor">
              <path d="M150 15 C135 15 130 30 130 45 L170 45 C170 30 165 15 150 15 Z M120 45 L180 45 L180 55 L120 55 Z M40 55 L260 55 L260 70 L40 70 Z M50 70 L50 120 L65 120 L65 70 Z M80 70 L80 120 L95 120 L95 70 Z M110 70 L110 120 L125 120 L125 70 Z M140 70 L140 120 L160 120 L160 70 Z M175 70 L175 120 L190 120 L190 70 Z M205 70 L205 120 L220 120 L220 70 Z M235 70 L235 120 L250 120 L250 70 Z M20 120 L280 120 L280 145 L20 145 Z" />
            </svg>
          </div>

          {/* Main Content Area */}
          <div className="relative z-10 space-y-6">
            {/* Tricolor Tag + Initiative Label */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 w-14 h-1.5 rounded-full overflow-hidden">
                <span className="w-1/3 h-full bg-[#FF9933]" />
                <span className="w-1/3 h-full bg-slate-300" />
                <span className="w-1/3 h-full bg-[#138808]" />
              </div>
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
                Government of India Initiative
              </span>
            </div>

            {/* Large Hero Title */}
            <div>
              <h1 className="leading-[1.05] tracking-tight">
                <span className="block font-serif italic text-4xl sm:text-5xl lg:text-6xl text-slate-800 font-normal">
                  Welcome to
                </span>
                <span className="block font-serif font-black text-6xl sm:text-7xl lg:text-8xl text-[#0d5c3a] tracking-tight mt-1 drop-shadow-sm">
                  AyuSetu.
                </span>
              </h1>
              <p className="mt-3 text-lg sm:text-xl lg:text-2xl font-medium text-slate-600 max-w-xl leading-relaxed">
                Your trusted herbal supply chain ecosystem.
              </p>
            </div>

            {/* 3 Key Feature Circles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 max-w-lg">
              {/* Feature 1: Transparency in Supply Chain */}
              <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 p-2 rounded-2xl bg-white/60 sm:bg-transparent border border-emerald-100/60 sm:border-none shadow-sm sm:shadow-none">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#e8f5e9] border border-emerald-200 flex items-center justify-center text-[#0d5c3a] shadow-sm shrink-0">
                  <Sprout className="w-6 h-6 text-[#0d5c3a]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                  Transparency in Supply Chain
                </span>
              </div>

              {/* Feature 2: Authenticity & Traceability */}
              <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 p-2 rounded-2xl bg-white/60 sm:bg-transparent border border-emerald-100/60 sm:border-none shadow-sm sm:shadow-none">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#e8f5e9] border border-emerald-200 flex items-center justify-center text-[#0d5c3a] shadow-sm shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#0d5c3a]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                  Authenticity & Traceability
                </span>
              </div>

              {/* Feature 3: Sustainable Livelihoods */}
              <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 p-2 rounded-2xl bg-white/60 sm:bg-transparent border border-emerald-100/60 sm:border-none shadow-sm sm:shadow-none">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#e8f5e9] border border-emerald-200 flex items-center justify-center text-[#0d5c3a] shadow-sm shrink-0">
                  <Users className="w-6 h-6 text-[#0d5c3a]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                  Sustainable Livelihoods
                </span>
              </div>
            </div>

            {/* CTAs: Get Started Button & Verify Product Button */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {/* Primary "Get Started >" Button */}
              <button
                id="get-started-btn"
                onClick={onGetStarted}
                className="group relative inline-flex items-center justify-center h-14 sm:h-16 px-8 sm:px-10 rounded-full bg-[#0d5c3a] hover:bg-[#09462b] text-white font-bold text-lg sm:text-xl shadow-[0_10px_25px_rgba(13,92,58,0.35)] hover:shadow-[0_15px_30px_rgba(13,92,58,0.5)] transform hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <span className="mr-2 tracking-wide font-sans">Get Started</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" strokeWidth={2.8} />
                {/* Subtle Sheen Sweep */}
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-15deg)_translateX(-120%)] group-hover:duration-1000 group-hover:[transform:skew(-15deg)_translateX(120%)] pointer-events-none">
                  <div className="relative h-full w-14 bg-white/20" />
                </div>
              </button>

              {/* Single "Verify Product" Entry Point */}
              <button
                id="verify-product-btn"
                onClick={() => navigate('/verify-product')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 font-semibold text-sm shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#0d5c3a]" />
                <span>Verify Product</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700" />
              </button>
            </div>

            {/* Bottom Quote & Viksit Bharat Logo */}
            <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-slate-200/80">
              {/* Quote */}
              <div className="space-y-1.5">
                <p className="font-serif italic text-sm sm:text-base text-slate-600 font-medium">
                  &ldquo;Traditional Knowledge for a Healthier Tomorrow&rdquo;
                </p>
                <div className="flex items-center gap-1 w-20 h-1 rounded-full overflow-hidden">
                  <span className="w-1/3 h-full bg-[#FF9933]" />
                  <span className="w-1/3 h-full bg-slate-300" />
                  <span className="w-1/3 h-full bg-[#138808]" />
                </div>
              </div>

              {/* Viksit Bharat @2047 Branding */}
              <div className="flex items-center gap-2 self-start sm:self-auto bg-white/80 backdrop-blur-sm border border-slate-200/70 rounded-xl px-3 py-1.5 shadow-sm">
                <div className="flex flex-col text-right leading-none">
                  <span className="text-xs font-black text-slate-800 tracking-tight">
                    Viksit
                  </span>
                  <span className="text-xs font-bold text-slate-700 tracking-tight">
                    Bharat
                  </span>
                  <span className="text-[10px] font-bold text-[#FF9933]">
                    @2047
                  </span>
                </div>
                {/* Tricolor flag swoop */}
                <div className="flex flex-col gap-0.5">
                  <span className="w-4 h-1 rounded-full bg-[#FF9933]" />
                  <span className="w-4 h-1 rounded-full bg-slate-300" />
                  <span className="w-4 h-1 rounded-full bg-[#138808]" />
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </main>

      {/* ========================================================================= */}
      {/* 3. BOTTOM TICKER / ACCESSIBILITY FOOTER                                  */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full bg-emerald-950 text-emerald-100/80 text-[10px] sm:text-xs py-2 px-6 flex flex-col sm:flex-row items-center justify-between gap-1 border-t border-emerald-800/40">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Ayurveda Supply Chain & Authenticity Verification Network</span>
        </div>
        <div className="text-emerald-300/80 font-mono text-[9px] tracking-wider">
          GOVERNMENT OF INDIA • NATIONAL AYUSH MISSION
        </div>
      </footer>
    </div>
  );
};
