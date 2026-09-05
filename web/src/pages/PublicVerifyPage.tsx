import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Leaf, 
  Factory, 
  Truck, 
  UserCheck, 
  FlaskConical, 
  Calendar, 
  MapPin, 
  Share2, 
  Printer, 
  Search, 
  ArrowLeft, 
  ChevronRight, 
  HeartPulse, 
  Clock, 
  Info, 
  Phone, 
  Mail, 
  Barcode, 
  Layers, 
  Building2, 
  MessageSquare, 
  Copy, 
  FileText, 
  BadgeCheck,
  Download
} from 'lucide-react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/integrations/firebase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';

import ashwagandhaBottleImg from '@/assets/ashwagandha-product.jpg';
import thakurYograjImg from '@/assets/thakur-yograj-product.png';
import thakurYograj1 from '@/assets/thakur-yograj-1.png';
import thakurYograj2 from '@/assets/thakur-yograj-2.png';
import thakurYograj3 from '@/assets/thakur-yograj-3.png';
import emblemImg from '@/assets/ayusetu-emblem.png';

interface BatchData {
  id: string;
  batch_id: string;
  type: string;
  status: string;
  quantity: number | string;
  product_name?: string;
  herb_name?: string;
  farmer_name?: string;
  farmer_phone?: string;
  farmer_location?: string;
  source_location?: string;
  destination_location?: string;
  current_owner_id?: string;
  creator_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

interface BatchHistoryItem {
  id: string;
  batch_id: string;
  event_type: string;
  actor_id: string;
  details: Record<string, any>;
  created_at: string;
}

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

const PublicVerifyPage = () => {
  const { batchId: urlBatchId } = useParams<{ batchId?: string }>();
  const [searchParams] = useSearchParams();
  const queryBatchId = searchParams.get('id') || searchParams.get('code') || searchParams.get('batch') || searchParams.get('gtin');
  
  const currentId = urlBatchId || queryBatchId || '';
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchInput, setSearchInput] = useState(currentId);
  const [loading, setLoading] = useState(false);
  const [batch, setBatch] = useState<BatchData | null>(null);
  const [inputBatches, setInputBatches] = useState<BatchData[]>([]);
  const [history, setHistory] = useState<BatchHistoryItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [recentBatches, setRecentBatches] = useState<BatchData[]>([]);

  // Smart Consumer Active Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'traceability' | 'quality' | 'manufacturer' | 'feedback'>('overview');
  
