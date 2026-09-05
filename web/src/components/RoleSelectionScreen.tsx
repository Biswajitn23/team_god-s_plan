import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShieldCheck, Leaf, Users, Sprout, Package, Settings, Factory, Truck } from 'lucide-react';
import ayuestufrontpage from '@/assets/ayuestufrontpage.png';

interface RoleSelectionScreenProps {
  onSelectRole: (roleId: string) => void;
  onBackToHome: () => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onSelectRole,
  onBackToHome,
}) => {
  const roleCards = [
    {
      id: 'farmer',
      title: 'Farmer / Collector',
      hindiTitle: 'किसान / औषधीय संकलक',
      nodeBadge: 'PRIMARY PRODUCER',
      subtitle: 'Register as a herbal resource provider',
      tagline: 'Grow for a Healthier India',
      bgColor: 'bg-[#f0fdf4]', // soft emerald
      borderColor: 'border-emerald-200/90',
      hoverBorder: 'hover:border-emerald-500',
      badgeBg: 'bg-emerald-100/90 text-emerald-800 border-emerald-300/60',
      iconBg: 'bg-emerald-100 text-emerald-800',
      icon: <Sprout className="w-5 h-5 text-emerald-700" />,
      btnBg: 'bg-emerald-800 hover:bg-emerald-900',
      btnRing: 'group-hover:ring-emerald-300',
      highlights: [
        'Geo-tagged crop harvest logging',
        'Organic & GAP cultivation record',
        'Direct MSP & transparent payouts'
      ],
      illustration: (
        <svg viewBox="0 0 120 70" className="w-full h-14 sm:h-16 text-emerald-700/80 stroke-current fill-none stroke-[1.5]">
          {/* Farmer bending over herbal plant illustration */}
          <circle cx="50" cy="18" r="5" stroke="currentColor" fill="currentColor" fillOpacity="0.1" />
          <path d="M42 15 Q50 11 58 15" strokeLinecap="round" />
          <path d="M50 23 L46 38 L38 45 L34 58" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M46 32 L32 42 L26 40" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M48 38 L56 48 L54 58" strokeLinecap="round" strokeLinejoin="round" />
          {/* Plants */}
          <path d="M72 60 C72 42 82 35 88 32 C94 37 94 48 94 60" strokeLinecap="round" />
          <path d="M84 34 Q76 40 76 46" strokeLinecap="round" />
          <path d="M84 42 Q92 44 90 50" strokeLinecap="round" />
          <path d="M20 60 L105 60" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>
      )
    },
    {
      id: 'aggregator',
      title: 'Aggregator',
      hindiTitle: 'संग्रहण एवं मंडी केंद्र',
      nodeBadge: 'CONSOLIDATION HUB',
      subtitle: 'Collection & consolidation',
      tagline: 'Bridge Farmers to Markets',
      bgColor: 'bg-[#fefce8]', // soft warm amber/cream
      borderColor: 'border-amber-200/90',
      hoverBorder: 'hover:border-amber-500',
      badgeBg: 'bg-amber-100/90 text-amber-800 border-amber-300/60',
      iconBg: 'bg-amber-100 text-amber-800',
      icon: <Package className="w-5 h-5 text-amber-700" />,
      btnBg: 'bg-amber-800 hover:bg-amber-900',
      btnRing: 'group-hover:ring-amber-300',
      highlights: [
        'Lot creation & moisture grading',
        'Transparent digital weighment',
        'Mandi consolidation & inventory'
      ],
      illustration: (
        <svg viewBox="0 0 120 70" className="w-full h-14 sm:h-16 text-amber-800/80 stroke-current fill-none stroke-[1.5]">
          {/* Sacks & collection trader */}
          <ellipse cx="40" cy="50" rx="13" ry="10" fill="currentColor" fillOpacity="0.08" />
          <path d="M30 40 Q40 34 50 40 L40 36 Z" />
          <ellipse cx="62" cy="52" rx="11" ry="9" fill="currentColor" fillOpacity="0.08" />
          {/* Aggregator person */}
          <circle cx="86" cy="22" r="4.5" stroke="currentColor" fill="currentColor" fillOpacity="0.1" />
          <path d="M86 26 L86 45 L80 58" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M86 45 L92 58" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M86 33 L72 38 L68 45" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 60 L105 60" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>
      )
    },
    {
      id: 'processor',
      title: 'Processor',
      hindiTitle: 'प्रसंस्करण एवं शोधन इकाई',
      nodeBadge: 'EXTRACTION & TESTING',
      subtitle: 'Processing & refinement',
      tagline: 'Add Value with Purity',
      bgColor: 'bg-[#f0f9ff]', // soft sky blue
      borderColor: 'border-sky-200/90',
      hoverBorder: 'hover:border-sky-500',
      badgeBg: 'bg-sky-100/90 text-sky-800 border-sky-300/60',
      iconBg: 'bg-sky-100 text-sky-800',
      icon: <Settings className="w-5 h-5 text-sky-700" />,
      btnBg: 'bg-sky-800 hover:bg-sky-900',
      btnRing: 'group-hover:ring-sky-300',
      highlights: [
        'Herbal extract standardization',
        'AYUSH pharmacopoeia testing',
        'Digitally signed QA/QC lab COA'
      ],
      illustration: (
        <svg viewBox="0 0 120 70" className="w-full h-14 sm:h-16 text-sky-800/80 stroke-current fill-none stroke-[1.5]">
          {/* Mortar & pestle + lab processing pipes */}
          <path d="M26 38 C26 54 46 56 56 56 C66 56 86 54 86 38 Z" fill="currentColor" fillOpacity="0.08" />
          <path d="M22 38 L90 38" strokeLinecap="round" />
          <path d="M42 22 L66 44" strokeLinecap="round" strokeWidth="2.5" />
          {/* Distillation lab columns */}
          <rect x="74" y="26" width="10" height="30" rx="2" fill="currentColor" fillOpacity="0.06" />
          <rect x="88" y="20" width="12" height="36" rx="2" fill="currentColor" fillOpacity="0.06" />
          <path d="M80 26 L80 18 L94 18 L94 20" strokeLinecap="round" />
          <path d="M15 58 L105 58" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>
      )
    },
    {
      id: 'manufacturer',
      title: 'Manufacturer',
      hindiTitle: 'औषध निर्माण इकाई',
      nodeBadge: 'GMP FORMULATION',
      subtitle: 'Product formulation',
      tagline: 'Create Trusted Products',
      bgColor: 'bg-[#fff1f2]', // soft rose
      borderColor: 'border-rose-200/90',
      hoverBorder: 'hover:border-rose-500',
      badgeBg: 'bg-rose-100/90 text-rose-800 border-rose-300/60',
      iconBg: 'bg-rose-100 text-rose-800',
      icon: <Factory className="w-5 h-5 text-rose-700" />,
      btnBg: 'bg-rose-800 hover:bg-rose-900',
      btnRing: 'group-hover:ring-rose-300',
      highlights: [
        'GMP finished goods formulation',
        'Batch QR serialization & seal',
        'Regulatory authenticity compliance'
      ],
      illustration: (
        <svg viewBox="0 0 120 70" className="w-full h-14 sm:h-16 text-rose-800/80 stroke-current fill-none stroke-[1.5]">
          {/* Jars, bottles, herbal formula vials */}
          <rect x="25" y="32" width="16" height="24" rx="3" fill="currentColor" fillOpacity="0.08" />
          <rect x="28" y="27" width="10" height="5" rx="1" />
          <rect x="48" y="25" width="20" height="31" rx="4" fill="currentColor" fillOpacity="0.08" />
          <rect x="52" y="20" width="12" height="5" rx="1" />
          <path d="M78 30 L90 30 L88 56 L80 56 Z" fill="currentColor" fillOpacity="0.08" />
          <rect x="80" y="25" width="8" height="5" rx="1" />
          <path d="M15 58 L105 58" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>
      )
    },
    {
      id: 'distributor',
      title: 'Distributor',
      hindiTitle: 'वितरण एवं लॉजिस्टिक्स',
      nodeBadge: 'LOGISTICS & SUPPLY',
      subtitle: 'Logistics & delivery',
      tagline: 'Take Ayurveda to Every Corner',
      bgColor: 'bg-[#f5f3ff]', // soft lavender/violet
      borderColor: 'border-violet-200/90',
      hoverBorder: 'hover:border-violet-500',
      badgeBg: 'bg-violet-100/90 text-violet-800 border-violet-300/60',
      iconBg: 'bg-violet-100 text-violet-800',
      icon: <Truck className="w-5 h-5 text-violet-700" />,
      btnBg: 'bg-violet-800 hover:bg-violet-900',
      btnRing: 'group-hover:ring-violet-300',
      highlights: [
        'GPS transit & cold-chain logging',
        'Digital e-Waybill dispatch proof',
        'Pharmacy & Vaidya distribution'
      ],
      illustration: (
        <svg viewBox="0 0 120 70" className="w-full h-14 sm:h-16 text-violet-800/80 stroke-current fill-none stroke-[1.5]">
          {/* Logistics delivery van with herb emblem */}
          <path d="M22 30 L66 30 L66 54 L22 54 Z" fill="currentColor" fillOpacity="0.08" />
          <path d="M66 36 L80 36 L92 45 L92 54 L66 54 Z" fill="currentColor" fillOpacity="0.08" />
          <circle cx="36" cy="54" r="5.5" fill="white" />
          <circle cx="78" cy="54" r="5.5" fill="white" />
          <path d="M44 41 C44 36 50 34 53 38 C50 41 46 41 44 41 Z" strokeWidth="1.2" fill="currentColor" fillOpacity="0.2" />
          <path d="M15 58 L105 58" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#faf9f5] text-slate-800 flex flex-col justify-between overflow-x-hidden select-none font-sans">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

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

          {/* Back to Home Button in Header */}
          <button
            onClick={onBackToHome}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-700 hover:text-emerald-900 font-medium text-xs shadow-sm hover:shadow transition-all ml-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Right: Digital India & Viksit Bharat */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Mobile Back Button */}
          <button
            onClick={onBackToHome}
            className="md:hidden flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Home</span>
          </button>

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
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN SECTION: Left Card + Right 5-Column Grid                          */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-2 sm:py-4 flex flex-col lg:flex-row items-stretch justify-between gap-6 lg:gap-8">
        
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT PHOTO CARD: AyuSetu + Badges                                       */}
        {/* ----------------------------------------------------------------------- */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full lg:w-[28%] xl:w-[26%] relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 min-h-[480px] lg:min-h-[580px] flex flex-col justify-between p-5 sm:p-6"
        >
          {/* Background Image of Farmer */}
          <img 
            src={ayuestufrontpage} 
            alt="AyuSetu - Empowering Herbal Communities" 
            className="absolute inset-0 w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/70 pointer-events-none" />

          {/* Top Branding */}
          <div className="relative z-10 space-y-1">
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight drop-shadow-md">
              AyuSetu
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-emerald-200">
              Government of India Initiative
            </p>
            {/* Tricolor Bar */}
            <div className="flex items-center gap-1 mt-1 w-14 h-1 rounded-full overflow-hidden">
              <span className="w-1/3 h-full bg-[#FF9933]" />
              <span className="w-1/3 h-full bg-white" />
              <span className="w-1/3 h-full bg-[#138808]" />
            </div>
          </div>

          {/* Middle Overlay Slogan */}
          <div className="relative z-10 my-auto py-4">
            <h2 className="text-lg sm:text-xl font-serif font-medium text-white/95 leading-snug drop-shadow-md">
              Connecting <br />
              <span className="font-semibold text-emerald-200">Our Herbs.</span> <br />
              Empowering <br />
              <span className="font-semibold text-emerald-200">Our People.</span>
            </h2>
          </div>

          {/* Bottom Badges + Quote */}
          <div className="relative z-10 space-y-3">
            {/* 3 Vertical Frosted Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/20 rounded-xl px-3 py-2 text-white shadow">
                <div className="w-6 h-6 rounded-full bg-emerald-700/60 flex items-center justify-center shrink-0">
                  <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold leading-tight">
                  Authentic Indian Herbs
                </span>
              </div>

              <div className="flex items-center gap-3 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/20 rounded-xl px-3 py-2 text-white shadow">
                <div className="w-6 h-6 rounded-full bg-emerald-700/60 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold leading-tight">
                  Transparent Supply Chain
                </span>
              </div>

              <div className="flex items-center gap-3 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/20 rounded-xl px-3 py-2 text-white shadow">
                <div className="w-6 h-6 rounded-full bg-emerald-700/60 flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 text-emerald-300" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold leading-tight">
                  Stronger Rural Livelihoods
                </span>
              </div>
            </div>

            {/* Bottom Quote Box */}
            <div className="bg-emerald-950/90 backdrop-blur-md border border-emerald-400/30 rounded-xl p-2.5 flex items-center gap-2.5 shadow-lg">
              <Sprout className="w-6 h-6 text-emerald-400 shrink-0" />
              <p className="text-[10px] sm:text-[11px] font-serif italic text-emerald-100/90 leading-tight">
                &ldquo;Healthy India through the Power of Our Heritage&rdquo;
              </p>
            </div>
          </div>
        </motion.div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT PANEL: 5 Role Cards in a Row                                      */}
        {/* ----------------------------------------------------------------------- */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="w-full lg:w-[72%] xl:w-[74%] flex flex-col justify-between"
        >
          {/* Section Header */}
          <div className="text-center mb-4 sm:mb-6">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-slate-500 uppercase">
              JOIN HANDS FOR A HEALTHIER INDIA
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mt-1">
              Select your role
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium mt-1.5">
              Choose how you want to participate in the AyuSetu ecosystem
            </p>
          </div>

          {/* 5 Column Role Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 my-auto">
            {roleCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={() => onSelectRole(card.id)}
                className={`group cursor-pointer rounded-2xl p-4 sm:p-4 flex flex-col justify-between text-center transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${card.bgColor} ${card.borderColor} border-2 ${card.hoverBorder} relative overflow-hidden`}
              >
                {/* Top Node Badge */}
                <div className="flex items-center justify-between gap-1 mb-2.5">
                  <span className={`text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full border ${card.badgeBg} tracking-wider uppercase`}>
                    {card.nodeBadge}
                  </span>
                  <span className="text-[9px] font-medium text-slate-500">
                    Step 0{index + 1}
                  </span>
                </div>

                {/* Top Icon Circle */}
                <div className="flex justify-center mb-2">
                  <div className={`w-11 h-11 rounded-full ${card.iconBg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                </div>

                {/* Card Title, Subtitle & Hindi title */}
                <div className="space-y-0.5 mb-2">
                  <h3 className="font-bold text-sm sm:text-[15px] text-slate-900 leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-serif">
                    {card.hindiTitle}
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium leading-snug pt-0.5">
                    {card.subtitle}
                  </p>
                </div>

                {/* Middle Illustration */}
                <div className="my-1 py-1 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {card.illustration}
                </div>

                {/* 3 Detail Bullet Points */}
                <div className="my-2 py-2 px-2 rounded-xl bg-white/75 border border-slate-200/60 text-left space-y-1 shadow-inner">
                  {card.highlights.map((item, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-1.5 text-[9px] sm:text-[10px] text-slate-700 leading-tight">
                      <span className="inline-block w-1 h-1 rounded-full bg-slate-400 mt-1 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Action: Arrow Button & Tagline */}
                <div className="mt-1 pt-1.5 space-y-1.5">
                  <div className="flex justify-center">
                    <button 
                      aria-label={`Select ${card.title}`}
                      className={`w-9 h-9 rounded-full ${card.btnBg} text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ring-4 ring-transparent ${card.btnRing}`}
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-semibold text-slate-700 leading-tight">
                    {card.tagline}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Bar: Soil to Society Banner & Watermark footer */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            {/* Mission Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-slate-200 text-[10px] sm:text-xs text-slate-700 font-medium shadow-sm">
              <Leaf className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>
                From Soil to Society &nbsp;|&nbsp; Transparent &nbsp;|&nbsp; Authentic &nbsp;|&nbsp; Sustainable &nbsp;|&nbsp; Atmanirbhar Bharat
              </span>
            </div>

            {/* Right Tagline */}
            <div className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">
              Our Herbs • Our Health • Our Future
            </div>
          </div>

        </motion.div>

      </main>

      {/* ========================================================================= */}
      {/* 3. FOOTER STRIP                                                           */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full bg-emerald-950 text-emerald-200/80 text-[10px] py-1.5 px-6 flex items-center justify-between border-t border-emerald-900">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>National AYUSH Traceability Portal • Authorized Access Point</span>
        </div>
        <div className="font-mono text-[9px] tracking-wider text-emerald-400/90">
          SECURED BY GOVERNMENT OF INDIA
        </div>
      </footer>
    </div>
  );
};
