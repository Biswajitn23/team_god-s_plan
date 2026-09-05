import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Leaf,
  Sprout,
  MapPin,
  FlaskConical,
  Package,
  Layers,
  Truck,
  FileText,
  Lock,
  QrCode,
  Sparkles,
  ExternalLink,
  Award,
  RefreshCw,
  Search,
  ChevronRight,
  Info,
  Calendar,
  Building2,
  Clock,
  Eye,
  X,
  Radio,
  FileCheck2,
  AlertOctagon,
  Share2,
  Download
} from 'lucide-react';
import ashwagandhaProduct from '@/assets/ashwagandha-product.jpg';

interface JourneyStage {
  id: string;
  number: number;
  icon: any;
  name: string;
  hindiName: string;
  date: string;
  location: string;
  actor: string;
  status: string;
  evidence: {
    title: string;
    details: string;
    metrics: Record<string, string>;
    docId: string;
  };
}

interface GenealogyNode {
  id: string;
  label: string;
  lotId: string;
  quantity: string;
  timestamp: string;
  actor: string;
  status: string;
  notes: string;
}

export const DigitalPassportPage: React.FC = () => {
  const navigate = useNavigate();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'overview' | 'journey' | 'source' | 'genealogy' | 'lab' | 'blockchain' | 'demos'>('overview');

  // Interactive Stage in Journey
  const [selectedJourneyIndex, setSelectedJourneyIndex] = useState<number>(0);

  // Genealogy Selected Node
  const [selectedGenealogyNode, setSelectedGenealogyNode] = useState<GenealogyNode | null>(null);

  // Certificate Viewer Modal
  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  // Counterfeit Demo State
  const [duplicateScanTriggered, setDuplicateScanTriggered] = useState<boolean>(false);

  // Recall Simulation State
  const [recallSimulated, setRecallSimulated] = useState<boolean>(false);
  const [showRecallModal, setShowRecallModal] = useState<boolean>(false);

  // Journey Stages
  const journeyStages: JourneyStage[] = [
    {
      id: 'collection',
      number: 1,
      icon: Sprout,
      name: 'Collection',
      hindiName: 'कृषक एवं संग्रहण',
      date: '14 May 2026',
      location: 'Neemuch Farm Cluster, Madhya Pradesh',
      actor: 'Rajesh Kumar (FARM-001)',
      status: 'Verified Harvest',
      evidence: {
        title: 'Farm Gate Botanical Sourcing Record',
        details: 'Geo-tagged harvest of mature Withania somnifera roots under Good Agricultural Practices (GAP) standards.',
        metrics: {
          'Botanical Part': 'Root (Freshly Harvested)',
          'Collection Area': 'Plot 4B (Protected Organic Zone)',
          'Direct MSP Payout': '₹380/kg (DBT Confirmed)',
          'Geo-Fence Tag': '24.46° N, 74.87° E'
        },
        docId: 'HARVEST-MP-2026-091'
      }
    },
    {
      id: 'source',
      number: 2,
      icon: MapPin,
      name: 'Source',
      hindiName: 'प्राथमिक एकत्रीकरण',
      date: '16 May 2026',
      location: 'Regional AYUSH Aggregator Hub, Indore',
      actor: 'MahaAgri Aggregators (AGG-1001)',
      status: 'Consolidation Locked',
      evidence: {
        title: 'Regional Weighment & Intake Assay',
        details: 'Calibrated digital intake, foreign matter screening, and barcoding of consolidated lot RAW-ASH-00182.',
        metrics: {
          'Intake Lot ID': 'RAW-ASH-00182',
          'Consolidated Weight': '500.00 kg',
          'Moisture Screening': '8.2% (Grade A Purity)',
          'Blockchain Tag': 'Minted Block #912,410'
        },
        docId: 'AGG-INTAKE-2026-441'
      }
    },
    {
      id: 'processing',
      number: 3,
      icon: Layers,
      name: 'Processing',
      hindiName: 'निष्कर्षण एवं प्रसंस्करण',
      date: '28 June 2026',
      location: 'Western Ghats Processing Plant, Nashik',
      actor: 'Western Ghats Processing (PROC-2001)',
      status: 'Extraction Certified',
      evidence: {
        title: 'Standardized Extraction Dossier',
        details: 'Hydro-alcoholic standardized solvent extraction yielding pure withanolide-rich botanical extract.',
        metrics: {
          'Processing Lot ID': 'PROC-ASH-00091',
          'Extraction Method': 'Hydro-Ethanolic (65°C)',
          'Yield Ratio': '10:1 Botanical Ratio',
          'Cleanliness Assay': '100% GMP Standard'
        },
        docId: 'PROC-EXT-2026-881'
      }
    },
    {
      id: 'laboratory',
      number: 4,
      icon: FlaskConical,
      name: 'Laboratory',
      hindiName: 'गुणवत्ता परीक्षण प्रयोगशाला',
      date: '28 July 2026',
      location: 'National AYUSH Quality Testing Lab, Bhopal',
      actor: 'Chief Quality Analyst (LAB-04)',
      status: 'All Tests Passed',
      evidence: {
        title: 'Pharmacopoeial Certificate of Analysis',
        details: 'High-Performance Thin-Layer Chromatography (HPTLC) verification confirming authentic Withania somnifera active markers.',
        metrics: {
          'Certificate ID': 'LAB-2026-88291',
          'Withanolides A & B': '5.4% (Standard >2.5%)',
          'Heavy Metals': 'Not Detected (<0.01 ppm)',
          'Microbial Count': 'Zero Pathogens'
        },
        docId: 'COA-AYUSH-2026-88291'
      }
    },
    {
      id: 'formulation',
      number: 5,
      icon: Package,
      name: 'Formulation',
      hindiName: 'जीएमपी निर्माण एवं पैकेजिंग',
      date: '12 Aug 2026',
      location: 'Ayurveda Life Labs Facility, Satara',
      actor: 'GMP Formulation Controller (MFG-3001)',
      status: 'Batch Approved',
      evidence: {
        title: 'GMP Finished Formulation Batching',
        details: 'Automated formulation encapsulation and airtight tamper-evident bottling under sterile cleanroom class 100,000.',
        metrics: {
          'Formulation Batch': 'AT-2026-001',
          'Dosage Form': 'Vegetarian Extract Capsules (500mg)',
          'Batch Volume': '5,000 Bottles',
          'Tamper Seal ID': 'SEAL-2026-0912'
        },
        docId: 'MFG-BATCH-2026-001'
      }
    },
    {
      id: 'final_product',
      number: 6,
      icon: CheckCircle2,
      name: 'Final Product',
      hindiName: 'प्रमाणित अंतिम उत्पाद',
      date: '20 Aug 2026',
      location: 'Central Pharmacy Distribution Node, Varanasi',
      actor: 'Logistics Operations Lead (DIST-4001)',
      status: 'Consumer Ready',
      evidence: {
        title: 'Cryptographic Dispatch & Retail Release',
        details: 'Cold-chain tracked delivery with serialized dynamic QR code activated for instant consumer verification.',
        metrics: {
          'Unique Serial': 'PX-82K9J',
          'Cold-Chain Log': '21.5°C Steady Transit',
          'Verification Status': '100% Authentic & Verifiable',
          'Public Ledger Hash': '0x8a92f1b4c731...491c'
        },
        docId: 'REL-2026-PX82K9J'
      }
    }
  ];

  // Genealogy Nodes
  const genealogyNodes: GenealogyNode[] = [
    {
      id: 'source-lot',
      label: 'Source Lot',
      lotId: 'RAW-ASH-00182',
      quantity: '500.00 kg (Dried Roots)',
      timestamp: '14 May 2026 09:30 AM',
      actor: 'Farmer Rajesh Kumar & Certified Harvesters',
      status: 'Origin Verified',
      notes: 'Organic Withania somnifera roots collected in Neemuch district, MP.'
    },
    {
      id: 'rm-lot',
      label: 'Raw Material Lot',
      lotId: 'RM-2026-041',
      quantity: '492.50 kg (Cleaned & Graded)',
      timestamp: '16 May 2026 02:15 PM',
      actor: 'MahaAgri Aggregators (AGG-1001)',
      status: 'Assay Passed',
      notes: 'Passed initial moisture test (8.2%) and foreign matter removal.'
    },
    {
      id: 'proc-lot',
      label: 'Processed Lot',
      lotId: 'PROC-ASH-00091',
      quantity: '48.20 kg (Standardized Extract)',
      timestamp: '28 June 2026 11:00 AM',
      actor: 'Western Ghats Processing Center (PROC-2001)',
      status: 'Extraction Complete',
      notes: '10:1 concentrated hydro-alcoholic extract with 5.4% Withanolides.'
    },
    {
      id: 'pwd-lot',
      label: 'Powder Lot',
      lotId: 'PWD-8812',
      quantity: '48.00 kg (Micronized 80 Mesh)',
      timestamp: '10 July 2026 04:30 PM',
      actor: 'Western Ghats Milling Unit',
      status: 'Homogenized',
      notes: 'Micronized powder sterilized with dry heat; zero microbial contamination.'
    },
    {
      id: 'mfg-batch',
      label: 'Formulation Batch',
      lotId: 'AT-2026-001',
      quantity: '5,000 Units (60 Capsules/bottle)',
      timestamp: '12 Aug 2026 10:45 AM',
      actor: 'Ayurveda Life Labs (MFG-3001)',
      status: 'GMP Sealed',
      notes: 'Capsule encapsulation, nitrogen flushing, and holographic safety seal applied.'
    },
    {
      id: 'final-product',
      label: 'Final Product',
      lotId: 'PX-82K9J (This Bottle)',
      quantity: '1 Bottle (60 Capsules)',
      timestamp: '20 Aug 2026 01:20 PM',
      actor: 'All-India Logistics Depot (DIST-4001)',
      status: 'Verified Authenticity',
      notes: 'Individual item serialized and cryptographically bound to parent batch AT-2026-001.'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#faf9f5] text-slate-800 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. TOP STANDALONE NAVBAR                                                 */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Brand & Passport Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#0d5c3a] text-white flex items-center justify-center shadow-sm shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-base font-black font-serif tracking-tight text-slate-900">
                  AyuTrace Nexus
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#0d5c3a] text-[9px] font-extrabold uppercase">
                  Digital Passport
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                National Botanical Provenance Protocol • GoI
              </span>
            </div>
          </div>

          {/* Navigation Pill Links */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold text-slate-600">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'journey', label: 'Journey' },
              { id: 'source', label: 'Source Provenance' },
              { id: 'genealogy', label: 'Genealogy' },
              { id: 'lab', label: 'Lab Evidence' },
              { id: 'blockchain', label: 'Blockchain Proof' },
              { id: 'demos', label: 'Authenticity & Demos' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  const el = document.getElementById(tab.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0d5c3a] text-white shadow-2xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right: Back to Main Website */}
          <button
            onClick={() => navigate('/')}
            className="self-end sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0d5c3a] bg-slate-50 hover:bg-emerald-50 border border-slate-200 px-3.5 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main Website</span>
          </button>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. DIGITAL BOTANICAL PASSPORT HERO HEADER (Screen 2)                     */}
      {/* ========================================================================= */}
      <section id="overview" className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-8 pb-4">
        
        <div className="bg-gradient-to-r from-[#eef8f3] via-white to-[#edf6f0] rounded-3xl border border-emerald-200/80 shadow-md p-6 sm:p-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left Product Title & Large Verified Badge */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-[#0d5c3a] text-white text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>VERIFIED DIGITAL PASSPORT</span>
                </span>

                <span className="px-3 py-1 rounded-full bg-white border border-emerald-200 font-mono text-xs font-bold text-slate-700">
                  Batch: AT-2026-001
                </span>

                <span className="px-3 py-1 rounded-full bg-white border border-emerald-200 font-mono text-xs font-bold text-slate-700">
                  Serial: PX-82K9J
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight">
                ASHWAGANDHA FORMULATION
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-medium font-serif italic">
                Botanical Standard: <span className="font-bold text-emerald-800 not-italic font-sans">Withania somnifera (L.) Dunal</span> • 100% Pure Certified Root Extract
              </p>
            </div>

            {/* Right Verified Stamp */}
            <div className="flex items-center gap-4 self-start lg:self-center bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-200 shadow-sm shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0d5c3a] to-emerald-500 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  GOVERNMENT OF INDIA
                </span>
                <span className="text-lg font-black text-emerald-800 leading-tight">
                  ✓ VERIFIED
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  AYUSH Quality Pass #99218
                </span>
              </div>
            </div>

          </div>

          {/* 4 Compact Verification Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-100">
            
            <div className="bg-white rounded-2xl p-4 border border-emerald-200/70 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0d5c3a] flex items-center justify-center shrink-0">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">Botanical Identity</p>
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified Species</span>
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-emerald-200/70 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">Source Provenance</p>
                <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  <span>Verified (MP, India)</span>
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-emerald-200/70 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">Laboratory Evidence</p>
                <span className="text-[11px] font-bold text-purple-700 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-purple-600" />
                  <span>Verified HPLC Pass</span>
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-emerald-200/70 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">Chain of Custody</p>
                <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-amber-600" />
                  <span>Verified On-Chain</span>
                </span>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. "FROM PLANT TO PRODUCT" HORIZONTAL JOURNEY (Screen 3)                  */}
      {/* ========================================================================= */}
      <section id="journey" className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d5c3a] uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5" />
              <span>Step-by-Step Provenance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              From Plant to Product
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Click any stage in the journey to reveal its underlying forensic evidence.
          </p>
        </div>

        {/* Clean Horizontal Journey Stepper */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-7 overflow-x-auto">
          
          <div className="flex items-center justify-between min-w-[700px] relative pb-2">
            
            {/* Continuous Track Line */}
            <div className="absolute top-7 left-8 right-8 h-1 bg-slate-200 -z-0" />
            
            {/* Active Track Highlight */}
            <div
              className="absolute top-7 left-8 h-1 bg-[#0d5c3a] transition-all duration-500 -z-0"
              style={{
                width: `${(selectedJourneyIndex / (journeyStages.length - 1)) * 90}%`
              }}
            />

            {journeyStages.map((stage, idx) => {
              const StageIcon = stage.icon;
              const isSelected = selectedJourneyIndex === idx;
              const isPast = idx <= selectedJourneyIndex;

              return (
                <div
                  key={stage.id}
                  onClick={() => setSelectedJourneyIndex(idx)}
                  className="flex flex-col items-center text-center cursor-pointer group z-10 px-2"
                >
                  {/* Circle Icon Indicator */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border-2 ${
                      isSelected
                        ? 'bg-[#0d5c3a] text-white border-emerald-400 scale-110 shadow-lg shadow-emerald-900/20 ring-4 ring-emerald-100'
                        : isPast
                        ? 'bg-emerald-50 text-[#0d5c3a] border-emerald-300'
                        : 'bg-slate-100 text-slate-400 border-slate-200 group-hover:border-slate-400'
                    }`}
                  >
                    <StageIcon className="w-6 h-6" />
                  </div>

                  {/* Stage Label */}
                  <span
                    className={`text-xs font-bold mt-2.5 transition-colors ${
                      isSelected ? 'text-[#0d5c3a]' : 'text-slate-700'
                    }`}
                  >
                    {stage.name}
                  </span>

                  <span className="text-[10px] font-mono text-slate-400">
                    {stage.date}
                  </span>
                </div>
              );
            })}

          </div>

          {/* Interactive Evidence Display Card for Selected Stage */}
          <div className="mt-8 pt-6 border-t border-slate-100 bg-[#f9fbf9] rounded-2xl p-6 border border-emerald-100">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-200/60">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0d5c3a] text-white flex items-center justify-center font-bold">
                  {journeyStages[selectedJourneyIndex].number}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {journeyStages[selectedJourneyIndex].evidence.title}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0d5c3a] text-[10px] font-extrabold">
                      {journeyStages[selectedJourneyIndex].status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    📍 {journeyStages[selectedJourneyIndex].location} • {journeyStages[selectedJourneyIndex].actor}
                  </p>
                </div>
              </div>

              <span className="font-mono text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start lg:self-center">
                Doc Ref: {journeyStages[selectedJourneyIndex].evidence.docId}
              </span>

            </div>

            <p className="text-xs sm:text-sm text-slate-700 mt-4 leading-relaxed font-medium">
              {journeyStages[selectedJourneyIndex].evidence.details}
            </p>

            {/* Metrics Key-Value Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-100/60">
              {Object.entries(journeyStages[selectedJourneyIndex].evidence.metrics).map(([key, val]) => (
                <div key={key} className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {key}
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {val}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. SOURCE PROVENANCE SECTION (Screen 4)                                  */}
      {/* ========================================================================= */}
      <section id="source" className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Botanical Origin & Wild Harvesting Validation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            Where did this botanical material come from?
          </h2>
          <p className="text-xs text-slate-500">
            Validated geo-location data from certified organic farm gate collection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Source Details Table & 3 Verification Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Source Details Grid */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">
                Source & Permit Specifications
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Source Region</span>
                  <p className="text-slate-900 font-bold text-sm mt-0.5">Madhya Pradesh, India</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Collection Date</span>
                  <p className="text-slate-900 font-bold text-sm mt-0.5">14 May 2026</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Botanical Species</span>
                  <p className="text-emerald-800 font-serif font-bold italic text-sm mt-0.5">Withania somnifera</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Plant Part</span>
                  <p className="text-slate-900 font-bold text-sm mt-0.5">Root (Dried)</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Source Type</span>
                  <p className="text-slate-900 font-bold text-sm mt-0.5">Cultivated / Organic GAP</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Permit Status</span>
                  <p className="text-emerald-700 font-bold text-sm mt-0.5">AYUSH-MP-2026-992 (Valid)</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Collection-Zone Validation</span>
                  <p className="text-slate-800 font-semibold text-xs mt-0.5">
                    Authorized Eco-Zone #4 • Certified Biodiversity Board Approved
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Verification Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Authorized Zone</h4>
                  <p className="text-[10px] text-slate-600 mt-0.5">SMPB Registered Region</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Collection Period</h4>
                  <p className="text-[10px] text-slate-600 mt-0.5">Optimal May Harvest</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Source Recorded</h4>
                  <p className="text-[10px] text-slate-600 mt-0.5">Tamper-proof Ledger</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Map Showing Collection Area & Privacy Shield (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0d5c3a]" />
                <span>Geographic Provenance Zone</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                Central India
              </span>
            </div>

            {/* Stylized Regional Map Visual */}
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-4 h-64 flex flex-col justify-between overflow-hidden text-white">
              
              {/* Vector Grid & Map Shape */}
              <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
                <svg viewBox="0 0 200 200" className="w-full h-full text-emerald-500/20" fill="currentColor">
                  <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" />
                  <circle cx="100" cy="100" r="45" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="8" fill="#10b981" />
                </svg>
              </div>

              {/* Top Geo Coordinates Badge */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-400 font-bold">● Neemuch District, MP</span>
                <span className="text-slate-400">Zone #4-B</span>
              </div>

              {/* Center Radar Pin */}
              <div className="relative z-10 self-center text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-white flex items-center justify-center mx-auto animate-pulse">
                  <Sprout className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-xs font-bold text-white block">
                  Botanical Origin Protected Radius
                </span>
              </div>

              {/* Bottom Sensitive Coordinate Warning Pill */}
              <div className="relative z-10 bg-black/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center gap-2 text-[10px] text-slate-300">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong>Exact coordinates restricted</strong> to protect wild harvesting habitats and local farmer biodiversity rights.
                </span>
              </div>

            </div>

            <p className="text-[11px] text-slate-500">
              Verified by Madhya Pradesh State Medicinal Plants Board (MPSMPB) Satellite Geofencing Network.
            </p>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. MATERIAL GENEALOGY SECTION (Screen 5)                                 */}
      {/* ========================================================================= */}
      <section id="genealogy" className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Forensic Lineage Tree</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              Material Genealogy
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Click any lot in the chain to inspect exact quantities, actors, and transformation timestamps.
          </p>
        </div>

        {/* Impressive Interactive Tree Structure */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 relative">
            
            {genealogyNodes.map((node, index) => (
              <div
                key={node.id}
                onClick={() => setSelectedGenealogyNode(node)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                  selectedGenealogyNode?.id === node.id
                    ? 'bg-purple-50 border-purple-400 shadow-md ring-2 ring-purple-200'
                    : 'bg-slate-50 hover:bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Node Level Label */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Step 0{index + 1}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-purple-700 transition-colors">
                    {node.label}
                  </h4>
                  <p className="font-mono text-xs font-bold text-[#0d5c3a] mt-1 truncate">
                    {node.lotId}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 space-y-0.5">
                  <p className="font-semibold text-slate-700">{node.quantity}</p>
                  <p className="truncate">{node.actor}</p>
                </div>

                {/* Arrow to Next Node (Hidden on last) */}
                {index < genealogyNodes.length - 1 && (
                  <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 w-5 h-5 rounded-full bg-white border border-slate-300 items-center justify-center text-slate-400 shadow-2xs">
                    <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}

          </div>

          {/* Node Details Inspection Drawer (If selected) */}
          {selectedGenealogyNode && (
            <div className="mt-6 p-5 rounded-2xl bg-purple-50/70 border border-purple-200 animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase text-purple-900">
                    Inspecting {selectedGenealogyNode.label}:
                  </span>
                  <span className="font-mono font-black text-purple-950 text-sm">
                    {selectedGenealogyNode.lotId}
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  {selectedGenealogyNode.notes}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Recorded at {selectedGenealogyNode.timestamp} by {selectedGenealogyNode.actor}
                </p>
              </div>

              <button
                onClick={() => setSelectedGenealogyNode(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-purple-200 text-purple-900 font-bold text-xs hover:bg-purple-100 transition-colors shrink-0"
              >
                Close Details
              </button>
            </div>
          )}

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 6. LABORATORY EVIDENCE SECTION (Screen 6)                                */}
      {/* ========================================================================= */}
      <section id="lab" className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d5c3a] uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>NABL & AYUSH Certified Laboratory Testing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              Laboratory Verification Evidence
            </h2>
          </div>

          <button
            onClick={() => setShowCertModal(true)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d5c3a] hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Certificate</span>
          </button>
        </div>

        {/* 5 Realistic Evidence Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Marker ID</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Botanical Identity</h4>
            <p className="text-xs font-bold text-emerald-800">PASSED</p>
            <span className="text-[10px] text-slate-500 block leading-tight">
              HPTLC Rf profile matched Withania standard.
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Assay</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Moisture Content</h4>
            <p className="text-xs font-bold text-emerald-800">6.8% (Pass)</p>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Permissible limit: &lt; 8.0%.
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Bio-Safety</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Microbial Testing</h4>
            <p className="text-xs font-bold text-emerald-800">Zero Pathogens</p>
            <span className="text-[10px] text-slate-500 block leading-tight">
              E. coli, Salmonella absent; Total count &lt; 100 CFU/g.
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Toxicology</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Heavy Metals</h4>
            <p className="text-xs font-bold text-emerald-800">&lt; 0.01 ppm</p>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Lead, Cadmium, Mercury well below safety threshold.
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Organic</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Pesticide Residues</h4>
            <p className="text-xs font-bold text-emerald-800">Not Detected</p>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Organochlorines & Phosphates absent.
            </span>
          </div>

        </div>

        {/* Certificate Metadata Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0d5c3a] flex items-center justify-center font-bold">
              CoA
            </div>
            <div>
              <span className="font-bold text-slate-900">Certificate Ref: LAB-2026-88291</span>
              <p className="text-[11px] text-slate-500">
                National AYUSH Quality Testing Lab, Bhopal • Verified Date: 28 July 2026
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#0d5c3a] font-bold text-xs self-start sm:self-auto">
            Quality Status: PASSED
          </span>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 7. BLOCKCHAIN PROOF: IMMUTABLE PROVENANCE RECORD (Screen 7)              */}
      {/* ========================================================================= */}
      <section id="blockchain" className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-4">
        
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-[#0d5c3a]" />
            <span>Audit Trail & Cryptographic Assurance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            Immutable Provenance Record
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Critical provenance events are recorded on a permissioned blockchain to provide a tamper-evident audit history.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Previous Record Hash</th>
                <th className="py-3 px-4">Current Record Hash</th>
                <th className="py-3 px-4">Digital Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">EV-HARV-091</td>
                <td className="py-3 px-4 text-slate-600">14 May 2026 09:30</td>
                <td className="py-3 px-4 text-slate-800 font-sans">FARM-001 (Farmer)</td>
                <td className="py-3 px-4 text-slate-400">0x000000000000...0000</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">0x7a8f9c12b4e6...99e1</td>
                <td className="py-3 px-4 text-slate-500">sig_ed25519_92a</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">EV-AGG-441</td>
                <td className="py-3 px-4 text-slate-600">16 May 2026 14:15</td>
                <td className="py-3 px-4 text-slate-800 font-sans">AGG-1001 (Aggregator)</td>
                <td className="py-3 px-4 text-slate-400">0x7a8f9c12b4e6...99e1</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">0x3f12e89a5c0b...88a4</td>
                <td className="py-3 px-4 text-slate-500">sig_ed25519_10b</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">EV-PROC-881</td>
                <td className="py-3 px-4 text-slate-600">28 Jun 2026 11:00</td>
                <td className="py-3 px-4 text-slate-800 font-sans">PROC-2001 (Processor)</td>
                <td className="py-3 px-4 text-slate-400">0x3f12e89a5c0b...88a4</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">0x91d4e723ac85...44d2</td>
                <td className="py-3 px-4 text-slate-500">sig_ed25519_44c</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">EV-LAB-882</td>
                <td className="py-3 px-4 text-slate-600">28 Jul 2026 16:45</td>
                <td className="py-3 px-4 text-slate-800 font-sans">LAB-04 (Govt Lab)</td>
                <td className="py-3 px-4 text-slate-400">0x91d4e723ac85...44d2</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">0x54e81b99cf02...22f9</td>
                <td className="py-3 px-4 text-slate-500">sig_ed25519_88d</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">EV-MFG-001</td>
                <td className="py-3 px-4 text-slate-600">12 Aug 2026 10:45</td>
                <td className="py-3 px-4 text-slate-800 font-sans">MFG-3001 (Manufacturer)</td>
                <td className="py-3 px-4 text-slate-400">0x54e81b99cf02...22f9</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">0x12c98d45fe77...00b8</td>
                <td className="py-3 px-4 text-slate-500">sig_ed25519_77e</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">EV-DISP-PX82</td>
                <td className="py-3 px-4 text-slate-600">20 Aug 2026 13:20</td>
                <td className="py-3 px-4 text-slate-800 font-sans">DIST-4001 (Distributor)</td>
                <td className="py-3 px-4 text-slate-400">0x12c98d45fe77...00b8</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">0x8a92f1b4c731...491c</td>
                <td className="py-3 px-4 text-slate-500">sig_ed25519_99f</td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 8. INTERACTIVE DEMOS: COUNTERFEIT & RECALL SIMULATIONS (Screens 8 & 9)   */}
      {/* ========================================================================= */}
      <section id="demos" className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Security Features</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            Counterfeit Detection & Recall Intelligence
          </h2>
          <p className="text-xs text-slate-500">
            Simulate real-world security events to see how AyuTrace Nexus protects consumers and manufacturers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* DEMO 1: COUNTERFEIT DETECTION (Screen 8) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 flex flex-col justify-between space-y-5">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0d5c3a]" />
                  <span>Check Package Authenticity</span>
                </h3>
                <span className="font-mono text-xs font-bold text-slate-500">
                  Serial: PX-82K9J
                </span>
              </div>

              {/* Status Box */}
              {!duplicateScanTriggered ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>✓ SERIAL VALID</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700">Single Registered Device</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    This unit has only been verified at its authentic retail destination in Delhi.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-300 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
                      <span>⚠ POSSIBLE COUNTERFEIT</span>
                    </span>
                    <span className="text-[10px] font-mono text-red-700 font-bold">Double-Spend Flagged</span>
                  </div>

                  <p className="text-xs text-red-900 font-semibold">
                    The same serial was detected in geographically inconsistent locations within an impossible time interval.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-red-200">
                    <div className="bg-white/80 p-2 rounded-xl border border-red-200">
                      <span className="text-slate-500 block text-[9px]">Original Scan</span>
                      <p className="font-bold text-slate-900">Delhi — 10:12 AM</p>
                    </div>
                    <div className="bg-white/80 p-2 rounded-xl border border-red-200">
                      <span className="text-red-600 block text-[9px]">Suspicious Scan</span>
                      <p className="font-bold text-red-700">Mumbai — 10:18 AM</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Trigger */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {duplicateScanTriggered ? "Simulation active" : "Test duplicate QR attack"}
              </span>

              {!duplicateScanTriggered ? (
                <button
                  onClick={() => setDuplicateScanTriggered(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simulate Duplicate Scan</span>
                </button>
              ) : (
                <button
                  onClick={() => setDuplicateScanTriggered(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Test</span>
                </button>
              )}
            </div>

          </div>

          {/* DEMO 2: RECALL INTELLIGENCE (Screen 9) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 flex flex-col justify-between space-y-5">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-orange-600" />
                  <span>Trace Product Impact (Recall Intelligence)</span>
                </h3>
                <span className="font-mono text-xs font-bold text-slate-500">
                  Precision Recall
                </span>
              </div>

              {!recallSimulated ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800">
                    End-to-End Targeted Containment
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    If an upstream farm lot is found contaminated, instantly isolate downstream batches in seconds instead of conducting blanket market recalls.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4 text-amber-600 animate-pulse" />
                      <span>⚠ QUALITY ALERT TRIGGERED</span>
                    </span>
                    <span className="text-[10px] font-mono text-amber-800 font-bold">Auto-Isolated</span>
                  </div>

                  {/* Impact Flow */}
                  <div className="text-[10px] font-mono text-slate-700 bg-white/90 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between flex-wrap gap-1">
                    <span>Raw Lot</span>
                    <span>→</span>
                    <span>Processing Lot</span>
                    <span>→</span>
                    <span className="text-amber-800 font-bold">Batch AT-2026-001</span>
                    <span>→</span>
                    <span>Packages</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white p-2 rounded-xl border border-amber-200">
                      <span className="text-[10px] text-slate-400 block">Affected Batches</span>
                      <p className="font-black text-slate-900">3 Batches</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-200">
                      <span className="text-[10px] text-slate-400 block">Identified Units</span>
                      <p className="font-black text-amber-800">8,412 Pkgs</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-200">
                      <span className="text-[10px] text-slate-400 block">Regions</span>
                      <p className="font-black text-slate-900">5 Depots</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Trigger */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {recallSimulated ? "Impact mapped" : "Simulate failed supplier lot"}
              </span>

              {!recallSimulated ? (
                <button
                  onClick={() => setRecallSimulated(true)}
                  className="px-4 py-2 rounded-xl bg-orange-700 hover:bg-orange-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Simulate Failed Lot</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRecallModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0d5c3a] text-white font-bold text-xs hover:bg-emerald-800 transition-colors shadow-2xs"
                  >
                    View Recall Impact
                  </button>
                  <button
                    onClick={() => setRecallSimulated(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 9. MODALS: CERTIFICATE VIEWER & RECALL DOSSIER                           */}
      {/* ========================================================================= */}

      {/* Lab Certificate Modal Viewer */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-emerald-950 text-white px-6 sm:px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                  CoA
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    Certificate of Analysis (CoA)
                  </h3>
                  <p className="text-[10px] text-emerald-300 font-mono">
                    Ref: LAB-2026-88291 • NABL / AYUSH Accredited
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCertModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Testing Authority</span>
                  <p className="font-bold text-slate-900 mt-0.5">National AYUSH Quality Testing Lab</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Sample Specimen</span>
                  <p className="font-bold text-slate-900 mt-0.5">Withania somnifera Extract</p>
                </div>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] border-b border-slate-200">
                    <th className="py-2">Test Parameter</th>
                    <th className="py-2">Method</th>
                    <th className="py-2">Specification</th>
                    <th className="py-2 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 font-bold">Withanolide Assay</td>
                    <td className="py-2.5 text-slate-500">HPLC</td>
                    <td className="py-2.5 text-slate-500">&gt; 2.5% w/w</td>
                    <td className="py-2.5 text-right font-bold text-emerald-700">5.4% (Pass)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Moisture Content</td>
                    <td className="py-2.5 text-slate-500">Karl Fischer</td>
                    <td className="py-2.5 text-slate-500">&lt; 8.0%</td>
                    <td className="py-2.5 text-right font-bold text-emerald-700">6.8% (Pass)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Total Ash</td>
                    <td className="py-2.5 text-slate-500">Gravimetric</td>
                    <td className="py-2.5 text-slate-500">&lt; 5.0%</td>
                    <td className="py-2.5 text-right font-bold text-emerald-700">3.2% (Pass)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Heavy Metals (Pb, Cd, As)</td>
                    <td className="py-2.5 text-slate-500">ICP-MS</td>
                    <td className="py-2.5 text-slate-500">&lt; 10.0 ppm</td>
                    <td className="py-2.5 text-right font-bold text-emerald-700">&lt; 0.01 ppm (Pass)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Total Viable Aerobic Count</td>
                    <td className="py-2.5 text-slate-500">Plate Count</td>
                    <td className="py-2.5 text-slate-500">&lt; 10,000 CFU/g</td>
                    <td className="py-2.5 text-right font-bold text-emerald-700">&lt; 100 CFU/g (Pass)</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center font-bold text-emerald-800">
                CONCLUSION: The batch conforms to official Ayurvedic Pharmacopoeia of India (API) standards.
              </div>
            </div>

            <div className="bg-slate-50 px-6 sm:px-8 py-4 border-t border-slate-200 flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-500">Digitally Signed by Chief Lab Officer</span>
              <button
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0d5c3a] text-white font-bold text-xs"
              >
                Close Certificate
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Recall Impact Dossier Modal */}
      {showRecallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-amber-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-amber-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertOctagon className="w-6 h-6 text-amber-300" />
                <h3 className="text-base font-bold text-white">
                  Precision Recall Dossier #REC-2026-09
                </h3>
              </div>
              <button
                onClick={() => setShowRecallModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-700 font-medium">
                Through AyuTrace Nexus material genealogy, all 8,412 affected packages across 5 regional distributors were instantly locked on-chain within <strong>1.4 seconds</strong> of quality flag initiation.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800">Quarantined Hubs:</span>
                <p className="text-slate-600">
                  1. Varanasi State Depot (1,800 units)<br />
                  2. Lucknow Hub (2,100 units)<br />
                  3. Jaipur Regional (1,400 units)<br />
                  4. Indore Central (1,612 units)<br />
                  5. Delhi North Warehouse (1,500 units)
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center font-bold">
                ✓ Zero Uncontrolled Market Exposure • Zero Brand Recall Panic
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowRecallModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Dismiss Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. FOOTER                                                               */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full bg-emerald-950 text-emerald-100/80 text-[10px] sm:text-xs py-4 px-6 mt-12 border-t border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AyuTrace Nexus • Digital Botanical Passport Verification Prototype</span>
          <span className="font-mono text-[9px] text-emerald-400">
            Permissioned Ledger Node #0912 • Ministry of Ayush
          </span>
        </div>
      </footer>

    </div>
  );
};

export default DigitalPassportPage;
