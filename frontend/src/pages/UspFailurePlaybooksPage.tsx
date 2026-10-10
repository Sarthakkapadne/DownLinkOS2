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
  Satellite as SatIcon,
  Check
} from 'lucide-react';

export interface UspFailurePlaybooksPageProps {
  onBack?: () => void;
  onNavigateToUsp1?: () => void;
}

interface OutageStep {
  stepNumber: number;
  title: string;
  simpleExplanation: string;
  svalbardVisualState: 'HEALTHY' | 'EXPLODED_OFFLINE' | 'OFFLINE_REPAIR';
  inuvikVisualState: 'IDLE' | 'TARGETING' | 'LOCKED_BEAM' | 'COMPLETED';
  trollsatVisualState: 'IDLE' | 'TARGETING' | 'LOCKED_BEAM' | 'COMPLETED';
  pelicanMemoryPercent: number;
  skysatFrozenLock: boolean;
  failoverTimeMs: number;
  dataSavedPercent: number;
  whatYouSee: string;
}

const OUTAGE_STEPS: OutageStep[] = [
  {
    stepNumber: 1,
    title: 'Step 1: Normal Everyday Operations',
    simpleExplanation: 'All 3 ground stations are working fine. Svalbard is the primary hub, handling polar passes for SuperDove-21 and Pelican-01 with smooth blue links.',
    svalbardVisualState: 'HEALTHY',
    inuvikVisualState: 'IDLE',
    trollsatVisualState: 'IDLE',
    pelicanMemoryPercent: 86,
    skysatFrozenLock: false,
    failoverTimeMs: 0,
    dataSavedPercent: 100,
    whatYouSee: 'Smooth blue communication lines between satellites and Svalbard station.'
  },
  {
    stepNumber: 2,
    title: 'Step 2: Disaster Strikes! Svalbard Station Goes Dark',
    simpleExplanation: 'A subsea fiber cable snaps or antenna motor freezes in -40°C arctic blizzard. Svalbard goes completely offline! Communications instantly break with flashing red alarms.',
    svalbardVisualState: 'EXPLODED_OFFLINE',
    inuvikVisualState: 'IDLE',
    trollsatVisualState: 'IDLE',
    pelicanMemoryPercent: 86,
    skysatFrozenLock: false,
    failoverTimeMs: 12,
    dataSavedPercent: 35,
    whatYouSee: 'Svalbard turns red with alarm flames. Connection lines break with red ⚠️ warnings!'
  },
  {
    stepNumber: 3,
    title: 'Step 3: ORBITOPS Instant Brain Activation (In 38 Milliseconds!)',
    simpleExplanation: 'Instead of crashing and panicking for 4 hours, ORBITOPS looks up a pre-computed backup plan from memory in 38.4 milliseconds. Ongoing passes within 30 min are safely locked.',
    svalbardVisualState: 'OFFLINE_REPAIR',
    inuvikVisualState: 'TARGETING',
    trollsatVisualState: 'TARGETING',
    pelicanMemoryPercent: 86,
    skysatFrozenLock: true,
    failoverTimeMs: 38.4,
    dataSavedPercent: 94.2,
    whatYouSee: 'SkySat-14 is protected by Green Frozen Lock. Yellow backup paths aim at Inuvik and TrollSat.'
  },
  {
    stepNumber: 4,
    title: 'Step 4: Backup Stations Take Over (Green Beams Lock On!)',
    simpleExplanation: 'Broken red lines disappear. Inuvik dish locks onto SuperDove-21 (+42m pass). TrollSat in Antarctica locks onto Pelican-01 (+48m pass), dumping its memory safely from 86% to 12%!',
    svalbardVisualState: 'OFFLINE_REPAIR',
    inuvikVisualState: 'LOCKED_BEAM',
    trollsatVisualState: 'LOCKED_BEAM',
    pelicanMemoryPercent: 12,
    skysatFrozenLock: true,
    failoverTimeMs: 38.4,
    dataSavedPercent: 94.2,
    whatYouSee: 'Bright green laser beams lock from backup stations. Pelican memory empties safely to 12%!'
  },
  {
    stepNumber: 5,
    title: 'Step 5: Disaster Neutralized! 94.2% Data Rescued',
    simpleExplanation: 'Both backup passes finish with 100% success. Zero camera shutoffs, zero lost packets, and zero human stress. Repair crews fix Svalbard while the fleet operates smoothly.',
    svalbardVisualState: 'OFFLINE_REPAIR',
    inuvikVisualState: 'COMPLETED',
    trollsatVisualState: 'COMPLETED',
    pelicanMemoryPercent: 12,
    skysatFrozenLock: true,
    failoverTimeMs: 38.4,
    dataSavedPercent: 94.2,
    whatYouSee: 'Green checkmarks everywhere! 94.2% data preserved with sub-second failover.'
  }
];

