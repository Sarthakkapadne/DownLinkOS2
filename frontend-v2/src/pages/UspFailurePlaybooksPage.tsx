import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  RotateCw, 
  ShieldCheck, 
  Radio, 
  Sparkles, 
  Clock, 
  Zap, 
  Lock, 
  Layers, 
  ArrowRight, 
  TrendingUp, 
  Activity,
  HardDrive,
  RefreshCw,
  Cpu,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Satellite as SatIcon
} from 'lucide-react';

export interface UspFailurePlaybooksPageProps {
  onBack?: () => void;
  onNavigateToUsp1?: () => void;
}

interface OutagePhase {
  phaseNumber: number;
  title: string;
  shortDesc: string;
  svalbardStatus: 'ONLINE' | 'FAILED';
  inuvikStatus: 'IDLE' | 'ABSORBING_SUPERDOVE';
  trollsatStatus: 'IDLE' | 'ABSORBING_PELICAN';
  skysatStatus: 'FROZEN_LOCK' | 'NORMAL';
  failoverTimeMs: number;
  dataRetainedPercent: number;
  activePlaybook: 'Playbook A (Nominal)' | 'Playbook B (Svalbard Outage)' | 'Playbook C (Multiple Outages)';
  rationale: string;
}

const OUTAGE_PHASES: OutagePhase[] = [
  {
    phaseNumber: 1,
    title: 'Phase 1: Nominal Fleet Operations (Playbook A)',
    shortDesc: 'All 3 ground stations are operating normally. Svalbard is the primary hub handling heavy polar passes for SuperDove-21 and Pelican-01.',
    svalbardStatus: 'ONLINE',
    inuvikStatus: 'IDLE',
    trollsatStatus: 'IDLE',
    skysatStatus: 'NORMAL',
    failoverTimeMs: 0,
    dataRetainedPercent: 100,
    activePlaybook: 'Playbook A (Nominal)',
    rationale: 'Primary polar schedule active. Svalbard 7.3m dish handling upcoming passes.'
  },
  {
    phaseNumber: 2,
    title: 'Phase 2: Sudden Arctic Station Outage (01:12 UTC)',
    shortDesc: 'Disaster strikes at Svalbard: subsea fiber line breaks or motor gearbox freezes in -40°C blizzard. Svalbard carrier signal drops instantly.',
    svalbardStatus: 'FAILED',
    inuvikStatus: 'IDLE',
    trollsatStatus: 'IDLE',
    skysatStatus: 'FROZEN_LOCK',
    failoverTimeMs: 12,
    dataRetainedPercent: 35,
    activePlaybook: 'Playbook A (Nominal)',
    rationale: 'Carrier loss detected. Legacy systems would crash and require 4 hours of human intervention here.'
  },
  {
    phaseNumber: 3,
    title: 'Phase 3: Instant Pre-Computed Failover in 38.4 ms',
    shortDesc: 'ORBITOPS does not calculate from scratch. It instantly pulls pre-computed Playbook B from memory in 38.4 milliseconds without human intervention.',
    svalbardStatus: 'FAILED',
    inuvikStatus: 'ABSORBING_SUPERDOVE',
    trollsatStatus: 'ABSORBING_PELICAN',
    skysatStatus: 'FROZEN_LOCK',
    failoverTimeMs: 38.4,
    dataRetainedPercent: 94.2,
    activePlaybook: 'Playbook B (Svalbard Outage)',
    rationale: 'Pre-computed contingency matrix validates alternate slew geometry and commits new plan.'
  },
  {
    phaseNumber: 4,
    title: 'Phase 4: Alternate Polar Station Handover',
    shortDesc: 'SuperDove-21 pass is rerouted to Inuvik (+42 min later). Critical Pelican-01 pass is rerouted to TrollSat (+48 min later) to prevent memory overflow.',
    svalbardStatus: 'FAILED',
    inuvikStatus: 'ABSORBING_SUPERDOVE',
    trollsatStatus: 'ABSORBING_PELICAN',
    skysatStatus: 'FROZEN_LOCK',
    failoverTimeMs: 38.4,
    dataRetainedPercent: 94.2,
    activePlaybook: 'Playbook B (Svalbard Outage)',
    rationale: 'Pelican memory buffer dumped from 86% to 12% at TrollSat. 0 camera shutoffs occur.'
  },
  {
    phaseNumber: 5,
    title: 'Phase 5: Resilient Recovery Complete (94.2% Saved)',
    shortDesc: 'Zero telemetry lines broken. Pass within 30 min (SkySat-14) was protected by Frozen Lock. 94.2% of all scheduled science data safely downlinked.',
    svalbardStatus: 'FAILED',
    inuvikStatus: 'ABSORBING_SUPERDOVE',
    trollsatStatus: 'ABSORBING_PELICAN',
    skysatStatus: 'FROZEN_LOCK',
    failoverTimeMs: 38.4,
    dataRetainedPercent: 94.2,
    activePlaybook: 'Playbook B (Svalbard Outage)',
    rationale: 'Disaster neutralized in sub-second time. Maintenance crew repairs Svalbard while fleet runs smoothly.'
  }
];

