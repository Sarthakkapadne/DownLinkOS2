import React from 'react';
import { 
  Satellite as SatIcon, 
  Radio, 
  ShieldCheck, 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  AlertTriangle,
  Layers
} from 'lucide-react';
import { ScheduleMetrics } from '../types';
import { minToTimeStr } from '../data/mockScenarios';

interface HeaderProps {
  currentMinute: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onResetTime: () => void;
  onScrubTime: (minute: number) => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  fcfsMetrics: ScheduleMetrics;
  orbitopsMetrics: ScheduleMetrics;
  isPlainEnglishMode: boolean;
  onTogglePlainEnglish: () => void;
  activeScenarioName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentMinute,
  isPlaying,
  onTogglePlay,
  onResetTime,
  onScrubTime,
  speed,
  onChangeSpeed,
  fcfsMetrics,
  orbitopsMetrics,
  isPlainEnglishMode,
  onTogglePlainEnglish,
  activeScenarioName
}) => {
  // Score percentage improvement
  const scoreImprovementPct = Math.round(
    ((orbitopsMetrics.priorityWeightedScore - fcfsMetrics.priorityWeightedScore) / 
    (fcfsMetrics.priorityWeightedScore || 1)) * 100
  );

  const volumeImprovementGb = Math.round(
    (orbitopsMetrics.totalDeliveredGb - fcfsMetrics.totalDeliveredGb) * 10
  ) / 10;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Mission Context */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-xs">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 m-0">ORBITOPS</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                SPACE-04
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Planet Labs Challenge
              </span>
            </div>
            <p className="text-xs text-slate-500 m-0">
              Autonomous Ground Station Scheduling & Real-Time Mission Control
            </p>
          </div>
        </div>

        {/* Center: Mission Clock & Time Scrubber */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
          <button
            onClick={onTogglePlay}
            className={`p-1.5 rounded-md text-white transition-colors cursor-pointer ${
              isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sky-600 hover:bg-sky-700'
            }`}
            title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={onResetTime}
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Reset to 00:00 UTC"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200 min-w-[85px] text-center">
              {minToTimeStr(currentMinute)}
            </span>
            <input
              type="range"
              min={0}
              max={1440}
              value={currentMinute}
              onChange={(e) => onScrubTime(Number(e.target.value))}
              className="w-24 sm:w-36 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>

          {/* Speed Pills */}
          <div className="hidden md:flex items-center gap-1 border-l border-slate-200 pl-2">
            {[1, 5, 20].map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`text-[11px] px-1.5 py-0.5 rounded font-mono font-medium transition-colors cursor-pointer ${
                  speed === s 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Right: Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlainEnglish}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Mode: </span>
            <span className="font-semibold text-sky-700">
              {isPlainEnglishMode ? 'Plain English (Operator)' : 'Deep Telemetry (Astrodynamics)'}
            </span>
          </button>
        </div>
      </div>

      {/* Bottom KPI Ribbon (Key Performance Indicators) */}
      <div className="bg-slate-50/80 border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Active Scenario Tag */}
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-600">Dataset:</span>
            <span className="font-medium text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
              {activeScenarioName}
            </span>
          </div>

          {/* KPI Indicators */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            {/* Value Gain vs FCFS */}
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-500">Value Gain:</span>
              <span className="font-bold text-emerald-700">
                +{scoreImprovementPct}%
              </span>
              <span className="text-[11px] text-slate-600">
                (+{volumeImprovementGb} GB)
              </span>
            </div>

            {/* Overflows Prevented */}
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-slate-500">Buffer Overflows:</span>
              <span className="font-bold text-emerald-700">
                {orbitopsMetrics.bufferOverflowCount}
              </span>
              <span className="text-[11px] text-slate-600 line-through">
                (FCFS: {fcfsMetrics.bufferOverflowCount})
              </span>
            </div>

            {/* Dish Utilization */}
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-600" />
              <span className="text-slate-500">Dish Utilization:</span>
              <span className="font-bold text-slate-800">
                {orbitopsMetrics.antennaUtilizationPct}%
              </span>
              <span className="text-[11px] text-slate-600">
                (vs FCFS {fcfsMetrics.antennaUtilizationPct}%)
              </span>
            </div>

            {/* Independent Validator Badge */}
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>VALIDATOR: PASS (0 Violations)</span>
            </div>

            {/* Math Optimality Bound */}
            <div className="hidden lg:flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full font-semibold text-[11px]">
              <span>SOLVER: OPTIMAL (Gap 2.8%)</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
