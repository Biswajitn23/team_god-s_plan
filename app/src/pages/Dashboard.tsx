import { Header } from '../components/layout/Header';
import { CollectionEventForm } from '../components/forms/CollectionEventForm';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Leaf, TrendingUp, CheckCircle, AlertCircle, Clock, Users, Package, Languages, RefreshCw, Download as DownloadIcon, Copy as CopyIcon, ShieldCheck, UserCheck, MapPin, Hash, Sparkles, PlusCircle, HelpCircle, MessageCircle, Bot, X, Volume2, VolumeX, ShoppingCart, Check } from 'lucide-react';
import { getCollections, initializeDemoData } from '../lib/localStorage';
import QRCode from 'qrcode';
import { useToast } from '../components/ui/use-toast';
import { useTranslation } from '../context/useTranslation';
import { useEffect, useState, useContext } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, collection, getDocs, addDoc, query, where, getDocs as getDocs2 } from 'firebase/firestore';
import { SimpleChatbot } from '../components/chatbot/SimpleChatbot';
import { BottomNav } from '../components/layout/BottomNav';
import { TTSEnabledContext, useTTS } from '../context/TTSContext';
import { LibreTrans } from '../components/ui/LibreTrans';

const languagesList = [
    { code: 'en', name: 'English', sub: 'Global' },
    { code: 'hi', name: 'हिन्दी', sub: 'Hindi' },
    { code: 'bn', name: 'বাংলা', sub: 'Bengali' },
    { code: 'te', name: 'తెలుగు', sub: 'Telugu' },
    { code: 'mr', name: 'मराठी', sub: 'Marathi' },
    { code: 'ta', name: 'தமிழ்', sub: 'Tamil' },
    { code: 'kn', name: 'ಕನ್ನಡ', sub: 'Kannada' },
    { code: 'ml', name: 'മലയാളം', sub: 'Malayalam' },
    { code: 'gu', name: 'ગુજરાતી', sub: 'Gujarati' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', sub: 'Punjabi' },
];


// ...existing code...

// ...existing code...

// Demand type for Firestore
type Demand = {
  id?: string;
  title: string;
  description: string;
  quantity: number;
  rate?: number; // Added field
  crop: string;
  company: string;
  created_at: string;
};

type Sale = {
  id: string;
  farmerId: string;
  demandId: string;
  company: string;
  crop: string;
  quantity: number;
  rate: number;
  totalAmount: string;
  timestamp: string;
};

export const Dashboard = ({ onLogout, farmer: propFarmer }: any) => {
  const { language, setLanguage, t } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');
  const [collectionEvents, setCollectionEvents] = useState<any[]>([]);
  const [showQR, setShowQR] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const { toast } = useToast();
  // Only trust propFarmer (from Firestore)
  const [farmer, setFarmer] = useState<any>(propFarmer);
  
  // Keep local farmer state in sync with props from App
  useEffect(() => {
    if (propFarmer) {
      setFarmer(propFarmer);
    }
  }, [propFarmer]);

  const { ttsEnabled, setTtsEnabled, speak } = useTTS();
  // Demands state
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loadingDemands, setLoadingDemands] = useState(false);
  // Sell workflow state
  const [respondedIds, setRespondedIds] = useState<string[]>([]);
  const [sellModal, setSellModal] = useState<{ demand: Demand; open: boolean } | null>(null);
  const [sellQty, setSellQty] = useState("");
  const [sellLoading, setSellLoading] = useState(false);
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [showSalesHistory, setShowSalesHistory] = useState(false);

  // Check if farmer has already responded to a demand
  const checkResponses = async (demandId: string) => {
    if (!farmer?.id) {
      console.warn("checkResponses: No farmer ID found");
      return false;
    }
    try {
      const responsesRef = collection(db, 'demands', demandId, 'responses');
      const q = query(responsesRef, where('farmerId', '==', farmer.id));
      const snap = await getDocs(q); // Use standard getDocs
      return !snap.empty;
    } catch (err) {
      console.error("Error checking responses:", err);
      return false;
    }
  };

  // On Sell tab, check all responses
  useEffect(() => {
    if (activeTab === 'sell' && demands.length && farmer?.id) {
      (async () => {
        const ids: string[] = [];
        for (const d of demands) {
          if (await checkResponses(d.id!)) ids.push(d.id!);
        }
        setRespondedIds(ids);
      })();
    }
  }, [activeTab, demands, farmer?.id]);

  // Handle farmer response to a demand
  const handleRespond = (demand: Demand) => {
    setSellModal({ demand, open: true });
    setSellQty("");
  };

  // Confirm sell
  const handleConfirmSell = async () => {
    if (!farmer?.id || !sellModal?.demand?.id || !sellQty) return;
    setSellLoading(true);
    const responsesRef = collection(db, 'demands', sellModal.demand.id, 'responses');
    const currentRate = sellModal.demand.rate || (sellModal.demand.crop.toLowerCase().includes('wheat') ? 22.50 : sellModal.demand.crop.toLowerCase().includes('rice') ? 44.00 : 19.75);
    
    await addDoc(responsesRef, {
      farmerId: farmer.id,
      farmerName: farmer.name,
      respondedAt: new Date().toISOString(),
      crop: sellModal.demand.crop,
      quantity: Number(sellQty),
      rate: currentRate,
      totalAmount: (Number(sellQty) * currentRate).toFixed(2),
    });
    // Store in global sales history for the farmer
    await addDoc(collection(db, 'sales'), {
      farmerId: farmer.id,
      demandId: sellModal.demand.id,
      company: sellModal.demand.company,
      crop: sellModal.demand.crop,
      quantity: Number(sellQty),
      rate: currentRate,
      totalAmount: (Number(sellQty) * currentRate).toFixed(2),
      timestamp: new Date().toISOString(),
    });

    setRespondedIds((prev) => [...prev, sellModal.demand.id!]);
    // Refresh sales history
    fetchSalesHistory();
    setSellLoading(false);
    setSellModal(null);
    toast({ title: 'Sell Confirmed', description: 'Your sale has been recorded.' });
  };

  const fetchSalesHistory = async () => {
    if (!farmer?.id) {
      console.warn("fetchSalesHistory: Not logged in");
      return;
    }
    
    try {
      const q = query(collection(db, 'sales'), where('farmerId', '==', farmer.id));
      const snapshot = await getDocs(q);
      
      const sales = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Sale));
      
      // Sort by timestamp safely
      sales.sort((a, b) => {
        const timeA = a.timestamp || "";
        const timeB = b.timestamp || "";
        return timeB.localeCompare(timeA);
      });
      
      setSalesHistory(sales);
      console.log(`Fetched ${sales.length} sales for farmer ${farmer.id}`);
    } catch (err) {
      console.error("Error fetching sales history:", err);
    }
  };

  // Fetch demands and sales history
  useEffect(() => {
    if (activeTab === 'sell') {
      setLoadingDemands(true);
      getDocs(collection(db, 'demands')).then((snapshot) => {
        setDemands(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Demand));
        setLoadingDemands(false);
      }).catch(() => setLoadingDemands(false));
      fetchSalesHistory();
    }
  }, [activeTab, farmer?.id]);

  // If no valid farmer, show nothing (or a message)
  if (!farmer || !farmer.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-emerald-700">Access Denied</h2>
        <p className="text-emerald-500 mt-2">You must register and be approved to access the dashboard.</p>
        <button className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold" onClick={onLogout}>Go to Login</button>
      </div>
    );
  }

  useEffect(() => {
    initializeDemoData();
    setCollectionEvents(getCollections());

    // Real-time Firestore listener for logged-in farmer
    let unsubscribe: (() => void) | undefined;
    if (farmer && farmer.id) {
      const farmerRef = doc(db, 'farmers', farmer.id);
      unsubscribe = onSnapshot(farmerRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFarmer({ ...farmer, ...data });
          localStorage.setItem('currentUser', JSON.stringify({ ...farmer, ...data }));
        } else {
          // Farmer document deleted, log out automatically
          localStorage.removeItem('currentUser');
          onLogout && onLogout();
        }
      });
    }

    // Migration: Sync local-only records to Firestore for public QR verification
    const syncLegacyRecords = async () => {
      const localData = localStorage.getItem('collections_data');
      if (farmer?.id) {
        try {
          const collections = localData ? JSON.parse(localData) : [];
          // Include demo collections in the sync list
          const { demoCollections } = await import('../lib/localStorage');
          const allToSync = [...collections, ...(Array.isArray(demoCollections) ? demoCollections : [])];

          for (const item of allToSync) {
            const q = query(collection(db, "crops"), where("batch_id", "==", item.batch_id));
            const snap = await getDocs(q);
            if (snap.empty) {
               await addDoc(collection(db, "crops"), {
                ...item,
                farmer_id: farmer.id,
                farmer_name: farmer.name || "Verified Farmer",
                created_at: item.created_at || serverTimestamp(),
                is_legacy: true
              });
            }
          }
        } catch (e) {
          console.error("Migration failed", e);
        }
      }
    };
    if (farmer) syncLegacyRecords();

    // Greeting on mount
    if (farmer?.name) {
      setTimeout(() => {
        const greeting = language === 'hi'
          ? `नमस्ते ${farmer.name}, आयुसेतु में आपका स्वागत है।`
          : `Welcome to Ayu-Setu, ${farmer.name}.`;
        speak(greeting);
      }, 1500);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [farmer?.id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleCreateCollection = (data: any) => {
    setCollectionEvents(getCollections());
    setActiveTab('history');
    toast({
      title: t('success'),
      description: t('successDesc').replace('{batchId}', ''),
    });
  };

  const generateQRCode = async (batchId: string) => {
    try {
      const qrUrl = `${window.location.origin}/view/${batchId}`;
      const url = await QRCode.toDataURL(qrUrl);
      setQrDataUrl(url);
      setShowQR(batchId);
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('link_copied'),
      description: t('link_copied_desc'),
    });
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `QR-${showQR}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const tabTitles: Record<string, string> = {
    home: 'Overview',
    collection: 'Registration',
    sell: 'Sell',
    history: 'History',
    help: 'Support'
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-emerald-950 flex flex-col font-sans transition-colors duration-500 selection:bg-emerald-100 selection:text-emerald-900">
      <Header user={farmer} onLogout={onLogout} />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-32">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 lg:space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1 flex-1">
              <h2 className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.4em]">
                <LibreTrans text="AYUSETU HOME" />
              </h2>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                  <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 dark:text-white tracking-tight leading-none uppercase italic transition-colors">
                    <LibreTrans text={tabTitles[activeTab] || 'Overview'} />
                  </h1>
                </div>

                <div className="hidden lg:flex items-center gap-1 p-1 bg-emerald-950/5 dark:bg-white/5 backdrop-blur-xl border border-emerald-100/50 dark:border-white/10 rounded-[1.5rem]">
                   {Object.entries(tabTitles).map(([key, label]) => {
                     const isActive = activeTab === key;
                     return (
                       <button
                         key={key}
                         onClick={() => setActiveTab(key)}
                         className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                           isActive 
                             ? 'bg-emerald-950 dark:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' 
                             : 'text-emerald-900/40 dark:text-white/40 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-white/50 dark:hover:bg-white/5'
                         }`}
                       >
                         <LibreTrans text={label} />
                       </button>
                     );
                   })}
                </div>

                {/* Relocated Controls */}
                <div className="flex items-center gap-2">
                   {/* Language Toggle */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-10 px-4 rounded-2xl bg-white dark:bg-white/10 border border-emerald-100 dark:border-white/10 text-emerald-900 dark:text-white flex items-center gap-2 hover:bg-emerald-50 dark:hover:bg-white/20 transition-all shadow-sm active:scale-95">
                          <Languages size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {languagesList.find(l => l.code === language)?.name || 'Language'}
                          </span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-emerald-100 dark:border-white/10 shadow-2xl bg-white/95 dark:bg-emerald-950/95 backdrop-blur-xl max-h-[60vh] overflow-y-auto scroll-premium">
                        {languagesList.map((lang) => (
                           <DropdownMenuItem 
                             key={lang.code}
                             onClick={() => setLanguage(lang.code)} 
                             className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between mb-1 ${language === lang.code ? 'bg-emerald-600 text-white' : 'dark:text-white hover:bg-emerald-50 dark:hover:bg-white/10'}`}
                           >
                              <div className="flex flex-col">
                                <span className="text-sm font-bold leading-none">{lang.name}</span>
                                <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${language === lang.code ? 'text-white/60' : 'text-emerald-600/40'}`}>
                                   {lang.sub}
                                </span>
                              </div>
                              {language === lang.code && <Check className="h-4 w-4" />}
                           </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* TTS Toggle */}
                    <button 
                      onClick={() => setTtsEnabled(!ttsEnabled)}
                      className={`h-10 w-10 rounded-2xl border transition-all shadow-sm active:scale-95 flex items-center justify-center ${ttsEnabled ? 'bg-emerald-600 border-transparent text-white' : 'bg-white dark:bg-white/10 border-emerald-100 dark:border-white/10 text-emerald-900 dark:text-white'}`}
                    >
                      {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                </div>
              </div>
            </div>
          </div>

          <TabsContent value="home" className="space-y-8 animate-in fade-in zoom-in-95 duration-500 outline-none">
            <div className="relative group perspective-1000">
               <div className="card-glass p-8 md:p-12 relative overflow-hidden bg-emerald-950 border-none rounded-[3rem] shadow-2xl">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                     <Package size={300} strokeWidth={0.5} />
                  </div>
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]" />
                  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-[80px]" />

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                     <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                           <Sparkles size={14} className="text-emerald-400" />
                           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{t('brand')} {t('farmer')}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none pb-2">
                           {t('welcome')}, <br />
                           <span className="text-emerald-400">{farmer?.name || t('farmer')}</span>
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500/60 to-transparent rounded-full" />

                        <div className="flex flex-wrap gap-2 pt-2">
                           <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                              <Hash size={16} className="text-emerald-400" />
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{t('farmerId')}</span>
                                 <span className="text-sm font-bold text-white/90 font-mono tracking-tight">FARM-{(farmer?.id || '001').split('-').pop()}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                         {[
                            { label: 'totalCollections', value: collectionEvents.length, icon: Package, color: 'emerald' },
                            { label: 'verified', value: collectionEvents.filter(e => e.status === 'verified').length, icon: CheckCircle, color: 'emerald' },
                            { label: 'pending', value: collectionEvents.filter(e => e.status === 'pending').length, icon: Clock, color: 'amber' },
                            { label: 'Certification', value: farmer?.certificationStatus || 'Verified', icon: ShieldCheck, color: 'cyan' },
                            { label: 'Compliance', value: `${farmer?.complianceScore || 100}%`, icon: UserCheck, color: 'emerald' }
                         ].map((stat, idx) => {
                            const Icon = stat.icon;
                            const colorClass = stat.color === 'emerald' ? 'text-emerald-400' : 
                                               stat.color === 'amber' ? 'text-amber-400' : 
                                               stat.color === 'cyan' ? 'text-cyan-400' : 'text-emerald-400';
                            return (
                                <div key={idx} className="p-6 bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl group/stat hover:bg-white/10 transition-all cursor-default">
                                   <Icon size={18} className={`${colorClass} mb-3 transition-transform group-hover/stat:scale-110 ml-auto`} />
                                   <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">
                                      <LibreTrans text={stat.label} />
                                   </p>
                                   <p className="text-xl font-black text-white leading-none break-words">
                                      <LibreTrans text={String(stat.value)} />
                                   </p>
                                </div>
                            );
                         })}
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:hidden">
               <button onClick={() => setActiveTab('collection')} className="p-4 bg-emerald-50 dark:bg-white/5 rounded-[2rem] border border-emerald-100 dark:border-white/10 flex flex-col items-center gap-2 active:scale-95 transition-all">
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                     <PlusCircle size={20} />
                  </div>
                  <span className="text-[8px] font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-widest text-center">
                    <LibreTrans text="Add Batch" />
                  </span>
               </button>
               <button onClick={() => setActiveTab('sell')} className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-[2rem] border border-amber-100 dark:border-amber-900/30 flex flex-col items-center gap-2 active:scale-95 transition-all">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                     <TrendingUp size={20} />
                  </div>
                  <span className="text-[8px] font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest text-center">
                    <LibreTrans text="Sell Items" />
                  </span>
               </button>
               <button onClick={() => setActiveTab('history')} className="p-4 bg-emerald-200 dark:bg-emerald-900 rounded-[2rem] border border-emerald-300 dark:border-emerald-800 flex flex-col items-center gap-2 active:scale-95 transition-all">
                  <div className="w-10 h-10 bg-emerald-950 dark:bg-emerald-400 rounded-xl flex items-center justify-center text-white dark:text-emerald-950 shadow-lg">
                     <Clock size={20} />
                  </div>
                  <span className="text-[8px] font-black text-emerald-900 dark:text-white uppercase tracking-widest text-center">
                    <LibreTrans text="Records" />
                  </span>
               </button>
            </div>
          </TabsContent>

          <TabsContent value="collection" className="animate-in slide-in-from-right-8 duration-500 outline-none">
            <div className="max-w-3xl mx-auto">
              <CollectionEventForm onSubmit={handleCreateCollection} />
            </div>
          </TabsContent>

          <TabsContent value="history" className="animate-in slide-in-from-left-8 duration-500 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collectionEvents.length === 0 ? (
                <div className="col-span-full py-24 text-center space-y-4 bg-white/50 dark:bg-white/5 rounded-[3rem] border border-dashed border-emerald-200 dark:border-emerald-800">
                   <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HelpCircle size={40} />
                   </div>
                   <h3 className="text-xl font-black text-emerald-950 dark:text-white uppercase tracking-widest italic">{t('noEventsFound')}</h3>
                   <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest opacity-40">Start by adding your first batch</p>
                </div>
              ) : (
                collectionEvents.map((event) => (
                  <div key={event.batch_id} className="card-glass group overflow-hidden border-emerald-100 flex flex-col h-full hover:shadow-2xl hover:shadow-emerald-900/20 transition-all duration-500 hover:-translate-y-2">
                    <div className="p-8 space-y-6 flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900 overflow-hidden border-2 border-white dark:border-white/10 shadow-lg group-hover:rotate-6 transition-transform">
                              <img 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.batch_id}`} 
                                alt="Farmer Avatar" 
                                className="w-full h-full object-cover"
                              />
                           </div>
                           <div className="p-3 bg-emerald-950 dark:bg-emerald-600 text-white rounded-xl shadow-md">
                              <Leaf size={18} />
                           </div>
                        </div>
                        <Badge className={`rounded-full px-4 py-1 font-black text-[9px] uppercase tracking-[0.2em] border-none shadow-sm ${
                          event.status === 'verified' ? 'bg-emerald-500 text-white' : 
                          event.status === 'rejected' ? 'bg-rose-500 text-white' : 
                          'bg-amber-400 text-emerald-950'
                        }`}>
                          <LibreTrans text={event.status || 'pending'} />
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-black text-emerald-950 dark:text-white tracking-tighter leading-tight group-hover:text-emerald-600 transition-colors uppercase italic">
                          <LibreTrans text={event.species} />
                        </h3>
                        <p className="text-[10px] font-bold text-emerald-900/40 dark:text-emerald-400/40 italic flex items-center gap-1.5 uppercase tracking-widest mt-1">
                           <Bot size={10} /> {event.scientific_name}
                        </p>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-emerald-50 dark:border-white/10">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-emerald-900/40 dark:text-white/40">{t('Quantity')}</span>
                          <span className="text-emerald-950 dark:text-white">{event.quantity} kg</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-emerald-900/40 dark:text-white/40">{t('Date')}</span>
                          <span className="text-emerald-950 dark:text-white">{new Date(event.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="pt-4 bg-emerald-50/50 dark:bg-white/5 p-4 rounded-2xl border border-emerald-100/50 dark:border-white/10">
                        <div className="flex items-center justify-between gap-2 overflow-hidden">
                           <div className="flex-1 min-w-0">
                             <p className="text-[8px] font-black text-emerald-900/40 dark:text-white/40 uppercase tracking-widest mb-1">{t('batch_id')}</p>
                             <p className="text-[10px] font-mono font-bold text-emerald-900 dark:text-emerald-400 truncate">{event.batch_id}</p>
                           </div>
                           <button 
                             onClick={() => copyToClipboard(event.batch_id)}
                             className="p-2 bg-white dark:bg-white/10 rounded-xl text-emerald-600 dark:text-white hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                           >
                             <CopyIcon size={14} />
                           </button>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => generateQRCode(event.batch_id)}
                      className="w-full py-5 bg-emerald-950 dark:bg-emerald-900 text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black transition-all group-hover:py-6"
                    >
                      <Languages size={14} /> <LibreTrans text="View QR" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="help" className="animate-in slide-in-from-bottom-8 duration-500 outline-none">
            <div className="max-w-xl mx-auto py-12 text-center space-y-8">
               <div className="w-24 h-24 bg-emerald-100 dark:bg-white/5 text-emerald-600 dark:text-emerald-400 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                  <HelpCircle size={48} />
               </div>
               <div>
                  <h2 className="text-3xl font-black text-emerald-950 dark:text-white tracking-tighter uppercase italic">
                    <LibreTrans text="Help Center" />
                  </h2>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400/60 uppercase tracking-widest mt-2">
                    <LibreTrans text="Get instant answers from AyuSetu AI" />
                  </p>
               </div>
               
               <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
                    className="p-8 bg-emerald-950 dark:bg-emerald-800 text-white rounded-[3rem] shadow-2xl hover:bg-black dark:hover:bg-emerald-700 transition-all flex flex-col items-center gap-4 group"
                  >
                     <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageCircle size={32} />
                     </div>
                     <span className="text-sm font-black uppercase tracking-widest">
                       <LibreTrans text="AyuSetu AI Assistant" />
                     </span>
                  </button>
               </div>
            </div>
          </TabsContent>

          {/* S E L L  Tab */}
          <TabsContent value="sell" className="animate-in slide-in-from-top-8 duration-500 outline-none">
            <div className="max-w-3xl mx-auto space-y-8 pb-32">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mb-4 uppercase tracking-tighter italic"><LibreTrans text="Marketplace" /></h2>
                <button 
                  onClick={() => setShowSalesHistory(!showSalesHistory)}
                  className={`px-6 py-2 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${
                    showSalesHistory 
                    ? 'bg-emerald-950 text-white' 
                    : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                  }`}
                >
                  {showSalesHistory ? <LibreTrans text="Hide History" /> : <LibreTrans text="Your Sales History" />}
                </button>
              </div>

              {showSalesHistory ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                   <h3 className="text-xs font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-2">Recent Sales</h3>
                   {salesHistory.length === 0 ? (
                     <div className="p-12 text-center bg-white/50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-emerald-200 text-emerald-900/30 text-[10px] font-black uppercase tracking-widest italic">
                        No sales recorded yet.
                     </div>
                   ) : (
                     salesHistory.map(sale => (
                       <div key={sale.id} className="p-5 bg-white dark:bg-emerald-900 rounded-[2rem] border border-emerald-100 dark:border-emerald-800 shadow-sm flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                                <TrendingUp size={24} />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5"><LibreTrans text={sale.company} /></p>
                                <h4 className="text-sm font-bold text-emerald-950 dark:text-white uppercase tracking-tight"><LibreTrans text={sale.crop} /> • {sale.quantity} kg</h4>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-lg font-black text-emerald-950 dark:text-emerald-400 italic leading-none">₹{sale.totalAmount}</p>
                             <p className="text-[8px] font-black text-emerald-900/30 uppercase tracking-widest mt-1"><LibreTrans text="Confirmed" /></p>
                          </div>
                       </div>
                     ))
                   )}
                </div>
              ) : (
                <>
                {loadingDemands ? (
                <div className="text-center text-emerald-500 py-20 flex flex-col items-center gap-4">
                   <RefreshCw className="animate-spin text-emerald-600" size={40} />
                   <span className="text-[10px] font-black uppercase tracking-widest"><LibreTrans text="Fetching Demands..." /></span>
                </div>
              ) : demands.length === 0 ? (
                <div className="text-center py-24 space-y-6 bg-white/50 dark:bg-white/5 rounded-[3rem] border border-dashed border-emerald-200">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                     <ShoppingCart size={40} />
                  </div>
                  <p className="text-sm font-bold text-emerald-800/40 uppercase tracking-widest italic">
                    No open demands available in your region yet.
                  </p>
                  {import.meta.env.DEV && (
                    <button
                      className="px-8 py-4 bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-emerald-700 transition-all active:scale-95"
                      onClick={async () => {
                        const { seedDemoDemands } = await import('../lib/firebase');
                        await seedDemoDemands(db);
                        window.location.reload();
                      }}
                    >
                      Seed Demo Demands
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {demands.map((demand) => (
                    <div key={demand.id} className="p-6 bg-white dark:bg-emerald-900 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-emerald-950 dark:text-white uppercase italic tracking-tight"><LibreTrans text={demand.title} /></h3>
                          <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest"><LibreTrans text={demand.company} /></p>
                        </div>
                        <Badge className="rounded-full px-4 py-1 font-black text-[9px] uppercase tracking-[0.2em] bg-emerald-100 text-emerald-600 border-none"><LibreTrans text={demand.crop} /></Badge>
                      </div>
                      <p className="text-sm text-emerald-800 dark:text-emerald-200/70 mt-1 leading-relaxed"><LibreTrans text={demand.description} /></p>
                      <div className="flex items-center gap-6 mt-2 pt-4 border-t border-emerald-50 shrink-0">
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black uppercase text-emerald-900/30 tracking-widest"><LibreTrans text="Required" /></span>
                           <span className="text-xs font-bold text-emerald-900 dark:text-white uppercase">{demand.quantity} kg</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black uppercase text-emerald-900/30 tracking-widest"><LibreTrans text="Industry Rate" /></span>
                           <span className="text-xs font-bold text-emerald-600 uppercase">
                              ₹{demand.rate || (demand.crop.toLowerCase().includes('wheat') ? 22.50 : demand.crop.toLowerCase().includes('rice') ? 44.00 : 19.75)}/kg
                           </span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black uppercase text-emerald-900/30 tracking-widest"><LibreTrans text="Posted" /></span>
                           <span className="text-xs font-bold text-emerald-900 dark:text-white">{new Date(demand.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        {respondedIds.includes(demand.id!) ? (
                          <div className="flex items-center gap-2 text-emerald-600 pt-2">
                             <CheckCircle size={14} />
                             <span className="text-[10px] font-black uppercase tracking-widest">Sold / Responded</span>
                          </div>
                        ) : (
                          <button
                            className="w-full py-4 bg-emerald-950 dark:bg-emerald-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                            onClick={() => handleRespond(demand)}
                          >
                            <LibreTrans text="Sell / Respond Now" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

            {/* Sell Modal */}
            {sellModal?.open && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-6">
                <div className="bg-white dark:bg-emerald-950 p-10 rounded-[3rem] shadow-2xl w-full max-w-sm flex flex-col gap-6 animate-in zoom-in-95 duration-300 border border-emerald-100/50">
                  <div>
                    <h3 className="text-2xl font-black text-emerald-950 dark:text-white uppercase italic tracking-tighter">Sell to {sellModal.demand.company}</h3>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">Quantity Entry</p>
                  </div>
                  
                  <div className="p-4 bg-emerald-50 dark:bg-white/5 rounded-2xl border border-emerald-100 flex flex-col gap-2">
                    <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-1">Company Needs</p>
                    <div className="flex justify-between items-center">
                       <p className="text-sm font-bold text-emerald-950 dark:text-white">{sellModal.demand.crop} - {sellModal.demand.quantity} kg</p>
                       <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                          @ ₹{sellModal.demand.rate || (sellModal.demand.crop.toLowerCase().includes('wheat') ? 22.50 : sellModal.demand.crop.toLowerCase().includes('rice') ? 44.00 : 19.75)}/kg
                       </p>
                    </div>
                    {sellQty && (
                      <div className="pt-2 border-t border-emerald-100 mt-2 flex justify-between items-center">
                         <span className="text-[10px] font-black text-emerald-900/60 uppercase">Est. Total</span>
                         <span className="text-lg font-black text-emerald-950 dark:text-white italic tracking-tighter">
                            ₹{(Number(sellQty) * (sellModal.demand.rate || (sellModal.demand.crop.toLowerCase().includes('wheat') ? 22.50 : sellModal.demand.crop.toLowerCase().includes('rice') ? 44.00 : 19.75))).toFixed(2)}
                         </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-1">Your Sale Quantity (kg)</label>
                    <input
                      type="number"
                      min="1"
                      max={sellModal.demand.quantity}
                      className="w-full h-14 bg-emerald-50 dark:bg-white/5 border-2 border-emerald-100 dark:border-white/10 rounded-2xl px-6 font-bold text-emerald-950 dark:text-white focus:border-emerald-500 outline-none transition-all placeholder:text-emerald-900/20"
                      placeholder="e.g. 50"
                      value={sellQty}
                      onChange={e => setSellQty(e.target.value)}
                      disabled={sellLoading}
                    />
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    <button
                      className="h-14 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-xl shadow-emerald-500/20"
                      onClick={handleConfirmSell}
                      disabled={sellLoading || !sellQty || Number(sellQty) < 1}
                    >
                      {sellLoading ? 'Processing...' : 'Confirm Sale'}
                    </button>
                    <button
                      className="h-14 bg-emerald-50 dark:bg-emerald-900 text-emerald-600 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all"
                      onClick={() => setSellModal(null)}
                      disabled={sellLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {showQR && (
        <div className="fixed inset-0 bg-emerald-950/90 dark:bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-emerald-950 p-8 sm:p-12 rounded-[4rem] max-w-sm w-full relative animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border dark:border-white/10">
            <button 
              onClick={() => setShowQR(null)}
              className="absolute -top-4 -right-4 p-4 bg-white dark:bg-emerald-900 text-emerald-950 dark:text-white rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all border border-emerald-50 dark:border-white/10"
            >
              <X size={24} />
            </button>
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-white/10 rounded-full">
                 <ShieldCheck size={12} className="text-emerald-500" />
                 <span className="text-[9px] font-black text-emerald-900 dark:text-white uppercase tracking-widest">{t('brand')} Verified ID</span>
              </div>
              <div className="bg-emerald-50 dark:bg-white p-8 rounded-[3rem] border border-emerald-100 flex items-center justify-center">
                <img src={qrDataUrl} alt="QR Code" className="w-full aspect-square mix-blend-multiply" />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-emerald-900/40 dark:text-white/40 uppercase tracking-[0.2em] mb-2">{t('batch_id')}</h3>
                <p className="text-sm font-mono font-bold text-emerald-950 dark:text-emerald-400 break-all bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-emerald-50 dark:border-white/10">{showQR}</p>
              </div>
              <button 
                onClick={downloadQR}
                className="w-full py-5 rounded-3xl bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <DownloadIcon size={18} /> {t('download_qr')}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />



      <SimpleChatbot />
    </div>
  );
};
