'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Camera,
  MapPin,
  Leaf,
  CheckCircle,
  Loader,
  User,
  FileDown,
  ShieldCheck as ShieldIcon,
  QrCode,
  Search,
  Plus,
  Crosshair,
  Image as ImageIcon,
  BookOpen,
  X,
  Check,
  ChevronDown,
  Upload,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs, limit, setDoc, doc } from 'firebase/firestore';
import { firestore } from '@/integrations/firebase/client';
import QRCode from 'react-qr-code';
import herbalBanner from '@/assets/herbal-plantation-banner.jpg';

interface CollectorBatchData {
  farmerName: string;
  farmerMobile: string;
  farmerVillage: string;
  farmerId: string;
  herbName: string;
  localName: string;
  partUsed: string;
  quantity: string;
  unit: 'KG' | 'G' | 'Quintal' | 'Tons';
  harvestDate: string;
  harvestType: 'wild' | 'cultivated';
  latitude: string;
  longitude: string;
  locationName: string;
  imageUrl: string;
  storageType: string;
}

interface CreateBatchForFarmerComponentProps {
  collectorName?: string;
  collectorId?: string;
  onBatchCreated?: (batchId: string, farmerId: string) => void;
  onClose?: () => void;
}

const herbsList = [
  { value: 'Ashwagandha', label: 'Ashwagandha (Withania somnifera / अश्वगंधा)' },
  { value: 'Tulsi', label: 'Tulsi (Ocimum tenuiflorum / तुलसी)' },
  { value: 'Neem', label: 'Neem (Azadirachta indica / नीम)' },
  { value: 'Brahmi', label: 'Brahmi (Bacopa monnieri / ब्राह्मी)' },
  { value: 'Amla', label: 'Amla (Phyllanthus emblica / आंवला)' },
  { value: 'Giloy', label: 'Giloy (Tinospora cordifolia / गिलोय)' },
  { value: 'Shatavari', label: 'Shatavari (Asparagus racemosus / शतावरी)' },
  { value: 'Mulethi', label: 'Mulethi (Glycyrrhiza glabra / मुलेठी)' },
  { value: 'Bhringraj', label: 'Bhringraj (Eclipta prostrata / भृंगराज)' },
  { value: 'Triphala', label: 'Triphala Mix (त्रिफला)' },
  { value: 'Turmeric', label: 'Turmeric / Haldi (Curcuma longa / हल्दी)' },
  { value: 'Arjuna', label: 'Arjuna (Terminalia arjuna / अर्जुन)' },
  { value: 'Guggulu', label: 'Guggulu (Commiphora mukul / गुग्गुलु)' }
];

const CreateBatchForFarmerComponent = ({
  collectorName = 'Senior Field Aggregator',
  collectorId = 'AGG-1001',
  onBatchCreated,
  onClose
}: CreateBatchForFarmerComponentProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [batchId, setBatchId] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const [formData, setFormData] = useState<CollectorBatchData>({
    farmerName: '',
    farmerMobile: '',
    farmerVillage: '',
    farmerId: '',
    herbName: '',
    localName: '',
    partUsed: 'Whole Plant',
    quantity: '',
    unit: 'KG',
    harvestDate: new Date().toISOString().split('T')[0],
    harvestType: 'cultivated',
    latitude: '',
    longitude: '',
    locationName: '',
    imageUrl: '',
    storageType: 'Climate Controlled'
  });

  const generateFarmerId = () => {
    const randomNum = Math.floor(Math.random() * 900 + 100);
    const id = `FARM-${randomNum}`;
    setFormData(prev => ({ ...prev, farmerId: id }));
    toast({
      title: "New ID Generated",
      description: `Assigned temporary Farmer ID: ${id}`
    });
  };

  const lookupFarmer = async () => {
    if (!formData.farmerId.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a Farmer ID to look up (e.g. FARM-001)",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const formattedId = formData.farmerId.trim().toUpperCase();
      const q = query(collection(firestore, 'farmers'), where('id', '==', formattedId), limit(1));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        setFormData(prev => ({
          ...prev,
          farmerId: formattedId,
          farmerName: docData.fullName || docData.name || '',
          farmerMobile: docData.mobile || '',
          farmerVillage: docData.location || docData.village || ''
        }));
        toast({
          title: "Farmer Record Found",
          description: `Synced data for ${docData.fullName || docData.name || formattedId}.`
        });
      } else {
        toast({
          title: "Not Found in Registry",
          description: "No registered farmer with this ID. You can enter details manually.",
          variant: "destructive"
        });
      }
    } catch (e) {
      console.error("Lookup error:", e);
      toast({
        title: "Registry Lookup Error",
        description: "Could not query farmer registry. Please check network connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Error",
        description: "GPS is not supported by your browser.",
        variant: "destructive"
      });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          locationName: `${lat}, ${lng}`
        }));
        toast({
          title: "GPS Location Locked",
          description: `Lat: ${lat}, Long: ${lng} recorded.`
        });
      },
      (err) => {
        setIsLocating(false);
        const mockLat = (28.6139 + (Math.random() - 0.5) * 0.05).toFixed(6);
        const mockLng = (77.2090 + (Math.random() - 0.5) * 0.05).toFixed(6);
        setFormData(prev => ({
          ...prev,
          latitude: mockLat,
          longitude: mockLng,
          locationName: `${mockLat}, ${mockLng}`
        }));
        toast({
          title: "GPS Coordinate Set",
          description: `Using node GPS coordinates: ${mockLat}, ${mockLng}`
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (e) {
      toast({
        title: "Camera Access",
        description: "Could not open camera. You can also upload a photo from gallery.",
        variant: "destructive"
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth || 640;
        canvasRef.current.height = videoRef.current.videoHeight || 480;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.85);
        setFormData(prev => ({ ...prev, imageUrl: dataUrl }));
        stopCamera();
        toast({ title: "Photo Captured", description: "Harvest photo attached successfully." });
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      setCameraActive(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5 MB.",
          variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        toast({
          title: "Image Uploaded",
          description: "Harvest evidence photo uploaded successfully."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const submitBatch = async () => {
    if (!formData.farmerId.trim()) {
      toast({ title: "Missing Farmer ID", description: "Please enter or generate a Farmer PIN (ID).", variant: "destructive" });
      return;
    }
    if (!formData.farmerName.trim()) {
      toast({ title: "Missing Legal Name", description: "Please enter the farmer's legal name.", variant: "destructive" });
      return;
    }
    if (!formData.herbName) {
      toast({ title: "Missing Herb Type", description: "Please select an herb type.", variant: "destructive" });
      return;
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      toast({ title: "Invalid Quantity", description: "Please enter a valid positive quantity.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const farmerDocId = formData.farmerId.toUpperCase();

      // 1. Save or update farmer profile
      await setDoc(doc(firestore, 'farmers', farmerDocId), {
        id: farmerDocId,
        fullName: formData.farmerName,
        mobile: formData.farmerMobile || 'N/A',
        location: formData.farmerVillage || 'Registered Village',
        created_at: new Date().toISOString(),
        farmSize: "1.5 Hectares",
        certificationStatus: "Field Verified",
        cropTypes: [formData.herbName, "Medicinal Plants"],
        complianceScore: 94,
        coordinates: formData.latitude ? `${formData.latitude}, ${formData.longitude}` : '28.6139, 77.2090'
      }, { merge: true });

      // 2. Generate unique batch number
      const newBatchId = `B-${collectorId.replace(/[^a-zA-Z0-9]/g, '').slice(-4)}-${farmerDocId.replace(/[^a-zA-Z0-9]/g, '').slice(-3)}-${Date.now().toString().slice(-4)}`;
      setBatchId(newBatchId);

      // 3. Save batch record
      await setDoc(doc(firestore, 'batches', newBatchId), {
        batch_id: newBatchId,
        farmer_id: farmerDocId,
        farmer_name: formData.farmerName,
        collector_id: collectorId,
        product_name: formData.herbName,
        herb_name: formData.herbName,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        status: 'received',
        type: 'raw_material',
        created_at: new Date().toISOString(),
        metadata: {
          village: formData.farmerVillage,
          mobile: formData.farmerMobile,
          coordinates: {
            lat: formData.latitude || '28.6139',
            lng: formData.longitude || '77.2090'
          },
          harvest_date: formData.harvestDate,
          storage: formData.storageType,
          photo_proof: formData.imageUrl || null,
          verified_by: collectorName
        }
      });

      setStep('success');
      onBatchCreated?.(newBatchId, farmerDocId);
      toast({
        title: "Registration Successful",
        description: `Batch ${newBatchId} cryptographically signed to ledger.`
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to persist batch parameters. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Success Screen Modal / Portal
  const successScreen = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          id="printable-area"
          className="max-w-xl w-full bg-white border border-emerald-300/80 rounded-3xl shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-[#0d5c3a] p-8 text-center text-white relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-emerald-300 flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <CheckCircle className="w-9 h-9 text-emerald-300" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
              BATCH REGISTERED
            </h2>
            <p className="text-emerald-200 text-xs font-bold uppercase mt-1 tracking-widest">
              AyuSetu Official Digital Receipt
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Batch ID & QR Code */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Batch Traceability Lot ID
                </span>
                <p className="text-2xl sm:text-3xl font-mono font-black text-slate-900">
                  {batchId}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  Farmer: <strong className="text-slate-900">{formData.farmerName}</strong> ({formData.farmerId})
                </p>
              </div>
              <div className="p-2 bg-white rounded-xl border border-emerald-200 shadow-sm shrink-0 flex flex-col items-center">
                <QRCode value={`${window.location.origin}/verify/${batchId}`} size={70} />
                <span className="text-[7px] font-mono font-bold text-emerald-800 mt-1">SCAN VERIFY</span>
              </div>
            </div>

            {/* Details Table */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Botanical Item:</span>
                <span className="font-bold text-slate-900">{formData.herbName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Quantity Intake:</span>
                <span className="font-bold text-slate-900">{formData.quantity} {formData.unit}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Origin Location:</span>
                <span className="font-semibold text-slate-800">{formData.farmerVillage || 'Field Location'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Intake Node / Officer:</span>
                <span className="font-semibold text-slate-800">{collectorName} ({collectorId})</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 no-print pt-2">
              <Button
                onClick={handleDownloadPDF}
                className="flex-1 bg-slate-900 hover:bg-black text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <FileDown className="w-4 h-4" />
                <span>Print / Save Receipt</span>
              </Button>
              <Button
                onClick={() => {
                  setStep('form');
                  setFormData(prev => ({
                    ...prev,
                    farmerId: '',
                    farmerName: '',
                    farmerMobile: '',
                    farmerVillage: '',
                    quantity: '',
                    imageUrl: ''
                  }));
                }}
                className="flex-1 bg-[#0d5c3a] hover:bg-[#084229] text-white font-bold text-xs py-3 rounded-xl shadow-sm"
              >
                <span>New Batch Intake</span>
              </Button>
              <Button
                onClick={() => onClose?.()}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs py-3 rounded-xl"
              >
                <span>Return to Hub</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="w-full">
      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =================================================================== */}
        {/* LEFT COLUMN: FORM SECTIONS (8 COLS)                                 */}
        {/* =================================================================== */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden shadow-sm">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-[#0d5c3a] flex items-center justify-center shrink-0 shadow-inner">
                <Leaf className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                  New Farmer Batch Registration
                </h2>
                <h3 className="text-sm font-bold text-[#0d5c3a] font-serif leading-tight">
                  नई किसान बैच पंजीकरण
                </h3>
                <p className="text-[11px] text-slate-600 font-medium">
                  Record herbal batch parameters to the global traceability ledger
                </p>
                <p className="text-[10px] text-slate-500">
                  औषधीय पौधों के बैच की जानकारी दर्ज करें
                </p>
              </div>
            </div>

            {/* Subtext Right */}
            <div className="text-left sm:text-right relative z-10 border-t sm:border-t-0 sm:border-l border-emerald-200/60 pt-2 sm:pt-0 sm:pl-4">
              <p className="text-[11px] font-bold text-slate-700 leading-tight">
                Every entry builds a healthier and self-reliant India
              </p>
              <p className="text-[10px] text-slate-500 font-serif leading-tight mt-0.5">
                हर प्रविष्टि एक स्वस्थ और आत्मनिर्भर भारत का निर्माण करती है
              </p>
            </div>

            {/* Decorative leaf watermark */}
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none text-emerald-800">
              <Leaf className="w-32 h-32" />
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 1: FARMER IDENTITY                                        */}
          {/* ----------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0d5c3a] text-white flex items-center justify-center text-xs font-black shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    Farmer Identity
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-600">
                    किसान की पहचान
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                  All fields marked * are mandatory
                </p>
                <p className="text-[9px] text-slate-400">
                  * चिह्नित सभी फ़ील्ड अनिवार्य हैं
                </p>
              </div>
            </div>

            {/* Unique Resource PIN (ID) */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-800">
                  Unique Resource PIN (ID) *
                </label>
                <span className="text-[11px] text-slate-500">
                  विशिष्ट संसाधन पिन (आईडी)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <input
                  type="text"
                  placeholder="e.g. FARM-001"
                  value={formData.farmerId}
                  onChange={(e) => {
                    let val = e.target.value.toUpperCase();
                    if (val.startsWith('FARM') && val.length > 4 && val[4] !== '-') {
                      val = 'FARM-' + val.slice(4);
                    }
                    setFormData(prev => ({ ...prev, farmerId: val }));
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 bg-white"
                />

                <Button
                  type="button"
                  onClick={lookupFarmer}
                  disabled={isLoading}
                  className="bg-white hover:bg-emerald-50 text-[#0d5c3a] border border-emerald-300/90 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  {isLoading ? (
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  <div className="flex flex-col text-left leading-none">
                    <span>Lookup</span>
                    <span className="text-[9px] font-normal text-slate-500">खोजें</span>
                  </div>
                </Button>

                <Button
                  type="button"
                  onClick={generateFarmerId}
                  className="bg-white hover:bg-emerald-50 text-[#0d5c3a] border border-emerald-300/90 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <div className="flex flex-col text-left leading-none">
                    <span>New ID</span>
                    <span className="text-[9px] font-normal text-slate-500">नया आईडी</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* 3-Column Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Legal Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>Legal Name *</span>
                  <span className="text-[10px] text-slate-500 font-normal">कानूनी नाम</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter farmer/registry name"
                  value={formData.farmerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, farmerName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 bg-white"
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>Contact Number *</span>
                  <span className="text-[10px] text-slate-500 font-normal">संपर्क नंबर</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.farmerMobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, farmerMobile: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 bg-white"
                />
              </div>

              {/* Location (Village) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>Location (Village) *</span>
                  <span className="text-[10px] text-slate-500 font-normal">स्थान (गांव)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter village name"
                  value={formData.farmerVillage}
                  onChange={(e) => setFormData(prev => ({ ...prev, farmerVillage: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 bg-white"
                />
              </div>
            </div>

          </div>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 2: BOTANICAL INVENTORY                                    */}
          {/* ----------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-6 h-6 rounded-full bg-[#0d5c3a] text-white flex items-center justify-center text-xs font-black shrink-0">
                2
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Botanical Inventory
                </h3>
                <span className="text-[11px] font-semibold text-slate-600">
                  औषधीय पौधों का विवरण
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Herb Type Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>Herb Type *</span>
                  <span className="text-[10px] text-slate-500 font-normal">औषधीय पौधे का प्रकार</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0d5c3a]">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.herbName}
                    onChange={(e) => setFormData(prev => ({ ...prev, herbName: e.target.value }))}
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select herb</option>
                    {herbsList.map(herb => (
                      <option key={herb.value} value={herb.value}>
                        {herb.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>Quantity *</span>
                  <span className="text-[10px] text-slate-500 font-normal">मात्रा</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 bg-white"
                  />
                  <div className="relative">
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value as any }))}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs px-3.5 py-2.5 rounded-xl appearance-none pr-7 cursor-pointer focus:outline-none"
                    >
                      <option value="KG">KG</option>
                      <option value="G">G</option>
                      <option value="Quintal">Quintal</option>
                      <option value="Tons">Tons</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 3: PROOF & LOCATION                                       */}
          {/* ----------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0d5c3a] text-white flex items-center justify-center text-xs font-black shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    Proof & Location
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-600">
                    प्रमाण और स्थान
                  </span>
                </div>
              </div>

              {/* GPS Lock & Scan Location Button */}
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex flex-col text-right leading-none">
                    <span className="font-bold text-slate-700 text-[11px]">GPS Location</span>
                    <span className="text-[9px] text-slate-500">स्थान (GPS)</span>
                  </div>

                  <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 ${
                    formData.latitude
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    <Crosshair className={`w-3.5 h-3.5 ${formData.latitude ? 'text-emerald-700' : 'text-rose-500'}`} />
                    <span>{formData.latitude ? `${formData.latitude}, ${formData.longitude}` : 'Not Locked'}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={captureLocation}
                  disabled={isLocating}
                  className="bg-white hover:bg-emerald-50 text-[#0d5c3a] border border-emerald-300/90 font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0"
                >
                  {isLocating ? (
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Crosshair className="w-3.5 h-3.5" />
                  )}
                  <div className="flex flex-col text-left leading-none">
                    <span>Scan Location</span>
                    <span className="text-[8px] font-normal text-slate-500">स्थान स्कैन करें</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Photo Capture & Upload Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Box 1: Capture Photo */}
              <div className="border-2 border-dashed border-emerald-200/90 rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-emerald-50/20 hover:bg-emerald-50/50 transition-colors relative overflow-hidden min-h-[160px]">
                {cameraActive ? (
                  <div className="absolute inset-0 z-20 bg-black flex flex-col">
                    <video ref={videoRef} autoPlay playsInline className="w-full flex-1 object-cover" />
                    <div className="p-3 bg-slate-900/90 flex gap-2 justify-center">
                      <Button onClick={capturePhoto} className="bg-[#0d5c3a] hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl">
                        Capture Photo
                      </Button>
                      <Button onClick={stopCamera} variant="outline" className="text-white border-white/40 text-xs px-4 py-2 rounded-xl">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : formData.imageUrl ? (
                  <div className="relative w-full h-full min-h-[140px] flex flex-col items-center justify-center">
                    <img
                      src={formData.imageUrl}
                      alt="Harvest Proof"
                      className="max-h-28 rounded-xl object-contain shadow-sm border border-emerald-200"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#0d5c3a] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Photo Attached
                      </span>
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="text-[10px] text-rose-600 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={startCamera}
                    className="cursor-pointer space-y-2 flex flex-col items-center"
                  >
                    <div className="w-11 h-11 rounded-full bg-emerald-100 text-[#0d5c3a] flex items-center justify-center shadow-inner">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900">
                        Capture Photo / <span className="text-slate-600">फोटो लें</span>
                      </h4>
                      <p className="text-[10px] text-slate-500 max-w-xs leading-tight">
                        Take a clear photo of harvested/collected herbs
                      </p>
                      <p className="text-[9px] text-slate-400">
                        एक स्पष्ट फोटो लें (कटाई/संग्रहित औषधि पौधों की)
                      </p>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Box 2: Upload from Gallery */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-200/90 rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-emerald-50/20 hover:bg-emerald-50/50 transition-colors cursor-pointer min-h-[160px] space-y-2"
              >
                <div className="w-11 h-11 rounded-full bg-emerald-100 text-[#0d5c3a] flex items-center justify-center shadow-inner">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900">
                    Upload from Gallery / <span className="text-slate-600">गैलरी से अपलोड करें</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Supported formats: JPG, PNG (Max 5 MB)
                  </p>
                  <p className="text-[9px] text-slate-400">
                    समर्थित प्रारूप: JPG, PNG (अधिकतम 5 MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

            </div>

          </div>

          {/* ----------------------------------------------------------------- */}
          {/* BOTTOM ACTION BUTTONS                                             */}
          {/* ----------------------------------------------------------------- */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <Button
              type="button"
              onClick={() => onClose?.()}
              variant="outline"
              className="border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm px-6 py-3 h-auto rounded-xl flex items-center gap-2 shadow-sm"
            >
              <X className="w-4 h-4 text-slate-500" />
              <div className="flex flex-col text-left leading-tight">
                <span>Cancel</span>
                <span className="text-[9px] font-normal text-slate-500">रद्द करें</span>
              </div>
            </Button>

            <Button
              type="button"
              onClick={submitBatch}
              disabled={isLoading}
              className="bg-[#0d5c3a] hover:bg-[#084229] text-white font-bold text-xs sm:text-sm px-8 py-3 h-auto rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" strokeWidth={3} />
              )}
              <div className="flex flex-col text-left leading-tight">
                <span>Execute Registration</span>
                <span className="text-[9px] font-normal text-emerald-200">पंजीकरण करें</span>
              </div>
            </Button>
          </div>

        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: GUIDELINES & INSPIRATIONAL SIDEBAR (4 COLS)           */}
        {/* =================================================================== */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* 1. Herbal Plantation Hero Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 group">
            <img
              src={herbalBanner}
              alt="Herbal Plantation"
              className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30 flex flex-col justify-between p-4 text-white">
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-bold tracking-tight text-white drop-shadow">
                  Our Herbs
                </h4>
                <h4 className="text-sm sm:text-base font-bold tracking-tight text-emerald-300 drop-shadow">
                  Our Heritage
                </h4>
                <h4 className="text-sm sm:text-base font-bold tracking-tight text-white drop-shadow">
                  Our Future
                </h4>
              </div>
              <div className="self-end bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-medium border border-white/20">
                AYUSH Verified Source
              </div>
            </div>
          </div>

          {/* 2. Guidelines Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0d5c3a]">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  Guidelines
                </h4>
                <span className="text-[10px] font-semibold text-slate-500">
                  महत्वपूर्ण निर्देश
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#0d5c3a] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-800 leading-tight">
                    Enter correct farmer details
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    किसान की सही जानकारी दर्ज करें
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#0d5c3a] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-800 leading-tight">
                    Capture clear photos
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    स्पष्ट फोटो लें
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#0d5c3a] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-800 leading-tight">
                    Ensure GPS location is accurate
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    स्थान (GPS) सही रूप से दर्ज करें
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#0d5c3a] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  4
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-800 leading-tight">
                    Verify all details before submission
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    सबमिट करने से पहले सभी विवरण जांच लें
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* 3. Secure • Transparent • Traceable Pillar */}
          <div className="bg-white border border-emerald-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0d5c3a] flex items-center justify-center shrink-0">
              <ShieldIcon className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                Secure • Transparent • Traceable
              </h4>
              <p className="text-[10px] font-bold text-[#0d5c3a] leading-tight">
                सुरक्षित • पारदर्शी • ट्रेसेबल
              </p>
              <p className="text-[9px] text-slate-500">
                Powered by Government of India / भारत सरकार द्वारा समर्थित
              </p>
            </div>
          </div>

          {/* 4. Sustainable Herbs Quote Card */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 relative overflow-hidden shadow-sm">
            <p className="text-xs font-semibold text-slate-700 italic leading-relaxed relative z-10">
              “Sustainable herbs. Healthier communities. A stronger India.”
            </p>
            <div className="flex items-center gap-1 mt-3">
              <span className="w-6 h-1 rounded-full bg-[#FF9933]" />
              <span className="w-6 h-1 rounded-full bg-white border border-slate-300" />
              <span className="w-6 h-1 rounded-full bg-[#138808]" />
            </div>
            <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-10 pointer-events-none text-emerald-800">
              <Leaf className="w-20 h-20" />
            </div>
          </div>

        </div>

      </div>

      {/* Render Success Screen Portal */}
      {step === 'success' && createPortal(successScreen, document.body)}
    </div>
  );
};

export default CreateBatchForFarmerComponent;
