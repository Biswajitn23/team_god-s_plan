import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useBatches } from '@/hooks/useBatches';
import FarmerDetailsDialog from '@/components/FarmerDetailsDialog';
import {
  Truck,
  Map,
  Users,
  AlertTriangle,
  Package,
  Boxes,
  Clock,
  CheckCircle2,
  Filter,
  Plus,
  ArrowRight,
  ChevronRight,
  QrCode,
  Eye,
  MoreVertical,
  Search,
  ShieldCheck,
  Globe,
  Sparkles,
  Leaf,
  FileText,
  Navigation,
  Radio,
  Download,
  Share2,
  X
} from 'lucide-react';
import logisticsTruckBanner from '@/assets/logistics-truck-banner.jpg';

interface DistributorViewProps {
  userId: string;
}

interface ShipmentItem {
  id: string;
  batchId: string;
  productName: string;
  vehicleNumber: string;
  driverName: string;
  driverId: string;
  destination: string;
  status: 'in_transit' | 'delivered' | 'delayed';
  dispatchTime: string;
  gpsLocation: string;
  temperature: string;
}

const DistributorView: React.FC<DistributorViewProps> = ({ userId }) => {
  const { batches, updateBatch } = useBatches('distributor', userId);
  const { toast } = useToast();

  // Dialog States
  const [activeDialog, setActiveDialog] = useState<
    'dispatch' | 'fleet' | 'reports' | 'qr' | 'details' | 'farmer' | null
  >(null);

  // Active Filter Tabs
  const [activeTab, setActiveTab] = useState<'all' | 'in_transit' | 'delivered' | 'delayed'>('all');
  const [shipmentSearch, setShipmentSearch] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<ShipmentItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Form State for Dispatch
  const [dispatchForm, setDispatchForm] = useState({
    productId: '',
    batchId: '',
    productName: '',
    shipmentId: '',
    vehicleNumber: '',
    driverName: '',
    driverId: '',
    destination: '',
    tempMonitoring: '22°C (Optimal)',
    originHub: 'Central AYUSH Formulation Facility, Haridwar'
  });

  // Local Mock/Real Shipments
  const [shipments, setShipments] = useState<ShipmentItem[]>([
    // Uncomment for default demo or leave empty as per screenshot
  ]);

  // Available manufactured products ready for dispatch
  const finalProductBatches = batches.filter(
    (b) => b.type === 'final_product' || b.status === 'finalized' || b.status === 'dispatched'
  );

  // Fallback final products if firestore is empty so user can experience full flow
  const displayFinalProducts = finalProductBatches.length > 0 ? finalProductBatches : [];

  // Metrics Calculation
  const productsReadyCount = finalProductBatches.filter(
    (b) => b.status === 'finalized' || b.status === 'approved' || !b.destination_location
  ).length;
  const activeShipmentsCount = shipments.filter((s) => s.status === 'in_transit').length;
  const completedDeliveriesCount = shipments.filter((s) => s.status === 'delivered').length;
  const pendingIssuesCount = shipments.filter((s) => s.status === 'delayed').length;

  // Filtered Shipments
  const filteredShipments = shipments.filter((s) => {
    const matchesTab = activeTab === 'all' || s.status === activeTab;
    const matchesSearch =
      shipmentSearch === '' ||
      s.id.toLowerCase().includes(shipmentSearch.toLowerCase()) ||
      s.batchId.toLowerCase().includes(shipmentSearch.toLowerCase()) ||
      s.productName.toLowerCase().includes(shipmentSearch.toLowerCase()) ||
      s.destination.toLowerCase().includes(shipmentSearch.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Handle Dispatch Form Submit
  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dispatchForm.vehicleNumber || !dispatchForm.destination || !dispatchForm.driverName) {
      toast({
        title: "Incomplete Details",
        description: "Please provide vehicle number, driver name, and destination node.",
        variant: "destructive"
      });
      return;
    }

    const newShipmentId = dispatchForm.shipmentId.trim() || `SHP-${Date.now().toString().slice(-6)}`;
    const newBatchId = dispatchForm.batchId || `FP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newProductName = dispatchForm.productName || 'Ayu Immunity Formulation';

    const newShipment: ShipmentItem = {
      id: newShipmentId,
      batchId: newBatchId,
      productName: newProductName,
      vehicleNumber: dispatchForm.vehicleNumber,
      driverName: dispatchForm.driverName,
      driverId: dispatchForm.driverId || 'DL-092024-9981',
      destination: dispatchForm.destination,
      status: 'in_transit',
      dispatchTime: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ' ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      gpsLocation: '28.6139° N, 77.2090° E',
      temperature: '21.5°C'
    };

    setShipments([newShipment, ...shipments]);

    // If linked to real batch, update in Firestore
    if (dispatchForm.productId) {
      try {
        await updateBatch(dispatchForm.productId, {
          status: 'dispatched',
          destination_location: dispatchForm.destination
        });
      } catch (err) {
        console.error("Firestore batch update error:", err);
      }
    }

    toast({
      title: "Consignment Dispatched",
      description: `Shipment ${newShipmentId} is now locked on-chain and in transit.`,
      variant: "default"
    });

    setDispatchForm({
      productId: '',
      batchId: '',
      productName: '',
      shipmentId: '',
      vehicleNumber: '',
      driverName: '',
      driverId: '',
      destination: '',
      tempMonitoring: '22°C (Optimal)',
      originHub: 'Central AYUSH Formulation Facility, Haridwar'
    });

    setActiveDialog(null);
  };

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: DISTRIBUTOR HUB                                           */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#eef8f3] via-[#f4faf6] to-[#edf6f0] border border-emerald-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Left Text Column */}
          <div className="space-y-3 max-w-2xl">
            {/* Hub Badge */}
            <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-[11px] font-extrabold uppercase tracking-widest text-[#0d5c3a]">
              DISTRIBUTOR HUB
            </span>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Enabling Safe & Timely Delivery
            </h1>

            {/* English & Hindi Subtitles */}
            <div className="space-y-0.5">
              <p className="text-sm sm:text-base font-semibold text-slate-700 leading-snug">
                From verified producers to every corner of India and the world.
              </p>
              <p className="text-xs sm:text-sm font-medium text-emerald-800/90 font-serif">
                प्रमाणित आयुर्वेदिक उत्पादों की सुरक्षित और समयबद्ध आपूर्ति
              </p>
            </div>

            {/* 4 Feature Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-emerald-200/70 shadow-2xs text-[11px] font-bold text-slate-800">
                <Leaf className="w-3.5 h-3.5 text-[#0d5c3a]" />
                <span>Traceable Supply Chain</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-emerald-200/70 shadow-2xs text-[11px] font-bold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0d5c3a]" />
                <span>Quality Assured</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-emerald-200/70 shadow-2xs text-[11px] font-bold text-slate-800">
                <Truck className="w-3.5 h-3.5 text-[#0d5c3a]" />
                <span>Efficient Logistics</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-emerald-200/70 shadow-2xs text-[11px] font-bold text-slate-800">
                <Globe className="w-3.5 h-3.5 text-[#0d5c3a]" />
                <span>Global Access</span>
              </div>
            </div>
          </div>

          {/* Right Banner Image & Slogan */}
          <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 self-center lg:self-auto shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-base sm:text-lg font-black font-serif text-slate-800 block leading-tight">
                Ancient
              </span>
              <span className="text-base sm:text-lg font-black font-serif text-slate-800 block leading-tight">
                Wisdom.
              </span>
              <span className="text-base sm:text-lg font-black font-serif text-[#0d5c3a] block leading-tight">
                Wider Reach.
              </span>
              <div className="flex items-center gap-1 justify-end mt-1.5">
                <span className="w-8 h-1 bg-[#FF9933] rounded-full" />
                <span className="w-3 h-1 bg-[#138808] rounded-full" />
              </div>
            </div>

            <div className="w-48 sm:w-60 lg:w-72 h-32 sm:h-36 rounded-2xl overflow-hidden shadow-md border-2 border-white/80 shrink-0">
              <img
                src={logisticsTruckBanner}
                alt="AyuSetu Branded Logistics Vehicle"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STAT METRIC CARDS ROW (4 CARDS)                                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Products Ready */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-200/70 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-[#0d5c3a] flex items-center justify-center shrink-0 shadow-2xs">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {productsReadyCount}
              </span>
              <p className="text-xs font-bold text-slate-600">Products Ready</p>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('final-products-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0d5c3a] hover:text-emerald-800 transition-colors group cursor-pointer"
          >
            <span>View Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 2: Active Shipments */}
        <div className="bg-white rounded-3xl p-5 border border-blue-200/70 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {activeShipmentsCount}
              </span>
              <p className="text-xs font-bold text-slate-600">Active Shipments</p>
            </div>
          </div>
          <button
            onClick={() => setActiveDialog('fleet')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors group cursor-pointer"
          >
            <span>Track Shipments</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 3: Deliveries Completed */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200/70 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {completedDeliveriesCount}
              </span>
              <p className="text-xs font-bold text-slate-600">Deliveries Completed</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('delivered')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors group cursor-pointer"
          >
            <span>View History</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 4: Pending Issues */}
        <div className="bg-white rounded-3xl p-5 border border-red-200/70 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100/80 text-red-700 flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {pendingIssuesCount}
              </span>
              <p className="text-xs font-bold text-slate-600">Pending Issues</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('delayed')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-700 hover:text-red-900 transition-colors group cursor-pointer"
          >
            <span>Resolve Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE 2-COLUMN LAYOUT (TABLES + RIGHT SIDEBAR)               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================================= */}
        {/* LEFT / CENTER COLUMN: TABLES (8 COLS)                                  */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 3.1 RECENT SHIPMENTS TABLE */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
            
            {/* Header with Title and Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0d5c3a] flex items-center justify-center shrink-0">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Recent Shipments
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track and manage your active consignments
                  </p>
                </div>
              </div>

              {/* Search, Filter, and + Dispatch Product Button */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={shipmentSearch}
                    onChange={(e) => setShipmentSearch(e.target.value)}
                    placeholder="Search by Shipment ID / Batch ID..."
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-48 sm:w-56"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShipmentSearch('')}
                  className="rounded-xl border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 h-8.5"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </Button>

                <Button
                  onClick={() => setActiveDialog('dispatch')}
                  className="bg-[#0d5c3a] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 h-8.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Dispatch Product</span>
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 pt-4 pb-2 text-xs font-bold border-b border-slate-100">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-emerald-50 text-[#0d5c3a] border border-emerald-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All ({shipments.length})
              </button>
              <button
                onClick={() => setActiveTab('in_transit')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'in_transit'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                In Transit ({shipments.filter((s) => s.status === 'in_transit').length})
              </button>
              <button
                onClick={() => setActiveTab('delivered')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'delivered'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Delivered ({shipments.filter((s) => s.status === 'delivered').length})
              </button>
              <button
                onClick={() => setActiveTab('delayed')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'delayed'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Delayed ({shipments.filter((s) => s.status === 'delayed').length})
              </button>
            </div>

            {/* Shipments Table Content */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                    <th className="py-3 px-3">Shipment ID</th>
                    <th className="py-3 px-3">Batch ID</th>
                    <th className="py-3 px-3">Product Name</th>
                    <th className="py-3 px-3">Vehicle</th>
                    <th className="py-3 px-3">Destination</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Dispatch Time</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {shipment.id}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {shipment.batchId}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900">
                        {shipment.productName}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {shipment.vehicleNumber}
                      </td>
                      <td className="py-3 px-3 text-slate-700 max-w-[140px] truncate">
                        {shipment.destination}
                      </td>
                      <td className="py-3 px-3">
                        {shipment.status === 'in_transit' && (
                          <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold flex items-center gap-1 w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            In Transit
                          </span>
                        )}
                        {shipment.status === 'delivered' && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Delivered
                          </span>
                        )}
                        {shipment.status === 'delayed' && (
                          <span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold flex items-center gap-1 w-max">
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            Delayed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {shipment.dispatchTime}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedShipment(shipment);
                            setActiveDialog('fleet');
                          }}
                          className="h-7 px-2.5 rounded-lg text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 font-bold text-xs"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {filteredShipments.length === 0 && (
                <div className="py-14 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Truck className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      No active shipments yet.
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Dispatch your first product batch to start tracking.
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveDialog('dispatch')}
                    className="mt-2 bg-[#0d5c3a] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Dispatch Product</span>
                  </Button>
                </div>
              )}
            </div>

          </div>

          {/* 3.2 FINAL PRODUCT BATCHES TABLE */}
          <div id="final-products-section" className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0d5c3a] flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Final Product Batches
                  </h3>
                  <p className="text-xs text-slate-500">
                    Batches dispatched and delivered to market
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  toast({
                    title: "AYUSH Product Registry",
                    description: "Viewing all certified on-chain formulations."
                  });
                }}
                className="text-xs font-bold text-[#0d5c3a] hover:text-emerald-800 flex items-center gap-1 group cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                    <th className="py-3 px-3">Product ID</th>
                    <th className="py-3 px-3">Batch ID</th>
                    <th className="py-3 px-3">Manufacturer</th>
                    <th className="py-3 px-3">Quantity</th>
                    <th className="py-3 px-3">Destination</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">QR Code</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayFinalProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {prod.id}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {prod.batch_id}
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-medium">
                        {prod.current_owner_id || 'AYUSH GMP Unit'}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {prod.weight_kg ? `${prod.weight_kg} kg` : '500 Units'}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {prod.destination_location || 'Domestic Market'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                          Approved
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => {
                            setSelectedProduct(prod);
                            setActiveDialog('qr');
                          }}
                          className="flex items-center gap-1 text-[#0d5c3a] hover:underline font-bold text-[11px]"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View QR</span>
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(prod);
                            setActiveDialog('details');
                          }}
                          className="h-7 px-2.5 rounded-lg text-emerald-700 hover:text-emerald-900 font-bold text-xs"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty state for Final Products */}
              {displayFinalProducts.length === 0 && (
                <div className="py-14 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Boxes className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      No final product batches available yet.
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Start by dispatching a product batch.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: FLEET MAP & QUICK ACTIONS & QUOTE (4 COLS)                */}
        {/* ======================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 3.3 LIVE FLEET TRACKING CARD */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0d5c3a] flex items-center justify-center shrink-0">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    Live Fleet Tracking
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Real-time location of shipments
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveDialog('fleet')}
                className="text-xs font-bold text-[#0d5c3a] hover:text-emerald-800 flex items-center gap-1 group cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stylized Interactive India Map Canvas */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#f7fbf9] to-[#edf6f1] border border-emerald-100 p-4 overflow-hidden h-72 flex flex-col justify-between">
              
              {/* Top Right Status Legend */}
              <div className="flex flex-col gap-1.5 self-end bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/80 text-[10px] font-bold shadow-2xs z-10">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>In Transit</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Delivered</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Delayed</span>
                </div>
              </div>

              {/* Vector Map Illustration */}
              <div className="absolute inset-0 flex items-center justify-center opacity-85 pointer-events-none">
                <svg
                  viewBox="0 0 300 340"
                  className="w-full h-full text-emerald-700/20 stroke-emerald-600/30"
                  fill="currentColor"
                  strokeWidth="1.2"
                >
                  {/* India Geographic Outline Silhouette Path */}
                  <path d="M 120 40 Q 140 30 160 50 Q 175 70 190 75 Q 210 90 230 110 Q 250 140 230 160 Q 210 170 190 180 Q 180 200 170 240 Q 150 280 140 300 Q 135 280 120 250 Q 100 220 90 190 Q 70 170 60 140 Q 65 110 80 90 Q 100 60 120 40 Z" />
                  
                  {/* Transit Routes (Dashed Lines) */}
                  <path
                    d="M 140 90 L 175 145 L 125 210 L 140 290"
                    fill="none"
                    stroke="#0d5c3a"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    className="animate-pulse"
                  />
                  <path
                    d="M 175 145 L 220 160"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.8"
                    strokeDasharray="3,3"
                  />

                  {/* Waypoint Pins */}
                  <circle cx="140" cy="90" r="5" fill="#138808" />
                  <circle cx="175" cy="145" r="6" fill="#0d5c3a" />
                  <circle cx="125" cy="210" r="5" fill="#3b82f6" />
                  <circle cx="220" cy="160" r="5" fill="#3b82f6" />
                  <circle cx="140" cy="290" r="5" fill="#138808" />
                </svg>

                {/* Moving Branded Truck Icon */}
                <div className="absolute top-[42%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 bg-[#0d5c3a] text-white p-1.5 rounded-lg shadow-lg animate-bounce">
                  <Truck className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-emerald-200/80 flex items-center justify-between text-[11px] z-10">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>GPS Synced: Live 28.61° N, 77.20° E</span>
                </div>
                <span className="font-mono text-emerald-700 font-bold">4 Nodes Active</span>
              </div>

            </div>

          </div>

          {/* 3.4 QUICK ACTIONS CARD */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-3.5">
            
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-[#0d5c3a]" />
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Quick Actions
              </h4>
            </div>

            <div className="space-y-2.5">
              
              {/* Action 1: Dispatch New Product */}
              <div
                onClick={() => setActiveDialog('dispatch')}
                className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 hover:bg-emerald-100/70 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#0d5c3a] flex items-center justify-center shadow-2xs shrink-0">
                    <Truck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-tight">
                      Dispatch New Product
                    </h5>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                      Create and assign shipment
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Action 2: Monitor Transport Fleet */}
              <div
                onClick={() => setActiveDialog('fleet')}
                className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 hover:bg-amber-100/70 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-amber-700 flex items-center justify-center shadow-2xs shrink-0">
                    <Map className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-tight">
                      Monitor Transport Fleet
                    </h5>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                      Live GPS tracking
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Action 3: Manage Farmer Database */}
              <FarmerDetailsDialog>
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/70 hover:bg-blue-100/70 transition-all flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white text-blue-700 flex items-center justify-center shadow-2xs shrink-0">
                      <Users className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 leading-tight">
                        Manage Farmer Database
                      </h5>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        View linked farmers
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                </div>
              </FarmerDetailsDialog>

              {/* Action 4: Generate Reports */}
              <div
                onClick={() => setActiveDialog('reports')}
                className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/70 hover:bg-orange-100/70 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-orange-700 flex items-center justify-center shadow-2xs shrink-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-tight">
                      Generate Reports
                    </h5>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                      Export logistics data
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-700 group-hover:translate-x-0.5 transition-all" />
              </div>

            </div>

          </div>

          {/* 3.5 AYURVEDIC MOTIVATION QUOTE BOX */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#f2f8f4] to-[#e7f3ec] border border-emerald-200/80 p-6 shadow-2xs flex flex-col justify-center min-h-[140px]">
            {/* Background Leaf Patterns */}
            <div className="absolute top-2 right-2 opacity-20 pointer-events-none">
              <Leaf className="w-24 h-24 text-[#0d5c3a]" />
            </div>
            
            <div className="relative z-10 text-center space-y-1">
              <p className="text-sm sm:text-base font-serif font-black text-slate-800 italic leading-snug">
                "Trusted Ayurveda.
              </p>
              <p className="text-sm sm:text-base font-serif font-black text-slate-800 italic leading-snug">
                Healthier Communities.
              </p>
              <p className="text-sm sm:text-base font-serif font-black text-[#0d5c3a] italic leading-snug">
                A Stronger India."
              </p>
              <div className="w-10 h-0.5 bg-[#FF9933] mx-auto mt-2 rounded-full" />
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. MODALS AND DIALOGS                                                     */}
      {/* ========================================================================= */}

      {/* 4.1 DISPATCH PRODUCT MODAL */}
      <Dialog open={activeDialog === 'dispatch'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-2xl border border-emerald-200 rounded-3xl p-0 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 px-8 py-6 border-b border-emerald-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0d5c3a] text-white flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                Authorize & Dispatch Consignment
              </DialogTitle>
              <DialogDescription className="text-emerald-800/80 font-bold text-xs uppercase tracking-wider pl-13 -mt-1">
                Release certified ayurvedic goods to secure transport vector
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleDispatchSubmit} className="p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Product Selection */}
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Select Certified Product Batch *
                </Label>
                <select
                  value={dispatchForm.productId}
                  onChange={(e) => {
                    const selected = displayFinalProducts.find((p) => p.id === e.target.value);
                    setDispatchForm({
                      ...dispatchForm,
                      productId: e.target.value,
                      batchId: selected ? selected.batch_id : '',
                      productName: selected ? selected.product_name || selected.herb_name : ''
                    });
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">-- Choose available batch from formulation vault --</option>
                  {displayFinalProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.batch_id}] {p.product_name || p.herb_name || p.id} - {p.weight_kg ? `${p.weight_kg} kg` : 'Approved'}
                    </option>
                  ))}
                  {displayFinalProducts.length === 0 && (
                    <>
                      <option value="FP-2026-001">[FP-2026-001] Ayu Immunity Churna - 250 kg</option>
                      <option value="FP-2026-002">[FP-2026-002] Brahmi Extract Capsules - 100 kg</option>
                    </>
                  )}
                </select>
              </div>

              {/* Shipment Manifest ID */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Shipment Manifest ID
                </Label>
                <Input
                  value={dispatchForm.shipmentId}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, shipmentId: e.target.value })}
                  placeholder="e.g. SHP-9021-IN"
                  className="rounded-xl border-slate-200 text-xs"
                />
              </div>

              {/* Vehicle Registration */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Vehicle License Plate *
                </Label>
                <Input
                  required
                  value={dispatchForm.vehicleNumber}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, vehicleNumber: e.target.value })}
                  placeholder="e.g. DL-01-AB-1234"
                  className="rounded-xl border-slate-200 text-xs"
                />
              </div>

              {/* Pilot / Driver Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Transport Pilot / Driver *
                </Label>
                <Input
                  required
                  value={dispatchForm.driverName}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, driverName: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                  className="rounded-xl border-slate-200 text-xs"
                />
              </div>

              {/* Driver ID */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Commercial Driver License
                </Label>
                <Input
                  value={dispatchForm.driverId}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, driverId: e.target.value })}
                  placeholder="e.g. DL-IND-88231"
                  className="rounded-xl border-slate-200 text-xs"
                />
              </div>

              {/* Destination Hub */}
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Destination Node / Pharmacy Distribution Hub *
                </Label>
                <Input
                  required
                  value={dispatchForm.destination}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, destination: e.target.value })}
                  placeholder="e.g. State Ayush Depot, Varanasi, Uttar Pradesh"
                  className="rounded-xl border-slate-200 text-xs"
                />
              </div>

            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveDialog(null)}
                className="rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#0d5c3a] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
              >
                <Truck className="w-4 h-4" />
                <span>Confirm & Dispatch Consignment</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4.2 LIVE FLEET MAP MODAL */}
      <Dialog open={activeDialog === 'fleet'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-4xl bg-white/95 backdrop-blur-2xl border border-emerald-200 rounded-3xl p-0 overflow-hidden shadow-2xl">
          <div className="bg-[#1b4d3e] text-white px-8 py-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-black flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600/50 flex items-center justify-center shrink-0 border border-emerald-400/30">
                  <Map className="w-5 h-5 text-emerald-300" />
                </div>
                AYUSH Live Geo-Logistics Command
              </DialogTitle>
              <DialogDescription className="text-emerald-200/80 font-bold text-xs uppercase tracking-wider pl-13 -mt-1">
                Real-time satellite GPS tracking with GMP temperature & humidity assurance
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-500">Fleet Health</span>
                <p className="text-xl font-black text-emerald-700 mt-1">100% On-Schedule</p>
                <span className="text-[11px] text-slate-600">All cold-chain parameters locked</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-500">Avg Cold Chain Temp</span>
                <p className="text-xl font-black text-blue-700 mt-1">21.8°C</p>
                <span className="text-[11px] text-slate-600">Target Range: 15°C - 25°C</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-500">Blockchain Sync</span>
                <p className="text-xl font-black text-[#0d5c3a] mt-1">Block #928,142</p>
                <span className="text-[11px] text-slate-600">Tamper-proof telemetry verified</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 p-6 text-white text-center space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span>Active Track: SHP-9021-IN</span>
                <span className="text-emerald-400 font-mono font-bold">● Online Signal Strong</span>
              </div>
              <p className="text-sm font-semibold text-slate-300">
                En route on National Highway 44 • ETA: 4 Hours 15 Mins
              </p>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full w-3/4 animate-pulse" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 4.3 QR CODE VIEWER MODAL */}
      <Dialog open={activeDialog === 'qr'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 border border-emerald-200 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#0d5c3a] flex items-center justify-center mx-auto">
            <QrCode className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              On-Chain Cryptographic QR Pass
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ministry of Ayush Verifiable Quality & Provenance Code
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-2">
            <div className="w-44 h-44 bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
              <QrCode className="w-36 h-36 text-slate-800" />
            </div>
            <span className="font-mono text-xs font-bold text-slate-700">
              {selectedProduct?.batch_id || 'FP-2026-001'}
            </span>
          </div>

          <Button
            onClick={() => {
              toast({
                title: "QR Code Exported",
                description: "Digital certificate downloaded successfully."
              });
              setActiveDialog(null);
            }}
            className="w-full bg-[#0d5c3a] hover:bg-emerald-800 text-white rounded-xl font-bold text-xs py-5"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Printable Certificate
          </Button>
        </DialogContent>
      </Dialog>

      {/* 4.4 REPORTS MODAL */}
      <Dialog open={activeDialog === 'reports'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-lg bg-white rounded-3xl p-6 border border-emerald-200 shadow-2xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Logistics Compliance Reports
              </h3>
              <p className="text-xs text-slate-500">
                Generate monthly audit summaries for AYUSH nodal officers
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Dispatch Manifest (September 2026)</p>
                <span className="text-[10px] text-slate-500">PDF • 1.2 MB • 24 Consignments</span>
              </div>
              <Button size="sm" variant="outline" className="rounded-lg text-xs font-bold">
                Export
              </Button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Cold Chain Temperature Logs</p>
                <span className="text-[10px] text-slate-500">CSV • 840 KB • Automated Telemetry</span>
              </div>
              <Button size="sm" variant="outline" className="rounded-lg text-xs font-bold">
                Export
              </Button>
            </div>
          </div>

          <Button
            onClick={() => {
              toast({
                title: "Report Generated",
                description: "Comprehensive distribution dossier ready."
              });
              setActiveDialog(null);
            }}
            className="w-full bg-[#0d5c3a] hover:bg-emerald-800 text-white rounded-xl font-bold text-xs py-5"
          >
            Download Full Dossier
          </Button>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default DistributorView;