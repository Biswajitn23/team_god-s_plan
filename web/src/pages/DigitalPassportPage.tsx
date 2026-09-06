import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Leaf,
  MapPin,
  FileCheck2,
  Calendar,
  Building2,
  Lock,
  Layers,
  Sparkles,
  QrCode,
  Download,
  ExternalLink,
  ChevronRight,
  Info,
  Beaker,
  Clock,
  UserCheck,
  Search,
  RefreshCw,
  X,
  Radio,
  FileText,
  Activity,
  Award
} from 'lucide-react';
import thakurYograjStudio from '@/assets/thakur-yograj-studio.jpg';

export const DigitalPassportPage: React.FC = () => {
  const navigate = useNavigate();

  // Active stage in "From Plant to Product"
  const [activeStage, setActiveStage] = useState<number>(0);

  // Selected Genealogy Node for detailed inspection
  const [selectedGenealogyNode, setSelectedGenealogyNode] = useState<string>('formulation');

  // Certificate Modal state
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Counterfeit Simulation state
  const [duplicateScanTriggered, setDuplicateScanTriggered] = useState<boolean>(false);

  // Recall Simulation state
  const [recallSimulated, setRecallSimulated] = useState<boolean>(false);
  const [showRecallModal, setShowRecallModal] = useState<boolean>(false);

  // 6 Stages Data
  const stages = [
    {
      id: 0,
      title: 'Collection',
      icon: '🌱',
      date: '14 May 2026',
      actor: 'Chhindwara Forest Tribal Collector Society',
      location: 'Madhya Pradesh, India',
      lot: 'RAW-ASH-00182',
      details: 'Wild-crafted organic root harvesting following National Medicinal Plants Board (NMPB) sustainable collection guidelines. Moisture level tested at 8.4% on field collection.',
      verifiedBy: 'State Forest Range Officer #MP-204',
      badge: 'GACP Compliant'
    },
    {
      id: 1,
      title: 'Source',
      icon: '📍',
      date: '18 May 2026',
      actor: 'Kisan Herbal Aggregator Depot',
      location: 'Neemuch Mandi, MP',
      lot: 'AGG-ASH-7712',
      details: 'Visual botanic sorting, root size grading (Grade-A thick taproot), foreign matter removal (< 0.5%), and solar shade dehydration.',
      verifiedBy: 'Govt. Mandi Botanical Inspector',
      badge: 'Geo-Tagged Origin'
    },
    {
      id: 2,
      title: 'Processing',
      icon: '📦',
      date: '02 Jun 2026',
      actor: 'Western Ghats Bio-Extracts Plant',
      location: 'Nashik, Maharashtra',
      lot: 'PROC-ASH-00091',
      details: 'Cryogenic micro-pulverization, ethanol-water hydroalcoholic extraction (10:1 ratio), standardized withanolide yield concentration at controlled 45°C.',
      verifiedBy: 'GMP Quality Assurance Head',
      badge: 'ISO 22000 GMP'
    },
    {
      id: 3,
      title: 'Laboratory',
      icon: '🧪',
      date: '15 Jul 2026',
      actor: 'Central AYUSH Analytical Testing Lab',
      location: 'Pune, Maharashtra',
      lot: 'LAB-2026-88291',
      details: 'HPTLC botanical fingerprint matching Ayurvedic Pharmacopoeia of India (API). Heavy metals, aflatoxins, and 142 pesticide residues tested below detection limits.',
      verifiedBy: 'Senior Pharmacognosist (NABL)',
      badge: 'NABL Accredited'
    },
    {
      id: 4,
      title: 'Formulation',
      icon: '💊',
      date: '12 Aug 2026',
      actor: 'Thakur Yograj Formulation Campus',
      location: 'Raipur, Chhattisgarh',
      lot: 'TY-BATCH-2026-001',
      details: 'Cold-pressed botanical herb infusion with Bhringraj, Amla, and Hibiscus, automated packaging into 250ml bottles, tamper-evident induction cap, and laser etched serial PX-82K9J.',
      verifiedBy: 'Chief Production Officer',
      badge: 'AYUSH GMP Certified'
    },
    {
      id: 5,
      title: 'Final Product',
      icon: '📦',
      date: '24 Aug 2026',
      actor: 'All-India National Logistics Hub',
      location: 'Raipur Central Depot',
      lot: 'TY-2026-001',
      details: 'Secure palletization, digital temperature-monitored distribution tracking, and tamper-evident consumer QR cryptographic key generation.',
      verifiedBy: 'Supply Chain Controller',
      badge: 'Tamper-Evident QR'
    }
  ];

  // Genealogy Nodes Info
  const genealogyData: Record<string, { title: string; lotId: string; quantity: string; timestamp: string; actor: string; status: string; hash: string }> = {
    source: {
      title: 'Source Lot',
      lotId: 'SRC-MP-9941',
      quantity: '1,200 kg Raw Herbs',
      timestamp: '14 May 2026 • 07:30 AM',
      actor: 'Tribal Herbal Harvester Union',
      status: 'Harvest Verified',
      hash: '0x9a8f...411e'
    },
    raw: {
      title: 'Raw Material Lot',
      lotId: 'RAW-HERB-00182',
      quantity: '1,180 kg Sorted Herbs',
      timestamp: '18 May 2026 • 11:15 AM',
      actor: 'Kisan Herbal Aggregator Depot',
      status: 'Mandi Cleared',
      hash: '0x81c2...9b04'
    },
    processed: {
      title: 'Processed Lot',
      lotId: 'PROC-HERB-00091',
      quantity: '850 kg Standardized Extract',
      timestamp: '02 Jun 2026 • 03:40 PM',
      actor: 'Bio-Extracts Processing Plant',
      status: 'Extraction Certified',
      hash: '0xfe31...77d8'
    },
    powder: {
      title: 'Extract Blend Lot',
      lotId: 'EXT-OIL-0442',
      quantity: '840 L Herb Oil Concentrate',
      timestamp: '20 Jun 2026 • 09:20 AM',
      actor: 'Precision Extraction Unit #3',
      status: 'Purity Tested',
      hash: '0x33ca...61a2'
    },
    formulation: {
      title: 'Formulation Batch',
      lotId: 'TY-BATCH-2026-001',
      quantity: '5,000 Finished Bottles (250ml)',
      timestamp: '12 Aug 2026 • 02:00 PM',
      actor: 'Thakur Yograj (Raipur, Chhattisgarh)',
      status: 'Batch Released',
      hash: '0x7e29...12c9'
    },
    final: {
      title: 'Final Product Serial',
      lotId: 'TY-2026-001 (PX-82K9J)',
      quantity: '1 Unit (250ml Pack)',
      timestamp: '24 Aug 2026 • 04:30 PM',
      actor: 'Authorized National Logistics Chain',
      status: 'Consumer Ready',
      hash: '0x4d12...88fa'
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] text-slate-800 font-sans select-none relative pb-16">
      
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. TOP STICKY PASSPORT NAV                                                */}
      {/* ========================================================================= */}
      <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0d5c3a] text-white flex items-center justify-center shadow-sm">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-slate-900 text-sm sm:text-base">
                AyuTrace Nexus
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-[#0d5c3a] border border-emerald-200 font-bold">
                PASSPORT: AT-2026-001
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              National Digital Botanical Provenance Protocol
            </p>
          </div>
        </div>

        {/* Quick Nav Anchors */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
          <a href="#overview" className="hover:text-[#0d5c3a] transition-colors">Overview</a>
          <a href="#journey" className="hover:text-[#0d5c3a] transition-colors">Journey</a>
          <a href="#provenance" className="hover:text-[#0d5c3a] transition-colors">Source</a>
          <a href="#genealogy" className="hover:text-[#0d5c3a] transition-colors">Genealogy</a>
          <a href="#laboratory" className="hover:text-[#0d5c3a] transition-colors">Lab Evidence</a>
          <a href="#blockchain" className="hover:text-[#0d5c3a] transition-colors">Ledger Proof</a>
          <a href="#authenticity" className="hover:text-[#0d5c3a] transition-colors">Authenticity</a>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0d5c3a] bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Main Website</span>
        </button>
      </nav>

      {/* Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8 relative z-10">

        {/* ========================================================================= */}
        {/* SCREEN 2: DIGITAL BOTANICAL PASSPORT HEADER & 4 VERIFICATION CARDS       */}
        {/* ========================================================================= */}
        <section id="overview" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          
          {/* Top Title Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-widest text-[#0d5c3a]">
                  GOVERNMENT OF INDIA AYUSH ACCREDITED
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  SERIAL: PX-82K9J
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight">
                THAKUR YOGRAJ HAIR OIL
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 font-serif italic">
                <span>Bhringraj, Amla, Hibiscus & Herbal Extracts</span>
                <span>•</span>
                <span>Manufacturer: <strong className="not-italic text-slate-800 font-semibold">Thakur Yograj, Raipur, Chhattisgarh</strong></span>
                <span>•</span>
                <span>Batch: <strong className="font-mono not-italic text-slate-800">TY-2026-001</strong></span>
                <span>•</span>
                <span>Mfd: <strong className="not-italic text-emerald-800 font-semibold">July 2026 to June 2028</strong></span>
              </div>
            </div>

            {/* Large Verified Status Pill */}
            <div className="flex items-center gap-3">
              <div className="px-5 py-2.5 rounded-2xl bg-[#0d5c3a] text-white flex items-center gap-2 shadow-lg shadow-emerald-900/20">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm sm:text-base font-black tracking-wider">
                    ✓ VERIFIED
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-emerald-200 font-semibold">
                    100% Provenance Integrity
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Compact Verification Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* Card 1 */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5 transition-all hover:bg-emerald-50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                  Botanical Identity
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-slate-900">
                Verified
              </p>
              <span className="text-[11px] text-slate-600 block">
                HPTLC fingerprint matched to Ayurvedic Pharmacopoeia
              </span>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5 transition-all hover:bg-emerald-50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                  Source Provenance
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-slate-900">
                Verified
              </p>
              <span className="text-[11px] text-slate-600 block">
                Madhya Pradesh, India • Geo-fenced harvest zone
              </span>
            </div>

            {/* Card 3 */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5 transition-all hover:bg-emerald-50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                  Laboratory Evidence
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-slate-900">
                Verified
              </p>
              <span className="text-[11px] text-slate-600 block">
                CoA #LAB-2026-88291 • Heavy metals & pesticides clear
              </span>
            </div>

            {/* Card 4 */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5 transition-all hover:bg-emerald-50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                  Chain of Custody
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-slate-900">
                Verified
              </p>
              <span className="text-[11px] text-slate-600 block">
                6/6 Permissioned Nodes Digitally Signed
              </span>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SCREEN 3: “FROM PLANT TO PRODUCT” HORIZONTAL INTERACTIVE JOURNEY          */}
        {/* ========================================================================= */}
        <section id="journey" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                From Plant to Product
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Click any stage along the botanical journey to inspect recorded digital evidence.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0d5c3a] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              Stage {activeStage + 1} of {stages.length}: {stages[activeStage].title}
            </span>
          </div>

          {/* Stepper Bar */}
          <div className="relative pt-2 pb-4">
            
            {/* Horizontal Line */}
            <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-1 bg-slate-200 z-0">
              <div
                className="h-full bg-[#0d5c3a] transition-all duration-500"
                style={{ width: `${(activeStage / (stages.length - 1)) * 100}%` }}
              />
            </div>

            {/* Stepper Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 relative z-10">
              {stages.map((stg, idx) => {
                const isActive = activeStage === idx;
                const isPassed = activeStage >= idx;

                return (
                  <button
                    key={stg.id}
                    onClick={() => setActiveStage(idx)}
                    className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[#0d5c3a] text-white border-[#0d5c3a] shadow-md scale-105'
                        : isPassed
                        ? 'bg-emerald-50/80 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-base mb-1.5 shadow-xs ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isPassed
                          ? 'bg-emerald-200/80 text-emerald-900'
                          : 'bg-white text-slate-500'
                      }`}
                    >
                      {stg.icon}
                    </div>
                    <span className="text-xs font-bold leading-tight">
                      {stg.title}
                    </span>
                    <span className={`text-[10px] font-mono mt-0.5 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {stg.date.split(' ')[0]} {stg.date.split(' ')[1]}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Active Stage Inline Evidence Detail Drawer */}
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{stages[activeStage].icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {stages[activeStage].title} Stage Proof
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#0d5c3a] text-[10px] font-black uppercase">
                      {stages[activeStage].badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Recorded Date: {stages[activeStage].date}
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-slate-600">
                Lot / Ref: <span className="text-[#0d5c3a]">{stages[activeStage].lot}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {stages[activeStage].details}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/70">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Executing Actor</span>
                  <span className="font-semibold text-slate-800">{stages[activeStage].actor}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/70">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Location & Verification Authority</span>
                  <span className="font-semibold text-slate-800">{stages[activeStage].location} • {stages[activeStage].verifiedBy}</span>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* SCREEN 4: SOURCE PROVENANCE & PROTECTED GEOGRAPHIC MAP                    */}
        {/* ========================================================================= */}
        <section id="provenance" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-50 text-[#0d5c3a] text-xs font-bold border border-emerald-200">
              <MapPin className="w-3.5 h-3.5" />
              <span>GEOGRAPHIC ORIGIN & ECOLOGICAL SAFETY</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
              Where did this botanical material come from?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Parameters Table (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Source Region</span>
                  <span className="font-bold text-slate-800 text-sm">Madhya Pradesh, India</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">Chhindwara & Neemuch Belt</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Collection Date</span>
                  <span className="font-bold text-slate-800 text-sm">14 May 2026</span>
                  <span className="text-[10px] text-slate-500 block">Post-monsoon maturation window</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Botanical Species</span>
                  <span className="font-serif italic font-bold text-emerald-900 text-sm">Withania somnifera</span>
                  <span className="text-[10px] text-slate-500 block">Solanaceae Family</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Plant Part Used</span>
                  <span className="font-bold text-slate-800 text-sm">Mature Root (Radix)</span>
                  <span className="text-[10px] text-slate-500 block">Cleaned, sun-dried taproots</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Source Type</span>
                  <span className="font-bold text-slate-800 text-sm">Cultivated (GACP)</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">Good Agricultural Practices</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Permit Status</span>
                  <span className="font-bold text-emerald-800 text-sm">Approved (Active)</span>
                  <span className="font-mono text-[10px] text-slate-500 block">AYUSH/MP/2026/GACP-8820</span>
                </div>

              </div>

              {/* 3 Verification Cards */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="font-bold text-emerald-900 block text-[11px]">Authorized Zone</span>
                  <span className="text-[9px] text-emerald-700">Govt. Verified</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="font-bold text-emerald-900 block text-[11px]">Collection Period</span>
                  <span className="text-[9px] text-emerald-700">Sustainable Cycle</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="font-bold text-emerald-900 block text-[11px]">Source Recorded</span>
                  <span className="text-[9px] text-emerald-700">GPS Geo-Tagged</span>
                </div>
              </div>

            </div>

            {/* Right Map Canvas (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-2xl p-4 sm:p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-inner">
              
              {/* Top Map Header */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Madhya Pradesh Geo-Fence</span>
                </div>

                {/* Exact coordinates restricted badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-[10px] text-amber-300 font-bold backdrop-blur-sm">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Exact coordinates restricted</span>
                </div>
              </div>

              {/* Vector Map Representation */}
              <div className="relative my-6 h-48 w-full flex items-center justify-center">
                <svg viewBox="0 0 400 300" className="w-full h-full opacity-80">
                  {/* Stylized State outline */}
                  <path
                    d="M60,140 C90,90 150,70 240,80 C290,90 340,130 330,190 C310,240 230,260 140,240 C90,230 50,180 60,140 Z"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  {/* Geo-fenced Polygon */}
                  <polygon
                    points="160,130 220,110 250,160 210,200 150,170"
                    fill="rgba(16, 185, 129, 0.25)"
                    stroke="#34d399"
                    strokeWidth="2.5"
                  />
                  {/* Radar Pulse on Centroid */}
                  <circle cx="195" cy="155" r="8" fill="#10b981" className="animate-ping" opacity="0.6" />
                  <circle cx="195" cy="155" r="5" fill="#34d399" />
                  <text x="195" y="180" textAnchor="middle" fill="#ecfdf5" fontSize="11" fontWeight="bold">
                    Zone MP-NEEMUCH-204
                  </text>
                  <text x="195" y="195" textAnchor="middle" fill="#a7f3d0" fontSize="9">
                    Approved Cultivation Cluster
                  </text>
                </svg>
              </div>

              {/* Privacy Notice */}
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-[10px] text-slate-300 z-10">
                <span className="font-bold text-white block">Ecological & Privacy Protection Protocol:</span>
                Exact wild-collection GPS markers are obfuscated to protect endangered natural biotopes while maintaining cryptographically verifiable origin provenance.
              </div>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SCREEN 5: MATERIAL GENEALOGY INTERACTIVE LINEAGE GRAPH                   */}
        {/* ========================================================================= */}
        <section id="genealogy" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-50 text-[#0d5c3a] text-xs font-bold border border-emerald-200">
              <Layers className="w-3.5 h-3.5" />
              <span>END-TO-END MATERIAL LINEAGE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
              Material Genealogy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Click any node in the transformation pipeline to inspect lot-level custody, mass balance, and digital proof.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Interactive Nodes Flow (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-3">
              
              {[
                { key: 'source', label: 'Source Lot', lot: 'SRC-MP-9941', icon: '🌱' },
                { key: 'raw', label: 'Raw Material Lot', lot: 'RAW-ASH-00182', icon: '📍' },
                { key: 'processed', label: 'Processed Lot', lot: 'PROC-ASH-00091', icon: '📦' },
                { key: 'powder', label: 'Powder Lot', lot: 'POW-ASH-0442', icon: '✨' },
                { key: 'formulation', label: 'Formulation Batch', lot: 'MFG-BATCH-2026-001', icon: '💊' },
                { key: 'final', label: 'Final Product', lot: 'AT-2026-001 (PX-82K9J)', icon: '📦' }
              ].map((item, i, arr) => {
                const isSelected = selectedGenealogyNode === item.key;

                return (
                  <React.Fragment key={item.key}>
                    <button
                      onClick={() => setSelectedGenealogyNode(item.key)}
                      className={`p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer border text-left ${
                        isSelected
                          ? 'bg-emerald-900 text-white border-emerald-700 shadow-md scale-[1.01]'
                          : 'bg-slate-50 hover:bg-emerald-50/60 text-slate-800 border-slate-200/90'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {item.label}
                          </span>
                          <span className={`font-mono text-[11px] font-semibold ${isSelected ? 'text-emerald-300' : 'text-emerald-700'}`}>
                            {item.lot}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                          isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100/80 text-[#0d5c3a]'
                        }`}>
                          Verified
                        </span>
                        <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                    </button>

                    {i < arr.length - 1 && (
                      <div className="flex justify-center -my-1 py-0.5">
                        <div className="w-0.5 h-3 bg-emerald-500/40" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

            </div>

            {/* Right Node Inspector Card (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-emerald-50/40 rounded-2xl p-5 border border-slate-200/90 flex flex-col justify-between space-y-4">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase text-slate-400">Selected Node Details</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#0d5c3a]">
                    {genealogyData[selectedGenealogyNode].status}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {genealogyData[selectedGenealogyNode].title}
                  </h3>
                  <p className="font-mono text-xs font-black text-[#0d5c3a]">
                    {genealogyData[selectedGenealogyNode].lotId}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Quantity / Mass Balance</span>
                    <span className="font-bold text-slate-800">{genealogyData[selectedGenealogyNode].quantity}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Timestamp</span>
                    <span className="font-medium text-slate-700">{genealogyData[selectedGenealogyNode].timestamp}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Signing Actor</span>
                    <span className="font-bold text-slate-800">{genealogyData[selectedGenealogyNode].actor}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Ledger Receipt Hash</span>
                    <span className="font-mono text-[10px] text-slate-500 break-all">{genealogyData[selectedGenealogyNode].hash}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-[10px] text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Linked and cryptographically chained to final serialized package PX-82K9J</span>
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SCREEN 6: LABORATORY VERIFICATION EVIDENCE & CERTIFICATE VIEWER           */}
        {/* ========================================================================= */}
        <section id="laboratory" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-50 text-[#0d5c3a] text-xs font-bold border border-emerald-200">
                <Beaker className="w-3.5 h-3.5" />
                <span>INDEPENDENT ANALYTICAL PROOF</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                Laboratory Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Certificate ID: <strong className="font-mono text-slate-800">LAB-2026-88291</strong> • Verified: 15 Jul 2026
              </p>
            </div>

            {/* View Certificate Button */}
            <button
              onClick={() => setShowCertificateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d5c3a] hover:bg-[#09462b] text-white font-bold text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto"
            >
              <FileText className="w-4 h-4 text-emerald-200" />
              <span>View Certificate</span>
            </button>
          </div>

          {/* 5 Real Test Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">Botanical Identity</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#0d5c3a] text-[10px] font-black">PASSED</span>
              </div>
              <p className="text-xs text-slate-600">
                HPTLC profile matching Withania somnifera standard. Withanolides content at 5.4% (API Spec: &gt; 2.5%).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">Moisture & Foreign Matter</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#0d5c3a] text-[10px] font-black">PASSED</span>
              </div>
              <p className="text-xs text-slate-600">
                Loss on Drying (LOD): 6.2% (Limit: &lt; 8.0%). Total ash: 5.1%. Acid-insoluble ash: 0.7%.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">Microbial Testing</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#0d5c3a] text-[10px] font-black">PASSED</span>
              </div>
              <p className="text-xs text-slate-600">
                Total viable count &lt; 100 CFU/g. E. coli, Salmonella, S. aureus: Completely ABSENT.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">Heavy Metals (ICP-MS)</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#0d5c3a] text-[10px] font-black">PASSED</span>
              </div>
              <p className="text-xs text-slate-600">
                Lead (Pb) &lt; 0.1 ppm, Cadmium (Cd) &lt; 0.05 ppm, Arsenic (As) &lt; 0.1 ppm, Mercury (Hg) &lt; 0.01 ppm.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">Pesticide Residues</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#0d5c3a] text-[10px] font-black">PASSED</span>
              </div>
              <p className="text-xs text-slate-600">
                142 Organochlorine & organophosphate chemical compounds tested: NOT DETECTED (ND).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950 text-white flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">Lab Accreditation</span>
                <p className="text-xs font-bold leading-snug">
                  Central AYUSH Analytical & Pharmacognosy Testing Lab
                </p>
                <span className="text-[10px] text-emerald-200/80 block">
                  NABL / ISO-IEC 17025 Certified
                </span>
              </div>
              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-emerald-800">
                <span>Signee: Dr. V. R. Deshmukh</span>
                <span className="text-emerald-400 font-bold">Signed On-Chain</span>
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SCREEN 7: IMMUTABLE PROVENANCE RECORD (BLOCKCHAIN PROOF)                  */}
        {/* ========================================================================= */}
        <section id="blockchain" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-50 text-[#0d5c3a] text-xs font-bold border border-emerald-200">
              <Lock className="w-3.5 h-3.5" />
              <span>TAMPER-EVIDENT AUDIT TRAIL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
              Immutable Provenance Record
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Critical provenance events are recorded on a permissioned blockchain to provide a tamper-evident audit history.
            </p>
          </div>

          {/* Audit Ledger Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Prev Hash</th>
                  <th className="py-3 px-4">Current Record Hash</th>
                  <th className="py-3 px-4">Digital Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-700">
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">EVT-001</td>
                  <td className="py-3 px-4">14 May 2026, 07:30</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">Kisan Tribal Collector Co-op</td>
                  <td className="py-3 px-4 text-slate-400">0x0000...0000</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">0x9a8f...411e</td>
                  <td className="py-3 px-4 text-slate-500">ECDSA:0x88c1..9a</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">EVT-002</td>
                  <td className="py-3 px-4">18 May 2026, 11:15</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">Neemuch Mandi Aggregator</td>
                  <td className="py-3 px-4 text-slate-400">0x9a8f...411e</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">0x81c2...9b04</td>
                  <td className="py-3 px-4 text-slate-500">ECDSA:0x39a0..bb</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">EVT-003</td>
                  <td className="py-3 px-4">02 Jun 2026, 15:40</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">Western Ghats Extraction Plant</td>
                  <td className="py-3 px-4 text-slate-400">0x81c2...9b04</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">0xfe31...77d8</td>
                  <td className="py-3 px-4 text-slate-500">ECDSA:0x51ef..42</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">EVT-004</td>
                  <td className="py-3 px-4">15 Jul 2026, 10:00</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">Central AYUSH Testing Lab</td>
                  <td className="py-3 px-4 text-slate-400">0xfe31...77d8</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">0x33ca...61a2</td>
                  <td className="py-3 px-4 text-slate-500">ECDSA:0x99aa..21</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">EVT-005</td>
                  <td className="py-3 px-4">12 Aug 2026, 14:00</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">Ayurveda Life Labs Formulation</td>
                  <td className="py-3 px-4 text-slate-400">0x33ca...61a2</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">0x7e29...12c9</td>
                  <td className="py-3 px-4 text-slate-500">ECDSA:0x12bb..78</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">EVT-006</td>
                  <td className="py-3 px-4">24 Aug 2026, 16:30</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">National Logistics Depot (Nagpur)</td>
                  <td className="py-3 px-4 text-slate-400">0x7e29...12c9</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">0x4d12...88fa</td>
                  <td className="py-3 px-4 text-slate-500">ECDSA:0x77cc..11</td>
                </tr>
              </tbody>
            </table>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* SCREEN 8 & 9: INTERACTIVE DEMOS (COUNTERFEIT & RECALL INTELLIGENCE)       */}
        {/* ========================================================================= */}
        <section id="authenticity" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* SCREEN 8: Counterfeit Detection Simulation */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0d5c3a] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Interactive Simulation 1
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  Serial: PX-82K9J
                </span>
              </div>

              <h3 className="text-xl font-serif font-black text-slate-900">
                Check Package Authenticity
              </h3>

              {/* Status Indicator */}
              {!duplicateScanTriggered ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-sm font-black text-emerald-900 block">
                      ✓ SERIAL VALID
                    </span>
                    <span className="text-xs text-emerald-700">
                      Single registered scan verified in consumer records.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 space-y-3 animate-shake">
                  <div className="flex items-center gap-2 text-rose-800">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span className="text-sm font-black uppercase">
                      ⚠ POSSIBLE COUNTERFEIT DETECTED
                    </span>
                  </div>

                  <p className="text-xs text-rose-700 leading-relaxed font-medium">
                    Reason: The same serial was detected in geographically inconsistent locations within an impossible time interval.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/80 border border-rose-200">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Original Scan</span>
                      <strong className="text-slate-800">Delhi — 10:12 AM</strong>
                      <span className="text-[9px] text-slate-500 block">Registered Dispenser</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-100/70 border border-rose-300">
                      <span className="text-[10px] font-bold text-rose-700 block uppercase">Suspicious Scan</span>
                      <strong className="text-rose-900">Mumbai — 10:18 AM</strong>
                      <span className="text-[9px] text-rose-700 block">Unverified Terminal</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-rose-900 text-white text-[10px] font-bold text-center">
                    Velocity Conflict: 1,150 km traversed in 6 minutes (Flagged in National DB)
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              {!duplicateScanTriggered ? (
                <button
                  onClick={() => setDuplicateScanTriggered(true)}
                  className="w-full h-12 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Radio className="w-4 h-4" />
                  <span>Simulate Duplicate Scan</span>
                </button>
              ) : (
                <button
                  onClick={() => setDuplicateScanTriggered(false)}
                  className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset to Valid State</span>
                </button>
              )}
            </div>

          </div>

          {/* SCREEN 9: Recall Intelligence Simulation */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0d5c3a] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Interactive Simulation 2
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  Root Lot: RAW-ASH-00182
                </span>
              </div>

              <h3 className="text-xl font-serif font-black text-slate-900">
                Trace Product Impact
              </h3>

              {!recallSimulated ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <p className="font-semibold text-slate-800">
                    Precision Recall Ready
                  </p>
                  <p>
                    Demonstrates how upstream lot defects instantly isolate impacted downstream formulations without nationwide blanket recalls.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center gap-2 text-amber-900">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span className="text-sm font-black uppercase">
                      ⚠ QUALITY ALERT • LOT QUARANTINE
                    </span>
                  </div>

                  {/* Animated Chain Flow */}
                  <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-[11px] font-mono text-amber-900 flex flex-wrap items-center justify-between gap-1">
                    <span>Raw Lot</span>
                    <span>→</span>
                    <span>Proc Lot</span>
                    <span>→</span>
                    <span>Batch</span>
                    <span>→</span>
                    <span>Packages</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-amber-100/80">
                      <strong className="text-amber-900 block text-sm">3</strong>
                      <span className="text-[9px] text-amber-800 font-bold">Batches Affected</span>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-100/80">
                      <strong className="text-amber-900 block text-sm">8,412</strong>
                      <span className="text-[9px] text-amber-800 font-bold">Total Packages</span>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-100/80">
                      <strong className="text-amber-900 block text-sm">5</strong>
                      <span className="text-[9px] text-amber-800 font-bold">Regions Isolated</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              {!recallSimulated ? (
                <button
                  onClick={() => setRecallSimulated(true)}
                  className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Simulate Failed Lot</span>
                </button>
              ) : (
                <div className="w-full flex items-center gap-2">
                  <button
                    onClick={() => setShowRecallModal(true)}
                    className="flex-1 h-12 rounded-xl bg-[#0d5c3a] hover:bg-[#09462b] text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>View Recall Impact</span>
                  </button>
                  <button
                    onClick={() => setRecallSimulated(false)}
                    className="px-4 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-all cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

          </div>

        </section>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: LAB CERTIFICATE VIEWER MODAL                                     */}
      {/* ========================================================================= */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-1 border-b border-slate-200 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-[#0d5c3a] text-[10px] font-black uppercase">
                <Award className="w-3.5 h-3.5" />
                <span>OFFICIAL CERTIFICATE OF ANALYSIS (COA)</span>
              </div>
              <h3 className="text-xl font-serif font-black text-slate-900">
                Central AYUSH Analytical Testing Laboratory
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Report No: COA-2026-88291 • NABL Accredited (Cert # TC-78901)
              </p>
            </div>

            {/* Certificate Body Data */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Sample Name</span>
                  <strong className="text-slate-800">Withania somnifera Extract (10:1)</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Sample Batch</span>
                  <strong className="font-mono text-slate-800">PROC-ASH-00091</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Date Received</span>
                  <span className="text-slate-700">10 Jul 2026</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Date Certified</span>
                  <span className="text-slate-700">15 Jul 2026</span>
                </div>
              </div>

              {/* Table of Test Parameters */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-2.5">Parameter</th>
                      <th className="p-2.5">Specification</th>
                      <th className="p-2.5">Observed Result</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-800">Withanolides Total</td>
                      <td className="p-2.5">&gt; 2.5% w/w</td>
                      <td className="p-2.5 font-bold text-emerald-800">5.42% w/w</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASSED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-800">Loss on Drying</td>
                      <td className="p-2.5">&lt; 8.0%</td>
                      <td className="p-2.5">6.2%</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASSED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-800">Lead (Pb)</td>
                      <td className="p-2.5">&lt; 10 ppm</td>
                      <td className="p-2.5">0.08 ppm</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASSED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-800">Arsenic (As)</td>
                      <td className="p-2.5">&lt; 3 ppm</td>
                      <td className="p-2.5">&lt; 0.05 ppm</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASSED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-800">Microbial Contaminants</td>
                      <td className="p-2.5">Absent</td>
                      <td className="p-2.5">Not Detected</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASSED</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures & Seal */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Authorized Signatory</span>
                  <span className="font-serif italic font-bold text-slate-900 text-sm">Dr. V. R. Deshmukh</span>
                  <span className="text-[9px] text-slate-500 block">Lead Pharmacognosy Scientist</span>
                </div>

                <div className="w-14 h-14 rounded-full border-2 border-emerald-700 border-dashed flex items-center justify-center text-center text-[8px] font-bold text-emerald-900">
                  AYUSH LAB SEAL
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCertificateModal(false)}
              className="w-full h-11 rounded-xl bg-[#0d5c3a] text-white font-bold text-xs hover:bg-[#09462b] transition-all cursor-pointer"
            >
              Close Certificate
            </button>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RECALL IMPACT INTELLIGENCE MODAL                                 */}
      {/* ========================================================================= */}
      {showRecallModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
            
            <button
              onClick={() => setShowRecallModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md">
                Precision Recall Intelligence
              </span>
              <h3 className="text-xl font-serif font-black text-slate-900">
                Impact Analysis: Lot RAW-ASH-00182
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <span className="font-bold block">Autonomous Recall Protocol Active:</span>
                All 5 distribution hubs holding batch AT-2026-001 have received instant cryptographically signed hold orders on their connected scanner terminals.
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Affected Distribution Nodes</span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span>Delhi Central Depot #DL-01</span>
                    <span className="text-rose-700 font-bold">2,400 Units (LOCKED)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span>Mumbai Logistics Hub #MH-04</span>
                    <span className="text-rose-700 font-bold">3,100 Units (LOCKED)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span>Bengaluru Transit Center #KA-02</span>
                    <span className="text-rose-700 font-bold">2,912 Units (LOCKED)</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowRecallModal(false)}
              className="w-full h-11 rounded-xl bg-[#0d5c3a] text-white font-bold text-xs hover:bg-[#09462b] transition-all cursor-pointer"
            >
              Acknowledge & Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default DigitalPassportPage;
