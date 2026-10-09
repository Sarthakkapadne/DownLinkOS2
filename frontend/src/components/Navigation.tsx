import React from 'react';
import { 
  Cpu, 
  CalendarRange, 
  Radio, 
  Layers 
} from 'lucide-react';

export type ActiveTab = 'algorithm' | 'overview' | 'simulator' | 'manifest';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  disruptionActive?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab
}) => {
  const tabs = [
    {
      id: 'algorithm' as ActiveTab,
      label: '1. How Algorithm Works & Heals',
      sublabel: 'Step-by-Step Interactive & Reroute',
      icon: Cpu,
      badge: 'HERO ENGINE'
    },
    {
      id: 'overview' as ActiveTab,
      label: '2. Explainable Dual-Gantt',
      sublabel: 'FCFS vs ORBITOPS & Overflow Deep Dive',
      icon: CalendarRange,
      badge: 'COMPARISON'
    },
    {
      id: 'simulator' as ActiveTab,
      label: '3. Live Downlink & Sim',
      sublabel: 'Polar Skyplot & Anomaly Injector',
      icon: Radio,
      badge: 'SIMULATOR'
    },
    {
      id: 'manifest' as ActiveTab,
      label: '4. Satellite Fleet & Passes',
      sublabel: 'Master Inventory & Water Tanks',
      icon: Layers,
      badge: 'INVENTORY'
    }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-left transition-all whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-xs font-semibold'
                    : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  isActive ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold leading-none">{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        tab.badge === 'HERO ENGINE' ? 'bg-sky-100 text-sky-800' :
                        tab.badge === 'COMPARISON' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                    {tab.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
