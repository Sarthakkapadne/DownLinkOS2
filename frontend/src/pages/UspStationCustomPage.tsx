import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Radio, 
  CloudRain, 
  Sun, 
  Wind, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  Sparkles, 
  Satellite as SatIcon, 
  Gauge, 
  Layers, 
  Info,
  Clock,
  Compass,
  Zap,
  TrendingUp,
  BookmarkCheck
} from 'lucide-react';

export interface UspStationCustomPageProps {
  onBack?: () => void;
  onNavigateToUsp2?: () => void;
}

// 6 Discrete Simulation Steps
interface SimulationStep {
  stepNumber: number;
  progressPercent: number;
  title: string;
  simpleExplanation: string;
  station1Status: string;
  station2Status: string;
  beamType: 'none' | 'st1-handshake' | 'st1-warning' | 'st1-emergency' | 'st2-fast-downlink';
  deliveredGb: number;
  bitrateMbps: number;
  decisionNote: string;
}

const SIMULATION_STEPS: SimulationStep[] = [
  {
    stepNumber: 1,
    progressPercent: 12,
    title: 'Step 1: Satellite First Connects to Station 1',
    simpleExplanation: 'SuperDove-21 reaches Station 1 (Inuvik) and establishes an initial connection. Download starts, but at a crawling speed of only 180 Mbps.',
    station1Status: 'Initial Handshake Active (180 Mbps)',
    station2Status: 'Idle / Standby',
    beamType: 'st1-handshake',
    deliveredGb: 2.1,
    bitrateMbps: 180,
    decisionNote: 'Initial link established. Testing station compatibility and link speed.'
  },
  {
    stepNumber: 2,
    progressPercent: 32,
    title: 'Step 2: Problems Discovered (Bad Weather & New Emergency Sat!)',
    simpleExplanation: 'Two major issues are found: (1) Heavy blizzard snow absorbs the signal (-2.8 dB), and (2) An emergency disaster satellite (SkySat-14, Priority P1) suddenly crosses the horizon needing this dish!',
    station1Status: '⚠️ Incompatible: Blizzard Fade + Emergency Sat Arriving',
    station2Status: 'Idle / Clear Weather',
    beamType: 'st1-warning',
    deliveredGb: 2.1,
    bitrateMbps: 180,
    decisionNote: 'Station 1 cannot handle both satellites. Blizzard would drop 68% of SuperDove data.'
  },
  {
    stepNumber: 3,
    progressPercent: 52,
    title: 'Step 3: ORBITOPS Saves Checkpoint & Switches to Station 2',
    simpleExplanation: 'Instead of dropping data, ORBITOPS saves a checkpoint of the 2.1 GB downloaded, releases Station 1 for the emergency satellite, and switches SuperDove-21 to Station 2 (Svalbard).',
    station1Status: 'Handed Over to Emergency SkySat-14',
    station2Status: 'Pre-Aiming Dish (Slewing to 38° Azimuth)',
    beamType: 'st1-emergency',
    deliveredGb: 2.1,
    bitrateMbps: 0,
    decisionNote: 'Checkpoint saved. SuperDove-21 rerouted to Station 2; SkySat-14 gets Station 1.'
  },
  {
    stepNumber: 4,
    progressPercent: 72,
    title: 'Step 4: Approaching Station 2 with Optimal Conditions',
    simpleExplanation: 'SuperDove-21 flies into Station 2’s sky. Station 2 has a giant 7.3m dish, clear arctic sky (0 dB loss), and high-speed 10 Gbps fiber. A bright green laser beam locks on!',
    station1Status: 'Servicing Emergency Satellite Safely',
    station2Status: 'Beam Locked (78° Zenith Pass)',
    beamType: 'st2-fast-downlink',
    deliveredGb: 18.5,
    bitrateMbps: 1420,
    decisionNote: 'Station 2 offers 8x higher download speed (1,420 Mbps) with zero weather loss.'
  },
  {
    stepNumber: 5,
    progressPercent: 92,
    title: 'Step 5: Blazing Fast Download Resumes & Completes',
    simpleExplanation: 'Picking up from the 2.1 GB checkpoint, the remaining 36.3 GB downloads in minutes at 1,420 Mbps. The entire 38.4 GB payload is safely saved to the cloud.',
    station1Status: 'Emergency Pass Completed',
    station2Status: 'Download Finished (38.4 GB Total)',
    beamType: 'st2-fast-downlink',
    deliveredGb: 38.4,
    bitrateMbps: 1420,
    decisionNote: '38.4 GB completely saved. 0 lost packets. 0 mission collisions.'
  },
  {
    stepNumber: 6,
    progressPercent: 100,
    title: 'Step 6: Win-Win Outcome for Both Satellites',
    simpleExplanation: 'By knowing each station’s real conditions, ORBITOPS saved both missions: the emergency satellite got Station 1 without delay, and SuperDove-21 got full high-speed download at Station 2.',
    station1Status: 'Ready for Next Pass',
    station2Status: 'Pass Complete / Dish Parking',
    beamType: 'none',
    deliveredGb: 38.4,
    bitrateMbps: 0,
    decisionNote: 'Station-aware scheduling achieved 100% throughput gain without disrupting critical missions.'
  }
];

