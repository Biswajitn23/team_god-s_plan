import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Leaf,
  CheckCircle2,
  Lock,
  Sparkles,
  Award,
  Calendar,
  Building2,
  FileCheck2,
  Cpu
} from 'lucide-react';
import ashwagandhaProduct from '@/assets/ashwagandha-product.jpg';

export const VerifyProductLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#faf9f5] text-slate-800 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR (AyuTrace Nexus)                                           */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 sm:px-12 py-3.5 flex items-center justify-between">
        {/* Left: AyuTrace Nexus Logo & Digital Passport Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0d5c3a] text-white flex items-center justify-center shadow-sm">
              <Leaf className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base sm:text-lg font-black font-serif tracking-tight text-[#0d5c3a]">
                AyuTrace Nexus
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                National Botanical Provenance Protocol
              </span>
            </div>
          </div>

          <span className="hidden sm:inline-block px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-widest text-[#0d5c3a]">
            BOTANICAL DIGITAL PASSPORT
          </span>
        </div>

        {/* Right: Back to Main Website */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0d5c3a] bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-200 px-4 py-2 rounded-xl transition-all shadow-2xs group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Main Website</span>
        </button>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN VERIFICATION SHOWCASE (Screen 1)                                 */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Header Title Section */}
        <div className="text-center space-y-2 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-[11px] font-bold text-[#0d5c3a] shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0d5c3a]" />
            <span>AUTHENTIC PRODUCT VERIFIED ON-CHAIN</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight">
            Verify what's behind the label.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Trace the botanical ingredients of this Ayurvedic product from its recorded source to the final formulation.
          </p>
        </div>

        {/* 2-Column Product Showcase Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* LEFT COLUMN: Physical Product Presentation & QR Scanning Visual (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-emerald-50/60 via-[#f5faf7] to-slate-50 p-6 sm:p-8 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80 relative overflow-hidden">
            
            {/* Background decorative pulse */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-200/20 blur-2xl pointer-events-none" />

            {/* Top Match Tag */}
            <div className="w-full flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full bg-white border border-emerald-200 text-xs font-bold text-[#0d5c3a] flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Physical Match Verified</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400 font-bold">
                ID: PX-82K9J
              </span>
            </div>

            {/* Real Uploaded Ayurvedic Product Image */}
            <div className="relative my-6 group">
              <div className="w-56 sm:w-64 h-72 sm:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white flex items-center justify-center relative">
                <img
                  src={ashwagandhaProduct}
                  alt="Ashwagandha Formulation - Real Physical Ayurvedic Product"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                />

                {/* Laser Scanning Effect Line */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-[bounce_3s_ease-in-out_infinite] pointer-events-none" />
              </div>

              {/* Verified Hologram Seal */}
              <div className="absolute -bottom-3 -right-3 bg-gradient-to-tr from-[#0d5c3a] to-emerald-600 text-white p-2.5 rounded-2xl shadow-lg border-2 border-white flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider">AYUSH GMP</span>
              </div>
            </div>

            {/* Bottom Cryptographic Stamp */}
            <div className="w-full bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs z-10 shadow-2xs">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#0d5c3a]" />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-[11px]">QR Pass Hash</span>
                  <span className="font-mono text-[9px] text-slate-500">0x8a92f1b4...491c</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-700">
                100% Tamper-Proof
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN: Product Verification Details & Primary CTA (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              
              {/* Top Status Banner */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-black tracking-wide text-emerald-800 uppercase">
                    ✓ VERIFIED PRODUCT
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-slate-500">
                  National Database Sync: Active
                </span>
              </div>

              {/* Product Title & Botanical Taxon */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
                  Ashwagandha Formulation
                </h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-800 font-serif italic font-semibold">
                  <span>Withania somnifera (L.) Dunal</span>
                  <span>•</span>
                  <span>Root Botanical Extract</span>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px]">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Manufacturer</span>
                  </div>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">
                    Ayurveda Life Labs
                  </p>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    Licensed GMP Manufacturing Unit
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px]">
                    <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Batch Number</span>
                  </div>
                  <p className="font-mono font-black text-slate-900 text-xs sm:text-sm">
                    AT-2026-001
                  </p>
                  <span className="text-[10px] text-slate-500 block">
                    Lot Size: 5,000 Units
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Manufacturing Date</span>
                  </div>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">
                    12 Aug 2026
                  </p>
                  <span className="text-[10px] text-slate-500 block">
                    Expiry: Aug 2028 (24 Months)
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Active Standard</span>
                  </div>
                  <p className="font-bold text-emerald-800 text-xs sm:text-sm">
                    Withanolides: 5.4%
                  </p>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    API Standard: &gt; 2.5% (PASSED)
                  </span>
                </div>

              </div>

              {/* Verification Badges summary */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 block">
                  DIGITAL CERTIFICATE CONFIRMATIONS
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Authentic Botanical Identity</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Geo-fenced Origin Traced</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Lab Safety & Purity Tested</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Tamper-evident Chain of Custody</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Primary Action Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                id="view-digital-passport-btn"
                onClick={() => navigate('/verify-product/passport')}
                className="w-full sm:w-auto flex-1 h-14 rounded-2xl bg-[#0d5c3a] hover:bg-[#09462b] text-white font-bold text-base shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>View Digital Passport</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/verify-product/passport')}
                className="w-full sm:w-auto px-6 h-14 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-emerald-700" />
                <span>Anti-Counterfeit Demo</span>
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 3. FOOTER                                                                */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full bg-white border-t border-slate-200/90 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AyuTrace Nexus • Ministry of Ayush Consumer Verification Prototype</span>
          <span className="font-mono text-[10px]">Permissioned On-Chain Ledger Protocol</span>
        </div>
      </footer>
    </div>
  );
};

export default VerifyProductLandingPage;
