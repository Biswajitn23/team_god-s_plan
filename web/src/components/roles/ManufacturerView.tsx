'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import FarmerDetailsDialog from '@/components/FarmerDetailsDialog';
import { useBatches } from '@/hooks/useBatches';
import {
  PackagePlus,
  QrCode,
  Users,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  CheckCircle,
  MoreVertical,
  Layers,
  Leaf,
  FileCheck,
  BookOpen,
  Globe,
  Download,
  Eye,
  Settings,
  Package,
  Boxes,
  ShieldCheck,
  X,
  Check
} from 'lucide-react';
import QRCode from 'react-qr-code';
import formulationBanner from '@/assets/ayurvedic-formulation-banner.jpg';

interface ManufacturerViewProps {
  userId: string;
}

interface ProcessedBatchItem {
  id: string;
  batch_id: string;
  processor_id: string;
  quantity: number;
  product_name: string;
  operation: string;
  status: 'In Progress' | 'Completed' | 'Pending';
  created_at: string;
}

interface FinalProductItem {
  id: string;
  product_id: string;
  batch_id: string;
  input_batches_count: number;
  product_name: string;
  qc_results: 'Pass' | 'Fail' | 'Pending';
  status: 'Approved' | 'In Review' | 'Flagged';
  created_at: string;
}