export const UspFailurePlaybooksPage: React.FC<UspFailurePlaybooksPageProps> = ({
  onBack,
  onNavigateToUsp1
}) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const phase = OUTAGE_PHASES[currentPhaseIndex];
  const isFailed = phase.svalbardStatus === 'FAILED';

  // Auto-play timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setCurrentPhaseIndex((prev) => {
          if (prev >= OUTAGE_PHASES.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleSimulateOutage = () => {
    setCurrentPhaseIndex(2); // Jump directly to failover phase
    setIsAutoPlaying(false);
  };

  const handleRestoreNominal = () => {
    setCurrentPhaseIndex(0);
    setIsAutoPlaying(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* ======================================================== */}
      {/* 0. TOP BREADCRUMB NAVIGATION                             */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-sky-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Algorithm & 180° Sky Horizon</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">Page 3 of 3</span>
          {onNavigateToUsp1 && (
            <button
              onClick={onNavigateToUsp1}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-sky-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: USP 1 Station Custom</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. HERO BANNER: USP 2 PLAIN-ENGLISH TRUTH                */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Zap className="w-3.5 h-3.5" />
            <span>CORE USP 2 · RESILIENCE & PRE-COMPUTED PLAYBOOKS</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Pre-Computed Failure Playbooks
          </h1>

          <p className="text-base sm:text-lg text-indigo-200/90 font-medium leading-relaxed">
            A scheduling plan must be ready for unexpected failures, not just normal operations.
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
            ORBITOPS prepares alternative schedules in advance for possible ground station failures. When a station goes offline, the system selects a suitable backup plan and validates it against remaining constraints in <strong>under 100 milliseconds</strong>.
          </p>

          <p className="text-xs text-sky-300 font-semibold italic pt-1">
            "The goal is simple: prepare for disruptions before they happen, rather than starting from scratch after a failure."
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-emerald-300 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pre-Computed Recovery Latency: <strong>38.4 ms</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              Frozen Horizon Lock: <strong className="text-white">t &lt; t_curr + 30 min</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              Data Retained: <strong className="text-emerald-400">94.2% (0 Overflows)</strong>
            </div>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <ShieldCheck className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. INTERACTIVE DISASTER SIMULATION CANVAS                */}
      {/* ======================================================== */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 text-white">
        
        {/* Simulator Control Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isFailed ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
              <h3 className="font-bold text-base sm:text-lg text-white tracking-wide">
                Live Disaster Simulator: Station Outage & Instant Playbook Failover
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Test what happens when the primary Arctic polar station (Svalbard) suddenly fails during peak operations.
            </p>
          </div>

          {/* Interactive Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {!isFailed ? (
              <button
                onClick={handleSimulateOutage}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-rose-950/50"
              >
                <Flame className="w-4 h-4 text-white animate-pulse" />
                <span>Simulate Svalbard Station Failure</span>
              </button>
            ) : (
              <button
                onClick={handleRestoreNominal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Restore Svalbard (Nominal State)</span>
              </button>
            )}

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition border border-slate-700 cursor-pointer"
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? 'Pause Story' : 'Auto-Play Story'}</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* VISUAL NETWORK MAP (SVG)                                 */}
        {/* ======================================================== */}
        <div className="relative w-full bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-hidden shadow-inner">
          
          {/* Top Live Metrics Strip inside Canvas */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800/80 gap-2">
            <span className="flex items-center gap-1.5">
              <span>Active Configuration:</span>
              <strong className={isFailed ? 'text-amber-400' : 'text-emerald-400'}>
                {phase.activePlaybook}
              </strong>
            </span>

            <span>
              Failover Latency: <strong className="text-sky-300">{phase.failoverTimeMs} ms</strong>
            </span>

            <span>
              Science Data Retained: <strong className={phase.dataRetainedPercent > 90 ? 'text-emerald-400' : 'text-rose-400'}>{phase.dataRetainedPercent}%</strong>
            </span>
          </div>

          <svg
            className="w-full h-80 select-none overflow-visible"
            viewBox="0 0 800 320"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="failGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.05" />
              </linearGradient>

              <linearGradient id="rerouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Earth Orbital Arc Horizon */}
            <path
              d="M 0 260 Q 400 230, 800 260 L 800 320 L 0 320 Z"
              fill="#0b0f19"
            />
            <line x1="0" y1="258" x2="800" y2="258" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* SATELLITES IN ORBIT (Top Layer) */}
            
            {/* Sat 1: SuperDove-21 (x = 200, y = 60) */}
            <g transform="translate(200, 60)">
              <rect x="-10" y="-6" width="20" height="12" rx="2" fill="#f59e0b" stroke="#fef3c7" strokeWidth="1.5" />
              <rect x="-22" y="-5" width="10" height="10" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <rect x="12" y="-5" width="10" height="10" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <text x="0" y="-12" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">SuperDove-21</text>
              <text x="0" y="20" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontFamily="monospace">38.4 GB Earth Imagery</text>
            </g>

            {/* Sat 2: Pelican-Rapid-01 (x = 420, y = 50) */}
            <g transform="translate(420, 50)">
              <rect x="-12" y="-7" width="24" height="14" rx="2" fill="#8b5cf6" stroke="#ddd6fe" strokeWidth="1.5" />
              <rect x="-26" y="-6" width="12" height="12" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <rect x="14" y="-6" width="12" height="12" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <text x="0" y="-13" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Pelican-01</text>
              <text x="0" y="21" fill="#fca5a5" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                Memory 86% Critical!
              </text>
            </g>

            {/* Sat 3: SkySat-14 (In-pass, t < 30m lock) (x = 640, y = 65) */}
            <g transform="translate(640, 65)">
              <rect x="-10" y="-6" width="20" height="12" rx="2" fill="#10b981" stroke="#a7f3d0" strokeWidth="1.5" />
              <rect x="-22" y="-5" width="10" height="10" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <rect x="12" y="-5" width="10" height="10" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <text x="0" y="-12" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">SkySat-14</text>
              <text x="0" y="20" fill="#6ee7b7" fontSize="8.5" textAnchor="middle" fontFamily="monospace">Lock &lt;30m (Protected)</text>
            </g>

            {/* GROUND STATIONS (Bottom Layer) */}

            {/* STATION 1: INUVIK (x = 180, y = 250) */}
            <g transform="translate(180, 250)">
              <rect x="-35" y="0" width="70" height="15" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <ellipse cx="0" cy="-20" rx="22" ry="7" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="0" y="32" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                BACKUP 1: INUVIK
              </text>
              <text x="0" y="46" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                Canada (68°N) · 5.4m Dish
              </text>
              {isFailed && (
                <text x="0" y="60" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">
                  ✅ Absorbing SuperDove-21 (+42m)
                </text>
              )}
            </g>

            {/* STATION 2: SVALBARD (x = 420, y = 250) - PRIMARY TARGET */}
            <g transform="translate(420, 250)">
              <rect x="-45" y="0" width="90" height="15" rx="3" fill="#1e293b" stroke={isFailed ? '#ef4444' : '#38bdf8'} strokeWidth="1.5" />
              <ellipse cx="0" cy="-26" rx="30" ry="10" fill={isFailed ? '#450a0a' : '#0284c7'} stroke={isFailed ? '#ef4444' : '#38bdf8'} strokeWidth="2" />
              <text x="0" y="32" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                PRIMARY: SVALBARD
              </text>
              <text x="0" y="46" fill={isFailed ? '#fca5a5' : '#38bdf8'} fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                {isFailed ? '⚠️ OFFLINE: Subsea Fiber Severed' : 'Norway (78°N) · 7.3m Dish'}
              </text>

              {/* Status Badge */}
              <rect x="-65" y="55" width="130" height="18" rx="4" fill={isFailed ? '#7f1d1d' : '#064e3b'} stroke={isFailed ? '#ef4444' : '#10b981'} strokeWidth="1" />
              <text x="0" y="67" fill={isFailed ? '#fef2f2' : '#6ee7b7'} fontSize="8.5" fontWeight="bold" textAnchor="middle">
                {isFailed ? '💥 OUTAGE DETECTED' : '🟢 NOMINAL HUB'}
              </text>
            </g>

            {/* STATION 3: TROLLSAT (x = 660, y = 250) */}
            <g transform="translate(660, 250)">
              <rect x="-35" y="0" width="70" height="15" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <ellipse cx="0" cy="-22" rx="24" ry="8" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="0" y="32" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                BACKUP 2: TROLLSAT
              </text>
              <text x="0" y="46" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                Antarctica (72°S) · 10m Reflector
              </text>
              {isFailed && (
                <text x="0" y="60" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
                  ✅ Absorbing Pelican-01 (+48m)
                </text>
              )}
            </g>

            {/* CONNECTION LINES & REROUTES */}
            
            {/* If NOT failed: Nominal blue links to Svalbard */}
            {!isFailed && (
              <g>
                {/* SuperDove to Svalbard */}
                <line x1="200" y1="70" x2="420" y2="225" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
                {/* Pelican to Svalbard */}
                <line x1="420" y1="65" x2="420" y2="225" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                {/* SkySat to Svalbard */}
                <line x1="640" y1="75" x2="420" y2="225" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
              </g>
            )}

            {/* If FAILED: Broken red links at Svalbard + Dynamic Green Reroute Arcs */}
            {isFailed && (
              <g>
                {/* Broken lines snapping at Svalbard */}
                <line x1="420" y1="65" x2="420" y2="150" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="420" cy="150" r="4" fill="#ef4444" />
                <text x="430" y="153" fill="#fca5a5" fontSize="9" fontWeight="bold">Link Broken</text>

                {/* REROUTE 1: SuperDove -> Inuvik (Green Arc) */}
                <path
                  d="M 200 70 Q 150 160, 180 230"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />
                <circle cx="180" cy="230" r="4" fill="#10b981" />
                <text x="135" y="150" fill="#6ee7b7" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  Reroute: +42m Inuvik
                </text>

                {/* REROUTE 2: Pelican -> TrollSat (Emerald Arc to Antarctica) */}
                <path
                  d="M 420 65 Q 560 120, 660 225"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="3"
                />
                <circle cx="660" cy="225" r="4" fill="#34d399" />
                <text x="540" y="130" fill="#a7f3d0" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
                  Reroute: +48m TrollSat (Saved Memory!)
                </text>

                {/* FROZEN LOCK: SkySat-14 (<30m) */}
                <g transform="translate(640, 105)">
                  <rect x="-65" y="-12" width="130" height="24" rx="5" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                  <text x="0" y="3" fill="#6ee7b7" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    🔒 FROZEN LOCK: t &lt; 30m
                  </text>
                </g>
              </g>
            )}

          </svg>
        </div>

        {/* ======================================================== */}
        {/* STEP-BY-STEP STORYBOARD SELECTOR                         */}
        {/* ======================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              DISASTER CHRONOLOGY & PLAYBOOK EXECUTION:
            </span>
            <span className="text-xs text-sky-400 font-semibold">
              Current: Phase {phase.phaseNumber} of 5
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
            {OUTAGE_PHASES.map((p, idx) => {
              const isActive = currentPhaseIndex === idx;
              return (
                <button
                  key={p.phaseNumber}
                  onClick={() => {
                    setCurrentPhaseIndex(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between min-h-[80px] ${
                    isActive
                      ? 'bg-indigo-950/80 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-400/50'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className={`font-bold ${isActive ? 'text-indigo-300' : 'text-slate-400'}`}>
                      PHASE {p.phaseNumber}
                    </span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />}
                  </div>
                  <span className={`text-[11px] font-semibold line-clamp-2 mt-1 leading-snug ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {p.title.replace(`Phase ${p.phaseNumber}: `, '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Telemetry Detail Console */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-700/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <h4 className="font-bold text-sm text-white font-sans flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>{phase.title}</span>
            </h4>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-bold self-start sm:self-auto">
              PRE-COMPUTED PLAYBOOK ENGINE
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {phase.shortDesc}
          </p>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-slate-400 text-[10px] block mb-0.5">PLAYBOOK DECISION LOG:</span>
            <strong className="text-emerald-400 font-sans">{phase.rationale}</strong>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. DIRECT COMPARISON: 4-HOUR PANIC VS 38.4MS PLAYBOOK     */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Direct Comparison: What Happens When a Station Goes Offline?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            The difference between legacy reactive human rescheduling vs ORBITOPS pre-computed playbooks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Box 1: The Old Way */}
          <div className="p-6 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>The Old Way: Starting from Scratch After Failure</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                4-HOUR DELAY
              </span>
            </div>

            <ul className="text-xs text-slate-700 space-y-2.5 leading-relaxed list-disc list-inside">
              <li>
                <strong>Station goes offline at 01:12 UTC:</strong> Schedulers crash; operators receive emergency pagers and scramble.
              </li>
              <li>
                <strong>Engineers panic and recalculate manually:</strong> Teams spend <strong>2 to 4 hours manually redrawing contact timetables</strong>.
              </li>
              <li>
                <strong>Pelican memory buffer hits 100%:</strong> While waiting for a new schedule, the onboard camera buffer overflows and emergency shutoff activates.
              </li>
              <li>
                <strong>Result:</strong> 65% data loss, massive recovery delays, and high operational stress.
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-white/80 border border-rose-200 text-xs font-mono text-rose-900">
              Outcome: <strong className="text-rose-600">65% Data Loss · Camera Emergency Shutdown · 4hr Downtime</strong>
            </div>
          </div>

          {/* Box 2: The ORBITOPS Way */}
          <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>The ORBITOPS Way: Pre-Computed Failure Playbooks</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                38.4 MS RECOVERY
              </span>
            </div>

            <ul className="text-xs text-slate-700 space-y-2.5 leading-relaxed list-disc list-inside">
              <li>
                <strong>Instant carrier loss detection:</strong> ORBITOPS detects carrier loss and activates <strong>Playbook B in 38.4 ms</strong>.
              </li>
              <li>
                <strong>Passes within 30 min are frozen:</strong> The Frozen Horizon Lock protects ongoing passes ($t &lt; t_curr + 30m$) without fleet thrashing.
              </li>
              <li>
                <strong>Critical passes shifted to backup nodes:</strong> Pelican-01 is transferred to TrollSat (+48m) to empty its memory; SuperDove-21 transferred to Inuvik (+42m).
              </li>
              <li>
                <strong>Result:</strong> 94.2% data preserved, 0 camera shutoffs, and zero human panic!
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-white/80 border border-emerald-200 text-xs font-mono text-emerald-900">
              Outcome: <strong className="text-emerald-700">94.2% Data Retained · Zero Overflows · 38.4ms Sub-Second Failover</strong>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. THE 3 PILLARS OF PLAYBOOK EXECUTION                   */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            The 3 Pillars of Playbook Execution
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            How ORBITOPS guarantees mathematical stability and prevents fleet chaos during outages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
              PILLAR 1 · ZERO THRASHING
            </span>
            <h4 className="font-bold text-base text-slate-900">
              The 30-Min Frozen Horizon Lock
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              When an outage strikes, never touch passes that are already running or starting within 30 minutes (t &lt; t_curr + 30m). Those passes are frozen in green. This eliminates fleet panic and preserves spacecraft telemetry lineage.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <RotateCw className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded">
              PILLAR 2 · ORBITAL RELAY
            </span>
            <h4 className="font-bold text-base text-slate-900">
              Sub-Graph Alternate Station Rerouting
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instead of resolving the entire global network from scratch, ORBITOPS re-routes only the specific disrupted passes to available stations within the 95-minute polar pass corridor (e.g. Inuvik or TrollSat), verified against their slew and elevation limits.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
              PILLAR 3 · SPEED
            </span>
            <h4 className="font-bold text-base text-slate-900">
              Sub-100ms Instant Switchover
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Because playbooks are computed ahead of time during idle ground compute cycles, activating Playbook B takes just 38.4 milliseconds. No timeouts, no GPU solver queues, no human panics.
            </p>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. BOTTOM NAVIGATION STRIP                                */}
      {/* ======================================================== */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-sky-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition shadow-2xs cursor-pointer w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page (Algorithm & 180° Sky Horizon)</span>
        </button>

        {onNavigateToUsp1 && (
          <button
            onClick={onNavigateToUsp1}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-sky-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition shadow-2xs cursor-pointer w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Switch to USP 1: Per-Station Custom Scheduler</span>
          </button>
        )}
      </div>

    </div>
  );
};