export const UspFailurePlaybooksPage: React.FC<UspFailurePlaybooksPageProps> = ({
  onBack,
  onNavigateToUsp1
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const step = OUTAGE_STEPS[currentStepIndex];
  const isFailed = step.svalbardVisualState !== 'HEALTHY';

  // Auto-play timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= OUTAGE_STEPS.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleTriggerFailure = () => {
    setCurrentStepIndex(1); // Jump directly to Step 2 (Disaster!)
    setIsAutoPlaying(false);
  };

  const handleRestoreNominal = () => {
    setCurrentStepIndex(0); // Jump back to Step 1 (Healthy)
    setIsAutoPlaying(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Breadcrumb Navigation */}
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

      {/* Hero Banner: Plain English Explanation */}
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
            When a ground station goes offline, humans usually spend <strong>2 to 4 hours panicking and redrawing schedules</strong>, causing satellites to run out of memory and shut off cameras. ORBITOPS pre-computes backup playbooks in advance—switching to backup stations in <strong>under 38 milliseconds</strong>!
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-emerald-300 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Failover Time: <strong>38.4 ms</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              Fleet Protection Rule: <strong className="text-white">30-Min Frozen Horizon Lock</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              Science Data Rescued: <strong className="text-emerald-400">94.2% (0 Overflows)</strong>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <ShieldCheck className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Visual Live Disaster Simulator Canvas */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 text-white">
        
        {/* Simulator Control Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isFailed ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
              <h3 className="font-bold text-base sm:text-lg text-white tracking-wide">
                Live Disaster Simulator: Ground Station Fails → ORBITOPS Switches in 38ms
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Click the red button below to knock Svalbard offline, then watch how the backup plan automatically saves the mission.
            </p>
          </div>

          {/* Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {!isFailed ? (
              <button
                onClick={handleTriggerFailure}
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
                <span>Restore Svalbard (Back to Step 1)</span>
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

        {/* SVG Simulation Screen */}
        <div className="relative w-full bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-hidden shadow-inner">
          
          {/* Top Telemetry Strip inside Canvas */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800/80 gap-2">
            <span className="flex items-center gap-1.5">
              <span>Svalbard Station Status:</span>
              <strong className={isFailed ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {step.svalbardVisualState === 'HEALTHY' ? 'ONLINE (7.3m Active)' : '💥 OFFLINE (Subsea Fiber Severed)'}
              </strong>
            </span>

            <span>
              Failover Speed: <strong className="text-sky-300 font-bold">{step.failoverTimeMs} ms</strong>
            </span>

            <span>
              Pelican Camera Memory: <strong className={step.pelicanMemoryPercent > 50 ? 'text-rose-400' : 'text-emerald-400'}>{step.pelicanMemoryPercent}%</strong>
            </span>

            <span>
              Total Data Rescued: <strong className="text-emerald-400 font-bold">{step.dataSavedPercent}%</strong>
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

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Earth Orbital Arc Horizon */}
            <path
              d="M 0 260 Q 400 230, 800 260 L 800 320 L 0 320 Z"
              fill="#0b0f19"
            />
            <line x1="0" y1="258" x2="800" y2="258" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* ======================================================== */}
            {/* SATELLITES IN ORBIT (Top Layer)                          */}
            {/* ======================================================== */}
            
            {/* Sat 1: SuperDove-21 (x = 200, y = 60) */}
            <g transform="translate(200, 60)">
              <rect x="-10" y="-6" width="20" height="12" rx="2" fill="#f59e0b" stroke="#fef3c7" strokeWidth="1.5" />
              <rect x="-22" y="-5" width="10" height="10" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <rect x="12" y="-5" width="10" height="10" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <text x="0" y="-12" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">SuperDove-21</text>
              <text x="0" y="20" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontFamily="monospace">38.4 GB Earth Imagery</text>
            </g>

            {/* Sat 2: Pelican-01 (x = 420, y = 50) */}
            <g transform="translate(420, 50)">
              <rect x="-12" y="-7" width="24" height="14" rx="2" fill="#8b5cf6" stroke="#ddd6fe" strokeWidth="1.5" />
              <rect x="-26" y="-6" width="12" height="12" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <rect x="14" y="-6" width="12" height="12" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <text x="0" y="-13" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Pelican-01</text>
              
              {/* Memory status on satellite */}
              {step.pelicanMemoryPercent > 50 ? (
                <text x="0" y="21" fill="#f87171" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  ⚠️ Memory: {step.pelicanMemoryPercent}% Full!
                </text>
              ) : (
                <text x="0" y="21" fill="#4ade80" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  ✅ Memory Dumped: {step.pelicanMemoryPercent}% (Safe!)
                </text>
              )}
            </g>

            {/* Sat 3: SkySat-14 (Pass starts in 5 min) (x = 640, y = 65) */}
            <g transform="translate(640, 65)">
              <rect x="-10" y="-6" width="20" height="12" rx="2" fill="#10b981" stroke="#a7f3d0" strokeWidth="1.5" />
              <rect x="-22" y="-5" width="10" height="10" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <rect x="12" y="-5" width="10" height="10" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <text x="0" y="-12" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">SkySat-14</text>
              <text x="0" y="20" fill="#a7f3d0" fontSize="8.5" textAnchor="middle" fontFamily="monospace">Starts in 5 min</text>
            </g>

            {/* ======================================================== */}
            {/* GROUND STATIONS (Bottom Layer)                           */}
            {/* ======================================================== */}

            {/* BACKUP 1: INUVIK (x = 180, y = 250) */}
            <g transform="translate(180, 250)">
              <rect x="-35" y="0" width="70" height="15" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              {/* Dish angle changes when locking */}
              <g transform={step.inuvikVisualState === 'LOCKED_BEAM' || step.inuvikVisualState === 'COMPLETED' ? "rotate(15, 0, -20)" : "rotate(0, 0, -20)"}>
                <ellipse cx="0" cy="-20" rx="22" ry="7" fill="#475569" stroke={step.inuvikVisualState === 'LOCKED_BEAM' ? '#10b981' : '#94a3b8'} strokeWidth="1.5" />
                <line x1="0" y1="-20" x2="0" y2="-30" stroke="#cbd5e1" strokeWidth="2" />
              </g>
              <text x="0" y="32" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                BACKUP 1: INUVIK
              </text>
              <text x="0" y="46" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                Canada (68°N) · 5.4m Dish
              </text>
              {step.inuvikVisualState === 'LOCKED_BEAM' && (
                <text x="0" y="60" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">
                  🟢 Absorbing SuperDove-21 (+42m)
                </text>
              )}
              {step.inuvikVisualState === 'COMPLETED' && (
                <text x="0" y="60" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">
                  ✅ 100% Data Rescued!
                </text>
              )}
            </g>

            {/* PRIMARY: SVALBARD (x = 420, y = 250) */}
            <g transform="translate(420, 250)">
              <rect x="-45" y="0" width="90" height="15" rx="3" fill="#1e293b" stroke={isFailed ? '#ef4444' : '#38bdf8'} strokeWidth="1.5" />
              <g transform={isFailed ? "rotate(-40, 0, -26)" : "rotate(0, 0, -26)"}>
                <ellipse cx="0" cy="-26" rx="30" ry="10" fill={isFailed ? '#450a0a' : '#0284c7'} stroke={isFailed ? '#ef4444' : '#38bdf8'} strokeWidth="2" />
                <line x1="0" y1="-26" x2="0" y2="-38" stroke="#cbd5e1" strokeWidth="2" />
              </g>
              <text x="0" y="32" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                PRIMARY: SVALBARD
              </text>
              <text x="0" y="46" fill={isFailed ? '#fca5a5' : '#38bdf8'} fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                {isFailed ? '💥 Fiber Severed / Motor Frozen' : 'Norway (78°N) · 7.3m Dish'}
              </text>

              {/* Status Badge */}
              <rect x="-65" y="55" width="130" height="18" rx="4" fill={isFailed ? '#7f1d1d' : '#064e3b'} stroke={isFailed ? '#ef4444' : '#10b981'} strokeWidth="1" />
              <text x="0" y="67" fill={isFailed ? '#fef2f2' : '#6ee7b7'} fontSize="8.5" fontWeight="bold" textAnchor="middle">
                {isFailed ? '💥 OUTAGE DETECTED' : '🟢 HEALTHY PRIMARY'}
              </text>
            </g>

            {/* BACKUP 2: TROLLSAT (x = 660, y = 250) */}
            <g transform="translate(660, 250)">
              <rect x="-35" y="0" width="70" height="15" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              {/* Dish angle changes when locking */}
              <g transform={step.trollsatVisualState === 'LOCKED_BEAM' || step.trollsatVisualState === 'COMPLETED' ? "rotate(-20, 0, -22)" : "rotate(0, 0, -22)"}>
                <ellipse cx="0" cy="-22" rx="24" ry="8" fill="#475569" stroke={step.trollsatVisualState === 'LOCKED_BEAM' ? '#10b981' : '#94a3b8'} strokeWidth="1.5" />
                <line x1="0" y1="-22" x2="0" y2="-34" stroke="#cbd5e1" strokeWidth="2" />
              </g>
              <text x="0" y="32" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                BACKUP 2: TROLLSAT
              </text>
              <text x="0" y="46" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                Antarctica (72°S) · 10m Reflector
              </text>
              {step.trollsatVisualState === 'LOCKED_BEAM' && (
                <text x="0" y="60" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
                  🟢 Absorbing Pelican-01 (+48m)
                </text>
              )}
              {step.trollsatVisualState === 'COMPLETED' && (
                <text x="0" y="60" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
                  ✅ Memory Emptied to 12%!
                </text>
              )}
            </g>

            {/* ======================================================== */}
            {/* STEP-BY-STEP VISUAL CONNECTION BEAMS                     */}
            {/* ======================================================== */}

            {/* STEP 1: Healthy blue connections to Svalbard */}
            {step.stepNumber === 1 && (
              <g>
                <line x1="200" y1="70" x2="420" y2="225" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                <line x1="420" y1="65" x2="420" y2="225" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.8" />
                <line x1="640" y1="75" x2="420" y2="225" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                <g transform="translate(420, 150)">
                  <rect x="-80" y="-12" width="160" height="24" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                  <text x="0" y="3" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Nominal Passes Scheduled
                  </text>
                </g>
              </g>
            )}

            {/* STEP 2: Disaster! Broken red dashed lines & warnings */}
            {step.stepNumber === 2 && (
              <g>
                {/* Broken links snapping at Svalbard */}
                <line x1="200" y1="70" x2="300" y2="150" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 4" />
                <circle cx="300" cy="150" r="4" fill="#ef4444" />
                
                <line x1="420" y1="65" x2="420" y2="150" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 4" />
                <circle cx="420" cy="150" r="5" fill="#ef4444" />

                <line x1="640" y1="75" x2="540" y2="150" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 4" />
                <circle cx="540" cy="150" r="4" fill="#ef4444" />

                {/* Alarm callout */}
                <g transform="translate(420, 150)">
                  <rect x="-105" y="-16" width="210" height="32" rx="6" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" filter="url(#glow)" />
                  <text x="0" y="-2" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    💥 SVALBARD CARRIER LOST!
                  </text>
                  <text x="0" y="10" fill="#fca5a5" fontSize="8" textAnchor="middle">
                    Legacy systems would panic for 4 hours
                  </text>
                </g>
              </g>
            )}

            {/* STEP 3: ORBITOPS 38ms Memory Lookup & Frozen Lock */}
            {step.stepNumber === 3 && (
              <g>
                {/* Central brain HUD */}
                <g transform="translate(420, 150)">
                  <rect x="-115" y="-18" width="230" height="36" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" filter="url(#glow)" />
                  <text x="0" y="-3" fill="#e0e7ff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    ⚡ ORBITOPS PLAYBOOK B ACTIVATED
                  </text>
                  <text x="0" y="10" fill="#a5b4fc" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                    Pre-computed lookup: 38.4 milliseconds
                  </text>
                </g>

                {/* SkySat-14 Protected by Frozen Lock */}
                <g transform="translate(640, 105)">
                  <rect x="-70" y="-12" width="140" height="24" rx="5" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                  <text x="0" y="3" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
                    🔒 FROZEN LOCK: t &lt; 30m
                  </text>
                </g>

                {/* Yellow targeting dotted lines */}
                <line x1="180" y1="230" x2="200" y2="70" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="660" y1="225" x2="420" y2="65" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
              </g>
            )}

            {/* STEP 4: Green Reroute Beams Lock On & Memory Drains */}
            {step.stepNumber === 4 && (
              <g>
                {/* Reroute to Inuvik */}
                <path
                  d="M 200 70 Q 150 160, 180 230"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                />
                <circle cx="180" cy="230" r="5" fill="#10b981" />
                <text x="135" y="150" fill="#6ee7b7" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
                  Reroute: Inuvik (+42m)
                </text>

                {/* Reroute to TrollSat */}
                <path
                  d="M 420 65 Q 560 120, 660 225"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="3.5"
                />
                <circle cx="660" cy="225" r="5" fill="#34d399" />
                <text x="540" y="130" fill="#a7f3d0" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
                  Reroute: TrollSat (+48m)
                </text>

                {/* Frozen Lock Badge on SkySat */}
                <g transform="translate(640, 105)">
                  <rect x="-70" y="-12" width="140" height="24" rx="5" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                  <text x="0" y="3" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
                    🔒 FROZEN LOCK: Preserved
                  </text>
                </g>
              </g>
            )}

            {/* STEP 5: Success & Disaster Neutralized */}
            {step.stepNumber === 5 && (
              <g>
                <g transform="translate(420, 150)">
                  <rect x="-115" y="-18" width="230" height="36" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
                  <text x="0" y="-3" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    ✅ 94.2% DATA PRESERVED (SAVED!)
                  </text>
                  <text x="0" y="10" fill="#a7f3d0" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                    Zero Camera Shutoffs · Zero Panic
                  </text>
                </g>

                {/* Checkmark badges on backup stations */}
                <circle cx="180" cy="230" r="10" fill="#10b981" />
                <text x="180" y="233" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">✓</text>

                <circle cx="660" cy="225" r="10" fill="#10b981" />
                <text x="660" y="228" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">✓</text>
              </g>
            )}

          </svg>
        </div>

        {/* Step-by-Step Storyboard Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              CLICK ANY STEP TO SEE HOW ORBITOPS RESPONDS:
            </span>
            <span className="text-xs text-sky-400 font-semibold">
              Current: Step {step.stepNumber} of 5
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
            {OUTAGE_STEPS.map((s, idx) => {
              const isActive = currentStepIndex === idx;
              return (
                <button
                  key={s.stepNumber}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between min-h-[85px] ${
                    isActive
                      ? 'bg-indigo-950/80 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-400/50'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className={`font-bold ${isActive ? 'text-indigo-300' : 'text-slate-400'}`}>
                      STEP {s.stepNumber}
                    </span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />}
                  </div>
                  <span className={`text-[11px] font-semibold line-clamp-2 mt-1 leading-snug ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {s.title.replace(`Step ${s.stepNumber}: `, '')}
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
              <span>{step.title}</span>
            </h4>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-bold self-start sm:self-auto">
              PLAIN ENGLISH EXPLANATION
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {step.simpleExplanation}
          </p>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-slate-400 text-[10px] block mb-0.5">WHAT CHANGED IN THE VISUALS:</span>
            <strong className="text-emerald-400 font-sans">{step.whatYouSee}</strong>
          </div>
        </div>

      </div>

      {/* Direct Comparison: 4-Hour Panic vs 38.4ms Playbook */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Direct Comparison: What Happens When a Ground Station Dies?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            The difference between legacy human panic vs ORBITOPS pre-computed playbooks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Old Way */}
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
                <strong>Engineers spend 2 to 4 hours redrawing tables:</strong> Teams manually try to find alternative dishes while satellites drift in orbit.
              </li>
              <li>
                <strong>Pelican memory overflows:</strong> The 86% memory buffer fills up to 100%, forcing the onboard computer to shut down the cameras!
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-white/80 border border-rose-200 text-xs font-mono text-rose-900">
              Result: <strong className="text-rose-600">65% Science Data Lost · Camera Shut Down · Extreme Stress</strong>
            </div>
          </div>

          {/* ORBITOPS Way */}
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
                <strong>Instant carrier loss detection:</strong> ORBITOPS activates pre-computed Playbook B in <strong>38.4 milliseconds</strong>.
              </li>
              <li>
                <strong>Frozen Horizon Lock protects ongoing passes:</strong> Passes starting within 30 min are locked in green so dishes don't thrash.
              </li>
              <li>
                <strong>Pelican memory emptied at TrollSat:</strong> Memory buffer dumps from 86% down to 12%, keeping the cameras running smoothly.
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-white/80 border border-emerald-200 text-xs font-mono text-emerald-900">
              Result: <strong className="text-emerald-700">94.2% Data Saved · Zero Overflows · Sub-Second Fix</strong>
            </div>
          </div>

        </div>
      </div>

      {/* The 3 Pillars of Playbook Execution */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            The 3 Pillars of How Playbooks Work
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            How ORBITOPS guarantees stability when ground hardware breaks:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
              PILLAR 1 · NO PANIC
            </span>
            <h4 className="font-bold text-base text-slate-900">
              The 30-Minute Frozen Lock
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              When an outage strikes, never touch passes that are starting within 30 minutes. Those are locked in green so antennas don't jerk or lose signal mid-stream.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <RotateCw className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded">
              PILLAR 2 · BACKUP NODES
            </span>
            <h4 className="font-bold text-base text-slate-900">
              Pre-Planned Station Handovers
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instead of recalculating the entire global network, ORBITOPS only reroutes the affected satellites to known backup stations (like Inuvik or TrollSat).
            </p>
          </div>

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
              Because playbooks are computed ahead of time during quiet computer cycles, activating the backup plan takes just 38.4 milliseconds. Zero human panic.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Navigation */}
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