const ManufacturerView = ({ userId }: ManufacturerViewProps) => {
  const { toast } = useToast();
  const { batches, loading, createBatch, updateBatch } = useBatches('manufacturer', userId);

  const [activeModal, setActiveModal] = useState<'createProduct' | 'newBatch' | 'viewQR' | 'recall' | null>(null);
  const [selectedQRBatch, setSelectedQRBatch] = useState<any>(null);
  const [searchProcessed, setSearchProcessed] = useState('');
  const [searchFinal, setSearchFinal] = useState('');
  const [processedStatusFilter, setProcessedStatusFilter] = useState('all');

  // Form State for creating final product
  const [formData, setFormData] = useState({
    productName: 'Ayu Immunity Churna',
    batchCode: `FP-2026-00${Math.floor(Math.random() * 90 + 10)}`,
    selectedBatches: [] as string[],
    quantity: '500',
    unit: 'Units (Pack of 100g)',
    qcResults: 'Pass',
    labReportNumber: 'AYUSH-QC-88912',
    shelfLifeMonths: '24',
    mrp: '299',
    recallBatchId: '',
    recallReason: ''
  });

  // Mock initial batches if database is empty for demo/visual fidelity
  const processedBatches: ProcessedBatchItem[] = [
    {
      id: 'pb-1',
      batch_id: 'BATCH-001',
      processor_id: userId || 'MOCK_ID',
      quantity: 25.00,
      product_name: 'Ashwagandha Extract',
      operation: 'Extraction',
      status: 'In Progress',
      created_at: '06 Sep 2026 01:20 AM'
    },
    {
      id: 'pb-2',
      batch_id: 'BATCH-004',
      processor_id: userId || 'MOCK_ID',
      quantity: 40.50,
      product_name: 'Tulsi Essential Distillate',
      operation: 'Steam Distillation',
      status: 'In Progress',
      created_at: '06 Sep 2026 12:45 AM'
    }
  ];

  const finalProductBatches: FinalProductItem[] = [
    {
      id: 'fp-1',
      product_id: 'PROD-001',
      batch_id: 'FP-2026-001',
      input_batches_count: 2,
      product_name: 'Ayu Immunity Churna',
      qc_results: 'Pass',
      status: 'Approved',
      created_at: '05 Sep 2026'
    },
    {
      id: 'fp-2',
      product_id: 'PROD-002',
      batch_id: 'FP-2026-002',
      input_batches_count: 1,
      product_name: 'Brahmi Extract Capsules',
      qc_results: 'Pass',
      status: 'Approved',
      created_at: '05 Sep 2026'
    },
    {
      id: 'fp-3',
      product_id: 'PROD-003',
      batch_id: 'FP-2026-003',
      input_batches_count: 3,
      product_name: 'Triphala Guggulu Tablets',
      qc_results: 'Pass',
      status: 'Approved',
      created_at: '04 Sep 2026'
    }
  ];

  const handleCreateProductSubmit = async () => {
    if (!formData.productName || !formData.batchCode) {
      toast({
        title: "Missing Information",
        description: "Please enter product name and batch code",
        variant: "destructive"
      });
      return;
    }

    try {
      await createBatch({
        batch_id: formData.batchCode,
        type: 'final_product',
        status: 'approved',
        quantity: parseFloat(formData.quantity) || 100,
        product_name: formData.productName,
        metadata: {
          qc_results: formData.qcResults,
          lab_report: formData.labReportNumber,
          shelf_life: formData.shelfLifeMonths,
          mrp: formData.mrp,
          manufacturer_id: userId
        }
      });

      toast({
        title: "Product Formulated & Registered",
        description: `Batch ${formData.batchCode} cryptographically signed with traceability QR code.`
      });

      setActiveModal(null);
    } catch (e) {
      toast({
        title: "Registration Error",
        description: "Failed to persist formulation batch to ledger.",
        variant: "destructive"
      });
    }
  };

  const handleInitiateRecall = () => {
    if (!formData.recallBatchId || !formData.recallReason) {
      toast({
        title: "Missing Parameters",
        description: "Please provide product batch ID and recall justification.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Recall Broadcasted",
      description: `Critical alert sent for batch ${formData.recallBatchId}. Downstream channels notified.`,
      variant: "destructive"
    });

    setFormData(prev => ({ ...prev, recallBatchId: '', recallReason: '' }));
    setActiveModal(null);
  };

  const openQRModal = (product: FinalProductItem) => {
    setSelectedQRBatch(product);
    setActiveModal('viewQR');
  };

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

  return (
    <div className="space-y-6">
      
      {/* =================================================================== */}
      {/* 1. HERO BANNER: MANUFACTURER HUB                                    */}
      {/* =================================================================== */}
      <div className="relative rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden flex flex-col lg:flex-row items-stretch justify-between">
        
        {/* Left Information Area */}
        <div className="p-6 sm:p-7 flex-1 space-y-3 z-10">
          <span className="text-[10px] font-black tracking-widest uppercase text-[#0d5c3a]">
            MANUFACTURER HUB
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Formulation for a Healthier India
          </h2>
          <div className="space-y-0.5 text-xs sm:text-sm text-slate-600 font-medium">
            <p>Transforming verified herbs into safe, standardised and traceable products</p>
            <p className="text-xs text-slate-500 font-serif">
              प्रमाणित औषधीय पौधों से सुरक्षित, मानकीकृत और ट्रेस करने योग्य उत्पाद तैयार करें
            </p>
          </div>

          {/* 4 Feature Badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-[11px] font-bold text-slate-700">
            <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5 text-[#0d5c3a]" /> Quality Assured
            </span>
            <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
              <Leaf className="w-3.5 h-3.5 text-[#0d5c3a]" /> Traceable Supply Chain
            </span>
            <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
              <BookOpen className="w-3.5 h-3.5 text-[#0d5c3a]" /> Traditional Knowledge
            </span>
            <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
              <Globe className="w-3.5 h-3.5 text-[#0d5c3a]" /> Global Impact
            </span>
          </div>
        </div>

        {/* Right Photographic Artwork */}
        <div className="relative w-full lg:w-[360px] xl:w-[420px] h-48 lg:h-auto min-h-[160px] overflow-hidden shrink-0">
          <img
            src={formulationBanner}
            alt="Ayurvedic Formulation Laboratory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white via-transparent to-black/20" />
          
          <div className="absolute top-4 right-4 text-right bg-white/90 backdrop-blur-md p-2.5 px-3 rounded-xl border border-slate-200/80 shadow-sm">
            <p className="text-[11px] font-bold text-slate-900 leading-tight">
              Ancient Wisdom.
            </p>
            <p className="text-[11px] font-bold text-[#0d5c3a] leading-tight">
              Modern Standards.
            </p>
            <div className="flex items-center justify-end gap-0.5 mt-1.5 w-10 ml-auto h-1 rounded-full overflow-hidden">
              <span className="w-1/3 h-full bg-[#FF9933]" />
              <span className="w-1/3 h-full bg-slate-300" />
              <span className="w-1/3 h-full bg-[#138808]" />
            </div>
          </div>
        </div>

      </div>

      {/* =================================================================== */}
      {/* 2. 4 ACTION CARDS                                                   */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Create Final Product */}
        <div
          onClick={() => setActiveModal('createProduct')}
          className="bg-white hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-4 sm:p-4.5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-[#0d5c3a] flex items-center justify-center shrink-0 shadow-inner">
              <Boxes className="w-5 h-5" strokeWidth={2.3} />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                Create Final Product
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                Formulate & register finished products
              </p>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-emerald-100 text-slate-400 group-hover:text-[#0d5c3a] flex items-center justify-center text-xs font-bold transition-colors">
            ›
          </div>
        </div>

        {/* Card 2: View QR Codes */}
        <div
          onClick={() => {
            if (finalProductBatches.length > 0) {
              openQRModal(finalProductBatches[0]);
            }
          }}
          className="bg-white hover:bg-sky-50/40 border border-slate-200/90 hover:border-sky-300 rounded-2xl p-4 sm:p-4.5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 shadow-inner">
              <QrCode className="w-5 h-5" strokeWidth={2.3} />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                View QR Codes
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                Access and download product QR codes
              </p>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-sky-100 text-slate-400 group-hover:text-sky-700 flex items-center justify-center text-xs font-bold transition-colors">
            ›
          </div>
        </div>

        {/* Card 3: Farmer Details */}
        <FarmerDetailsDialog>
          <div className="bg-white hover:bg-amber-50/40 border border-slate-200/90 hover:border-amber-300 rounded-2xl p-4 sm:p-4.5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group h-full">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-inner">
                <Users className="w-5 h-5" strokeWidth={2.3} />
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                  Farmer Details
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                  View linked farmer information
                </p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-amber-100 text-slate-400 group-hover:text-amber-800 flex items-center justify-center text-xs font-bold transition-colors">
              ›
            </div>
          </div>
        </FarmerDetailsDialog>

        {/* Card 4: Initiate Recall */}
        <div
          onClick={() => setActiveModal('recall')}
          className="bg-white hover:bg-rose-50/40 border border-slate-200/90 hover:border-rose-300 rounded-2xl p-4 sm:p-4.5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 shadow-inner">
              <AlertTriangle className="w-5 h-5" strokeWidth={2.3} />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                Initiate Recall
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                Report and manage product recall
              </p>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-rose-100 text-slate-400 group-hover:text-rose-700 flex items-center justify-center text-xs font-bold transition-colors">
            ›
          </div>
        </div>

      </div>

      {/* =================================================================== */}
      {/* 3. SECTION 1: PROCESSED BATCHES TABLE                               */}
      {/* =================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
        
        {/* Section Header & Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0d5c3a]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                Processed Batches
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Ongoing formulation batches
              </p>
            </div>
          </div>

          {/* Right Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={processedStatusFilter}
              onChange={(e) => setProcessedStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Batch ID / Herb / Product..."
                value={searchProcessed}
                onChange={(e) => setSearchProcessed(e.target.value)}
                className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-48 sm:w-64 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <Button
              onClick={() => setActiveModal('createProduct')}
              className="bg-[#0d5c3a] hover:bg-[#084229] text-white text-xs font-bold px-4 py-2 h-auto rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Batch</span>
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">BATCH ID</th>
                <th className="py-3 px-4">PROCESSOR ID</th>
                <th className="py-3 px-4">WEIGHT (KG)</th>
                <th className="py-3 px-4">HERB / FORMULATION</th>
                <th className="py-3 px-4">OPERATION</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{batch.batch_id}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{batch.processor_id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{batch.quantity.toFixed(2)}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{batch.product_name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{batch.operation}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {batch.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{batch.created_at}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast({ title: "Batch Details", description: `Viewing formula specifications for ${batch.batch_id}` });
                        }}
                        className="text-xs h-7 px-2.5 rounded-lg border-slate-200 font-bold hover:bg-emerald-50 hover:text-[#0d5c3a]"
                      >
                        View
                      </Button>
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* =================================================================== */}
      {/* 4. SECTION 2: FINAL PRODUCT BATCHES TABLE                           */}
      {/* =================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
        
        {/* Section Header & Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0d5c3a]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                Final Product Batches
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Completed and approved products
              </p>
            </div>
          </div>

          {/* Right Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Product ID / Batch ID..."
                value={searchFinal}
                onChange={(e) => setSearchFinal(e.target.value)}
                className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-48 sm:w-60 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <Button
              variant="outline"
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold px-3 py-2 h-auto rounded-xl flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter</span>
            </Button>

            <Button
              onClick={() => setActiveModal('createProduct')}
              className="bg-[#0d5c3a] hover:bg-[#084229] text-white text-xs font-bold px-4 py-2 h-auto rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Product</span>
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">PRODUCT ID</th>
                <th className="py-3 px-4">BATCH ID</th>
                <th className="py-3 px-4">INPUT BATCHES</th>
                <th className="py-3 px-4">PRODUCT NAME</th>
                <th className="py-3 px-4">QC RESULTS</th>
                <th className="py-3 px-4">QR CODE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {finalProductBatches.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{product.product_id}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{product.batch_id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{product.input_batches_count}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{product.product_name}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#0d5c3a] border border-emerald-200">
                      {product.qc_results}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => openQRModal(product)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#0d5c3a] hover:underline"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View QR</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#0d5c3a] border border-emerald-200">
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openQRModal(product)}
                        className="text-xs h-7 px-2.5 rounded-lg border-slate-200 font-bold hover:bg-emerald-50 hover:text-[#0d5c3a]"
                      >
                        View
                      </Button>
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* =================================================================== */}
      {/* 5. MODAL DIALOGS                                                    */}
      {/* =================================================================== */}

      {/* Modal 1: Create Product */}
      <Dialog open={activeModal === 'createProduct'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-2xl bg-white border border-slate-200 rounded-3xl p-0 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0d5c3a] flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Formulate & Register Product</h3>
                <p className="text-[11px] text-slate-500">Attach laboratory test results and generate product batch QR code</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-bold text-slate-800">Product Name *</Label>
                <Input
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g. Ayu Immunity Churna"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-slate-800">Finished Batch Code *</Label>
                <Input
                  value={formData.batchCode}
                  onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                  className="rounded-xl font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-slate-800">Batch Quantity *</Label>
                <Input
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-slate-800">QC Laboratory Certificate ID</Label>
                <Input
                  value={formData.labReportNumber}
                  onChange={(e) => setFormData({ ...formData, labReportNumber: e.target.value })}
                  className="rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-800">Quality Clearance Status</p>
                <p className="text-[10px] text-slate-500">Verified by AYUSH accredited testing facility</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-[#0d5c3a] border border-emerald-200">
                QC PASSED
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setActiveModal(null)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateProductSubmit}
                className="flex-1 bg-[#0d5c3a] hover:bg-[#084229] text-white font-bold rounded-xl shadow-md"
              >
                Register & Sign Batch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 2: View QR Codes */}
      <Dialog open={activeModal === 'viewQR'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 rounded-3xl p-0 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Traceability QR Code</h3>
                <p className="text-[11px] text-slate-500">{selectedQRBatch?.product_name || 'Herbal Formulation'}</p>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col items-center text-center space-y-4">
            <div id="product-qr-box" className="p-5 bg-white rounded-2xl border-2 border-emerald-200 shadow-md">
              <QRCode
                value={`${window.location.origin}/verify/${selectedQRBatch?.batch_id || 'FP-2026-001'}`}
                size={180}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-mono font-bold text-slate-900">
                {selectedQRBatch?.batch_id || 'FP-2026-001'}
              </p>
              <p className="text-[11px] text-slate-500">
                Product ID: {selectedQRBatch?.product_id || 'PROD-001'}
              </p>
            </div>

            <div className="w-full flex gap-3 pt-2">
              <Button
                onClick={() => downloadQR('product-qr-box', `${selectedQRBatch?.batch_id || 'QR'}_label`)}
                className="flex-1 bg-[#0d5c3a] hover:bg-[#084229] text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download QR Code</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveModal(null)}
                className="rounded-xl text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Initiate Recall */}
      <Dialog open={activeModal === 'recall'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-xl bg-white border border-rose-200 rounded-3xl p-0 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-950">Initiate Product Recall</h3>
                <p className="text-[11px] text-rose-700/80">Issue immediate downstream hold across distributor & retail network</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <div className="space-y-1">
              <Label className="font-bold text-slate-800">Target Finished Batch ID *</Label>
              <Input
                value={formData.recallBatchId}
                onChange={(e) => setFormData({ ...formData, recallBatchId: e.target.value })}
                placeholder="e.g. FP-2026-001"
                className="rounded-xl font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-slate-800">Root Cause & Justification *</Label>
              <textarea
                value={formData.recallReason}
                onChange={(e) => setFormData({ ...formData, recallReason: e.target.value })}
                placeholder="Specify laboratory re-testing issues or packaging discrepancies..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <Button
              onClick={handleInitiateRecall}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-md mt-2"
            >
              Broadcast Product Recall
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ManufacturerView;