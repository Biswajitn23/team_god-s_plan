import React from "react";
import { useTTS } from '../../context/TTSContext';
import { Camera, MapPin, Clock, Leaf, Download, QrCode, Sparkles, Sprout, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";
import { X } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useTranslation } from "../../context/useTranslation";
import Webcam from "react-webcam";
import { saveCollection, CollectionRecord } from "../../lib/localStorage";
import { getFirestore, collection as fsCollection, addDoc, serverTimestamp } from "firebase/firestore";
import QRCode from "qrcode";

interface CollectionEvent {
  species: string;
  scientificName: string;
  method: string;
  quantity: number;
  location: string;
  notes: string;
  photos: string[];
}

interface CollectionEventFormProps {
  onSubmit: (data: any) => void;
  className?: string;
}

export const CollectionEventForm: React.FC<CollectionEventFormProps> = ({ onSubmit, className }) => {
   const firestore = getFirestore();
   // Get current user from localStorage (or context if available)
   const storedUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
   const farmer = storedUser ? JSON.parse(storedUser) : null;
  const { ttsEnabled, speak } = useTTS ? useTTS() : { ttsEnabled: false, speak: () => {} };
  const ttsFeedback = (text: string) => { if (ttsEnabled) speak(text); };
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [showQRCode, setShowQRCode] = React.useState(false);
  const [currentBatchId, setCurrentBatchId] = React.useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState("");
  const webcamRef = React.useRef<Webcam>(null);
  const [formData, setFormData] = React.useState<CollectionEvent>({
    species: "",
    scientificName: "",
    method: "",
    quantity: 0,
    location: "",
    notes: "",
    photos: []
  });

  const speciesData = [
    { local: "अश्वगंधा", scientific: "Withania somnifera", english: "Ashwagandha" },
    { local: "ब्राह्मी", scientific: "Bacopa monnieri", english: "Brahmi" },
    { local: "तुलसी", scientific: "Ocimum tenuiflorum", english: "Holy Basil" },
    { local: "नीम", scientific: "Azadirachta indica", english: "Neem" },
    { local: "हल्दी", scientific: "Curcuma longa", english: "Turmeric" },
    { local: "आंवला", scientific: "Phyllanthus emblica", english: "Amla" }
  ];

  const collectionMethods = [
    { value: "leaf", label: t("Leaf Collection") },
    { value: "root", label: t("Root Collection") },
    { value: "whole", label: t("Whole Plant") },
    { value: "bark", label: t("Bark Collection") },
    { value: "flower", label: t("Flower Collection") },
    { value: "fruit", label: t("Fruit Collection") }
  ];

  const toEnglishSpecies = (name: string) => {
    const found = speciesData.find(
      (s) => s.english.toLowerCase() === name.toLowerCase() || s.local === name
    );
    return found?.english || name;
  };

  const generateBatchId = () => {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = String(Date.now()).slice(-4);
    return `COL-${dateStr}-${timeStr}`;
  };

  const getCurrentLocation = () => {
    ttsFeedback(t('Capture Location'));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ 
            ...prev, 
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
          }));
          toast({ title: t("Location Captured") });
        },
        () => {
          toast({ title: t("Location Error"), variant: "destructive" });
        }
      );
    }
  };

  const handleCapture = React.useCallback(() => {
    ttsFeedback(t('Photo Captured'));
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, imageSrc]
      }));
      toast({ title: t("Photo Captured") });
      setIsCameraOpen(false);
    }
  }, [webcamRef, t]);

  const generateQRCode = async (batchId: string, details: { species: string; quantity: number; location: string; created_at?: string }) => {
    try {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const host = isLocal ? `192.168.137.65:${window.location.port || '8080'}` : window.location.host;
      const qrUrl = `${window.location.protocol}//${host}/view/${batchId}`;
      const qrDataUrl = await QRCode.toDataURL(qrUrl, { width: 256, margin: 2 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 340;
        canvas.height = 370;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const qrImage = new Image();
        qrImage.onload = () => {
          ctx.drawImage(qrImage, (canvas.width - qrImage.width) / 2, 10);
          ctx.fillStyle = '#111';
          ctx.font = 'bold 15px Arial';
          ctx.textAlign = 'center';
          let y = qrImage.height + 35;
          ctx.fillText('Batch ID: ' + batchId, canvas.width / 2, y);
          ctx.fillText('Species: ' + details.species, canvas.width / 2, y + 40);
          ctx.fillText('Quantity: ' + details.quantity + 'kg', canvas.width / 2, y + 80);
          setQrCodeDataUrl(canvas.toDataURL('image/png'));
          setCurrentBatchId(batchId);
          setShowQRCode(true);
        };
        qrImage.src = qrDataUrl;
      }
    } catch (e) { console.error(e); }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;
    const a = document.createElement("a");
    a.href = qrCodeDataUrl;
    a.download = `QR_${currentBatchId}.png`;
    a.click();
  };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      ttsFeedback(t('Submit'));
      setIsSubmitting(true);
      try {
         if (!formData.species || !formData.method || !formData.quantity || !formData.location || formData.photos.length === 0) {
            throw new Error(t("Please fill all required fields"));
         }
         const batchId = generateBatchId();
         const englishSpecies = toEnglishSpecies(formData.species);
         const scientific = speciesData.find(s => s.english === englishSpecies)?.scientific || formData.scientificName;
         const collectionData: CollectionRecord = {
            species: englishSpecies,
            scientific_name: scientific,
            method: formData.method,
            quantity: formData.quantity,
            location: formData.location,
            notes: formData.notes,
            photos: formData.photos,
            batch_id: batchId
         };
         // Save to local storage (existing behavior)
         const savedData = saveCollection(collectionData);
         // Save to Firestore (new behavior)
         await addDoc(fsCollection(firestore, "crops"), {
            ...collectionData,
            farmer_id: farmer?.id || null,
            farmer_name: farmer?.name || "Verified Farmer",
            created_at: serverTimestamp(),
         });
         onSubmit({ ...formData, batchId });
         toast({ title: t("success"), description: `Batch ${batchId} registered.` });
         await generateQRCode(batchId, {
            species: formData.species,
            quantity: formData.quantity,
            location: formData.location,
            created_at: savedData.created_at || new Date().toISOString(),
         });
         setFormData({ species: "", scientificName: "", method: "", quantity: 0, location: "", notes: "", photos: [] });
      } catch (error) {
         toast({ title: t("error"), description: error instanceof Error ? error.message : t("errorFail"), variant: "destructive" });
      } finally { setIsSubmitting(false); }
   };

  return (
    <div className={`space-y-10 ${className}`}>
      <div className="flex items-center gap-4 border-b border-emerald-100 pb-8">
         <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
            <Sprout size={24} />
         </div>
         <div>
            <h2 className="text-2xl font-black text-emerald-950 tracking-tight leading-none">{t("Add New Crop")}</h2>
            <p className="text-xs font-bold text-emerald-600/60 uppercase tracking-widest mt-1">Fill in the details below</p>
         </div>
         <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Node Online</span>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 animate-reveal">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Species */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                  <Leaf size={12} className="text-emerald-500" />
                  {t("Crop Name")}*
               </label>
               <select
                  value={formData.species}
                  onChange={(e) => {
                     const val = e.target.value;
                     const selected = speciesData.find(s => s.english === val || s.local === val);
                     setFormData(prev => ({ ...prev, species: selected?.english || val, scientificName: selected?.scientific || "" }));
                     ttsFeedback(selected?.english || val);
                  }}
                  className="block w-full rounded-xl border border-emerald-200 bg-white py-3 px-4 text-emerald-900 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 transition-all"
               >
                  <option value="">{t("Select Species")}</option>
                  {speciesData.map(s => (
                     <option key={s.scientific} value={s.english}>{language === 'hi' ? s.local : s.english}</option>
                  ))}
               </select>
            </div>

            {/* Scientific Name */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  {t("Crop Type")}
               </label>
               <input
                  type="text"
                  readOnly
                  value={formData.scientificName}
                  placeholder="Auto System"
                  className="input-premium bg-slate-50 border-emerald-100 text-emerald-900/40 cursor-not-allowed italic"
               />
            </div>

            {/* Method */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={12} className="text-emerald-500" />
                  {t("How was it harvested?")}*
               </label>
               <select
                  value={formData.method}
                  onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                  className="block w-full rounded-xl border border-emerald-200 bg-white py-3 px-4 text-emerald-900 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 transition-all"
               >
                  <option value="">{t("Select Method")}</option>
                  {collectionMethods.map(m => (
                     <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
               </select>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                  <ArrowRight size={12} className="text-emerald-500" />
                  {t("Weight in KG")}*
               </label>
               <input
                  type="number"
                  inputMode="decimal"
                  value={formData.quantity || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                  className="input-premium bg-emerald-50/30 border-emerald-100"
                  placeholder="0.00"
               />
            </div>
         </div>

         {/* Location */}
         <div className="space-y-3">
            <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
               <MapPin size={12} className="text-emerald-500" />
               {t("Farm Location")}*
            </label>
            <div className="relative group">
               <input
                  type="text"
                  value={formData.location}
                  placeholder="Finding location..."
                  className="input-premium pr-32 bg-emerald-50/30 border-emerald-100"
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
               />
               <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="absolute right-2 top-2 h-10 px-4 bg-emerald-950 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 flex items-center gap-2"
               >
                  <MapPin size={10} /> Get Location
               </button>
            </div>
         </div>

         {/* Photos */}
         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                  <Camera size={12} className="text-emerald-500" />
                  {t("Crop Photos")}*
               </label>
               <span className="text-[10px] font-black text-emerald-500 uppercase px-3 py-1 bg-emerald-50 rounded-lg">
                  {formData.photos.length} Photos taken
               </span>
            </div>
            
            <button
               type="button"
               onClick={() => setIsCameraOpen(true)}
               className="w-full py-8 border-2 border-dashed border-emerald-200 rounded-[2rem] bg-emerald-50/30 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all flex flex-col items-center justify-center gap-3 active:scale-[0.99] group"
            >
               <div className="p-4 bg-white rounded-2xl shadow-lg border border-emerald-100 group-hover:scale-110 transition-transform">
                  <Camera size={32} />
               </div>
               <span className="text-xs font-black uppercase tracking-widest text-emerald-950">Open Camera</span>
            </button>

            {isCameraOpen && (
               <div className="fixed inset-0 z-[100] bg-emerald-950/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-500">
                  <div className="w-full max-w-4xl bg-white rounded-[3rem] overflow-hidden shadow-2xl relative animate-reveal">
                     <button className="absolute top-6 right-6 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black transition-colors" onClick={() => setIsCameraOpen(false)}>
                        <X size={24} />
                     </button>
                     <div className="p-8 border-b border-emerald-50 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-950">Take Photo</span>
                     </div>
                     <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "environment" }}
                        className="w-full h-[50vh] object-cover"
                     />
                     <div className="p-8 bg-slate-50 flex gap-4">
                        <button
                           type="button"
                           onClick={handleCapture}
                           className="flex-1 py-5 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 active:scale-95 transition-all text-sm"
                        >
                           Capture Photo
                        </button>
                        <button
                           type="button"
                           onClick={() => setIsCameraOpen(false)}
                           className="px-10 py-5 rounded-2xl bg-white border border-emerald-100 text-emerald-950 font-black uppercase tracking-widest hover:bg-emerald-50 transition-all text-sm"
                        >
                           Abort
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {formData.photos.length > 0 && (
               <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {formData.photos.map((photo, i) => (
                     <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-emerald-100 shadow-sm relative group">
                        <img src={photo} className="w-full h-full object-cover" />
                        <button 
                           type="button"
                           className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-black text-[9px] uppercase"
                           onClick={() => setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== i) }))}
                        >
                           Discard
                        </button>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Notes */}
         <div className="space-y-3">
            <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
               <ArrowRight size={12} className="text-emerald-500" />
               {t("Additional Notes")}
            </label>
            <textarea
               value={formData.notes}
               onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
               placeholder="Any other details about the crop..."
               className="input-premium h-32 resize-none bg-emerald-50/10 border-emerald-100"
            />
         </div>

         <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 rounded-[2rem] bg-emerald-950 text-white font-black text-lg uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 group"
         >
            {isSubmitting ? (
               <>
                  <Clock className="animate-spin" />
                  SAVING...
               </>
            ) : (
               <>
                  SAVE CROP DETAILS
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
               </>
            )}
         </button>

         {/* QR Result Overlay */}
         {showQRCode && (
            <div className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-500">
               <div className="w-full max-w-md bg-emerald-950 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden animate-reveal">
                  <div className="absolute top-0 right-0 p-10 opacity-5"><QrCode size={200} /></div>
                  
                  <div className="text-center relative z-10">
                     <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                        <ShieldCheck size={32} />
                     </div>
                     <h3 className="text-2xl font-black tracking-tighter mb-2">Saved Successfully</h3>
                     <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-8">Your QR Code is Ready</p>
                     
                     <div className="p-6 bg-white rounded-3xl shadow-2xl mb-8 flex justify-center">
                        <img src={qrCodeDataUrl} alt="QR" className="w-48 h-48" />
                     </div>

                     <div className="space-y-3">
                        <a
                           href={`/view/${currentBatchId}`}
                           target="_blank"
                           rel="noreferrer"
                           className="w-full py-4 rounded-2xl bg-white text-emerald-950 font-black uppercase tracking-widest text-xs hover:bg-emerald-50 transition-all shadow-xl flex items-center justify-center gap-2"
                        >
                           <ExternalLink size={16} /> Open Verification Details (Preview)
                        </a>
                        <button
                           type="button"
                           onClick={downloadQRCode}
                           className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 text-xs flex items-center justify-center gap-2"
                        >
                           <Download size={16} /> Download QR
                        </button>
                        <button
                           type="button"
                           onClick={() => setShowQRCode(false)}
                           className="w-full py-3 rounded-2xl bg-white/10 text-white border border-white/20 font-black uppercase tracking-widest hover:bg-white/20 transition-all text-xs"
                        >
                           Close
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </form>
    </div>
  );
};
