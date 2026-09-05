import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Users,
  Sprout,
  Leaf,
  ArrowRight,
  QrCode,
  Truck,
  FlaskConical,
  Package,
  Layers,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Lock,
  Cpu,
  Database,
  Radio,
  Clock,
  FileText,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ayuestufrontpage from '@/assets/ayuestufrontpage.png';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

interface PrototypeStage {
  id: number;
  stageNumber: string;
  title: string;
  hindiTitle: string;
  role: string;
  badgeColor: string;
  icon: any;
  summary: string;
  keyFeatures: string[];
  techStack: string[];
  hashSample: string;
  simulatedData: Record<string, string>;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const [selectedStageModal, setSelectedStageModal] = useState<PrototypeStage | null>(null);

  const prototypeStages: PrototypeStage[] = [
    {
      id: 1,
      stageNumber: "01",
      title: "Farmer & Cultivation",
      hindiTitle: "किसान और औषधीय फसल",
      role: "farmer",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: Sprout,
      summary: "GPS geo-tagged harvest collection directly from certified farmers and wild-herb collectors with dynamic MSP protection.",
      keyFeatures: [
        "Satellite GPS & timestamp verification",
        "Aadhaar-linked farmer direct payouts",
        "GAP & Organic standard validation",
        "Species authenticity validation (Ashwagandha, Brahmi)"
      ],
      techStack: ["GeoJSON GPS", "Aadhaar e-KYC", "Firestore Realtime"],
      hashSample: "0x7a8f9c12b4e6d308...99e1",
      simulatedData: {
        "Farmer ID": "FARM-001 (Rajesh Kumar)",
        "Farm Location": "Aurangabad, MH (19.8762° N, 75.3433° E)",
        "Harvest Crop": "Ashwagandha (Withania somnifera)",
        "Moisture Content": "8.2% (Grade A Premium)",
        "Verified By": "Local AYUSH Field Officer"
      }
    },
    {
      id: 2,
      stageNumber: "02",
      title: "Regional Aggregation",
      hindiTitle: "क्षेत्रीय एकत्रीकरण केंद्र",
      role: "aggregator",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
      icon: Layers,
      summary: "Digital weighment, physical quality testing, consolidation into standardized lots, and tamper-proof barcode assignment.",
      keyFeatures: [
        "Calibrated digital weighment intake",
        "Moisture & foreign matter screening",
        "Consolidated consignment grouping",
        "Blockchain minting of raw herb batch"
      ],
      techStack: ["SHA-256 Batch Hashing", "Barcode Serialization"],
      hashSample: "0x3f12e89a5c0b7412...88a4",
      simulatedData: {
        "Aggregator Hub": "AGG-1001 (MahaAgri Hub)",
        "Consignment ID": "BATCH-001",
        "Total Intake": "500.00 kg",
        "Lab Assay Ref": "AYUSH-LAB-9921",
        "Consolidation Status": "Consolidated & Dispatched"
      }
    },
    {
      id: 3,
      stageNumber: "03",
      title: "Refinement & Processing",
      hindiTitle: "प्रसंस्करण और निष्कर्षण",
      role: "processor",
      badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
      icon: FlaskConical,
      summary: "Standardized solvent extraction, grinding, HPLC purity testing, and generation of verified Certificate of Analysis (CoA).",
      keyFeatures: [
        "Precision temperature/pressure control",
        "Automated yield calculation & loss tracking",
        "HPLC/GC-MS chemical assay upload",
        "GMP compliance pass/fail certification"
      ],
      techStack: ["Industrial Telemetry", "CoA Digital Signature"],
      hashSample: "0x91d4e723ac85bf10...44d2",
      simulatedData: {
        "Facility": "PROC-2001 (Western Ghats Plant)",
        "Operation": "Hydro-Alcoholic Extraction",
        "Active Withanolides": "5.4% (Exceeds Pharmacopoeia 2.5%)",
        "Heavy Metals Test": "Passed (Below 0.01 ppm)",
        "QC Clearance": "Approved by AYUSH Officer"
      }
    },
    {
      id: 4,
      stageNumber: "04",
      title: "GMP Formulation Vault",
      hindiTitle: "जीएमपी फॉर्मूलेशन और क्यूआर",
      role: "manufacturer",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Package,
      summary: "Finished product blending (Churna, Syrup, Capsules), packaging serialization, and on-chain verifiable cryptographic QR pass generation.",
      keyFeatures: [
        "Multi-ingredient recipe composition",
        "Dosage standardization & shelf-life lock",
        "Verifiable dynamic QR code rendering",
        "Anti-counterfeit cryptographic seal"
      ],
      techStack: ["Dynamic Cryptographic QR", "ERC-721 Provenance"],
      hashSample: "0x54e81b99cf0214a7...22f9",
      simulatedData: {
        "Manufacturer": "MFG-3001 (Ayurveda Life Labs)",
        "Final Product": "Ayu Immunity Churna (250g)",
        "Batch Code": "FP-2026-001",
        "Shelf Life": "24 Months (Exp: Aug 2028)",
        "QR Status": "Cryptographically Sealed"
      }
    },
    {
      id: 5,
      stageNumber: "05",
      title: "Smart Logistics & Verify",
      hindiTitle: "स्मार्ट लॉजिस्टिक्स और सत्यापन",
      role: "distributor",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Truck,
      summary: "Cold-chain GPS fleet monitoring, destination pharmacy delivery, and instant public consumer verification via smartphone scan.",
      keyFeatures: [
        "Live satellite GPS vector tracking",
        "Cold-chain temp logs (15°C - 25°C)",
        "Instant public smartphone QR scan",
        "100% farm-to-shelf provenance audit"
      ],
      techStack: ["Satellite Telemetry", "Public Web Verification"],
      hashSample: "0x12c98d45fe776091...00b8",
      simulatedData: {
        "Logistics Lead": "DIST-4001 (All-India Logistics)",
        "Vehicle Vector": "DL-01-AB-1234 (Live GPS)",
        "Storage Temp": "21.5°C (Optimal Range)",
        "Destination": "State Ayush Depot, Varanasi",
        "Consumer Scan": "Publicly Accessible"
      }
    }
  ];

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
              <path d="M50 5 C40 5 35 15 35 25 C35 32 38 38 42 42 C30 45 20 55 20 70 C20 78 25 85 32 90 L32 96 C30 98 25 100 20 102 L20 106 L80 106 L80 102 C75 100 70 98 68 96 L68 90 C75 85 80 78 80 70 C80 55 70 45 58 42 C62 38 65 32 65 25 C65 15 60 5 50 5 Z M50 12 C55 12 58 18 58 25 C58 32 55 38 50 38 C45 38 42 32 42 25 C42 18 45 12 50 12 Z M35 70 C35 60 42 50 50 50 C58 50 65 60 65 70 C65 78 58 86 50 86 C42 86 35 78 35 70 Z" />
              <circle cx="50" cy="98" r="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
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

