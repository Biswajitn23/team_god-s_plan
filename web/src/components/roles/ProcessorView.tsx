'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import FarmerDetailsDialog from '@/components/FarmerDetailsDialog';
import { useBatches } from '@/hooks/useBatches';
import { 
  PackageCheck, 
  Activity, 
  FileCheck, 
  AlertTriangle,
  ShieldCheck,
  UserCircle,
  QrCode,
  Check,
  X,
  Search,
  Thermometer,
  Clock,
  Layers,
  FileText
} from 'lucide-react';

interface ProcessorViewProps {
  userId: string;
}

const ProcessorView = ({ userId }: ProcessorViewProps) => {
  const { toast } = useToast();
  const { batches, loading } = useBatches('processor', userId);
  const [activeForm, setActiveForm] = useState<'receiveLot' | 'logProcessing' | 'qualityTest' | 'recall' | null>(null);
  
  const [formData, setFormData] = useState({
    lotQR: '',
    receivedWeight: '',
    temperature: '',
    duration: '',
    parentLotId: '',
    testBatchId: '',
    recallBatchId: '',
    recallReason: ''
  });

  const handleReceiveLot = () => {
    if (!formData.lotQR && !formData.receivedWeight) {
      toast({ title: "Input Required", description: "Please enter Lot QR/Code and weight.", variant: "destructive" });
      return;
    }
    toast({ title: "Lot Received", description: "Incoming material recorded in processing ledger." });
    setActiveForm(null);
  };

  const handleLogProcessing = () => {
    if (!formData.temperature || !formData.duration) {
      toast({ title: "Input Required", description: "Please fill in processing temperature and duration.", variant: "destructive" });
      return;
    }
    toast({ title: "Processing Logged", description: "Thermodynamic parameters updated for batch string." });
    setActiveForm(null);
  };

  const handleQualityTest = () => {
    toast({ title: "Quality Affixed", description: "AYUSH premium certification linked to batch." });
    setActiveForm(null);
  };

  const handleInitiateRecall = () => {
    if (!formData.recallBatchId) {
      toast({ title: "Input Required", description: "Please enter Batch ID to recall.", variant: "destructive" });
      return;
    }
    toast({ title: "Recall Initialized", description: `Recall flagged for ${formData.recallBatchId}. System-wide alert broadcasted.`, variant: "destructive" });
    setActiveForm(null);
  };

  const simulateQRScan = () => {
    setFormData({ ...formData, lotQR: 'LOT-' + Math.floor(Math.random() * 1000000) });
    toast({ title: "QR Scan Successful", description: "Lot ID retrieved." });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'received': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'verified': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'recalled': return 'bg-red-100 text-red-800 border-red-200 animate-pulse';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* =================================================================== */}
      {/* 1. HERO REFINEMENT INTELLIGENCE BANNER                              */}
      {/* =================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Refinement Intelligence
            </h2>
            <span className="bg-[#0d5c3a] text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
              LIVE
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-[0.2em]">
            POST-HARVEST INDUSTRIAL PROCESSING PROTOCOL
          </p>
        </div>

        {/* Right Protocol Integrity Pill */}
        <div className="flex items-center gap-3 bg-emerald-50/70 border border-emerald-200/80 px-4 py-2.5 rounded-2xl shadow-sm self-start md:self-auto">
          <div className="text-right">
            <p className="text-[9px] font-bold text-[#0d5c3a] uppercase tracking-wider leading-none">
              PROTOCOL INTEGRITY
            </p>
            <p className="text-xs font-black text-slate-900 mt-0.5">
              L4 SECURE
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#0d5c3a] text-white flex items-center justify-center shadow-sm shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. INDUSTRIAL ACTION 5-COLUMN GRID                                  */}
      {/* =================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Receive Lot */}
        <div 
          onClick={() => setActiveForm('receiveLot')}
          className="bg-white hover:bg-sky-50/40 border border-slate-200/90 hover:border-sky-300 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PackageCheck className="w-6 h-6" strokeWidth={2.3} />
          </div>
          <span className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
            Receive Lot
          </span>
        </div>

        {/* Card 2: Log Process */}
        <div 
          onClick={() => setActiveForm('logProcessing')}
          className="bg-white hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6" strokeWidth={2.3} />
          </div>
          <span className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
            Log Process
          </span>
        </div>

        {/* Card 3: Quality Hub */}
        <div 
          onClick={() => setActiveForm('qualityTest')}
          className="bg-white hover:bg-teal-50/40 border border-slate-200/90 hover:border-teal-300 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileCheck className="w-6 h-6" strokeWidth={2.3} />
          </div>
          <span className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
            Quality Hub
          </span>
        </div>

        {/* Card 4: Recall Protocol */}
        <div 
          onClick={() => setActiveForm('recall')}
          className="bg-white hover:bg-rose-50/40 border border-slate-200/90 hover:border-rose-300 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6" strokeWidth={2.3} />
          </div>
          <span className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
            Recall Protocol
          </span>
        </div>

        {/* Card 5: Partner Sync */}
        <FarmerDetailsDialog>
          <div className="bg-white hover:bg-violet-50/40 border border-slate-200/90 hover:border-violet-300 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group text-center h-full">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCircle className="w-6 h-6" strokeWidth={2.3} />
            </div>
            <span className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
              Partner Sync
            </span>
          </div>
        </FarmerDetailsDialog>

      </div>

      {/* =================================================================== */}
      {/* 3. ACTIVE INDUSTRIAL INVENTORY TABLE                                */}
      {/* =================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
          <div className="w-1.5 h-5 bg-[#0d5c3a] rounded-full" />
          <h3 className="text-base font-bold text-slate-900">
            Active Industrial Inventory
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5">TRACE ID</th>
                <th className="px-5 py-3.5">BOTANICAL STRING</th>
                <th className="px-5 py-3.5">QUANTITY</th>
                <th className="px-5 py-3.5">PROTOCOL STATUS</th>
                <th className="px-5 py-3.5">TIMESTAMP</th>
                <th className="px-5 py-3.5">CONDITION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-medium">
                    Syncing with industrial ledger...
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-slate-400 font-medium">
                    No active refinery strings found.
                  </td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-800">{batch.batch_id}</td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 block">{batch.product_name || 'Herbal Blend'}</span>
                      <span className="text-[10px] text-slate-400 uppercase">{batch.type}</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">{batch.quantity}</td>
                    <td className="px-5 py-4">
                      <Badge className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${getStatusColor(batch.status)}`}>
                        {batch.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{new Date(batch.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4 font-medium text-emerald-700">{batch.metadata?.condition || 'Optimal'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. MODALS / DIALOGS                                                 */}
      {/* =================================================================== */}

      {/* Modal 1: Receive Lot */}
      <Dialog open={activeForm === 'receiveLot'} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="sm:max-w-xl bg-white border border-slate-200 rounded-3xl p-0 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Receive Lot</h3>
                <p className="text-[11px] text-slate-500">Verify incoming consignment weight and QR integrity</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="lotQR" className="text-xs font-bold text-slate-800">Lot QR Code *</Label>
              <div className="flex gap-2 mt-1.5">
                <Input
                  id="lotQR"
                  value={formData.lotQR}
                  onChange={(e) => setFormData({ ...formData, lotQR: e.target.value })}
                  placeholder="Scan or enter lot QR code"
                  className="rounded-xl"
                />
                <Button type="button" onClick={simulateQRScan} className="bg-emerald-50 text-[#0d5c3a] hover:bg-emerald-100 border border-emerald-200 font-bold rounded-xl text-xs">
                  Scan
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="receivedWeight" className="text-xs font-bold text-slate-800">Received Weight (kg) *</Label>
              <Input
                id="receivedWeight"
                type="number"
                step="0.1"
                value={formData.receivedWeight}
                onChange={(e) => setFormData({ ...formData, receivedWeight: e.target.value })}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <Button onClick={handleReceiveLot} className="w-full bg-[#0d5c3a] hover:bg-[#084229] text-white font-bold py-3 rounded-xl shadow-md mt-2">
              Log Received Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Log Processing */}
      <Dialog open={activeForm === 'logProcessing'} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="sm:max-w-xl bg-white border border-slate-200 rounded-3xl p-0 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Log Processing Step</h3>
                <p className="text-[11px] text-slate-500">Record thermodynamic and temporal parameters of refinement</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="parentLotId" className="text-xs font-bold text-slate-800">Parent Lot ID *</Label>
              <select
                id="parentLotId"
                value={formData.parentLotId}
                onChange={(e) => setFormData({ ...formData, parentLotId: e.target.value })}
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="">Select parent lot</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.batch_id}>{batch.batch_id} - {batch.product_name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="temperature" className="text-xs font-bold text-slate-800">Temp (°C) *</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  className="mt-1.5 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-xs font-bold text-slate-800">Duration (hr) *</Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="mt-1.5 rounded-xl"
                />
              </div>
            </div>
            <Button onClick={handleLogProcessing} className="w-full bg-[#0d5c3a] hover:bg-[#084229] text-white font-bold py-3 rounded-xl shadow-md mt-2">
              Submit Processing Record
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Quality Hub */}
      <Dialog open={activeForm === 'qualityTest'} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="sm:max-w-xl bg-white border border-slate-200 rounded-3xl p-0 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Quality Hub Verification</h3>
                <p className="text-[11px] text-slate-500">Attach laboratory test results and AYUSH quality certificates</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="testBatchId" className="text-xs font-bold text-slate-800">Batch ID for Certification *</Label>
              <Input
                id="testBatchId"
                value={formData.testBatchId}
                onChange={(e) => setFormData({ ...formData, testBatchId: e.target.value })}
                placeholder="e.g. BATCH-8821"
                className="mt-1.5 rounded-xl"
              />
            </div>
            <Button onClick={handleQualityTest} className="w-full bg-[#0d5c3a] hover:bg-[#084229] text-white font-bold py-3 rounded-xl shadow-md mt-2">
              Affix AYUSH Certification
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 4: Recall */}
      <Dialog open={activeForm === 'recall'} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="sm:max-w-xl bg-white border border-rose-200 rounded-3xl p-0 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-950">Industrial Recall Protocol</h3>
                <p className="text-[11px] text-rose-700/80">Issue immediate downstream hold on compromised batch strings</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="recallBatchId" className="text-xs font-bold text-slate-800">Target Batch / Lot ID *</Label>
              <Input
                id="recallBatchId"
                value={formData.recallBatchId}
                onChange={(e) => setFormData({ ...formData, recallBatchId: e.target.value })}
                className="mt-1.5 rounded-xl border-rose-200"
              />
            </div>
            <div>
              <Label htmlFor="recallReason" className="text-xs font-bold text-slate-800">Discrepancy / Failure Reason *</Label>
              <textarea
                id="recallReason"
                value={formData.recallReason}
                onChange={(e) => setFormData({ ...formData, recallReason: e.target.value })}
                className="w-full mt-1.5 p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 min-h-[100px]"
                placeholder="Specify laboratory test discrepancies or contamination notes..."
              />
            </div>
            <Button onClick={handleInitiateRecall} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-md mt-2">
              Broadcast System Recall
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ProcessorView;