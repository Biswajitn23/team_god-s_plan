import { LayoutDashboard, PlusCircle, Clock, HelpCircle, ShoppingCart } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav = ({ activeTab, setActiveTab }: BottomNavProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'collection', label: 'Add Crop', icon: PlusCircle },
    { id: 'sell', label: 'Sell', icon: ShoppingCart },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];


  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none md:hidden">
      <div className="bg-white/80 dark:bg-emerald-950/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_-8px_40px_rgba(0,0,0,0.08)] rounded-[2.5rem] p-2 flex items-center justify-around pointer-events-auto transition-colors duration-500">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl transition-all duration-300 relative group ${
                isActive ? 'bg-emerald-950 dark:bg-emerald-600 text-white shadow-lg' : 'text-emerald-950/40 dark:text-white/40 hover:text-emerald-950 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-white/5'
              }`}
            >

              {/* Glow effect for Help icon */}
              {item.id === 'help' && !isActive && (
                <div className="absolute inset-0 bg-emerald-400/30 rounded-2xl blur-xl animate-glow-slow -z-10" />
              )}

              
              <Icon size={20} className={isActive ? 'animate-bounce-subtle' : ''} />
              <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                isActive ? 'opacity-100 scale-110' : 'opacity-60 scale-100'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              )}
            </button>

          );
        })}
      </div>
    </div>
  );
};