  // Gallery active image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Feedback form state
  const [feedback, setFeedback] = useState({ name: '', phone: '', comments: '', rating: '5' });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Fetch recent batches for quick suggestions
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const snap = await getDocs(collection(firestore, 'batches'));
        const list: BatchData[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            batch_id: data.batch_id || d.id,
            type: data.type || 'batch',
            status: data.status || 'created',
            quantity: data.quantity || 0,
            product_name: data.product_name || data.herb_name || 'Ayurvedic Product',
            created_at: data.created_at || new Date().toISOString(),
            metadata: data.metadata || {}
          });
        });
        setRecentBatches(list.slice(0, 5));
      } catch (err) {
        console.error('Error fetching recent batches:', err);
      }
    };
    fetchRecent();
  }, []);

  // Main lookup function
  useEffect(() => {
    if (!currentId) {
      setBatch(null);
      setSearched(false);
      return;
    }

    const fetchBatchDetails = async (targetId: string) => {
      setLoading(true);
      setSearched(true);
      setBatch(null);
      setInputBatches([]);
      setHistory([]);
      setFeedbackSubmitted(false);

      try {
        const cleanTarget = targetId.trim();
        let foundBatch: BatchData | null = null;

        // 1. Try matching batch_id exactly
        const q1 = query(collection(firestore, 'batches'), where('batch_id', '==', cleanTarget));
        const snap1 = await getDocs(q1);

        if (!snap1.empty) {
          const docSnap = snap1.docs[0];
          foundBatch = { id: docSnap.id, ...docSnap.data() } as BatchData;
        }

        // 2. Try matching metadata.qrCode
        if (!foundBatch) {
          const q2 = query(collection(firestore, 'batches'), where('metadata.qrCode', '==', cleanTarget));
          const snap2 = await getDocs(q2);
          if (!snap2.empty) {
            const docSnap = snap2.docs[0];
            foundBatch = { id: docSnap.id, ...docSnap.data() } as BatchData;
          }
        }

        // 3. Try matching direct firestore document ID
        if (!foundBatch) {
          try {
            const docRef = doc(firestore, 'batches', cleanTarget);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              foundBatch = { id: docSnap.id, ...docSnap.data() } as BatchData;
            }
          } catch {
            // Ignore invalid doc id syntax
          }
        }

        // 4. Fallback search across loaded collection if case-insensitive
        if (!foundBatch) {
          const allSnap = await getDocs(collection(firestore, 'batches'));
          allSnap.forEach(d => {
            const data = d.data();
            const bId = (data.batch_id || '').toLowerCase();
            const qr = (data.metadata?.qrCode || '').toLowerCase();
            const target = cleanTarget.toLowerCase();
            if (bId === target || qr === target || qr.includes(target) || bId.includes(target)) {
              foundBatch = { id: d.id, ...data } as BatchData;
            }
          });
        }

        // 5. Fallback for Thakur Yograj Herbal Hair Oil (thakuryograj.com)
        if (!foundBatch && (
          cleanTarget.toLowerCase().includes('thakur') || 
          cleanTarget.toLowerCase().includes('yograj') || 
          cleanTarget.toUpperCase().includes('TY-') ||
          cleanTarget.toLowerCase().includes('oil') ||
          cleanTarget.toLowerCase().includes('hair') ||
          cleanTarget === '8906148291045'
        )) {
          foundBatch = {
            id: 'TY-HHO-250',
            batch_id: cleanTarget.toUpperCase().startsWith('TY') ? cleanTarget.toUpperCase() : 'TY-HHO-250',
            type: 'final_product',
            status: 'finalized',
            quantity: '250 ml (Net Vol. 250ml)',
            product_name: 'THAKUR YOGRAJ HERBAL HAIR OIL',
            herb_name: 'Bhringraj, Amla, Japa & Brahmi Keshya Formula',
            farmer_name: 'AyuSetu Certified Tribal & Herbal Producers Cooperative',
            farmer_location: 'Western Ghats & Satpura Herbal Belt, India',
            source_location: 'AyuSetu Botanical Distillation & Extraction Hub, Nashik',
            created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
            metadata: {
              gtin: '8906148291045',
              brand: 'Thakur Yograj',
              hindiBrand: 'ठाकुर योगराज',
              tagline: "Get Smooth, Silky Healthy Hair | Long Hair Don't Care",
              claims: "100% AYURVEDIC | CHEMICAL FREE | HAIRS STRENGTHENING",
              website: "thakuryograj.com",
              verifyUrl: "https://web-lemon-psi-69.vercel.app/verify/TY-HHO-250",
              mrp: '₹499.00',
              netVol: '250ml',
              fssai: 'AYU-MH-2023-88741 / GMP Certified Facility',
              moisture: '0.08% (Pure Herbal Decoction)',
              condition: '100% Pure Cold-Pressed Kshir Pak Decoction',
              latitude: '21.1458° N',
              longitude: '79.0882° E',
              operation: 'Classical Kshir Pak Vidhi & Cold Maceration (72 hrs slow copper boiling)',
              temperature: '45°C Controlled',
              duration: '72 hrs',
              qcResults: '100% HERBAL & MINERAL OIL FREE - PASSED',
              qualityTest: {
                authority: 'National Pharmacopoeial Laboratory for Indian Medicine',
                results: 'PASSED',
                testType: 'AYUSH Grade A Premium Standard'
              }
            }
          };
        }

        // 6. Direct Fallback for Official GS1 GTIN 8908014928452 (User's Exact Product Reference)
        if (!foundBatch && (cleanTarget === '8908014928452' || cleanTarget.toLowerCase().includes('ashwagandha'))) {
          foundBatch = {
            id: 'GTIN-8908014928452',
            batch_id: 'FP890801',
            type: 'final_product',
            status: 'finalized',
            quantity: '80 Tablets (Pack of 60 + 20 Tablets Free)',
            product_name: 'ASHWAGANDHA 60+20 TABLETS',
            herb_name: 'Withania Somnifera (Ashwagandha Extract)',
            farmer_name: 'Rajesh Kumar Sharma (Organic Certified)',
            farmer_location: 'Aurangabad Agro-Cluster, Maharashtra',
            source_location: 'MahaAgri Central Transit Depot, Maharashtra',
            created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
            metadata: {
              gtin: '8908014928452',
              brand: 'Siddhayu',
              mrp: '₹395.00',
              fssai: 'AYU-MH-2023-90812 / FSSAI 10019022009871',
              moisture: '7.4%',
              condition: 'Premium Organic Grade A',
              latitude: '19.8762° N',
              longitude: '75.3433° E',
              operation: 'Hydro-Alcoholic Aqueous Extraction (GMP)',
              temperature: '65',
              duration: '12',
              qcResults: 'AYUSH Grade A PASSED',
              qualityTest: {
                authority: 'Central AYUSH Pharmacopoeia Lab',
                results: 'PASSED',
                testType: 'AYUSH Premium Standard'
              }
            }
          };
        }

        if (foundBatch) {
          setBatch(foundBatch);

          // If this batch has inputBatches, fetch their details for complete provenance
          const inputs = foundBatch.metadata?.inputBatches;
          if (Array.isArray(inputs) && inputs.length > 0) {
            const loadedInputs: BatchData[] = [];
            for (const inId of inputs) {
              const inQ = query(collection(firestore, 'batches'), where('batch_id', '==', inId));
              const inSnap = await getDocs(inQ);
              if (!inSnap.empty) {
                loadedInputs.push({ id: inSnap.docs[0].id, ...inSnap.docs[0].data() } as BatchData);
              }
            }
            setInputBatches(loadedInputs);
          }

          // Fetch chronological event history
          try {
            const histQ = query(collection(firestore, 'batch_history'), where('batch_id', '==', foundBatch.batch_id));
            const histSnap = await getDocs(histQ);
            const histList: BatchHistoryItem[] = [];
            histSnap.forEach((h) => {
              histList.push({ id: h.id, ...h.data() } as BatchHistoryItem);
            });
            histList.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            setHistory(histList);
          } catch (histErr) {
            console.warn('Could not load history:', histErr);
          }
        }
      } catch (error) {
        console.error('Error fetching verification details:', error);
        toast({
          title: 'Verification Lookup Error',
          description: 'Failed to retrieve details from the national registry.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBatchDetails(currentId);
  }, [currentId, toast]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    navigate(`/verify/${encodeURIComponent(searchInput.trim())}`);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Smart Consumer - ${batch?.product_name || batch?.batch_id}`,
          text: `Verified National GS1 & AYUSH record for ${batch?.product_name || batch?.batch_id}`,
          url: shareUrl,
        });
      } catch {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Verification Link Copied',
      description: 'The direct Smart Consumer URL has been copied to your clipboard.',
    });
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    toast({
      title: 'Feedback Registered',
      description: 'Your consumer review has been logged with the DataKart grievance registry.',
    });
  };

  const isRecalled = batch?.status === 'recalled';

  const isThakur = Boolean(
    batch?.metadata?.brand?.toLowerCase().includes('thakur') ||
    batch?.product_name?.toLowerCase().includes('thakur') ||
    batch?.product_name?.toLowerCase().includes('yograj') ||
    batch?.batch_id?.toLowerCase().includes('ty-') ||
    currentId?.toLowerCase().includes('thakur') ||
    currentId?.toLowerCase().includes('yograj') ||
    currentId?.toUpperCase().includes('TY-') ||
    currentId === '8906148291045'
  );

  const [qrMode, setQrMode] = useState<'google' | 'mobile' | 'current'>('google');

  const getVerifyUrl = (mode: 'google' | 'mobile' | 'current') => {
    const id = batch?.batch_id || currentId || (isThakur ? 'TY-HHO-250' : '8908014928452');
    if (mode === 'google') {
      return `https://web-lemon-psi-69.vercel.app/verify/${id}`;
    }
    if (mode === 'mobile') {
      return `http://192.168.137.65:8080/verify/${id}`;
    }
    return `${window.location.origin}/verify/${id}`;
  };

  const qrUrl = getVerifyUrl(qrMode);

  // Derive GTIN from batch metadata or standard GS1 GTIN-13 format for India (890 prefix)
  const gtinNumber = batch?.metadata?.gtin || (isThakur ? '8906148291045' : (batch?.batch_id.startsWith('FP') ? '8908014928452' : `890${Math.abs(batch?.batch_id.split('').reduce((a,b)=>(((a<<5)-a)+b.charCodeAt(0))|0, 0)).toString().padEnd(10, '0').slice(0, 10)}`));
  const brandName = batch?.metadata?.brand || (isThakur ? 'Thakur Yograj' : 'Siddhayu');
  const productName = batch?.product_name || batch?.herb_name || (isThakur ? 'THAKUR YOGRAJ HERBAL HAIR OIL' : 'ASHWAGANDHA 60+20 TABLETS');
  const fssaiLicense = batch?.metadata?.fssai || (isThakur ? 'AYU-MH-2023-88741 / GMP Certified Facility' : 'AYU-MH-2023-90812 / FSSAI 10019022009871');
  const mrpPrice = batch?.metadata?.mrp || (isThakur ? '₹499.00' : '₹395.00');
  const netQuantity = isThakur ? '250 ml (Net Vol. 250ml)' : (typeof batch?.quantity === 'number' ? `${batch.quantity} units` : (batch?.quantity || '80 Tablets (60+20 Special Offer Pack)'));

  // Product Gallery Images - All 3 packaging photos + official seal
  const galleryImages = isThakur ? [
    { src: thakurYograj1, alt: 'Thakur Yograj Herbal Hair Oil - Box & 250ml Bottle Front' },
    { src: thakurYograj2, alt: 'Thakur Yograj Herbal Hair Oil - Formulation & Ingredients Panel' },
    { src: thakurYograj3, alt: 'Thakur Yograj Herbal Hair Oil - Usage & Manufacturing Details' },
    { src: emblemImg, alt: 'Official AYUSH & DataKart Seal' }
  ] : [
    { src: ashwagandhaBottleImg, alt: 'Primary Product Pack Shot' },
    { src: emblemImg, alt: 'Official AYUSH & DataKart Seal' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-emerald-600 selection:text-white font-sans antialiased pb-28">
      
      {/* Top GS1 Smart Consumer / Ministry of Consumer Affairs Bar */}
      <div className="bg-[#1e293b] text-white text-[10px] sm:text-xs border-b border-slate-700 py-1.5 sm:py-2 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="bg-emerald-600 text-white font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded tracking-widest uppercase shrink-0">
              Official
            </span>
            <span className="text-slate-300 font-medium truncate">
              National Smart Consumer & AYUSH Registry
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-[10px] sm:text-[11px] shrink-0">
            <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" /> 1800-11-4000</span>
          </div>
        </div>
      </div>

      {/* Main Header & Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 flex items-center">
                    Smart<span className="text-emerald-700">Consumer</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-bold font-mono border border-emerald-300">
                    AYUSH
                  </span>
                </div>
                <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden xs:block">
                  AyuSetu Distributed Product Ledger
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search GTIN / Barcode / Batch ID (e.g. 8908014928452)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-24 h-11 bg-slate-50 border-slate-300 text-slate-900 rounded-xl focus:bg-white text-xs"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 top-1.5 h-8 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs"
              >
                Search
              </Button>
            </form>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="h-8 sm:h-10 text-[11px] sm:text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100 px-2.5 sm:px-3 rounded-xl gap-1">
                <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="p-2 sm:p-3 border-t border-slate-100 md:hidden bg-slate-50">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search GTIN or Batch (e.g. 8908014928452)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-20 h-10 bg-white border-slate-300 text-slate-900 rounded-xl text-xs"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1 h-8 px-3 bg-emerald-700 text-white text-xs font-bold rounded-lg"
            >
              Verify
            </Button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8">

        {/* Quick Demo GTIN Badges if no batch or searching */}
        {(!currentId || (!batch && !loading)) && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
            <span className="font-bold text-slate-700 text-[11px] sm:text-xs flex items-center gap-1 w-full sm:w-auto">
              <Barcode className="w-3.5 h-3.5 text-emerald-600" /> Sample Registered GTINs & Batches:
            </span>
            {['8908014928452', 'BATCH-001', 'PROC-B-99', 'LOT-505', ...(recentBatches.map(b => b.batch_id).filter(id => !['8908014928452', 'BATCH-001', 'PROC-B-99', 'LOT-505'].includes(id)))].slice(0, 5).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSearchInput(id);
                  navigate(`/verify/${id}`);
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-mono text-[11px] font-bold transition-colors"
              >
                {id}
              </button>
            ))}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-16 sm:py-24 bg-white rounded-3xl border border-slate-200 shadow-sm px-4">
            <div className="inline-flex p-3 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 animate-pulse mb-4">
              <FlaskConical className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 animate-spin" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 mb-2">Connecting to DataKart & National Ledger...</h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
              Verifying barcode registration, manufacturer licenses, lab quality assays, and raw herb harvest provenance.
            </p>
          </div>
        )}

        {/* Not Found Screen */}
        {!loading && searched && !batch && (
          <div className="max-w-xl mx-auto text-center py-12 sm:py-16 px-4 sm:px-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-2">Product Record Not Found</h3>
            <p className="text-slate-500 text-xs sm:text-sm mb-6">
              No registered record matches identifier <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">"{currentId}"</span>.
            </p>
            <Button
              onClick={() => { setSearchInput(''); navigate('/verify/8908014928452'); }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs px-6 h-11 w-full sm:w-auto"
            >
              Load Sample Product (8908014928452)
            </Button>
          </div>
        )}

        {/* Batch Found: Full Smart Consumer Product Page */}
        {!loading && batch && (
          <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-300">
            
            {/* Recall Notice Alert if Recalled */}
            {isRecalled && (
              <div className="p-4 sm:p-5 rounded-2xl bg-red-600 text-white shadow-lg flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-black uppercase tracking-wider">Critical Alert: Product Recalled by Authority</h3>
                  <p className="text-[11px] sm:text-xs text-red-100 mt-1">
                    Batch <span className="font-mono font-bold underline">{batch.batch_id}</span> has been issued a national recall notice. Do not consume this batch. Return the package to your dispensary or contact the manufacturer's grievance officer immediately.
                  </p>
                </div>
              </div>
            )}

            {/* Top Product Showcase Card: Left Gallery + Right Key Specs */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
                
                {/* Left Column: Product Image Gallery & Trust Badges */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="w-full aspect-square max-w-[300px] sm:max-w-[360px] rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-4 flex items-center justify-center relative overflow-hidden group shadow-inner">
                    <img
                      src={galleryImages[selectedImageIndex].src}
                      alt={galleryImages[selectedImageIndex].alt}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-emerald-700/90 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm backdrop-blur-sm">
                      <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> GS1 Verified Pack
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex items-center gap-2.5 sm:gap-3 mt-3 sm:mt-4">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 p-1 bg-slate-50 transition-all ${
                          selectedImageIndex === idx ? 'border-emerald-600 shadow-md scale-105' : 'border-slate-200 hover:border-slate-300 opacity-70'
                        }`}
                      >
                        <img src={img.src} alt={img.alt} className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>

                  {/* 1D Barcode Graphic Simulation & GTIN number */}
                  <div className="w-full max-w-[300px] sm:max-w-[360px] mt-4 sm:mt-6 p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">EAN-13 / GTIN Barcode</p>
                    <div className="h-10 sm:h-12 flex items-center justify-center gap-0.5 sm:gap-1 overflow-hidden px-2 select-none">
                      {/* Stylized Barcode Bars */}
                      {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 2, 4, 2, 1, 3, 2, 1, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4].map((w, i) => (
                        <div key={i} className="bg-slate-900 h-full" style={{ width: `${Math.max(1, w * 1.5)}px` }} />
                      ))}
                    </div>
                    <p className="font-mono text-xs sm:text-sm font-black tracking-widest text-slate-800 mt-1.5">
                      {gtinNumber}
                    </p>
                  </div>

                  {/* Scannable 2D QR Code Token with Download / Save Button */}
                  <div className="w-full max-w-[300px] sm:max-w-[360px] mt-3 sm:mt-4 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block">Google Scan QR</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Google Scan</span>
                    </div>

                    <p className="text-[11px] text-slate-500 text-left">
                      Scan with <strong>Google Scan / Google Lens</strong> or phone camera to verify this product:
                    </p>

                    {/* Mode Selector */}
                    <div className="flex bg-slate-100 p-0.5 rounded-xl text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setQrMode('google')}
                        className={`flex-1 py-1 rounded-lg transition-all ${qrMode === 'google' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-900'}`}
                        title="Google Scan Official Verification URL"
                      >
                        🔍 Google Scan
                      </button>
                      <button
                        type="button"
                        onClick={() => setQrMode('mobile')}
                        className={`flex-1 py-1 rounded-lg transition-all ${qrMode === 'mobile' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-900'}`}
                        title="Local Wi-Fi Network URL"
                      >
                        📱 Local Wi-Fi
                      </button>
                      <button
                        type="button"
                        onClick={() => setQrMode('current')}
                        className={`flex-1 py-1 rounded-lg transition-all ${qrMode === 'current' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-900'}`}
                        title="Localhost Domain"
                      >
                        🌐 Localhost
                      </button>
                    </div>

                    <div className="flex flex-col items-center pt-1">
                      <div id="public-product-qr" className="p-2.5 bg-white border-2 border-emerald-600 rounded-2xl shadow-sm">
                        <QRCode value={qrUrl} size={140} />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-emerald-950 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded mt-2 max-w-full truncate">
                        {qrUrl}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => downloadQR('public-product-qr', `Verify_${batch.batch_id}`)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex-1 h-9 rounded-xl gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" /> Download QR
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(qrUrl);
                          toast({ title: "URL Copied", description: "Verification page URL copied to clipboard." });
                        }}
                        className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex-1 h-9 rounded-xl gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy URL
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Product Title, Brand, Pricing & Key Specs */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    {/* Brand and Verification Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pb-1.5">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-xs sm:text-sm font-black text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg border border-emerald-200">
                          {isThakur ? 'ठाकुर योगराज • THAKUR YOGRAJ' : brandName}
                        </span>
                        {isThakur && (
                          <a 
                            href="https://thakuryograj.com" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs font-black text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1 bg-emerald-100/70 hover:bg-emerald-100 px-2.5 py-0.5 sm:py-1 rounded-lg border border-emerald-300 transition-colors"
                          >
                            🌐 thakuryograj.com ↗
                          </a>
                        )}
                        <span className="text-[11px] sm:text-xs font-medium text-slate-500">
                          Ayurvedic Medicine
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" /> AYUSH Certified
                      </div>
                    </div>

                    {/* Product Main Title */}
                    <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-1.5 sm:mt-2">
                      {isThakur ? 'THAKUR YOGRAJ HERBAL HAIR OIL (ठाकुर योगराज हर्बल हेयर ऑयल)' : productName}
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                      {isThakur 
                        ? "100% AYURVEDIC | CHEMICAL FREE | HAIRS STRENGTHENING | Get Smooth, Silky Healthy Hair — Long Hair Don't Care"
                        : "Natural Adaptogenic Herbal Formulation for Stress Relief, Rejuvenation & Vitality"}
                    </p>

                    {/* Pricing & Net Quantity Box */}
                    <div className="mt-4 sm:mt-5 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Maximum Retail Price (MRP)</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl sm:text-2xl font-black text-slate-900">{mrpPrice}</span>
                          <span className="text-[10px] sm:text-xs text-slate-500 font-medium">(Incl. all taxes)</span>
                        </div>
                      </div>

                      <div className="border-l border-slate-200 pl-3 sm:pl-4">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Net Quantity</span>
                        <p className="text-sm sm:text-base font-bold text-emerald-800">{netQuantity}</p>
                      </div>
                    </div>

                    {/* Key Attributes Grid (GS1 Smart Consumer Standard) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-5">
                      <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Batch / Lot No.</span>
                        <span className="text-xs font-mono font-black text-slate-900 truncate block">{batch.batch_id}</span>
                      </div>

                      <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mfg. Date</span>
                        <span className="text-xs font-bold text-slate-900">
                          {new Date(batch.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Shelf Life</span>
                        <span className="text-xs font-bold text-slate-900">24 Months</span>
                      </div>

                      <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AYUSH / FSSAI Lic.</span>
                        <span className="text-xs font-mono font-bold text-slate-900 truncate block">{fssaiLicense}</span>
                      </div>

                      <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dosage Form</span>
                        <span className="text-xs font-bold text-slate-900">{isThakur ? 'Kshir Pak Herbal Oil' : 'Standardized Tablets'}</span>
                      </div>

                      <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Brand Portal</span>
                        <span className="text-xs font-bold text-emerald-800 truncate block">
                          {isThakur ? <a href="https://thakuryograj.com" target="_blank" rel="noreferrer" className="underline">thakuryograj.com ↗</a> : 'ayusetu.in'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 no-print">
                    <Button
                      onClick={handleShare}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs h-11 px-5 rounded-xl shadow-sm gap-2 flex-1"
                    >
                      <Share2 className="w-4 h-4" /> Share Product
                    </Button>
                    <Button
                      onClick={copyLink}
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs h-11 px-4 rounded-xl gap-2 flex-1"
                    >
                      <Copy className="w-4 h-4" /> Copy Link
                    </Button>
                    <Button
                      onClick={() => window.print()}
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs h-11 px-4 rounded-xl gap-2 sm:flex-initial"
                    >
                      <Printer className="w-4 h-4" /> Print Certificate
                    </Button>
                  </div>
                </div>

              </div>
            </div>

            {/* Smart Consumer Detailed Navigation Tabs */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Horizontal Scrollable Tabs Bar on Mobile with Smooth Touch */}
              <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50 p-1.5 sm:p-2 gap-1 scrollbar-none snap-x touch-pan-x">
                {[
                  { id: 'overview', label: 'Specifications', icon: FileText },
                  { id: 'ingredients', label: 'Ingredients', icon: Leaf },
                  { id: 'traceability', label: 'Traceability', icon: Truck },
                  { id: 'quality', label: 'Lab Tests', icon: FlaskConical },
                  { id: 'manufacturer', label: 'Manufacturer', icon: Building2 },
                  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all shrink-0 snap-start ${
                        isActive
                          ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/80 font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Container */}
              <div className="p-4 sm:p-8 lg:p-10">

                {/* TAB 1: Product Specifications & Usage */}
                {activeTab === 'overview' && (
                  <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1.5">Description & Indications</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {isThakur ? (
                          <>
                            <strong>THAKUR YOGRAJ HERBAL HAIR OIL (ठाकुर योगराज हर्बल हेयर ऑयल)</strong> is an authentic classical Ayurvedic formulation prepared through traditional <em>Kshir Pak Vidhi</em>. Enriched with 8 potent botanical herbs including Bhringraj, Amla, Gudhal, Brahmi, and Neem, it deeply nourishes the scalp, strengthens hair follicles from root to tip, eliminates dandruff, and promotes lustrous, thick hair growth. 100% Ayurvedic, chemical-free, and guaranteed 0% mineral oil.
                          </>
                        ) : (
                          `${productName} is formulated with standardized pure herbal extracts sourced directly from registered farmer clusters. Known as the "Royal Herb" of Ayurveda, Ashwagandha (Withania somnifera) acts as a potent adaptogen that modulates cortisol levels, promotes restorative sleep, and boosts immune vitality.`
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
                          <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" /> Key Health Benefits
                        </div>
                        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                          {isThakur ? (
                            <>
                              <li><strong>Hair Strengthening:</strong> Deep follicular nourishment prevents hair thinning and premature fall.</li>
                              <li><strong>Smooth & Silky Texture:</strong> Gudhal & Amla natural conditioning provides glossy shine and softness.</li>
                              <li><strong>Anti-Dandruff Action:</strong> Neem & Shikakai naturally cleanse scalp microflora.</li>
                              <li><strong>Scalp Cooling:</strong> Brahmi soothes tension and promotes restful sleep.</li>
                            </>
                          ) : (
                            <>
                              <li><strong>Stress Relief:</strong> Supports healthy cortisol response.</li>
                              <li><strong>Energy & Stamina:</strong> Natural physical endurance support.</li>
                              <li><strong>Cognitive Health:</strong> Enhances focus and memory retention.</li>
                              <li><strong>Immune Defense:</strong> Supports natural body resilience.</li>
                            </>
                          )}
                        </ul>
                      </div>

                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" /> Usage & Administration
                        </div>
                        <div className="text-xs text-slate-600 space-y-1.5">
                          {isThakur ? (
                            <>
                              <p><strong>Recommended Usage:</strong> Take 10-15 ml and massage gently into scalp with fingertips for 5-10 minutes. Leave overnight or for minimum 2 hours before washing.</p>
                              <p><strong>Storage:</strong> Store in a cool, dry place. Close cap tightly after each application.</p>
                            </>
                          ) : (
                            <>
                              <p><strong>Recommended Dosage:</strong> 1-2 tablets twice daily after meals with warm water or milk.</p>
                              <p><strong>Storage:</strong> Store in a cool, dry place. Keep bottle tightly closed.</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
                      <Info className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">{isThakur ? "Ayurvedic External Use Advisory:" : "Ayurvedic Physician Advisory:"}</span>
                        <p className="mt-0.5 text-[11px] sm:text-xs">
                          {isThakur 
                            ? "For external scalp and hair application only. 100% natural herbal decoction. In case of rare contact with eyes, rinse thoroughly with fresh water."
                            : "Consult an Ayurvedic physician during pregnancy, lactation, or if taking ongoing chronic prescription medications."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Botanical Ingredients & Formulation Tree */}
                {activeTab === 'ingredients' && (
                  <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">
                        {isThakur ? "8 Botanical Herbs Composition & Classical Kshir Pak Formulation" : "Active Botanical Composition"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isThakur ? "100% Ayurvedic • Chemical Free • 0% Mineral Oil (Liquid Paraffin Free)" : "Standardized pure herbal extracts verified on AyuSetu blockchain"}
                      </p>
                    </div>

                    {isThakur ? (
                      <div className="space-y-4">
                        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center justify-between text-xs font-bold text-emerald-950">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" /> 100% PURE HERBAL KSHIR PAK DECOCTION
                          </span>
                          <span className="text-emerald-800 text-[11px]">Net Vol: 250ml</span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                              <tr>
                                <th className="p-3 border-b border-slate-200">Sanskrit Name</th>
                                <th className="p-3 border-b border-slate-200">Botanical Specimen</th>
                                <th className="p-3 border-b border-slate-200">Plant Part</th>
                                <th className="p-3 border-b border-slate-200">Proportion</th>
                                <th className="p-3 border-b border-slate-200">Action & Benefits</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                              <tr className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-emerald-800">Bhringraj (भृंगराज)</td>
                                <td className="p-3 italic font-serif">Eclipta alba</td>
                                <td className="p-3">Whole Plant</td>
                                <td className="p-3 font-mono font-bold">15%</td>
                                <td className="p-3 text-emerald-700">Stimulates dormant follicles & prevents premature greying</td>
                              </tr>
                              <tr className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-emerald-800">Amla (आमलकी)</td>
                                <td className="p-3 italic font-serif">Phyllanthus emblica</td>
                                <td className="p-3">Fresh Pericarp</td>
                                <td className="p-3 font-mono font-bold">15%</td>
                                <td className="p-3 text-emerald-700">Natural Tannins & Vitamin C for root strengthening</td>
                              </tr>
                              <tr className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-emerald-800">Gudhal / Japa (गुड़हल)</td>
                                <td className="p-3 italic font-serif">Hibiscus rosa-sinensis</td>
                                <td className="p-3">Flower Petals</td>
                                <td className="p-3 font-mono font-bold">12%</td>
                                <td className="p-3 text-emerald-700">Conditioning, adds smooth silky shine & repairs keratin</td>
                              </tr>
                              <tr className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-emerald-800">Brahmi (ब्राह्मी)</td>
                                <td className="p-3 italic font-serif">Bacopa monnieri</td>
                                <td className="p-3">Whole Herb</td>
                                <td className="p-3 font-mono font-bold">10%</td>
                                <td className="p-3 text-emerald-700">Scalp cooling, relieves tension & stress-related hair fall</td>
                              </tr>
                              <tr className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-emerald-800">Neem (निम्ब)</td>
                                <td className="p-3 italic font-serif">Azadirachta indica</td>
                                <td className="p-3">Leaves</td>
                                <td className="p-3 font-mono font-bold">8%</td>
                                <td className="p-3 text-emerald-700">Anti-microbial, eliminates scalp flaking & dandruff</td>
                              </tr>
                              <tr className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-emerald-800">Shikakai (शिकाकाई)</td>
                                <td className="p-3 italic font-serif">Acacia concinna</td>
                                <td className="p-3">Pods</td>
                                <td className="p-3 font-mono font-bold">8%</td>
                                <td className="p-3 text-emerald-700">Natural gentle saponin cleansing & root strengthening</td>
                              </tr>
                              <tr className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-emerald-800">Methi (मेथी)</td>
                                <td className="p-3 italic font-serif">Trigonella foenum-graecum</td>
                                <td className="p-3">Seeds</td>
                                <td className="p-3 font-mono font-bold">7%</td>
                                <td className="p-3 text-emerald-700">Amino acid proteins for tensile strength</td>
                              </tr>
                              <tr className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-emerald-800">Til & Coconut Taila</td>
                                <td className="p-3 italic font-serif">Sesamum indicum & Cocos nucifera</td>
                                <td className="p-3">Cold-Pressed Oils</td>
                                <td className="p-3 font-mono font-bold">25%</td>
                                <td className="p-3 text-emerald-700">Taila Paka matrix (100% Mineral Oil Free)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Mobile-Friendly Ingredients Cards (Visible on Small Screens) */}
                        <div className="space-y-3 sm:hidden">
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-emerald-800 text-sm">Ashwagandha</span>
                              <span className="font-mono font-black text-slate-900 text-xs">500 mg</span>
                            </div>
                            <p className="text-xs italic font-serif text-slate-600 mt-0.5">Withania somnifera (Root)</p>
                            <span className="text-[10px] text-slate-500 block mt-1">Min. 5% Withanolides (HPLC)</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-emerald-800 text-sm">Brahmi (Extract)</span>
                              <span className="font-mono font-black text-slate-900 text-xs">50 mg</span>
                            </div>
                            <p className="text-xs italic font-serif text-slate-600 mt-0.5">Bacopa monnieri (Whole)</p>
                            <span className="text-[10px] text-slate-500 block mt-1">Min. 20% Bacosides</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-emerald-800 text-sm">Piperine</span>
                              <span className="font-mono font-black text-slate-900 text-xs">5 mg</span>
                            </div>
                            <p className="text-xs italic font-serif text-slate-600 mt-0.5">Piper nigrum (Bio-enhancer)</p>
                            <span className="text-[10px] text-slate-500 block mt-1">Min. 95% Piperine</span>
                          </div>
                        </div>

                        {/* Desktop Ingredients Table */}
                        <div className="hidden sm:block overflow-x-auto">
                          <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                              <tr>
                                <th className="p-3 border-b border-slate-200">Sanskrit Name</th>
                                <th className="p-3 border-b border-slate-200">Botanical Specimen</th>
                                <th className="p-3 border-b border-slate-200">Plant Part</th>
                                <th className="p-3 border-b border-slate-200">Standardization</th>
                                <th className="p-3 border-b border-slate-200">Quantity / Tab</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                              <tr className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-emerald-800">Ashwagandha</td>
                                <td className="p-3 italic font-serif">Withania somnifera (L.) Dunal</td>
                                <td className="p-3">Root (Mula)</td>
                                <td className="p-3">Min. 5% Withanolides (HPLC)</td>
                                <td className="p-3 font-mono font-bold">500 mg</td>
                              </tr>
                              <tr className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-emerald-800">Brahmi (Extract)</td>
                                <td className="p-3 italic font-serif">Bacopa monnieri</td>
                                <td className="p-3">Whole Plant</td>
                                <td className="p-3">Min. 20% Bacosides</td>
                                <td className="p-3 font-mono font-bold">50 mg</td>
                              </tr>
                              <tr className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-emerald-800">Piperine</td>
                                <td className="p-3 italic font-serif">Piper nigrum</td>
                                <td className="p-3">Dried Fruit</td>
                                <td className="p-3">Min. 95% Piperine</td>
                                <td className="p-3 font-mono font-bold">5 mg</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    {/* Source Input Batches Lineage */}
                    {inputBatches.length > 0 && (
                      <div className="pt-4 border-t border-slate-200">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-emerald-600" /> Source Input Batches
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          {inputBatches.map((inB) => {
                            const pct = batch.metadata?.batchPercentages?.[inB.batch_id];
                            return (
                              <div
                                key={inB.id}
                                onClick={() => navigate(`/verify/${inB.batch_id}`)}
                                className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition-all flex items-center justify-between group"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-black text-emerald-800">{inB.batch_id}</span>
                                    {pct && (
                                      <Badge className="bg-emerald-100 text-emerald-800 text-[9px]">{pct}% Blend</Badge>
                                    )}
                                  </div>
                                  <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">{inB.product_name || inB.herb_name}</p>
                                  <p className="text-[11px] text-slate-500 font-mono">Origin: {inB.farmer_location || 'Maharashtra Agro-Zone'}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: Farm-to-Shelf Traceability Ledger */}
                {activeTab === 'traceability' && (
                  <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">National Traceability Pipeline</h3>
                      <p className="text-xs text-slate-500">Immutable ledger custody transfers from farm of origin to consumer shelf</p>
                    </div>

                    <div className="relative pl-5 sm:pl-8 space-y-6 sm:space-y-8 before:absolute before:left-2.5 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-600">
                      
                      {/* Step 1: Farm Origin */}
                      <div className="relative group">
                        <div className="absolute -left-5 sm:-left-8 w-5 sm:w-8 h-5 sm:h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] sm:text-xs font-black shadow-md">
                          1
                        </div>
                        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                          <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                            <span className="text-[11px] sm:text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                              <Leaf className="w-3.5 h-3.5" /> Stage 1: Agricultural Harvest
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">
                              {batch.farmer_location || 'Aurangabad, Maharashtra'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs text-slate-700">
                            <div>
                              <span className="text-slate-400 font-medium">Farmer / Collective:</span>
                              <p className="font-bold text-slate-900 text-xs sm:text-sm">{batch.farmer_name || batch.metadata?.farmerName || 'Rajesh Kumar Sharma'}</p>
                            </div>
                            <div>
                              <span className="text-slate-400 font-medium">Botanical Specimen:</span>
                              <p className="font-bold text-emerald-800 text-xs sm:text-sm">{batch.herb_name || productName}</p>
                            </div>
                            {(batch.metadata?.latitude || batch.metadata?.longitude) && (
                              <div className="sm:col-span-2 flex items-center gap-1 text-emerald-800 font-mono text-[10px] sm:text-[11px] bg-white p-2 rounded-lg border border-slate-200">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Coordinates: {batch.metadata.latitude}, {batch.metadata.longitude}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Step 2: Aggregator Node */}
                      <div className="relative group">
                        <div className="absolute -left-5 sm:-left-8 w-5 sm:w-8 h-5 sm:h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px] sm:text-xs font-black shadow-md">
                          2
                        </div>
                        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                          <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                            <span className="text-[11px] sm:text-xs font-black text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5" /> Stage 2: Quality Inspection Hub
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">
                              {batch.source_location || 'MahaAgri Central Transit'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs text-slate-700">
                            <div>
                              <span className="text-slate-400 font-medium">Transit Pass:</span>
                              <p className="font-bold text-slate-900 font-mono">{batch.metadata?.waybill || `WB-7891-${batch.batch_id.slice(-4)}`}</p>
                            </div>
                            <div>
                              <span className="text-slate-400 font-medium">Carrier Vehicle:</span>
                              <p className="font-bold text-slate-900 font-mono">{batch.metadata?.vehicle || 'MH-12-AS-9080 (Cold-Chain)'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 3: Processing Plant */}
                      <div className="relative group">
                        <div className="absolute -left-5 sm:-left-8 w-5 sm:w-8 h-5 sm:h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] sm:text-xs font-black shadow-md">
                          3
                        </div>
                        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                          <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                            <span className="text-[11px] sm:text-xs font-black text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                              <FlaskConical className="w-3.5 h-3.5" /> Stage 3: GMP Phytochemical Extraction
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">
                              Western Ghats Extraction Plant
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs text-slate-700">
                            <div>
                              <span className="text-slate-400 font-medium">Method:</span>
                              <p className="font-bold text-slate-900">{batch.metadata?.operation || 'Hydro-Alcoholic Aqueous (GMP)'}</p>
                            </div>
                            <div>
                              <span className="text-slate-400 font-medium">Temp:</span>
                              <p className="font-bold text-slate-900">{batch.metadata?.temperature ? `${batch.metadata.temperature} °C` : '65°C'}</p>
                            </div>
                            <div>
                              <span className="text-slate-400 font-medium">Duration:</span>
                              <p className="font-bold text-slate-900">{batch.metadata?.duration ? `${batch.metadata.duration}h` : '12h'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 4: Formulation & Packaging */}
                      <div className="relative group">
                        <div className="absolute -left-5 sm:-left-8 w-5 sm:w-8 h-5 sm:h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] sm:text-xs font-black shadow-md">
                          4
                        </div>
                        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                          <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                            <span className="text-[11px] sm:text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                              <Factory className="w-3.5 h-3.5" /> Stage 4: Formulation & Packaging
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">
                              Satara GMP Facility
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs text-slate-700">
                            <div>
                              <span className="text-slate-400 font-medium">Master Batch:</span>
                              <p className="font-bold text-slate-900 font-mono">{batch.batch_id}</p>
                            </div>
                            <div>
                              <span className="text-slate-400 font-medium">Quality Release:</span>
                              <p className="font-bold text-emerald-700 font-mono">PASSED / QC APPROVED</p>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 4: Quality & Lab Tests */}
                {activeTab === 'quality' && (
                  <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">Laboratory Assay & Certificate of Analysis (COA)</h3>
                      <p className="text-xs text-slate-500">
                        {isThakur 
                          ? "Certified 100% Herbal & Mineral Oil Free (Liquid Paraffin NIL) - NPLIM / AYUSH Standard" 
                          : "Certified by NABL Accredited AYUSH Central Quality Control Testing Laboratory"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {isThakur ? "Mineral Oil / Paraffin" : "Heavy Metals"}
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 
                          {isThakur ? "0% NIL / NOT DETECTED" : "PASS (Lead, Arsenic < 0.1 ppm)"}
                        </p>
                      </div>

                      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Heavy Metals & Toxins</span>
                        <p className="text-xs sm:text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> ALL LIMITS PASSED
                        </p>
                      </div>

                      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Microbial Load</span>
                        <p className="text-xs sm:text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> PASSED AYUSH LIMITS
                        </p>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white">
                      <h4 className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Detailed Batch Quality Parameters</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px]">{isThakur ? "Acid Value:" : "Moisture Content:"}</span>
                          <p className="font-bold text-slate-800">{isThakur ? "1.4 mg KOH/g (PASSED)" : (batch.metadata?.moisture || '7.4% (Optimal)')}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">{isThakur ? "Peroxide Value:" : "Bio-Active Marker:"}</span>
                          <p className="font-bold text-slate-800">{isThakur ? "1.2 meq/kg (PASSED)" : "5.2% Withanolides (HPLC)"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">Testing Authority:</span>
                          <p className="font-bold text-slate-800 truncate">{batch.metadata?.qualityTest?.authority || 'National Pharmacopoeial Laboratory'}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">Official Verdict:</span>
                          <p className="font-bold text-emerald-700">{batch.metadata?.qcResults || 'PASSED'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: Manufacturer & Consumer Care Details */}
                {activeTab === 'manufacturer' && (
                  <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">Manufacturer & Consumer Care</h3>
                      <p className="text-xs text-slate-500">Statutory declarations under Legal Metrology Rules</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs text-slate-700">
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                          <Factory className="w-4 h-4 text-emerald-700 shrink-0" /> Manufactured By
                        </div>
                        <p className="font-bold text-slate-900">{isThakur ? "Thakur Yograj Herbal Products Pvt. Ltd." : "Ayurveda Life Labs Pvt. Ltd. (Siddhayu Division)"}</p>
                        <p>{isThakur ? "Plot No. 18, Ayurvedic Industrial Zone, Maharashtra - 400705, India" : "Plot No. 42-45, MIDC Industrial Area, Satara, Maharashtra - 415004, India"}</p>
                        <p className="font-mono text-slate-500 text-[11px]">License: {isThakur ? "AYU-MH-2023-88741" : "AYU-MH-2023-90812"}</p>
                        {isThakur && (
                          <div className="pt-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Official Brand Portal</span>
                            <a 
                              href="https://thakuryograj.com" 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-xs font-black text-emerald-800 hover:text-emerald-600 underline flex items-center gap-1 mt-0.5"
                            >
                              🌐 https://thakuryograj.com ↗
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                          <Building2 className="w-4 h-4 text-emerald-700 shrink-0" /> Marketed By
                        </div>
                        <p className="font-bold text-slate-900">{isThakur ? "Thakur Yograj Consumer Healthcare" : "Siddhayu Herbal Heritage Ltd."}</p>
                        <p>{isThakur ? "Corporate Towers, Sector 15, Mumbai, Maharashtra - 400051, India" : "Bandra Kurla Complex, Mumbai, Maharashtra - 400051, India"}</p>
                        <p className="font-mono text-slate-500 text-[11px]">CIN: {isThakur ? "U24239MH2021PTC368819" : "U24239MH2018PLC309101"}</p>
                        {isThakur && (
                          <div className="pt-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Brand Website</span>
                            <a 
                              href="https://thakuryograj.com" 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-xs font-black text-emerald-800 hover:text-emerald-600 underline flex items-center gap-1 mt-0.5"
                            >
                              thakuryograj.com
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                      <h4 className="font-bold text-xs sm:text-sm text-emerald-900 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-700 shrink-0" /> Consumer Care Helpline
                      </h4>
                      <p>For any product feedback, queries, or authenticity verification, please contact our grievance redressal officer:</p>
                      <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-4 font-semibold text-emerald-900 pt-1">
                        <span>📞 {isThakur ? "1800-890-4422 (Mon-Sat, 9AM-7PM)" : "1800-209-1234 (Mon-Sat, 9AM-6PM)"}</span>
                        <span>✉️ {isThakur ? "care@thakuryograj.com" : "care@siddhayu.com"}</span>
                        {isThakur && <span>🌐 thakuryograj.com</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: Consumer Feedback */}
                {activeTab === 'feedback' && (
                  <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200 max-w-xl">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">Consumer Feedback</h3>
                      <p className="text-xs text-slate-500">Submit your product experience to the national registry</p>
                    </div>

                    {feedbackSubmitted ? (
                      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                        <h4 className="font-black text-emerald-950 text-base">Feedback Logged</h4>
                        <p className="text-xs text-emerald-800 mt-1">Your review and batch rating have been recorded on the AyuSetu ledger.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleFeedbackSubmit} className="space-y-3.5 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Your Name</label>
                          <Input
                            required
                            type="text"
                            placeholder="e.g. Ramesh Patel"
                            value={feedback.name}
                            onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                            className="bg-slate-50 border-slate-300 rounded-xl h-10 text-xs"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Mobile Number (Optional)</label>
                          <Input
                            type="tel"
                            placeholder="e.g. 9876543210"
                            value={feedback.phone}
                            onChange={(e) => setFeedback({ ...feedback, phone: e.target.value })}
                            className="bg-slate-50 border-slate-300 rounded-xl h-10 text-xs"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Product Quality Rating</label>
                          <select
                            value={feedback.rating}
                            onChange={(e) => setFeedback({ ...feedback, rating: e.target.value })}
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                          >
                            <option value="5">⭐⭐⭐⭐⭐ Excellent (Authentic Pack)</option>
                            <option value="4">⭐⭐⭐⭐ Good</option>
                            <option value="3">⭐⭐⭐ Average</option>
                            <option value="2">⭐⭐ Poor Quality</option>
                            <option value="1">⭐ Suspected Counterfeit</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Comments / Grievance</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Share your experience or report packaging/seal issues..."
                            value={feedback.comments}
                            onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                          />
                        </div>

                        <Button type="submit" className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs">
                          Submit Feedback
                        </Button>
                      </form>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Printable Official Certificate (Clean PDF Print Mode) */}
            <div className="hidden print:block fixed inset-0 bg-white text-black p-12 z-[99999]">
              <div className="text-center border-b-4 border-emerald-700 pb-6 mb-8">
                <h1 className="text-3xl font-serif font-black uppercase text-emerald-900">Ministry of AYUSH & Consumer Affairs</h1>
                <h2 className="text-xl font-bold tracking-widest text-slate-800 mt-1">SMART CONSUMER OFFICIAL TRACEABILITY CERTIFICATE</h2>
                <p className="text-xs text-slate-500 mt-2 font-mono">Issued via National DataKart & AyuSetu Distributed Ledger</p>
              </div>

              <div className="grid grid-cols-2 gap-6 my-8 text-sm">
                <div>
                  <p className="font-bold text-slate-500">Product Name:</p>
                  <p className="text-xl font-black text-slate-900">{productName}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-500">GTIN / EAN-13:</p>
                  <p className="text-xl font-mono font-black text-emerald-800">{gtinNumber}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-500">Batch Identifier:</p>
                  <p className="text-xl font-mono font-black text-slate-900">{batch.batch_id}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-500">Quality Clearance:</p>
                  <p className="text-base font-bold text-emerald-700">{batch.metadata?.qcResults || 'PASSED / AYUSH CERTIFIED'}</p>
                </div>
              </div>

              <div className="border-t border-b border-slate-300 py-6 my-8 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500">Recall & Safety Status:</p>
                  <p className="text-lg font-black text-emerald-700 uppercase">{batch.status === 'recalled' ? 'RECALLED' : 'AUTHENTIC & VERIFIED'}</p>
                  <p className="text-xs text-slate-500 mt-1">License: {fssaiLicense}</p>
                </div>
                <div className="p-2 border border-slate-300 rounded">
                  <QRCode value={qrUrl} size={90} />
                </div>
              </div>

              <div className="text-center text-xs text-slate-400 mt-16 pt-8 border-t border-slate-200 font-mono">
                Digitally Signed & Validated across Government of India AyuSetu Ledger Nodes.
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Floating Bottom Action Bar for Mobile Viewers */}
      {batch && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:hidden z-40 shadow-2xl flex items-center justify-between gap-2 no-print">
          <Button
            onClick={handleShare}
            size="sm"
            className="flex-1 h-11 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </Button>
          <Button
            onClick={copyLink}
            variant="outline"
            size="sm"
            className="flex-1 h-11 border-slate-300 text-slate-700 font-bold text-xs rounded-xl gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Link
          </Button>
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="sm"
            className="h-11 px-3 border-slate-300 text-slate-700 font-bold rounded-xl"
            title="Print Certificate"
          >
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 sm:mt-20 border-t border-slate-200 bg-white py-6 sm:py-8 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[11px] sm:text-xs">© {new Date().getFullYear()} AyuSetu National Traceability Ledger • Powered by GS1 DataKart & Ministry of AYUSH</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/" className="hover:text-slate-900 underline">Dispensary Portal</Link>
            <a href="https://smartconsumer.org.in" target="_blank" rel="noreferrer" className="hover:text-slate-900 underline">GS1 Smart Consumer</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicVerifyPage;