          {/* Decorative Botanical Leaf Silhouettes */}
          <div className="absolute right-4 top-1/3 opacity-[0.07] pointer-events-none -z-0">
            <svg className="w-48 h-48 text-emerald-900" viewBox="0 0 200 200" fill="currentColor">
              <path d="M100 20 C60 50 30 110 50 160 C70 140 85 100 100 70 C115 100 130 140 150 160 C170 110 140 50 100 20 Z" />
              <path d="M140 60 C170 80 190 120 180 160 C160 145 145 120 135 100 C140 85 140 70 140 60 Z" opacity="0.6" />
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

            {/* CTAs: Get Started Button, Look at Prototype Button & QR Verify */}
            <div className="pt-4 flex flex-wrap items-center gap-3.5 sm:gap-4">
              {/* 1. Primary "Get Started >" Button */}
              <button
                id="get-started-btn"
                onClick={onGetStarted}
                className="group relative inline-flex items-center justify-center h-14 sm:h-16 px-7 sm:px-9 rounded-full bg-[#0d5c3a] hover:bg-[#09462b] text-white font-bold text-base sm:text-lg shadow-[0_10px_25px_rgba(13,92,58,0.35)] hover:shadow-[0_15px_30px_rgba(13,92,58,0.5)] transform hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 overflow-hidden"
              >
                <span className="mr-2 tracking-wide font-sans">Get Started</span>
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1.5 transition-transform" strokeWidth={2.8} />
                {/* Subtle Sheen Sweep */}
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-15deg)_translateX(-120%)] group-hover:duration-1000 group-hover:[transform:skew(-15deg)_translateX(120%)] pointer-events-none">
                  <div className="relative h-full w-14 bg-white/20" />
                </div>
              </button>

              {/* 2. Look at Prototype Button (New Feature) */}
              <button
                id="look-at-prototype-btn"
                onClick={() => {
                  const el = document.getElementById('prototype-stage-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group inline-flex items-center gap-2 h-14 sm:h-16 px-6 sm:px-7 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-base sm:text-lg shadow-[0_8px_20px_rgba(245,158,11,0.35)] hover:shadow-[0_12px_25px_rgba(245,158,11,0.5)] transform hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer overflow-hidden"
              >
                <Sparkles className="w-5 h-5 text-amber-100 animate-pulse" />
                <span>Look at Prototype</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* 3. Public Consumer Quick Verify Link */}
              <button
                onClick={() => navigate('/verify')}
                className="inline-flex items-center gap-2 h-14 sm:h-16 px-5 sm:px-6 rounded-full bg-white hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 font-semibold text-sm sm:text-base shadow-sm hover:shadow transition-all"
              >
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-[#0d5c3a]" />
                <span>Verify Batch QR</span>
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
      {/* 3. "HAVE A LOOK AT OUR PROTOTYPE STAGE" INTERACTIVE SECTION                */}
      {/* ========================================================================= */}
      <section 
        id="prototype-stage-section" 
        className="relative z-10 w-full bg-gradient-to-b from-white via-[#f4faf6] to-[#ebf5ef] border-t-2 border-emerald-200/90 py-16 px-4 sm:px-8 md:px-14 shadow-inner"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300/80 text-amber-800 text-xs font-extrabold uppercase tracking-widest shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>LIVE SYSTEM PROTOTYPE WALKTHROUGH</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-serif">
              Have a look at our <span className="text-[#0d5c3a]">prototype stage</span>
            </h2>

            <p className="text-xs sm:text-sm font-semibold text-emerald-800/90 font-serif">
              हमारे प्रोटोटाइप चरण का अवलोकन करें - 5 परस्पर जुड़े सत्यापन चरण
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              AyuSetu connects farmers, collectors, labs, manufacturers, and distributors into a single, unified, tamper-proof blockchain traceability pipeline. Click any stage below to explore its live simulated telemetry and on-chain ledger state.
            </p>

            <div className="flex items-center justify-center gap-1.5 pt-1">
              <span className="w-10 h-1 bg-[#FF9933] rounded-full" />
              <span className="w-10 h-1 bg-slate-300 rounded-full" />
              <span className="w-10 h-1 bg-[#138808] rounded-full" />
            </div>
          </div>

          {/* 5 Prototype Stages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {prototypeStages.map((stage) => {
              const StageIcon = stage.icon;
              return (
                <div
                  key={stage.id}
                  onClick={() => setSelectedStageModal(stage)}
                  className="bg-white rounded-3xl p-5 border border-emerald-200/80 shadow-sm hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                >
                  {/* Top Color Accent Ribbon */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-[#0d5c3a]" />

                  {/* Stage Number & Icon */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black font-mono text-slate-300 group-hover:text-[#0d5c3a] transition-colors">
                        STAGE {stage.stageNumber}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0d5c3a] border border-emerald-100 flex items-center justify-center shadow-2xs group-hover:bg-[#0d5c3a] group-hover:text-white transition-all">
                        <StageIcon className="w-5 h-5" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-[#0d5c3a] transition-colors">
                        {stage.title}
                      </h3>
                      <p className="text-[11px] text-emerald-700/90 font-serif font-medium mt-0.5">
                        {stage.hindiTitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {stage.summary}
                    </p>

                    {/* Features checklist */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {stage.keyFeatures.slice(0, 2).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Footer CTA */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0d5c3a] group-hover:text-emerald-800">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Inspect Stage</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct Live Action Bar for Prototype Testing */}
          <div className="rounded-3xl bg-gradient-to-r from-[#1b4d3e] via-[#0d5c3a] to-[#144838] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Interactive Sandbox Available
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-serif tracking-tight">
                Ready to test the live role portals?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
                Experience the full operational dashboard for all roles including Aggregator, Processor, Manufacturer, Distributor, and Farmers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onGetStarted}
                className="px-6 py-3 rounded-full bg-white hover:bg-emerald-50 text-[#0d5c3a] font-bold text-sm shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all"
              >
                Launch Role Selector
              </button>
              <button
                onClick={() => navigate('/verify')}
                className="px-6 py-3 rounded-full bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-500/40 font-bold text-sm shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <QrCode className="w-4 h-4" />
                <span>Test Consumer QR Scan</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PROTOTYPE STAGE INSPECTION MODAL                                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedStageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full border border-emerald-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 px-6 sm:px-8 py-5 border-b border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0d5c3a] text-white flex items-center justify-center shadow-md">
                    {React.createElement(selectedStageModal.icon, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-extrabold text-[#0d5c3a] uppercase tracking-wider">
                      PROTOTYPE STAGE {selectedStageModal.stageNumber}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      {selectedStageModal.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStageModal(null)}
                  className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors shadow-2xs"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Stage Description & Mission
                  </h4>
                  <p className="text-sm font-medium text-slate-700 mt-1 leading-relaxed">
                    {selectedStageModal.summary}
                  </p>
                </div>

                {/* Simulated Real-Time Data Block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Simulated Live Telemetry & Ledger Block
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Verified
                    </span>
                  </div>

                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-emerald-400 text-[11px]">
                      <span>Hash: {selectedStageModal.hashSample}</span>
                      <span className="text-slate-400">AYUSH-NODE-OK</span>
                    </div>

                    {Object.entries(selectedStageModal.simulatedData).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 text-[11px] gap-0.5">
                        <span className="text-slate-400">{key}:</span>
                        <span className="font-bold text-white text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Stack Tags */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    Security & Verification Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStageModal.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-6 sm:px-8 py-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => setSelectedStageModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setSelectedStageModal(null);
                    onGetStarted();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#0d5c3a] hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span>Enter {selectedStageModal.title} Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. BOTTOM TICKER / ACCESSIBILITY FOOTER                                  */}
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
