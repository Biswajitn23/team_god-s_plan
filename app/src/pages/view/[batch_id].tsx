import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { 
  Leaf, 
  MapPin, 
  User, 
  ShieldCheck, 
  Clock, 
  Package, 
  Info,
  CheckCircle2,
  AlertCircle,
  Truck,
  Factory,
  Beaker
} from "lucide-react";

export default function ViewCollection() {
  const { batch_id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!batch_id) return;
      setLoading(true);
      
      try {
        // 1. Try Global Firestore first
        const q = query(collection(db, "crops"), where("batch_id", "==", batch_id));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setData(querySnapshot.docs[0].data());
          setLoading(false);
          return;
        }

        // 2. Fallback to Local Storage (for legacy/offline records)
        const localData = localStorage.getItem('collections_data');
        if (localData) {
          const collections = JSON.parse(localData);
          const found = collections.find((c: any) => c.batch_id === batch_id);
          if (found) {
            setData(found);
            setLoading(false);
            return;
          }
        }

        setError("This batch record could not be found on the chain.");
      } catch (err) {
        console.error("Error fetching batch:", err);
        setError("Unable to connect to the authentication node.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [batch_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50/30 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-sm font-black text-emerald-900 uppercase tracking-widest animate-pulse">Verifying Batch Authenticity...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-red-500/10">
          <AlertCircle size={48} />
        </div>
        <h1 className="text-2xl font-black text-emerald-950 uppercase tracking-tighter italic">Record Not Found</h1>
        <p className="mt-4 text-emerald-700/60 max-w-xs mx-auto text-sm font-medium leading-relaxed">
          The requested batch ID does not exist in our secure digital ledger. Please verify the QR code.
        </p>
      </div>
    );
  }

  const createdDate = data.created_at?.toDate ? data.created_at.toDate() : new Date(data.created_at);
  const currentStage = data.current_stage || 1; // Default to 1 (Collection)

  const steps = [
    { 
      id: 1, 
      title: "Wild Collection", 
      icon: MapPin, 
      desc: `Harvested by ${data.farmer_name || "Verified Farmer"}`,
      details: [`Location: ${data.location}`, `Method: ${data.method}`]
    },
    { 
      id: 2, 
      title: "Quality Grading", 
      icon: Beaker, 
      desc: "Authenticity & Purity Test",
      details: ["Moisture: 8.5%", "Purity Score: 98%"]
    },
    { 
      id: 3, 
      title: "Central Processing", 
      icon: Factory, 
      desc: "Cleaning & Packaging",
      details: ["Node: Haridwar Hub", "Temp: 22°C Controlled"]
    },
    { 
      id: 4, 
      title: "Final Dispatch", 
      icon: Truck, 
      desc: "Ready for Consumer Distribution",
      details: ["Status: Batch Released", "Seal: Digital Cryptoseal"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafdfb] selection:bg-emerald-200">
      {/* Header Overlay */}
      <div className="h-72 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fafdfb] to-transparent"></div>
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
          <Leaf size={300} />
        </div>
        
        <div className="max-w-2xl mx-auto px-6 pt-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-400/20 backdrop-blur-md border border-emerald-400/30 rounded-full mb-6">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.2em]">Provenance Verified</span>
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none mb-1">
            {data.species}
          </h1>
          <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">{data.scientific_name}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-24 relative z-20 pb-20">
        <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(6,78,59,0.1)] border border-emerald-100/50 p-8 mb-12 overflow-hidden relative">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.25em]">Batch ID</span>
                <h2 className="text-lg font-mono font-bold text-emerald-950 mt-1">{data.batch_id}</h2>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.25em]">Registered</span>
                <p className="text-sm font-bold text-emerald-950 mt-1">{createdDate.toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100/50 flex flex-col items-center justify-center">
                <Package className="text-emerald-600 mb-2" size={24} />
                <span className="text-[10px] font-black text-emerald-900/40 uppercase mb-1">Weight</span>
                <span className="text-2xl font-black text-emerald-950 italic">{data.quantity} kg</span>
              </div>
              <div className="p-6 bg-emerald-950 rounded-[2rem] flex flex-col items-center justify-center text-white">
                <Leaf className="text-emerald-400 mb-2" size={24} />
                <span className="text-[10px] font-black text-white/40 uppercase mb-1">Method</span>
                <span className="text-2xl font-black italic capitalize text-center leading-none">{data.method}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="space-y-10">
          <h3 className="text-sm font-black text-emerald-900 uppercase tracking-[0.3em] ml-2 flex items-center gap-3">
             <Clock size={16} className="text-emerald-500" />
             Chain of Transparency
          </h3>

          <div className="relative pl-12 space-y-16">
            <div className="absolute left-[1.35rem] top-2 bottom-8 w-1 bg-gradient-to-b from-emerald-500 via-emerald-200 to-transparent rounded-full opacity-30 shadow-inner"></div>

            {steps.map((step) => {
              const isCompleted = step.id <= currentStage;
              const isCurrent = step.id === currentStage;
              const Icon = step.icon;

              return (
                <div key={step.id} className={`relative group transition-opacity duration-700 ${!isCompleted ? 'opacity-30' : 'opacity-100'}`}>
                  <div className={`absolute -left-12 w-11 h-11 bg-white rounded-2xl border-4 transition-all duration-700 flex items-center justify-center z-10 shadow-lg ${
                    isCompleted ? 'border-emerald-500 text-emerald-500' : 'border-emerald-100 text-emerald-200'
                  } ${isCurrent ? 'scale-125 ring-8 ring-emerald-500/10' : ''}`}>
                    <Icon size={20} className={isCurrent ? 'animate-pulse' : ''} />
                  </div>

                  <div className={`bg-white p-8 rounded-[2.5rem] border transition-all duration-700 ${
                    isCompleted ? 'border-emerald-100 shadow-sm' : 'border-emerald-50 grayscale'
                  } ${isCurrent ? 'ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-500/5' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-black text-emerald-950 uppercase italic tracking-tight">{step.title}</h4>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isCompleted ? 'text-emerald-500' : 'text-emerald-300'}`}>
                          {isCurrent ? "IN PROGRESS" : isCompleted ? "COMPLETED" : "AWAITING"}
                        </p>
                      </div>
                      {isCompleted && <CheckCircle2 size={24} className="text-emerald-500" />}
                    </div>
                    
                    <div className="flex flex-col gap-3 text-sm font-medium text-emerald-800">
                      <p className="opacity-80">{step.desc}</p>
                      {isCompleted && (
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {step.details.map((detail, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-emerald-50/50 rounded-xl border border-emerald-100/30 text-[11px] font-bold text-emerald-700">
                              <Info size={12} className="shrink-0" />
                              {detail}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center border-t border-emerald-100 pt-16">
            <div className="flex items-center justify-center gap-2 mb-6 opacity-40">
              <Leaf size={24} />
              <span className="text-xl font-black uppercase italic tracking-tighter">AyuSetu</span>
            </div>
            <p className="text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.4em] mb-4 italic">Blockchain Traceability Node: Valid</p>
            <div className="h-1 w-12 bg-emerald-500 mx-auto rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
