import React from 'react';
import { 
  Layers,
  CalendarRange, 
  Radio,
  Flame, 
  FileText, 
  Globe2 
} from 'lucide-react';

export type ActiveTab = 'manifest' | 'overview' | 'simulator' | 'disruption' | 'explainer' | 'globe';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  disruptionActive: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  disruptionActive
}) => {
  const tabs = [
    {
      id: 'manifest' as ActiveTab,
      label: '1. Fleet & Pass Manifest',
      sublabel: 'Master Inventory & Water Tanks',
      icon: Layers,
      badge: 'MANIFEST'
    },
    {
      id: 'overview' as ActiveTab,
      label: '2. Dual-Gantt Compare',
      sublabel: 'FCFS vs ORBITOPS Head-to-Head',
      icon: CalendarRange,
      badge: 'HERO'
    },
    {
      id: 'simulator' as ActiveTab,
      label: '3. Live Downlink & Sim',
      sublabel: 'Polar Skyplot & Anomaly Injector',
      icon: Radio,
      badge: 'SIM'
    },
    {
      id: 'disruption' as ActiveTab,
      label: '4. Outage Sandbox',
      sublabel: 'Station Failure & <50ms Healing',
      icon: Flame,
      badge: disruptionActive ? 'OUTAGE ACTIVE' : 'BREAK IT'
    },
    {
      id: 'explainer' as ActiveTab,
      label: '5. Flight-Ops Explainer',
      sublabel: 'Lineage & Price of Forcing',
      icon: FileText,
      badge: 'AUDIT'
    },
    {
      id: 'globe' as ActiveTab,
      label: '6. 3D Constellation',
      sublabel: 'Three.js Planetary Twin',
      icon: Globe2,
      badge: '3D'
    }
  ];

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-left transition-all whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-2xs font-semibold'
                    : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`p-1.5 rounded-md ${
                  isActive ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold leading-none">{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        tab.badge === 'HERO' ? 'bg-sky-100 text-sky-800' :
                        tab.badge === 'OUTAGE ACTIVE' ? 'bg-red-100 text-red-800 animate-pulse' :
                        tab.badge === 'BREAK IT' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600 font-normal leading-tight mt-0.5">
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
