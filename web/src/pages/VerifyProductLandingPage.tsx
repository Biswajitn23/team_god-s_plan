import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Leaf,
  CheckCircle2,
  Calendar,
  Building2,
  FileCheck2,
  Share2,
  Search,
  ExternalLink,
  ChevronDown,
  Globe,
  Award,
  FlaskConical,
  Sprout,
  FileText,
  AlertTriangle,
  Link as LinkIcon,
  Phone,
  Home,
  Download,
  Maximize2,
  Copy,
  Check,
  Smartphone,
  X
} from 'lucide-react';
import QRCode from 'react-qr-code';
import thakurYograjStudio from '@/assets/thakur-yograj-studio.jpg';

const downloadQR = (elementId: string, filename: string) => {
  const container = document.getElementById(elementId);
  if (!container) return;
  const svg = container.tagName.toLowerCase() === 'svg' ? container : container.querySelector('svg');
  if (!svg) return;
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width + 40;
    canvas.height = img.height + 40;
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${filename}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    }
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
};

export const VerifyProductLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState<string>('02:09:35 AM, Sun, 06 Sept 2026');
  const [copied, setCopied] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const publicVerifyUrl = 'https://web-lemon-psi-69.vercel.app/verify-product';
  const activeQrUrl = publicVerifyUrl;

  const copyToClipboard = (text?: string) => {
    const urlToCopy = text || activeQrUrl;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      const dateStr = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
      setCurrentDateTime(`${timeStr}, ${dateStr}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShare = () => {
    copyToClipboard(activeQrUrl);
    setShowShareModal(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7f5] text-slate-800 flex flex-col font-sans select-none relative overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & NAVBAR (Official Government Portal Look)                   */}
      {/* ========================================================================= */}
      <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4 z-30">
        
        {/* Left: State Emblem + Ministry of Ayush + AyuSetu Brand */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Emblem of India */}
          <div className="flex items-center gap-2.5 border-r border-slate-200 pr-4">
            <svg
              className="w-8 h-10 text-slate-900 shrink-0"
              viewBox="0 0 100 120"
              fill="currentColor"
              aria-label="Emblem of India"
            >
              <path d="M50 5 C40 5 35 15 35 25 C35 32 38 38 42 42 C30 45 20 55 20 70 C20 78 25 85 32 90 L32 96 C30 98 25 100 20 102 L20 106 L80 106 L80 102 C75 100 70 98 68 96 L68 90 C75 85 80 78 80 70 C80 55 70 45 58 42 C62 38 65 32 65 25 C65 15 60 5 50 5 Z M50 12 C55 12 58 18 58 25 C58 32 55 38 50 38 C45 38 42 32 42 25 C42 18 45 12 50 12 Z M35 70 C35 60 42 50 50 50 C58 50 65 60 65 70 C65 78 58 86 50 86 C42 86 35 78 35 70 Z" />
              <circle cx="50" cy="98" r="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <rect x="25" y="110" width="50" height="3" rx="1.5" fill="currentColor" />
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-bold text-slate-900 font-serif">भारत सरकार</span>
              <span className="text-xs font-bold tracking-tight text-slate-900 font-serif">Government of India</span>
              <span className="text-[10px] text-slate-600 font-medium">आयुष मंत्रालय</span>
              <span className="text-[10px] text-slate-500 font-medium">Ministry of Ayush</span>
            </div>
          </div>

          {/* AyuSetu Logo */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex flex-col leading-none">
              <span className="text-xl sm:text-2xl font-serif font-black text-[#0d5c3a] tracking-tight">
                AyuSetu
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-emerald-800 uppercase tracking-wider mt-0.5">
                TRADITIONAL KNOWLEDGE FOR A HEALTHIER INDIA
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden md:flex items-center">
          <div className="w-full relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Product / Batch ID / Manufacturer... उत्पाद / बैच आईडी / निर्माता से खोजें..."
              className="w-full h-9 pl-9 pr-4 rounded-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#0d5c3a] transition-all"
            />
          </div>
        </div>

        {/* Right: Digital India, Viksit Bharat, Live Time, Language, Back Button */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          {/* Digital India mark */}
          <div className="hidden xl:flex items-center gap-1.5">
            <div className="relative w-6 h-6 rounded-full border-2 border-[#FF9933] border-t-[#138808] border-r-[#000080] flex items-center justify-center transform -rotate-45">
              <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#000080] via-[#FF9933] to-[#138808]" />
            </div>
            <div className="flex flex-col text-[8px] leading-tight font-bold text-slate-800">
              <span>Digital India</span>
              <span className="text-[7px] text-slate-500 font-normal">Power To Empower</span>
            </div>
          </div>

          {/* Viksit Bharat @2047 */}
          <div className="hidden lg:flex flex-col text-right leading-none border-l border-slate-200 pl-3">
            <span className="text-[11px] font-black text-slate-800">Viksit</span>
            <span className="text-[11px] font-bold text-slate-700">Bharat</span>
            <span className="text-[9px] font-bold text-[#FF9933]">@2047</span>
          </div>

          {/* Live Date & Time */}
          <div className="hidden sm:flex flex-col text-right leading-tight border-l border-slate-200 pl-3">
            <span className="font-mono text-xs font-black text-slate-900">
              {currentDateTime.split(',')[0]}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {currentDateTime.split(',').slice(1).join(',')}
            </span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>English</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          {/* Back to Main Website */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d5c3a] bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main Website</span>
          </button>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 2. SUB-BAR: BREADCRUMBS                                                   */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#0d5c3a] text-white text-xs px-4 sm:px-8 py-2 flex items-center gap-2 shadow-xs">
        <button onClick={() => navigate('/')} className="hover:text-emerald-200 cursor-pointer">
          <Home className="w-3.5 h-3.5" />
        </button>
        <span className="text-emerald-300/60">/</span>
        <span className="text-emerald-100">Verify Product</span>
        <span className="text-emerald-300/60">/</span>
        <span className="text-white font-bold">Digital Product Passport</span>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN PORTAL BODY                                                       */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-4">
        
        {/* Top Verified Blockchain Banner */}
        <div className="w-full bg-gradient-to-r from-emerald-50/90 via-[#f0f9f4] to-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs relative overflow-hidden">
          
          {/* Left: Verified on Blockchain Stamp */}
          <div className="flex items-center gap-3.5 z-10">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Ayurvedic Product – Verified on National Blockchain
              </h1>
              <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                यह आयुर्वेदिक उत्पाद राष्ट्रीय ब्लॉकचेन पर सत्यापित है
              </p>
            </div>
          </div>

          {/* Right Quote & State Watermark */}
          <div className="flex items-center gap-6 z-10 self-end md:self-auto">
            <div className="text-right space-y-1">
              <p className="text-xs sm:text-sm font-serif font-bold text-emerald-900 leading-tight">
                &ldquo;प्रमाणित परंपरा, स्वस्थ भारत की ओर&rdquo;
              </p>
              <p className="text-[10px] text-slate-500 font-serif italic">
                Verified Tradition, A Healthier India
              </p>
              <div className="flex items-center justify-end gap-0.5 pt-0.5">
                <span className="w-4 h-0.5 bg-[#FF9933] rounded-full" />
                <span className="w-4 h-0.5 bg-slate-300 rounded-full" />
                <span className="w-4 h-0.5 bg-[#138808] rounded-full" />
              </div>
            </div>

            {/* Emblem watermark representation */}
            <div className="opacity-40 hidden sm:block">
              <svg className="w-12 h-14 text-slate-800" viewBox="0 0 100 120" fill="currentColor">
                <path d="M50 5 C40 5 35 15 35 25 C35 32 38 38 42 42 C30 45 20 55 20 70 C20 78 25 85 32 90 L32 96 C30 98 25 100 20 102 L20 106 L80 106 L80 102 C75 100 70 98 68 96 L68 90 C75 85 80 78 80 70 C80 55 70 45 58 42 C62 38 65 32 65 25 C65 15 60 5 50 5 Z M50 12 C55 12 58 18 58 25 C58 32 55 38 50 38 C45 38 42 32 42 25 C42 18 45 12 50 12 Z M35 70 C35 60 42 50 50 50 C58 50 65 60 65 70 C65 78 58 86 50 86 C42 86 35 78 35 70 Z" />
                <text x="50" y="118" textAnchor="middle" fontSize="7" fontWeight="bold">सत्यमेव जयते</text>
              </svg>
            </div>
          </div>

        </div>

        {/* 3-Column Master Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* ===================================================================== */}
          {/* COLUMN 1: PRODUCT IMAGE & AUTHENTICATION BADGES (3 Cols)              */}
          {/* ===================================================================== */}
          <div className="lg:col-span-3 space-y-3.5">
            
            {/* Main Product Showcase Box */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col items-center relative overflow-hidden">
              
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#f6f1e8] flex items-center justify-center relative border border-slate-100">
                <img
                  src={thakurYograjStudio}
                  alt="Thakur Yograj Herbal Hair Oil Product Box and Bottle"
                  className="w-full h-full object-cover object-center"
                />

                {/* Laser Scanning Line */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981] animate-[bounce_3s_ease-in-out_infinite] pointer-events-none" />
              </div>

            </div>

            {/* Scan QR to View Card - Live Scannable 2D QR Code */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0d5c3a] shrink-0">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-bold text-slate-900">Scan QR Code</span>
                    <span className="text-[11px] font-bold text-[#0d5c3a]">on AyuSetu</span>
                    <span className="text-[9px] text-slate-500 font-medium">सत्यापन हेतु QR कोड</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowQrModal(true)}
                    title="Enlarge QR Code"
                    className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 flex items-center justify-center text-slate-600 hover:text-[#0d5c3a] transition-all cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleShare}
                    title="Share Verification Link"
                    className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 flex items-center justify-center text-slate-600 hover:text-[#0d5c3a] transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scannable QR Code Visual Box with Viewfinder Corner Brackets */}
              <div 
                onClick={() => setShowQrModal(true)}
                className="relative bg-gradient-to-b from-emerald-50/50 via-slate-50/30 to-white rounded-xl p-3 border border-emerald-100 flex flex-col items-center justify-center cursor-pointer group hover:border-emerald-300 transition-all shadow-xs"
              >
                {/* Viewfinder corner guides */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#0d5c3a] rounded-tl pointer-events-none" />
                <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#0d5c3a] rounded-tr pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#0d5c3a] rounded-bl pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#0d5c3a] rounded-br pointer-events-none" />

                {/* Scannable QR Code SVG */}
                <div id="product-landing-qr" className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-xs">
                  <QRCode
                    value={activeQrUrl}
                    size={148}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                    level="M"
                  />
                </div>

                <div className="mt-2 text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 group-hover:text-[#0d5c3a] transition-colors">
                    <Smartphone className="w-3.5 h-3.5 text-[#0d5c3a]" />
                    Point Camera to Scan & Open
                  </span>
                  <span className="block text-[9px] text-slate-500 font-medium">
                    फोन कैमरा या गूगल लेंस से सीधे खोलें
                  </span>
                </div>
              </div>

              {/* Public Verification Target URL */}
              <div className="space-y-1 pt-0.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-600">Verification URL:</span>
                  <span className="text-[9px] font-bold text-[#0d5c3a] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Public Web & Mobile Scannable
                  </span>
                </div>

                {/* Active URL string with quick copy */}
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-1 text-[9px] font-mono text-slate-700">
                  <span className="truncate" title={activeQrUrl}>{activeQrUrl}</span>
                  <button
                    onClick={() => copyToClipboard(activeQrUrl)}
                    className="shrink-0 p-1 hover:text-[#0d5c3a] text-slate-500 rounded hover:bg-slate-200/60 cursor-pointer"
                    title="Copy Link"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons: Download QR & Test Open */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  onClick={() => downloadQR('product-landing-qr', 'thakur-yograj-verify-qr')}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-[10px] font-bold text-slate-700 hover:text-[#0d5c3a] transition-all cursor-pointer"
                >
                  <Download className="w-3 h-3 text-[#0d5c3a]" />
                  <span>Download QR</span>
                </button>
                <a
                  href={activeQrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-bold text-[#0d5c3a] transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Page</span>
                </a>
              </div>
            </div>

            {/* 100% Authentic Guaranteed Card */}
            <div className="bg-gradient-to-r from-[#0d5c3a]/10 via-[#0d5c3a]/5 to-transparent rounded-2xl p-3.5 border border-emerald-200/90 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0d5c3a] text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block leading-tight">
                  100% Authentic
                </span>
                <span className="text-[10px] font-bold text-[#0d5c3a]">
                  पूर्णतः प्रामाणिक
                </span>
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* COLUMN 2: DETAILED PRODUCT, MANUFACTURER & SPECS (6 Cols)            */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 space-y-3.5">
            
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
              
              {/* Top Verified Header Pill */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0d5c3a] text-white text-[11px] font-bold tracking-wide shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>VERIFIED PRODUCT | सत्यापित उत्पाद</span>
                </span>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <span className="text-[11px]">National Database Sync:</span>
                  <span className="text-emerald-700 font-bold">Active</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>

              {/* Brand & Product Title */}
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  BRAND / ब्रांड
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
                  THAKUR YOGRAJ
                </h2>
                <div className="text-sm sm:text-base font-bold text-[#0d5c3a]">
                  Hair Oil / <span className="font-medium">हेयर ऑयल</span>
                </div>
                <p className="text-xs text-slate-600 pt-0.5">
                  Pure Herbal Extracts Formulation <span className="text-slate-300">|</span> <span className="text-slate-500">शुद्ध हर्बल अर्क आधारित सूत्रण</span>
                </p>
              </div>

              {/* 3 Quick Product Badges */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                  <span className="text-base">🧴</span>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Net Volume</span>
                    <strong className="text-slate-900 text-xs">220 ml</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                  <span className="text-base">🇮🇳</span>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Origin</span>
                    <strong className="text-slate-900 text-xs">India</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                  <span className="text-base">🌿</span>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Category</span>
                    <strong className="text-slate-900 text-xs leading-none block">Ayurvedic Hair Care</strong>
                  </div>
                </div>

              </div>

              {/* Manufacturer Information Box */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/90 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-emerald-200/60">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#0d5c3a] text-white flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase text-slate-500 block">MANUFACTURER / निर्माता</span>
                      <strong className="text-slate-900 text-xs sm:text-sm">THAKUR YOGRAJ</strong>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono font-bold text-[#0d5c3a]">
                    GSTIN: <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-300">22MHJPS4647F1ZX</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-700 leading-relaxed">
                  H NO 42 WARD NO 2, RANI DURGAWATI PARA, VILL SIRRI, TILDA, Raipur, Chhattisgarh, 492001 (State Code: 22)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1 border-t border-emerald-200/60">
                  <div>
                    <span className="text-slate-500 font-bold">Email:</span> <a href="mailto:thakuryograjj84@gmail.com" className="text-[#0d5c3a] font-semibold hover:underline">thakuryograjj84@gmail.com</a>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">Contact:</span> <a href="tel:+918224905073" className="text-[#0d5c3a] font-semibold hover:underline">+91 82249 05073</a>
                  </div>
                </div>
              </div>

              {/* Batch & Dates (2-grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[9px]">
                    <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>BATCH NUMBER / बैच संख्या</span>
                  </div>
                  <p className="font-mono font-black text-slate-900 text-sm">
                    TY-2026-001
                  </p>
                  <span className="text-[10px] text-slate-500 block">
                    Net / Gross Weight: 220 ml
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[9px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>MANUFACTURING & EXPIRY / निर्माण और समाप्ति</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">
                    July 2026 to June 2028
                  </p>
                  <span className="text-[10px] text-slate-500 block">
                    24 Months Shelf Life / 24 माह की शेल्फ लाइफ
                  </span>
                </div>

              </div>

              {/* Certification & Compliance */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  CERTIFICATION & COMPLIANCE / प्रमाणन एवं अनुपालन
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  
                  <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-0.5" />
                    <strong className="text-slate-900 text-[10px]">GMP</strong>
                    <span className="text-[9px] text-emerald-800">Certified</span>
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mb-0.5" />
                    <strong className="text-slate-900 text-[10px]">AYUSH</strong>
                    <span className="text-[9px] text-emerald-800">Compliant</span>
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col items-center justify-center">
                    <FlaskConical className="w-4 h-4 text-emerald-600 mb-0.5" />
                    <strong className="text-slate-900 text-[10px]">Lab Tested</strong>
                    <span className="text-[9px] text-emerald-800">for Safety</span>
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col items-center justify-center">
                    <Sprout className="w-4 h-4 text-emerald-600 mb-0.5" />
                    <strong className="text-slate-900 text-[10px]">Natural Ingredients</strong>
                    <span className="text-[9px] text-emerald-800">Verified</span>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* ===================================================================== */}
          {/* COLUMN 3: BLOCKCHAIN PROOF & JOURNEY TIMELINE (3 Cols)                */}
          {/* ===================================================================== */}
          <div className="lg:col-span-3 space-y-3.5">
            
            {/* Blockchain Verification Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <LinkIcon className="w-4 h-4 text-[#0d5c3a]" />
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Blockchain Verification
                </h3>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans font-medium text-[11px]">Product ID</span>
                  <strong className="text-slate-800">PX-82K9J</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans font-medium text-[11px]">Transaction Hash</span>
                  <span className="text-[#0d5c3a] font-bold">0x9f4c...a7d2</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans font-medium text-[11px]">Block Number</span>
                  <span className="text-slate-800">#4589123</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans font-medium text-[11px]">Verified On</span>
                  <span className="text-slate-700 text-[10px]">06 Sept 2026, 01:45 PM</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-sans">
                  <span className="text-slate-500 font-medium text-[11px]">Status</span>
                  <div className="text-right">
                    <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 justify-end">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Valid & Untampered
                    </span>
                    <span className="text-[10px] text-slate-400 block">मान्य और अपरिवर्तित</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Journey to You Timeline Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <ShieldCheck className="w-4 h-4 text-[#0d5c3a]" />
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Journey to You / <span className="font-medium text-[11px] text-slate-600">आप तक की यात्रा</span>
                </h3>
              </div>

              {/* Vertical Stepper */}
              <div className="space-y-3 text-xs relative pl-1">
                
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 flex items-start justify-between leading-tight">
                    <div>
                      <strong className="text-slate-800 block text-[11px]">Raw Material Sourced</strong>
                      <span className="text-[9px] text-slate-500">कच्चा माल स्रोत</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-700 font-bold block">Jan 2026</span>
                      <span className="text-[9px] text-slate-500">Chhattisgarh</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 flex items-start justify-between leading-tight">
                    <div>
                      <strong className="text-slate-800 block text-[11px]">Manufactured</strong>
                      <span className="text-[9px] text-slate-500">निर्माण</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-700 font-bold block">Jul 2026</span>
                      <span className="text-[9px] text-slate-500">Raipur</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 flex items-start justify-between leading-tight">
                    <div>
                      <strong className="text-slate-800 block text-[11px]">Quality Tested</strong>
                      <span className="text-[9px] text-slate-500">गुणवत्ता परीक्षण</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-700 font-bold block">Jul 2026</span>
                      <span className="text-[9px] text-slate-500">Govt. Lab</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 flex items-start justify-between leading-tight">
                    <div>
                      <strong className="text-slate-800 block text-[11px]">Listed on Blockchain</strong>
                      <span className="text-[9px] text-slate-500">ब्लॉकचेन पर सूचीबद्ध</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-700 font-bold block">Aug 2026</span>
                      <span className="text-[9px] text-slate-500">AyuSetu</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 flex items-start justify-between leading-tight">
                    <div>
                      <strong className="text-slate-800 block text-[11px]">Available for Consumers</strong>
                      <span className="text-[9px] text-slate-500">उपभोक्ताओं के लिए उपलब्ध</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-700 font-bold block">Sep 2026</span>
                      <span className="text-[9px] text-slate-500">India</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2">
              <button
                id="view-complete-traceability-btn"
                onClick={() => navigate('/verify-product/passport')}
                className="w-full h-12 rounded-xl bg-[#0d5c3a] hover:bg-[#09462b] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-between px-4 cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-200" />
                  <div className="text-left leading-tight">
                    <span className="block font-bold">View Complete Traceability Details</span>
                    <span className="text-[9px] text-emerald-200 font-normal">पूर्ण ट्रेसेबिलिटी विवरण देखें</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="w-full h-9 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Report An Issue / समस्या की रिपोर्ट करें</span>
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 4. FOOTER                                                                */}
      {/* ========================================================================= */}
      <footer className="w-full bg-white border-t border-slate-200/90 py-4 px-4 sm:px-8 mt-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <svg className="w-5 h-6 text-slate-700" viewBox="0 0 100 120" fill="currentColor">
              <path d="M50 5 C40 5 35 15 35 25 C35 32 38 38 42 42 C30 45 20 55 20 70 C20 78 25 85 32 90 L32 96 C30 98 25 100 20 102 L20 106 L80 106 L80 102 C75 100 70 98 68 96 L68 90 C75 85 80 78 80 70 C80 55 70 45 58 42 C62 38 65 32 65 25 C65 15 60 5 50 5 Z" />
            </svg>
            <div>
              <span className="font-bold text-slate-900 block leading-tight">Ministry of Ayush</span>
              <span className="text-[10px] text-slate-500">Government of India</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <a href="#" className="hover:text-emerald-700">Terms of Use</a>
            <span>|</span>
            <a href="#" className="hover:text-emerald-700">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-emerald-700">Help & Support</a>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Phone className="w-3.5 h-3.5 text-[#0d5c3a]" />
              <div>
                <span>1800-120-8040</span>
                <span className="text-[9px] text-slate-400 block leading-none">(Toll Free)</span>
              </div>
            </div>

            <a href="https://www.ayush.gov.in" target="_blank" rel="noreferrer" className="text-slate-700 hover:text-emerald-700 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>www.ayush.gov.in</span>
            </a>

            <div className="hidden lg:flex items-center gap-1.5 text-[#0d5c3a] font-bold">
              <Leaf className="w-3.5 h-3.5" />
              <div>
                <span>Ayurveda for All</span>
                <span className="text-[9px] text-emerald-800 block leading-none">स्वस्थ भारत, सशक्त भारत</span>
              </div>
            </div>
          </div>

        </div>
      </footer>

      {/* Fullscreen / Zoom QR Modal */}
      {showQrModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4 text-center relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0d5c3a]">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="text-left leading-tight">
                <h3 className="text-sm font-bold text-slate-900">AyuSetu Product QR Code</h3>
                <p className="text-[10px] text-slate-500 font-medium">Thakur Yograj Herbal Hair Oil Verification</p>
              </div>
            </div>

            {/* High-res QR Display */}
            <div className="p-4 bg-white border-2 border-[#0d5c3a] rounded-2xl inline-block shadow-md">
              <div id="modal-landing-qr">
                <QRCode
                  value={activeQrUrl}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 256 256`}
                  level="M"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Point any phone camera or Google Lens at this QR code
              </p>
              <p className="text-[11px] text-slate-500">
                फोन के कैमरे या गूगल लेंस से सीधे स्कैन करें
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[10px] font-mono text-slate-700 truncate">
              {activeQrUrl}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => downloadQR('modal-landing-qr', 'thakur-yograj-verify-qr')}
                className="flex-1 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#0d5c3a]" />
                Download PNG
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="flex-1 h-9 rounded-xl bg-[#0d5c3a] hover:bg-[#0b4d30] text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Share Product Verification</h3>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200">
              <QRCode value={activeQrUrl} size={130} />
            </div>

            <p className="text-xs text-slate-600">
              Link has been copied to your clipboard! Share this URL or QR code with consumers or retailers to verify product authenticity.
            </p>

            <div className="p-2 bg-slate-100 rounded-lg text-[10px] font-mono text-slate-700 truncate">
              {activeQrUrl}
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full h-10 rounded-xl bg-[#0d5c3a] text-white text-xs font-bold cursor-pointer hover:bg-[#0b4d30] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">National Anti-Counterfeit Cell</h3>
            <p className="text-xs text-slate-600">
              To report discrepancies regarding Batch TY-2026-001 or suspect packaging, submit details to the AYUSH National Verification Authority.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border text-xs font-mono">
              Hotline: 1800-120-8040 (Toll Free)
              Email: grievance@ayush.gov.in
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="w-full h-10 rounded-xl bg-[#0d5c3a] text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default VerifyProductLandingPage;
