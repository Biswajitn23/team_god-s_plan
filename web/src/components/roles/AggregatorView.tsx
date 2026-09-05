import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import FarmerDetailsDialog from '@/components/FarmerDetailsDialog';
import CreateBatchForFarmerComponent from '@/components/CreateBatchForFarmerComponent';
import { useBatches } from '@/hooks/useBatches';
import { Plus, PackageCheck, Layers, Truck, UserCircle, AlertTriangle } from 'lucide-react';

interface AggregatorViewProps {
  userId: string;
  onOpenNewBatch?: () => void;
}

const AggregatorView = ({ userId, onOpenNewBatch }: AggregatorViewProps) => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const { batches, loading, createBatch, updateBatch } = useBatches('aggregator', userId);

  const [formData, setFormData] = useState({
    farmerQR: '',
    farmerCode: '',
    scanMethod: 'manual', // 'manual' or 'scan'
    receivedWeight: '',
    conditionPhotos: [] as string[],
    batchQR: '',
    batchId: '',
    batchScanMethod: 'manual',
    batchConditionPhotos: [] as string[],
    lotWeight: '',
    grade: '',
    moistureEstimate: '',
    waybillId: '',
    sealId: '',
    sealPhoto: '',
    driverId: '',
    vehicleNumber: '',
    recallBatchId: '',
    recallReason: ''
  });

  const { toast } = useToast();

  const handleReceiveMaterial = async () => {
    const farmerCode = formData.scanMethod === 'scan' ? formData.farmerQR : formData.farmerCode;
    if (!farmerCode || !formData.receivedWeight) {
      toast({
        title: "Missing Information",
        description: "Please fill in farmer code/QR and weight",
        variant: "destructive"
      });
      return;
    }

    try {
      await createBatch({
        batch_id: `RM${Date.now().toString().slice(-6)}`,
        type: 'raw_material',
        status: 'received',
        quantity: parseFloat(formData.receivedWeight),
        product_name: 'Raw Material',
        farmer_name: farmerCode,
        metadata: {
          condition: 'Good',
          photos: formData.conditionPhotos,
          scanMethod: formData.scanMethod
        }
      });

      setFormData({ 
        ...formData, 
        farmerQR: '', 
        farmerCode: '', 
        receivedWeight: '', 
        conditionPhotos: [] 
      });
      setActiveForm(null);
    } catch (error) {
      console.error('Error receiving material:', error);
    }
  };

  const handleInitiateRecall = () => {
    if (!formData.recallBatchId || !formData.recallReason) {
      toast({
        title: "Missing Information",
        description: "Please fill in batch ID and recall reason",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Recall Initiated",
      description: `Batch ${formData.recallBatchId} has been flagged for recall. Notifications sent.`,
      variant: "destructive"
    });

    setFormData({ ...formData, recallBatchId: '', recallReason: '' });
    setActiveForm(null);
  };

  const simulateQRScan = (field: string) => {
    const mockQR = `QR${Date.now().toString().slice(-6)}`;
    if (field === 'farmer') {
      setFormData({ ...formData, farmerQR: mockQR, scanMethod: 'scan' });
    } else if (field === 'batch') {
      setFormData({ ...formData, batchQR: mockQR, batchScanMethod: 'scan' });
    }
  };

  const handlePhotoUpload = (field: string, files: FileList | null) => {
    if (!files) return;
    
    const photoUrls: string[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        photoUrls.push(`uploaded_${file.name}`);
      }
    });

    if (field === 'condition') {
      setFormData({ ...formData, conditionPhotos: [...formData.conditionPhotos, ...photoUrls] });
    } else if (field === 'batch') {
      setFormData({ ...formData, batchConditionPhotos: [...formData.batchConditionPhotos, ...photoUrls] });
    } else if (field === 'seal') {
      setFormData({ ...formData, sealPhoto: photoUrls[0] || '' });
    }
  };

  const handleCreateLot = async () => {
    if (!formData.lotWeight || !formData.grade) {
      toast({
        title: "Missing Information", 
        description: "Please fill in lot weight and grade",
        variant: "destructive"
      });
      return;
    }

    try {
      await createBatch({
        batch_id: `LOT${Date.now().toString().slice(-6)}`,
        type: 'lot',
        status: 'created',
        quantity: parseFloat(formData.lotWeight),
        product_name: 'Consolidated Lot',
        metadata: {
          grade: formData.grade,
          moistureEstimate: formData.moistureEstimate,
          photos: formData.batchConditionPhotos,
          sourceBatchId: formData.batchScanMethod === 'scan' ? formData.batchQR : formData.batchId
        }
      });

      setFormData({ 
        ...formData, 
        batchQR: '',
        batchId: '',
        lotWeight: '', 
        grade: '', 
        moistureEstimate: '',
        batchConditionPhotos: []
      });
      setActiveForm(null);
    } catch (error) {
      console.error('Error creating lot:', error);
    }
  };

  const handleStartTransport = () => {
    if (!formData.waybillId || !formData.sealId || !formData.vehicleNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in waybill ID, seal ID and vehicle number",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Transport Started",
      description: `Transport initiated with waybill ${formData.waybillId}`,
      variant: "default"
    });

    setFormData({ 
      ...formData, 
      waybillId: '', 
      sealId: '', 
      sealPhoto: '',
      driverId: '', 
      vehicleNumber: '' 
    });
    setActiveForm(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'badge-pending';
      case 'processed': return 'badge-verified';
      default: return 'badge-pending';
    }
  };

  if (activeForm === 'createBatchForFarmer') {
    return (
      <CreateBatchForFarmerComponent
        collectorName="Senior Field Aggregator"
        collectorId={userId}
        onClose={() => setActiveForm(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ------------------------------------------------------------------- */}
      {/* 1. HERO HEADER BANNER                                               */}
      {/* ------------------------------------------------------------------- */}
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-50/50 via-slate-50/40 to-amber-50/30 p-6 sm:p-7 border border-slate-200/70 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Welcome Text */}
        <div className="space-y-2 relative z-10 max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">
            Welcome, <span className="text-[#0d5c3a]">Aggregator</span>
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
            Manage raw material collection and logistics under AyuSetu
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-slate-500">
            <span>Transparent Supply Chain</span>
            <span className="text-slate-300">•</span>
            <span>Authentic Herbs</span>
            <span className="text-slate-300">•</span>
            <span>Stronger Farmers</span>
          </div>
        </div>

        {/* Right Artwork & Heritage Badge */}
        <div className="relative z-10 flex items-center gap-4 self-end md:self-auto">
          {/* Natural Heritage Tagline with Tricolor Bar */}
          <div className="flex flex-col text-right">
            <span className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase leading-tight">NATURAL HERITAGE</span>
            <span className="text-[9px] font-bold text-slate-600 tracking-[0.2em] uppercase leading-tight">HEALTHY INDIA</span>
            <span className="text-[9px] font-bold text-[#0d5c3a] tracking-[0.2em] uppercase leading-tight">STRONGER TOMORROW</span>
            <div className="flex items-center justify-end gap-0.5 mt-1.5 w-12 ml-auto h-1 rounded-full overflow-hidden">
              <span className="w-1/3 h-full bg-[#FF9933]" />
              <span className="w-1/3 h-full bg-slate-300" />
              <span className="w-1/3 h-full bg-[#138808]" />
            </div>
          </div>

          {/* Rashtrapati Bhavan Architecture Sketch */}
          <div className="w-24 h-16 opacity-30 text-[#0d5c3a] hidden sm:block">
            <svg viewBox="0 0 300 150" fill="currentColor" className="w-full h-full">
              <path d="M150 15 C135 15 130 30 130 45 L170 45 C170 30 165 15 150 15 Z M120 45 L180 45 L180 55 L120 55 Z M40 55 L260 55 L260 70 L40 70 Z M50 70 L50 120 L65 120 L65 70 Z M80 70 L80 120 L95 120 L95 70 Z M110 70 L110 120 L125 120 L125 70 Z M140 70 L140 120 L160 120 L160 70 Z M175 70 L175 120 L190 120 L190 70 Z M205 70 L205 120 L220 120 L220 70 Z M235 70 L235 120 L250 120 L250 70 Z M20 120 L280 120 L280 145 L20 145 Z" />
            </svg>
          </div>
        </div>

        {/* Decorative Background Leaf */}
        <div className="absolute right-32 -bottom-6 w-32 h-32 opacity-10 text-[#0d5c3a] pointer-events-none">
          <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
            <path d="M100 20 C60 50 30 110 50 160 C70 140 85 100 100 70 C115 100 130 140 150 160 C170 110 140 50 100 20 Z" />
          </svg>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. 6 ACTION BUTTONS (MATCHING IMAGE 2 EXACTLY)                      */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Button 1: New Farmer Batch */}
        <div 
          onClick={() => {
            if (onOpenNewBatch) {
              onOpenNewBatch();
            } else {
              setActiveForm('createBatchForFarmer');
            }
          }}
          className="bg-white hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-4 sm:p-4.5 flex flex-col justify-between text-left cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group relative"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 shadow-inner">
            <Plus className="w-5 h-5 text-emerald-700" strokeWidth={2.8} />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
              New Farmer Batch
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
              Register collection from farmers
            </p>
          </div>
          <div className="mt-2.5 flex justify-end">
            <span className="text-slate-400 group-hover:text-emerald-700 font-mono text-sm group-hover:translate-x-0.5 transition-all">›</span>
          </div>
        </div>

        {/* Button 2: Receive Material */}
        <div 
          onClick={() => setActiveForm('receive')}
          className="bg-white hover:bg-amber-50/40 border border-slate-200/90 hover:border-amber-300 rounded-2xl p-4 sm:p-4.5 flex flex-col justify-between text-left cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group relative"
        >
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-3 shadow-inner">
            <PackageCheck className="w-5 h-5 text-amber-700" strokeWidth={2.3} />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
              Receive Material
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
              Log received raw material
            </p>
          </div>
          <div className="mt-2.5 flex justify-end">
            <span className="text-slate-400 group-hover:text-amber-700 font-mono text-sm group-hover:translate-x-0.5 transition-all">›</span>
          </div>
        </div>

        {/* Button 3: Create Lot */}
        <div 
          onClick={() => setActiveForm('createLot')}
          className="bg-white hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-4 sm:p-4.5 flex flex-col justify-between text-left cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group relative"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 shadow-inner">
            <Layers className="w-5 h-5 text-emerald-700" strokeWidth={2.3} />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
              Create Lot
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
              Consolidate and create batch lot
            </p>
          </div>
          <div className="mt-2.5 flex justify-end">
            <span className="text-slate-400 group-hover:text-emerald-700 font-mono text-sm group-hover:translate-x-0.5 transition-all">›</span>
          </div>
        </div>

        {/* Button 4: Start Transport */}
        <div 
          onClick={() => setActiveForm('transport')}
          className="bg-white hover:bg-sky-50/40 border border-slate-200/90 hover:border-sky-300 rounded-2xl p-4 sm:p-4.5 flex flex-col justify-between text-left cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group relative"
        >
          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center mb-3 shadow-inner">
            <Truck className="w-5 h-5 text-sky-700" strokeWidth={2.3} />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
              Start Transport
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
              Initiate logistics and shipment
            </p>
          </div>
          <div className="mt-2.5 flex justify-end">
            <span className="text-slate-400 group-hover:text-sky-700 font-mono text-sm group-hover:translate-x-0.5 transition-all">›</span>
          </div>
        </div>

        {/* Button 5: Farmer Details */}
        <FarmerDetailsDialog>
          <div className="bg-white hover:bg-violet-50/40 border border-slate-200/90 hover:border-violet-300 rounded-2xl p-4 sm:p-4.5 flex flex-col justify-between text-left cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group relative h-full">
            <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-800 flex items-center justify-center mb-3 shadow-inner">
              <UserCircle className="w-5 h-5 text-violet-700" strokeWidth={2.3} />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                Farmer Details
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                View and manage farmer info
              </p>
            </div>
            <div className="mt-2.5 flex justify-end">
              <span className="text-slate-400 group-hover:text-violet-700 font-mono text-sm group-hover:translate-x-0.5 transition-all">›</span>
            </div>
          </div>
        </FarmerDetailsDialog>

        {/* Button 6: Initiate Recall */}
        <div 
          onClick={() => setActiveForm('recall')}
          className="bg-white hover:bg-rose-50/40 border border-slate-200/90 hover:border-rose-300 rounded-2xl p-4 sm:p-4.5 flex flex-col justify-between text-left cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group relative"
        >
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center mb-3 shadow-inner">
            <AlertTriangle className="w-5 h-5 text-rose-700" strokeWidth={2.3} />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
              Initiate Recall
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
              Report and manage issues
            </p>
          </div>
          <div className="mt-2.5 flex justify-end">
            <span className="text-slate-400 group-hover:text-rose-700 font-mono text-sm group-hover:translate-x-0.5 transition-all">›</span>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. COLLECTION EVENTS TABLE CONTAINER                                */}
      {/* ------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-sm">
        
        {/* Table Section Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0d5c3a]">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                Collection Events
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Recent collection activities from registered farmers
              </p>
            </div>
          </div>

          <button 
            onClick={() => setActiveForm('createBatchForFarmer')}
            className="text-xs font-bold text-[#0d5c3a] hover:text-emerald-900 flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <span>→</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f0f9f5] border-b border-emerald-100/80 text-[10px] sm:text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">EVENT ID</th>
                <th className="py-3 px-4">FARMER CODE</th>
                <th className="py-3 px-4">WEIGHT (KG)</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">CONDITION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#0d5c3a] border-t-transparent rounded-full animate-spin" />
                      <span>Loading collection records...</span>
                    </div>
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center shadow-inner">
                        <PackageCheck className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-sm text-slate-800">
                          No collection events yet
                        </h4>
                        <p className="text-xs text-slate-500">
                          Start by registering a new farmer batch.
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          if (onOpenNewBatch) {
                            onOpenNewBatch();
                          } else {
                            setActiveForm('createBatchForFarmer');
                          }
                        }}
                        className="mt-2 bg-[#0d5c3a] hover:bg-[#09462b] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={3} />
                        <span>New Farmer Batch</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{batch.batch_id}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{batch.farmer_name || '-'}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{batch.quantity}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${batch.status === 'received' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{new Date(batch.created_at).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{batch.metadata?.condition || 'Good'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Modals */}
      <Dialog open={activeForm === 'receive'} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="sm:max-w-xl bg-white/95 backdrop-blur-2xl border border-emerald-200/60 rounded-[2rem] p-0 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 px-8 py-6 border-b border-emerald-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-emerald-950 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <PackageCheck className="text-emerald-600 w-5 h-5" />
                </div>
                Receive Material
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="p-8">
            <div className="mb-6">
              <Label className="text-sm font-bold text-emerald-950">Input Method</Label>
              <div className="flex space-x-4 mt-3">
                <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                  <input
                    type="radio"
                    className="accent-emerald-600 w-4 h-4"
                    name="scanMethod"
                    value="manual"
                    checked={formData.scanMethod === 'manual'}
                    onChange={(e) => setFormData({...formData, scanMethod: e.target.value, farmerQR: ''})}
                  />
                  <span>Manual Entry</span>
                </label>
                <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                  <input
                    type="radio"
                    className="accent-emerald-600 w-4 h-4"
                    name="scanMethod"
                    value="scan"
                    checked={formData.scanMethod === 'scan'}
                    onChange={(e) => setFormData({...formData, scanMethod: e.target.value, farmerCode: ''})}
                  />
                  <span>QR Scan</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {formData.scanMethod === 'manual' ? (
                <div>
                  <Label htmlFor="farmerCode" className="text-emerald-950 font-bold ml-1">Farmer Code</Label>
                  <Input
                    id="farmerCode"
                    value={formData.farmerCode}
                    onChange={(e) => setFormData({...formData, farmerCode: e.target.value})}
                    placeholder="e.g. FARM-1001"
                    className="mt-1.5 px-4 py-3 h-auto rounded-xl border border-emerald-200/60 shadow-sm"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="farmerQR" className="text-emerald-950 font-bold ml-1">Farmer QR</Label>
                  <div className="flex space-x-3 mt-1.5">
                    <Input
                      id="farmerQR"
                      value={formData.farmerQR}
                      placeholder="QR Result..."
                      className="px-4 py-3 h-auto rounded-xl border border-emerald-200/60 shadow-sm"
                      readOnly
                    />
                    <Button type="button" onClick={() => simulateQRScan('farmer')} className="h-auto px-6 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold shadow-sm">
                      Scan
                    </Button>
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="receivedWeight" className="text-emerald-950 font-bold ml-1">Weight Intake (kg)</Label>
                <Input
                  id="receivedWeight"
                  type="number"
                  step="0.1"
                  value={formData.receivedWeight}
                  onChange={(e) => setFormData({...formData, receivedWeight: e.target.value})}
                  className="mt-1.5 px-4 py-3 h-auto rounded-xl border border-emerald-200/60 shadow-sm"
                  required
                />
              </div>

              <div>
                <Button onClick={handleReceiveMaterial} className="w-full py-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20 mt-4">
                  Commit To Blockchain
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeForm === 'createLot'} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-2xl border border-emerald-200/60 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 px-8 py-6 border-b border-emerald-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-emerald-950 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <Layers className="text-emerald-600 w-5 h-5" />
                </div>
                Create Consolidated Lot
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label className="text-sm font-bold text-emerald-950 ml-1">Input Sequence</Label>
                <div className="flex gap-4 mt-2">
                  <button 
                    onClick={() => setFormData({...formData, batchScanMethod: 'manual', batchQR: ''})}
                    className={`flex-1 py-3 px-4 rounded-xl border text-[10px] font-black tracking-widest transition-all ${formData.batchScanMethod === 'manual' ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white border-emerald-100 text-emerald-900'}`}
                  >
                    MANUAL ENTRY
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, batchScanMethod: 'scan', batchId: ''})}
                    className={`flex-1 py-3 px-4 rounded-xl border text-[10px] font-black tracking-widest transition-all ${formData.batchScanMethod === 'scan' ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white border-emerald-100 text-emerald-900'}`}
                  >
                    QR SCAN
                  </button>
                </div>
              </div>

              {formData.batchScanMethod === 'manual' ? (
                <div>
                  <Label htmlFor="batchId" className="text-emerald-950 font-bold ml-1">Batch ID</Label>
                  <Input
                    id="batchId"
                    value={formData.batchId}
                    onChange={(e) => setFormData({...formData, batchId: e.target.value})}
                    placeholder="e.g. BATCH-1001"
                    className="mt-1.5 h-12 bg-white"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="batchQR" className="text-emerald-950 font-bold ml-1">Scan Result</Label>
                  <div className="flex space-x-2 mt-1.5">
                    <Input
                      id="batchQR"
                      value={formData.batchQR}
                      className="h-12 bg-white font-mono"
                      readOnly
                    />
                    <Button onClick={() => simulateQRScan('batch')} className="h-12 bg-emerald-100 text-emerald-800 font-bold px-6">
                      Scan
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="lotWeight" className="text-emerald-950 font-bold ml-1">Total Weight (kg)</Label>
                <Input
                  id="lotWeight"
                  type="number"
                  value={formData.lotWeight}
                  onChange={(e) => setFormData({...formData, lotWeight: e.target.value})}
                  className="mt-1.5 h-12 bg-white"
                />
              </div>
              
              <div>
                <Label htmlFor="grade" className="text-emerald-950 font-bold ml-1">Botanical Grade</Label>
                <select
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  className="w-full mt-1.5 h-12 rounded-xl border border-emerald-200 px-4 bg-white font-bold text-emerald-950"
                >
                  <option value="">Select grading...</option>
                  <option value="A">Premium (A+)</option>
                  <option value="B">Standard (B)</option>
                  <option value="C">Basic (C)</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="moistureEstimate" className="text-emerald-950 font-bold ml-1">Moisture (%)</Label>
                <Input
                  id="moistureEstimate"
                  type="number"
                  value={formData.moistureEstimate}
                  onChange={(e) => setFormData({...formData, moistureEstimate: e.target.value})}
                  className="mt-1.5 h-12 bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <Button onClick={handleCreateLot} className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs tracking-widest shadow-xl shadow-emerald-600/20 mt-4">
                  GENERATE LOT MANIFEST
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeForm === 'transport'} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-2xl border border-emerald-200/60 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 px-8 py-6 border-b border-emerald-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-emerald-950 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <Truck className="text-emerald-600 w-5 h-5" />
                </div>
                Logistics Initiation
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="waybillId" className="text-emerald-950 font-bold ml-1">Waybill Identifier</Label>
                <Input
                  id="waybillId"
                  value={formData.waybillId}
                  onChange={(e) => setFormData({...formData, waybillId: e.target.value})}
                  placeholder="WB-XXXXXX"
                  className="mt-1.5 h-12 bg-white"
                />
              </div>
              
              <div>
                <Label htmlFor="sealId" className="text-emerald-950 font-bold ml-1">Security Seal ID</Label>
                <Input
                  id="sealId"
                  value={formData.sealId}
                  onChange={(e) => setFormData({...formData, sealId: e.target.value})}
                  placeholder="SEAL-XXXXXX"
                  className="mt-1.5 h-12 bg-white"
                />
              </div>

              <div>
                <Label htmlFor="vehicleNumber" className="text-emerald-950 font-bold ml-1">Vehicle Plate Number</Label>
                <Input
                  id="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                  placeholder="KA-01-XXXX"
                  className="mt-1.5 h-12 bg-white"
                />
              </div>

              <div>
                <Label htmlFor="driverId" className="text-emerald-950 font-bold ml-1">Operator/Driver ID</Label>
                <Input
                  id="driverId"
                  value={formData.driverId}
                  onChange={(e) => setFormData({...formData, driverId: e.target.value})}
                  className="mt-1.5 h-12 bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <Button onClick={handleStartTransport} className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs tracking-widest shadow-xl mt-4">
                  INITIATE FLEET DEPLOYMENT
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeForm === 'recall'} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="sm:max-w-xl bg-white/95 backdrop-blur-2xl border border-red-200/60 rounded-[2rem] p-0 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 px-8 py-6 border-b border-red-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-red-950 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <AlertTriangle className="text-red-600 w-5 h-5" />
                </div>
                Critical Recall Protocol
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="recallBatchId" className="text-red-950 font-bold ml-1">Target Batch ID</Label>
                <Input
                  id="recallBatchId"
                  value={formData.recallBatchId}
                  onChange={(e) => setFormData({...formData, recallBatchId: e.target.value})}
                  className="mt-1.5 h-12 bg-white border-red-100"
                />
              </div>
              <div>
                <Label htmlFor="recallReason" className="text-red-950 font-bold ml-1">Root Cause Analysis</Label>
                <textarea
                  id="recallReason"
                  value={formData.recallReason}
                  onChange={(e) => setFormData({...formData, recallReason: e.target.value})}
                  className="w-full mt-1.5 p-4 rounded-xl border border-red-100 bg-white font-medium text-slate-800 min-h-[120px]"
                  placeholder="Detail the discrepancy..."
                />
              </div>
              <Button onClick={handleInitiateRecall} className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs tracking-widest shadow-xl shadow-red-600/20">
                EXECUTE SYSTEM-WIDE RECALL
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AggregatorView;