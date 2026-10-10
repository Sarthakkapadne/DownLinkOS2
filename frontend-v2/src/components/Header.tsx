import React from 'react';
import { 
  Radio, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Satellite as SatIcon,
  Sparkles,
  Layers,
  Zap,
  Cpu,
  BarChart3
} from 'lucide-react';

export type ActivePageType = 'landing' | 'usp1' | 'usp2';

interface HeaderProps {
  currentUtcTime?: string;
  activeSatelliteName?: string;
  activePage?: ActivePageType;
  onNavigate?: (page: ActivePageType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUtcTime = '01:12:45 UTC',
  activeSatelliteName = 'SuperDove-Flock-4P-21',
  activePage = 'landing',
  onNavigate
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Strip: Brand & Live Mission Clock */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-3 pb-2.5 gap-3 border-b border-slate-100">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-200">
              <SatIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-slate-900 font-sans">
                  ORBITOPS <span className="text-sky-600 font-semibold text-sm">· DownlinkOS</span>
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  SPACE-04
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Autonomous Multi-Satellite Ground Station Scheduling · Planet Labs Challenge
              </p>
            </div>
          </div>

          {/* Real-Time KPIs & Mission Clock */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
            {/* Active Link Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Link: <strong>{activeSatelliteName}</strong></span>
            </div>

            {/* Invariant Health Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono hidden sm:flex">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Invariants: <strong className="text-slate-900">0 Violations</strong></span>
            </div>

            {/* Mission UTC Clock */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-mono shadow-xs">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-bold tracking-wider">{currentUtcTime}</span>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Main View Navigation Tabs */}
        <div className="flex items-center gap-2 py-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => onNavigate?.('landing')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activePage === 'landing'
                ? 'bg-sky-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>1. Algorithm & 180° Sky Horizon (Landing Page)</span>
          </button>

          <button
            onClick={() => onNavigate?.('usp1')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activePage === 'usp1'
                ? 'bg-sky-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>2. USP 1: Per-Station Custom Scheduler</span>
          </button>

          <button
            onClick={() => onNavigate?.('usp2')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activePage === 'usp2'
                ? 'bg-sky-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>3. USP 2: Pre-Computed Failure Playbooks</span>
          </button>
        </div>

      </div>
    </header>
  );
};