export const UspStationCustomPage: React.FC<UspStationCustomPageProps> = ({
  onBack,
  onNavigateToUsp2
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentProgress, setCurrentProgress] = useState<number>(10);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const animationFrameRef = useRef<number | null>(null);

  // Derive current step from progress
  const getCurrentStepIndex = (progress: number) => {
    if (progress < 22) return 0;
    if (progress < 42) return 1;
    if (progress < 62) return 2;
    if (progress < 82) return 3;
    if (progress < 98) return 4;
    return 5;
  };

  const currentStepIndex = getCurrentStepIndex(currentProgress);
  const currentStep = SIMULATION_STEPS[currentStepIndex];

  // Animation Loop
  useEffect(() => {
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setCurrentProgress((prev) => {
          const next = prev + delta * 7 * playbackSpeed;
          if (next >= 100) {
            return 100;
          }
          return next;
        });
      }

      animationFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animationFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  const handleJumpToStep = (index: number) => {
    setCurrentProgress(SIMULATION_STEPS[index].progressPercent);
  };

  const handleReset = () => {
    setCurrentProgress(0);
    setIsPlaying(true);
  };

  // Interpolated satellite flight coordinates on 800x320 SVG Canvas
  const getSatellitePosition = (progress: number) => {
    const t = Math.max(0, Math.min(100, progress)) / 100;
    const x = 70 + t * 680;
    const y = 90 - Math.sin(t * Math.PI) * 45 + Math.sin(t * Math.PI * 2) * 15;
    return { x, y };
  };

  const satPos = getSatellitePosition(currentProgress);

  // Dynamic delivered GB
  const getLiveDeliveredGb = () => {
    if (currentProgress < 10) return 0;
    if (currentProgress < 62) return 2.1;
    const remaining = (currentProgress - 62) / (98 - 62);
    return Math.min(38.4, Number((2.1 + remaining * 36.3).toFixed(1)));
  };

  const liveDeliveredGb = getLiveDeliveredGb();

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
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">Page 2 of 3</span>
          {onNavigateToUsp2 && (
            <button
              onClick={onNavigateToUsp2}
              className="flex items-center gap-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-xl transition shadow-2xs cursor-pointer"
            >
              <span>Next: USP 2 Pre-Computed Playbooks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hero Banner: Plain English Explanation */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
            <Cpu className="w-3.5 h-3.5" />
            <span>CORE USP 1 · STATION-AWARE SCHEDULING ENGINE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Per-Station Custom Scheduler
          </h1>

          <p className="text-base sm:text-lg text-sky-200/90 font-medium leading-relaxed">
            Every ground station is different. Treating all antennas the same causes massive data loss.
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
            Watch the live simulation below: SuperDove-21 first connects to Station 1, but discovers <strong>slow speeds due to bad weather and a new emergency satellite needing the dish</strong>. Instead of dropping data, ORBITOPS saves a checkpoint and switches to Station 2 for an 8x faster download!
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-sky-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Network: <strong>3 Ground Stations</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              Downlinking Payload: <strong className="text-white">SuperDove-21 (38.4 GB)</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              Emergency Mission: <strong className="text-amber-400">SkySat-14 (Priority P1 Disaster)</strong>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Radio className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Visual Multi-Station Simulation Canvas */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 text-white">
        
        {/* Playback Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-bold text-base sm:text-lg text-white tracking-wide">
                Live Simulation: Satellite Connects to Station 1 → Discovers Issues → Switches to Station 2
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Watch how ORBITOPS tests Station 1, saves a checkpoint, and hands over to Station 2 when issues are detected.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer shadow-sm ${
                isPlaying 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play Simulation'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-mono font-bold transition border border-slate-700 cursor-pointer"
            >
              {playbackSpeed}x Speed
            </button>
          </div>
        </div>

        {/* SVG Screen */}
        <div className="relative w-full bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-hidden shadow-inner">
          
          {/* Header Inside Canvas */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/80">
            <span className="flex items-center gap-1.5 text-sky-400 font-bold">
              <SatIcon className="w-3.5 h-3.5 text-sky-400" />
              SuperDove-21 (38.4 GB Earth Imagery)
            </span>
            <span className="text-slate-400">
              Data Downloaded: <strong className="text-emerald-400">{liveDeliveredGb.toFixed(1)} / 38.4 GB</strong>
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Download Speed: <strong className="text-sky-300">{currentStep.bitrateMbps} Mbps</strong>
            </span>
          </div>

          <svg
            className="w-full h-72 sm:h-80 select-none overflow-visible"
            viewBox="0 0 800 320"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>

              {/* Amber Handshake Beam */}
              <linearGradient id="amberBeamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.1" />
              </linearGradient>

              {/* Warning Flickering Beam */}
              <linearGradient id="warnBeamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
              </linearGradient>

              {/* Ultra Green Fast Downlink Beam */}
              <linearGradient id="fastDownlinkGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.15" />
              </linearGradient>

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Sky */}
            <rect x="0" y="0" width="800" height="320" fill="url(#skyGrad)" rx="12" />

            {/* Ground Horizon */}
            <path
              d="M 0 250 Q 200 240, 400 250 T 800 245 L 800 320 L 0 320 Z"
              fill="#090d16"
            />
            <line x1="0" y1="248" x2="800" y2="248" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Trajectory */}
            <path
              d="M 60 90 Q 240 45, 420 70 T 760 110"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.4"
            />

            {/* Trajectory labels */}
            <text x="140" y="68" fill="#38bdf8" fontSize="10" opacity="0.6" fontFamily="monospace">▶ Orbit Track</text>
            <text x="470" y="70" fill="#38bdf8" fontSize="10" opacity="0.6" fontFamily="monospace">▶ Flight Direction</text>

            {/* ======================================================== */}
            {/* STATION 1: INUVIK (x = 220, y = 250)                     */}
            {/* ======================================================== */}
            <g transform="translate(220, 250)">
              <rect x="-35" y="0" width="70" height="15" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <rect x="-10" y="-12" width="20" height="12" fill="#334155" />

              {/* Dish tilting towards SuperDove or SkySat */}
              <g transform={currentProgress < 50 ? "rotate(-25, 0, -12)" : "rotate(-40, 0, -12)"}>
                <ellipse cx="0" cy="-22" rx="22" ry="7" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="0" y1="-22" x2="0" y2="-32" stroke="#cbd5e1" strokeWidth="2" />
                <circle cx="0" cy="-32" r="2.5" fill={currentStep.beamType === 'st1-warning' ? "#ef4444" : "#f59e0b"} />
              </g>

              <text x="0" y="32" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                STATION 1: INUVIK
              </text>
              <text x="0" y="46" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                5.4m Small Dish · Blizzard Fade (-2.8 dB)
              </text>

              {/* Status Badge */}
              {currentProgress < 25 && (
                <g>
                  <rect x="-65" y="55" width="130" height="18" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
                  <text x="0" y="67" fill="#fef3c7" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    🟡 CONNECTED: Slow 180 Mbps
                  </text>
                </g>
              )}
              {currentProgress >= 25 && currentProgress < 55 && (
                <g>
                  <rect x="-70" y="55" width="140" height="18" rx="4" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
                  <text x="0" y="67" fill="#fca5a5" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    ⚠️ INCOMPATIBLE + P1 SAT ARRIVING
                  </text>
                </g>
              )}
              {currentProgress >= 55 && (
                <g>
                  <rect x="-70" y="55" width="140" height="18" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                  <text x="0" y="67" fill="#93c5fd" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    🔵 Servicing Emergency SkySat
                  </text>
                </g>
              )}
            </g>

            {/* STEP 1: INITIAL CONNECTION BEAM (SuperDove to Station 1) */}
            {currentStep.beamType === 'st1-handshake' && (
              <g>
                <polygon
                  points={`220,225 ${satPos.x - 14},${satPos.y + 10} ${satPos.x + 14},${satPos.y + 10}`}
                  fill="url(#amberBeamGrad)"
                />
                <line
                  x1={satPos.x}
                  y1={satPos.y + 8}
                  x2="220"
                  y2="225"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <g transform={`translate(${Math.max(160, satPos.x)}, ${satPos.y + 40})`}>
                  <rect x="-80" y="-12" width="160" height="24" rx="5" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
                  <text x="0" y="3" fill="#fef3c7" fontSize="9" fontWeight="bold" textAnchor="middle">
                    📶 Initial Link: Slow 180 Mbps
                  </text>
                </g>
              </g>
            )}

            {/* STEP 2: PROBLEMS DISCOVERED (Flickering Warning + SkySat Arriving) */}
            {currentStep.beamType === 'st1-warning' && (
              <g>
                {/* Flickering warning beam */}
                <polygon
                  points={`220,225 ${satPos.x - 16},${satPos.y + 10} ${satPos.x + 16},${satPos.y + 10}`}
                  fill="url(#warnBeamGrad)"
                />
                <line
                  x1={satPos.x}
                  y1={satPos.y + 8}
                  x2="220"
                  y2="225"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />

                {/* SkySat-14 Appears on horizon */}
                <g transform="translate(130, 35)">
                  <rect x="-14" y="-8" width="28" height="16" rx="2" fill="#b91c1c" stroke="#f87171" strokeWidth="1.5" />
                  <line x1="-24" y1="0" x2="-14" y2="0" stroke="#f87171" strokeWidth="2" />
                  <line x1="14" y1="0" x2="24" y2="0" stroke="#f87171" strokeWidth="2" />
                  <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">P1</text>
                  <text x="0" y="-12" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Emergency SkySat-14 Arriving!
                  </text>
                </g>

                {/* Big Warning Callout */}
                <g transform="translate(240, 120)">
                  <rect x="-110" y="-16" width="220" height="32" rx="6" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" filter="url(#glow)" />
                  <text x="0" y="-2" fill="#fef2f2" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    ⚠️ POOR COMPATIBILITY + P1 CONFLICT
                  </text>
                  <text x="0" y="10" fill="#fca5a5" fontSize="8" textAnchor="middle">
                    Snow fade drops 68% data · Switching to Station 2!
                  </text>
                </g>
              </g>
            )}

            {/* STEP 3: CHECKPOINT SAVED BADGE & HANDOVER TO EMERGENCY SAT */}
            {currentStep.beamType === 'st1-emergency' && (
              <g>
                {/* Station 1 now connected to SkySat-14 */}
                <polygon
                  points="220,225 110,40 150,40"
                  fill="url(#amberBeamGrad)"
                />
                <g transform="translate(130, 35)">
                  <rect x="-14" y="-8" width="28" height="16" rx="2" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                  <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">P1</text>
                  <text x="0" y="-12" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">
                    SkySat-14 (Downloading Safely)
                  </text>
                </g>

                {/* Saved Checkpoint Badge on SuperDove */}
                <g transform={`translate(${satPos.x}, ${satPos.y + 45})`}>
                  <rect x="-85" y="-12" width="170" height="24" rx="5" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                  <text x="0" y="3" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
                    💾 Checkpoint Saved: 2.1 GB
                  </text>
                </g>
              </g>
            )}

            {/* ======================================================== */}
            {/* STATION 2: KSAT SVALBARD (x = 520, y = 250)              */}
            {/* ======================================================== */}
            <g transform="translate(520, 250)">
              <rect x="-45" y="0" width="90" height="15" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="-14" y="-14" width="28" height="14" fill="#334155" />

              {/* Station 2 Large 7.3m Dish Antenna */}
              <g transform={
                currentProgress >= 60 && currentProgress <= 95
                  ? `rotate(${-35 + ((currentProgress - 60) / 35) * 70}, 0, -14)`
                  : "rotate(15, 0, -14)"
              }>
                <ellipse cx="0" cy="-28" rx="30" ry="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <line x1="0" y1="-28" x2="0" y2="-42" stroke="#e0f2fe" strokeWidth="2.5" />
                <circle cx="0" cy="-42" r="3" fill={currentStep.beamType === 'st2-fast-downlink' ? "#10b981" : "#38bdf8"} />
              </g>

              <text x="0" y="32" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                STATION 2: KSAT SVALBARD
              </text>
              <text x="0" y="46" fill="#38bdf8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                7.3m Huge Dish · Clear Sky (0 dB) · 10G Fiber
              </text>

              {/* Status Badge */}
              {currentProgress < 60 ? (
                <g>
                  <rect x="-65" y="55" width="130" height="18" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                  <text x="0" y="67" fill="#cbd5e1" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    Ready & Pre-Aiming Dish
                  </text>
                </g>
              ) : (
                <g>
                  <rect x="-70" y="55" width="140" height="18" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                  <text x="0" y="67" fill="#6ee7b7" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    🟢 FAST DOWNLINK: 1,420 Mbps
                  </text>
                </g>
              )}
            </g>

            {/* STEP 4 & 5: FAST DOWNLINK AT STATION 2 */}
            {currentStep.beamType === 'st2-fast-downlink' && (
              <g>
                <polygon
                  points={`520,215 ${satPos.x - 22},${satPos.y + 12} ${satPos.x + 22},${satPos.y + 12}`}
                  fill="url(#fastDownlinkGrad)"
                />
                <line
                  x1={satPos.x}
                  y1={satPos.y + 10}
                  x2="520"
                  y2="215"
                  stroke="#34d399"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                />

                {/* Throughput Callout Box */}
                <g transform={`translate(${Math.max(420, Math.min(620, satPos.x))}, ${satPos.y + 55})`}>
                  <rect x="-95" y="-14" width="190" height="28" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" filter="url(#glow)" />
                  <text x="0" y="-1" fill="#ecfdf5" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    ⚡ 1,420 Mbps (8x Faster Download!)
                  </text>
                  <text x="0" y="9" fill="#a7f3d0" fontSize="8" textAnchor="middle" fontFamily="monospace">
                    Resumed from 2.1 GB Checkpoint
                  </text>
                </g>
              </g>
            )}

            {/* STATION 3: TROLLSAT ANTARCTICA (x = 730, y = 250) */}
            <g transform="translate(730, 250)">
              <rect x="-25" y="0" width="50" height="15" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <ellipse cx="0" cy="-20" rx="18" ry="6" fill="#475569" stroke="#64748b" strokeWidth="1" />
              <text x="0" y="32" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
                STATION 3: TROLLSAT
              </text>
              <text x="0" y="46" fill="#64748b" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                10m Cryo · Polar Backup
              </text>
            </g>

            {/* THE MOVING SPACECRAFT (SUPERDOVE-21) */}
            <g transform={`translate(${satPos.x}, ${satPos.y})`}>
              <circle cx="0" cy="0" r="18" fill="#0284c7" opacity="0.25" filter="url(#glow)" />
              <rect x="-10" y="-6" width="20" height="12" rx="2" fill="#f59e0b" stroke="#fef3c7" strokeWidth="1.5" />
              <rect x="-24" y="-5" width="12" height="10" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <rect x="12" y="-5" width="12" height="10" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <polygon points="0,6 -4,11 4,11" fill="#ffffff" />
              <text x="0" y="-12" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" filter="url(#glow)">
                SuperDove-21
              </text>
              <text x="0" y="-23" fill="#38bdf8" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                [38.4 GB Earth Imagery]
              </text>
            </g>

          </svg>

          {/* Interactive Progress Scrub Bar */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Simulation Scrub:</span>
              <span className="text-sky-300 font-bold">{currentProgress.toFixed(0)}% Completed</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={currentProgress}
              onChange={(e) => {
                setCurrentProgress(parseFloat(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Step-by-Step Storyboard Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              CLICK ANY STEP TO SEE HOW THE DECISION UNFOLDS:
            </span>
            <span className="text-xs text-sky-400 font-semibold">
              Current: Step {currentStep.stepNumber} of 6
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            {SIMULATION_STEPS.map((step, idx) => {
              const isActive = currentStepIndex === idx;
              return (
                <button
                  key={step.stepNumber}
                  onClick={() => handleJumpToStep(idx)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between min-h-[75px] ${
                    isActive
                      ? 'bg-sky-950/80 border-sky-400 text-white shadow-sm ring-1 ring-sky-400/50'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className={`font-bold ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>
                      STEP {step.stepNumber}
                    </span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />}
                  </div>
                  <span className={`text-[11px] font-semibold line-clamp-2 mt-1 leading-snug ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {step.title.replace(`Step ${step.stepNumber}: `, '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Decision Telemetry Console */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-700/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h4 className="font-bold text-sm text-white font-sans">
                {currentStep.title}
              </h4>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold self-start sm:self-auto">
              PLAIN ENGLISH EXPLANATION
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {currentStep.simpleExplanation}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">STATION 1 (INUVIK):</span>
              <strong className={currentStep.station1Status.includes('Incompatible') ? 'text-rose-400' : 'text-slate-200'}>
                {currentStep.station1Status}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">STATION 2 (SVALBARD):</span>
              <strong className={currentStep.station2Status.includes('Locked') || currentStep.station2Status.includes('Finished') ? 'text-emerald-400' : 'text-sky-300'}>
                {currentStep.station2Status}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">WHY THIS MATTERS:</span>
              <strong className="text-amber-300 font-sans text-[11px]">
                {currentStep.decisionNote}
              </strong>
            </div>
          </div>
        </div>

      </div>

      {/* Side-by-Side: Blind Schedulers vs ORBITOPS */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Direct Comparison: What Happens In This Scenario?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Compare what traditional blind schedulers do versus ORBITOPS station-aware scheduling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Blind Scheduler */}
          <div className="p-6 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>The Blind Way: Treating Every Antenna the Same</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                LEGACY FAILURE
              </span>
            </div>

            <ul className="text-xs text-slate-700 space-y-2.5 leading-relaxed list-disc list-inside">
              <li>
                <strong>Forces SuperDove-21 to stay at Station 1:</strong> The naive scheduler sees Station 1 was assigned first, so it stubbornly keeps it there.
              </li>
              <li>
                <strong>Blocks the emergency satellite:</strong> SkySat-14 is forced to wait, delaying urgent disaster relief imagery.
              </li>
              <li>
                <strong>Drops 68% of data in blizzard:</strong> The snow storm chokes the connection, causing 31.8 GB of photos to be dropped or lost.
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-white/80 border border-rose-200 text-xs font-mono text-rose-900">
              Result: <strong className="text-rose-600">68% Data Loss · Emergency Relief Delayed</strong>
            </div>
          </div>

          {/* ORBITOPS */}
          <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>The ORBITOPS Way: Per-Station Custom Scheduling</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                100% SUCCESS
              </span>
            </div>

            <ul className="text-xs text-slate-700 space-y-2.5 leading-relaxed list-disc list-inside">
              <li>
                <strong>Detects Station 1 issues immediately:</strong> Notices the blizzard fade and that an emergency satellite needs the dish.
              </li>
              <li>
                <strong>Saves 2.1 GB checkpoint:</strong> Safely disconnects SuperDove-21 without throwing away what was already downloaded.
              </li>
              <li>
                <strong>Switches to Station 2:</strong> Takes advantage of Station 2's giant 7.3m dish and 10 Gbps fiber, finishing the download at 1,420 Mbps!
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-white/80 border border-emerald-200 text-xs font-mono text-emerald-900">
              Result: <strong className="text-emerald-700">100% Data Delivered · Both Satellites Succeeded</strong>
            </div>
          </div>

        </div>
      </div>

      {/* The 4 Physical Station Factors */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            The 4 Real-World Conditions ORBITOPS Checks at Every Station
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Every station has physical limits. Here is what ORBITOPS checks before deciding:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <Radio className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              1. Dish Size & Antenna Power
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bigger dishes (like 7.3m) pull in much stronger signals than small dishes (5.4m), enabling blazing fast 1,420 Mbps downloads.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <CloudRain className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              2. Real-Time Weather (Rain & Snow)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Snow and heavy rain absorb satellite radio signals. ORBITOPS checks live weather and avoids storm-hit ground stations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              3. Dish Turning Speed (Slew Rate)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Heavy antennas take minutes to turn around. ORBITOPS calculates motor speeds so antennas never miss the satellite rising over the horizon.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <HardDrive className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              4. Ground Internet & Fiber Bandwidth
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A ground station with slow internet can't send gigabytes of satellite photos to customers. ORBITOPS sends big payloads to high-speed fiber stations.
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

        {onNavigateToUsp2 && (
          <button
            onClick={onNavigateToUsp2}
            className="flex items-center gap-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl transition shadow-2xs cursor-pointer w-full sm:w-auto justify-center"
          >
            <span>Proceed to USP 2: Pre-Computed Failure Playbooks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
