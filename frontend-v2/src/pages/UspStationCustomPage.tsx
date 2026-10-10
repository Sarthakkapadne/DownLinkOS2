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
  Sliders
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
  shortDesc: string;
  station1Status: string;
  station2Status: string;
  station3Status: string;
  activeBeam: 'none' | 'st1-conflict' | 'st2-downlink';
  deliveredGb: number;
  bitrateMbps: number;
  decisionNote: string;
}

const SIMULATION_STEPS: SimulationStep[] = [
  {
    stepNumber: 1,
    progressPercent: 5,
    title: 'Phase 1: Inbound Satellite Approaching Station 1',
    shortDesc: 'SuperDove-21 (38.4 GB Earth imagery, Priority P2) enters the polar corridor traveling towards Station 1 (Inuvik).',
    station1Status: 'Tracking P1 SkySat-14',
    station2Status: 'Standby / Dish Idle',
    station3Status: 'Standby / High-gain Polar Backup',
    activeBeam: 'none',
    deliveredGb: 0.0,
    bitrateMbps: 0,
    decisionNote: 'Initial orbit trajectory projected towards Station 1 horizon.'
  },
  {
    stepNumber: 2,
    progressPercent: 28,
    title: 'Phase 2: Conflict & Weather Discovery at Station 1',
    shortDesc: 'ORBITOPS inspects Station 1: Dish is occupied by SkySat-14 (P1 Disaster Alert). Also, a blizzard causes -2.8 dB rain fade and slow 1.2°/s slew.',
    station1Status: 'CONFLICT: Occupied by P1 Sat + Blizzard',
    station2Status: 'Standby / Free & Clear',
    station3Status: 'Standby / Ready',
    activeBeam: 'st1-conflict',
    deliveredGb: 0.0,
    bitrateMbps: 0,
    decisionNote: 'Station 1 rejected: Cannot preempt P1 Disaster sat; blizzard would cause 68% packet loss.'
  },
  {
    stepNumber: 3,
    progressPercent: 48,
    title: 'Phase 3: Station-Aware Re-Evaluation by ORBITOPS',
    shortDesc: 'Instead of dropping data or waiting blindly, ORBITOPS evaluates upcoming stations and picks Station 2 (Svalbard: 7.3m dish, 0 dB clear sky, 10 Gbps fiber).',
    station1Status: 'Servicing P1 SkySat-14 Safely',
    station2Status: 'Pre-Aiming Dish (Slewing to 38° Azimuth)',
    station3Status: 'Standby',
    activeBeam: 'none',
    deliveredGb: 0.0,
    bitrateMbps: 0,
    decisionNote: 'ORBITOPS assigns upcoming overhead pass to Station 2 with optimal 256-APSK modulation window.'
  },
  {
    stepNumber: 4,
    progressPercent: 70,
    title: 'Phase 4: Orbital Transit to Station 2 Horizon',
    shortDesc: 'SuperDove-21 flies past Station 1 without interference, rising above Station 2’s 5° elevation mask with perfect line-of-sight.',
    station1Status: 'Servicing P1 SkySat-14',
    station2Status: 'RF Carrier Acquired (Zenith Lock)',
    station3Status: 'Standby',
    activeBeam: 'st2-downlink',
    deliveredGb: 16.8,
    bitrateMbps: 1420,
    decisionNote: 'Carrier lock established! High-speed X-band downlink streaming at 1,420 Mbps.'
  },
  {
    stepNumber: 5,
    progressPercent: 92,
    title: 'Phase 5: Peak Downlink Execution at Station 2',
    shortDesc: 'Station 2 dish tracks SuperDove-21 through zenith (78° elevation). 10 Gbps fiber flushes imagery directly to cloud processing.',
    station1Status: 'Completed P1 Pass',
    station2Status: 'Downlink Complete (38.4 GB Received)',
    station3Status: 'Standby',
    activeBeam: 'st2-downlink',
    deliveredGb: 38.4,
    bitrateMbps: 1420,
    decisionNote: '38.4 GB fully downloaded. CFDP Class 2 transaction verified with 0 lost packets.'
  },
  {
    stepNumber: 6,
    progressPercent: 100,
    title: 'Phase 6: Mission Success Summary',
    shortDesc: 'Both satellites successfully served! P1 SkySat-14 was protected at Station 1, and SuperDove-21 downloaded 100% of data at Station 2.',
    station1Status: 'Ready for Next Pass',
    station2Status: 'Contact Closed / Dish Parking',
    station3Status: 'Standby',
    activeBeam: 'none',
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
    if (progress < 20) return 0;
    if (progress < 40) return 1;
    if (progress < 60) return 2;
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
  // Path starts at top-left (80, 50), curves over Station 1 (240, 100), over Station 2 (540, 60), to exit (760, 110)
  const getSatellitePosition = (progress: number) => {
    const t = Math.max(0, Math.min(100, progress)) / 100;
    // Cubic bezier or parametric curve
    const x = 70 + t * 680;
    // Realistic orbital dip and zenith rise: dips slightly between stations
    const y = 90 - Math.sin(t * Math.PI) * 45 + Math.sin(t * Math.PI * 2) * 15;
    return { x, y };
  };

  const satPos = getSatellitePosition(currentProgress);

  // Dynamic delivered GB proportional to progress
  const liveDeliveredGb = currentProgress < 60 
    ? 0 
    : Math.min(38.4, Number(((currentProgress - 60) / 32 * 38.4).toFixed(1)));

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

      {/* ======================================================== */}
      {/* 1. HERO BANNER: USP 1 PLAIN-ENGLISH TRUTH                */}
      {/* ======================================================== */}
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
            Every ground station operates differently, so one scheduling strategy cannot fit them all.
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
            ORBITOPS considers each station’s <strong>dish size, weather conditions, antenna movement speed, and data-handling capacity</strong> before assigning satellite contacts. When a satellite approaches a station that has a higher-priority conflict or poor conditions, ORBITOPS does not drop data or cause schedule collisions—it chooses the <strong>next optimal station</strong> that matches the satellite's exact data needs.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-sky-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Multi-Station Network: <strong>3 Active Ground Nodes</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              Target Payload: <strong className="text-white">SuperDove-21 (38.4 GB)</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              Protected Mission: <strong className="text-amber-400">SkySat-14 (P1 Disaster Alert)</strong>
            </div>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Radio className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. LIVE INTERACTIVE MULTI-STATION VISUAL SIMULATION      */}
      {/* ======================================================== */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 text-white">
        
        {/* Simulation Header & Playback Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-bold text-base sm:text-lg text-white tracking-wide">
                Live Orbital Simulation: Satellite Passing Across 3 Ground Stations
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Watch SuperDove-21 approach Station 1, discover a higher-priority conflict and blizzard fade, and get intelligently rescheduled to Station 2.
            </p>
          </div>

          {/* Interactive Playback Control Strip */}
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
              title="Reset Simulation"
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

        {/* ======================================================== */}
        {/* THE VISUAL ORBITAL CANVAS (SVG)                          */}
        {/* ======================================================== */}
        <div className="relative w-full bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-hidden shadow-inner">
          
          {/* Top Status Bar Inside Canvas */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/80">
            <span className="flex items-center gap-1.5 text-sky-400 font-bold">
              <SatIcon className="w-3.5 h-3.5 text-sky-400" />
              Spacecraft: SuperDove-21 (LEO 500 km · 98° Sun-Synch)
            </span>
            <span className="text-slate-400">
              Downlink Progress: <strong className="text-emerald-400">{liveDeliveredGb.toFixed(1)} / 38.4 GB</strong>
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Carrier Bitrate: <strong className="text-sky-300">{currentStep.bitrateMbps} Mbps</strong>
            </span>
          </div>

          <svg
            className="w-full h-72 sm:h-80 select-none overflow-visible"
            viewBox="0 0 800 320"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Sky Background Gradient */}
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>

              {/* Red Conflict Beam Gradient */}
              <linearGradient id="conflictBeamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.05" />
              </linearGradient>

              {/* Green Downlink Beam Gradient */}
              <linearGradient id="downlinkBeamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
              </linearGradient>

              {/* Glow Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Sky */}
            <rect x="0" y="0" width="800" height="320" fill="url(#skyGrad)" rx="12" />

            {/* Ground Horizon Terrain Strip */}
            <path
              d="M 0 250 Q 200 240, 400 250 T 800 245 L 800 320 L 0 320 Z"
              fill="#090d16"
            />
            <line x1="0" y1="248" x2="800" y2="248" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Orbital Trajectory Path (White/Sky dashed curve) */}
            <path
              d="M 60 90 Q 240 45, 420 70 T 760 110"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.5"
            />

            {/* Trajectory Direction Arrows */}
            <text x="140" y="68" fill="#38bdf8" fontSize="10" opacity="0.6" fontFamily="monospace">▶ Orbit Track</text>
            <text x="470" y="70" fill="#38bdf8" fontSize="10" opacity="0.6" fontFamily="monospace">▶ Flight Direction</text>

            {/* ======================================================== */}
            {/* STATION 1: INUVIK (x = 220, y = 250)                     */}
            {/* ======================================================== */}
            <g transform="translate(220, 250)">
              {/* Station Foundation */}
              <rect x="-35" y="0" width="70" height="15" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <rect x="-10" y="-12" width="20" height="12" fill="#334155" />

              {/* Station 1 Dish Antenna */}
              {/* Rotates slightly to show tracking */}
              <g transform={currentProgress >= 15 && currentProgress <= 45 ? "rotate(-25, 0, -12)" : "rotate(-10, 0, -12)"}>
                <ellipse cx="0" cy="-22" rx="22" ry="7" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="0" y1="-22" x2="0" y2="-32" stroke="#cbd5e1" strokeWidth="2" />
                <circle cx="0" cy="-32" r="2.5" fill="#ef4444" />
              </g>

              {/* Station Label & Badges */}
              <text x="0" y="32" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                STATION 1: INUVIK
              </text>
              <text x="0" y="46" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                5.4m Dish · Blizzard Fade (-2.8dB)
              </text>

              {/* Conflict / Occupied Beacon */}
              <rect x="-65" y="55" width="130" height="18" rx="4" fill="#450a0a" stroke="#b91c1c" strokeWidth="1" />
              <text x="0" y="67" fill="#fca5a5" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                🔴 BUSY: Servicing P1 SkySat
              </text>
            </g>

            {/* High-Priority SkySat-14 Active Link at Station 1 (Red/Amber RF Beam) */}
            {currentProgress >= 15 && currentProgress <= 45 && (
              <g>
                {/* Station 1 Tracking SkySat-14 (located top-left at x=140, y=30) */}
                <polygon
                  points="220,225 120,40 160,40"
                  fill="url(#conflictBeamGrad)"
                />
                {/* SkySat-14 Satellite Icon */}
                <g transform="translate(140, 35)">
                  <rect x="-14" y="-8" width="28" height="16" rx="2" fill="#b91c1c" stroke="#f87171" strokeWidth="1.5" />
                  <line x1="-24" y1="0" x2="-14" y2="0" stroke="#f87171" strokeWidth="2" />
                  <line x1="14" y1="0" x2="24" y2="0" stroke="#f87171" strokeWidth="2" />
                  <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">P1</text>
                  <text x="0" y="-12" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">
                    SkySat-14 (Disaster Relief)
                  </text>
                </g>

                {/* Conflict Notice Callout */}
                <g transform="translate(200, 110)">
                  <rect x="-95" y="-14" width="190" height="28" rx="6" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" filter="url(#glow)" />
                  <text x="0" y="-1" fill="#fef2f2" fontSize="9" fontWeight="bold" textAnchor="middle">
                    ⚠️ CONFLICT: Dish Occupied by P1 Sat!
                  </text>
                  <text x="0" y="9" fill="#fca5a5" fontSize="8" textAnchor="middle">
                    Blizzard (-2.8dB) would drop 68% data
                  </text>
                </g>
              </g>
            )}

            {/* ======================================================== */}
            {/* STATION 2: SVALBARD KSAT (x = 520, y = 250)              */}
            {/* ======================================================== */}
            <g transform="translate(520, 250)">
              {/* Foundation */}
              <rect x="-45" y="0" width="90" height="15" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="-14" y="-14" width="28" height="14" fill="#334155" />

              {/* Station 2 Large 7.3m Dish Antenna */}
              {/* Slews dynamically toward satellite when passing overhead */}
              <g transform={
                currentProgress >= 55 && currentProgress <= 95
                  ? `rotate(${-35 + ((currentProgress - 55) / 40) * 70}, 0, -14)`
                  : "rotate(15, 0, -14)"
              }>
                <ellipse cx="0" cy="-28" rx="30" ry="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <line x1="0" y1="-28" x2="0" y2="-42" stroke="#e0f2fe" strokeWidth="2.5" />
                <circle cx="0" cy="-42" r="3" fill={currentStep.activeBeam === 'st2-downlink' ? "#10b981" : "#38bdf8"} />
              </g>

              {/* Station Label & Badges */}
              <text x="0" y="32" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                STATION 2: KSAT SVALBARD
              </text>
              <text x="0" y="46" fill="#38bdf8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                7.3m Dish · Arctic Clear Sky (0.0dB) · 10G Fiber
              </text>

              {/* Availability Badge */}
              <rect x="-70" y="55" width="140" height="18" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
              <text x="0" y="67" fill="#6ee7b7" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                🟢 OPTIMAL FIT: Ready for SuperDove
              </text>
            </g>

            {/* Downlink RF Carrier Beam at Station 2 (Active during Steps 4 & 5) */}
            {currentStep.activeBeam === 'st2-downlink' && (
              <g>
                <polygon
                  points={`520,215 ${satPos.x - 22},${satPos.y + 12} ${satPos.x + 22},${satPos.y + 12}`}
                  fill="url(#downlinkBeamGrad)"
                />
                {/* Active Data Particles moving down the beam */}
                <line
                  x1={satPos.x}
                  y1={satPos.y + 10}
                  x2="520"
                  y2="215"
                  stroke="#34d399"
                  strokeWidth="2.5"
                  strokeDasharray="8 6"
                  opacity="0.9"
                />

                {/* Live Throughput Callout Box */}
                <g transform={`translate(${Math.max(420, Math.min(620, satPos.x))}, ${satPos.y + 55})`}>
                  <rect x="-85" y="-14" width="170" height="28" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" filter="url(#glow)" />
                  <text x="0" y="-1" fill="#ecfdf5" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    ⚡ DOWNLINK ACTIVE: 1,420 Mbps
                  </text>
                  <text x="0" y="9" fill="#a7f3d0" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                    256-APSK · 10 Gbps Fiber Flush
                  </text>
                </g>
              </g>
            )}

            {/* ======================================================== */}
            {/* STATION 3: TROLLSAT ANTARCTICA (x = 730, y = 250)        */}
            {/* ======================================================== */}
            <g transform="translate(730, 250)">
              <rect x="-25" y="0" width="50" height="15" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <ellipse cx="0" cy="-20" rx="18" ry="6" fill="#475569" stroke="#64748b" strokeWidth="1" />
              <text x="0" y="32" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
                STATION 3: TROLLSAT
              </text>
              <text x="0" y="46" fill="#64748b" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                10m Cryo · Standby Backup
              </text>
            </g>

            {/* ======================================================== */}
            {/* THE MOVING SPACECRAFT (SUPERDOVE-21)                     */}
            {/* ======================================================== */}
            <g transform={`translate(${satPos.x}, ${satPos.y})`}>
              {/* Glow circle */}
              <circle cx="0" cy="0" r="18" fill="#0284c7" opacity="0.25" filter="url(#glow)" />

              {/* Satellite Body (Gold Foil) */}
              <rect x="-10" y="-6" width="20" height="12" rx="2" fill="#f59e0b" stroke="#fef3c7" strokeWidth="1.5" />

              {/* Solar Panels (Blue Wings) */}
              <rect x="-24" y="-5" width="12" height="10" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <rect x="12" y="-5" width="12" height="10" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />

              {/* Earth-facing X-band feed horn */}
              <polygon points="0,6 -4,11 4,11" fill="#ffffff" />

              {/* Satellite Label */}
              <text x="0" y="-12" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" filter="url(#glow)">
                SuperDove-21
              </text>
              <text x="0" y="-23" fill="#38bdf8" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                [38.4 GB Earth Imagery]
              </text>
            </g>

          </svg>

          {/* Interactive Timeline Progress Scrub Bar */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Orbital Simulation Scrub:</span>
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

        {/* ======================================================== */}
        {/* STEP-BY-STEP INTERACTIVE STORYBOARD STRIP                */}
        {/* ======================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              CLICK ANY PHASE TO INSPECT ORBITOPS DECISION:
            </span>
            <span className="text-xs text-sky-400 font-semibold">
              Current: Phase {currentStep.stepNumber} of 6
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
                      PHASE {step.stepNumber}
                    </span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />}
                  </div>
                  <span className={`text-[11px] font-semibold line-clamp-2 mt-1 leading-snug ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {step.title.replace(`Phase ${step.stepNumber}: `, '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* ACTIVE DECISION TELEMETRY CONSOLE                        */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-700/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h4 className="font-bold text-sm text-white font-sans">
                {currentStep.title}
              </h4>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold self-start sm:self-auto">
              ORBITOPS AUTONOMOUS EVALUATION
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {currentStep.shortDesc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">STATION 1 (INUVIK) STATE:</span>
              <strong className={currentStep.station1Status.includes('CONFLICT') ? 'text-rose-400' : 'text-slate-200'}>
                {currentStep.station1Status}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">STATION 2 (SVALBARD) STATE:</span>
              <strong className={currentStep.station2Status.includes('Downlink') || currentStep.station2Status.includes('Optimal') || currentStep.station2Status.includes('Lock') ? 'text-emerald-400' : 'text-sky-300'}>
                {currentStep.station2Status}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">DECISION RATIONALE:</span>
              <strong className="text-amber-300 font-sans text-[11px]">
                {currentStep.decisionNote}
              </strong>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. SIDE-BY-SIDE: BLIND UNIFORM VS ORBITOPS STATION-AWARE */}
      {/* ======================================================== */}
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
          
          {/* Box 1: Blind Uniform Schedulers */}
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
                <strong>Forces contact at Station 1:</strong> The naive scheduler sees Station 1 is physically closest and schedules SuperDove-21 there.
              </li>
              <li>
                <strong>Either preempts P1 Disaster Alert:</strong> Cuts off emergency SkySat-14 tactical imagery, endangering ground first-responders.
              </li>
              <li>
                <strong>OR gets choked in blizzard rain fade:</strong> If scheduled after SkySat-14, Station 1’s snow attenuation (-2.8 dB) throttles bitrate from 1,420 Mbps down to 180 Mbps.
              </li>
              <li>
                <strong>Result:</strong> 31.8 GB of imagery is lost or delayed by 12 hours. Severe schedule collision!
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-white/80 border border-rose-200 text-xs font-mono text-rose-900">
              Score: <strong className="text-rose-600">68% Data Loss · Mission Conflict Violated</strong>
            </div>
          </div>

          {/* Box 2: ORBITOPS Station-Aware Scheduler */}
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
                <strong>Inspects Station 1 capabilities:</strong> Recognizes Station 1 is busy with a higher-priority P1 mission and that weather fade would degrade link margin.
              </li>
              <li>
                <strong>Zero mission interference:</strong> Leaves Station 1 unhindered to finish emergency telemetry for SkySat-14.
              </li>
              <li>
                <strong>Assigns to Station 2 (KSAT Svalbard):</strong> Matches SuperDove-21’s 38.4 GB dump with Station 2’s large 7.3m dish, clear arctic sky, and 10 Gbps subsea fiber link.
              </li>
              <li>
                <strong>Result:</strong> 100% of payload (38.4 GB) downlinked at peak 1,420 Mbps rate without a single dropped packet!
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-white/80 border border-emerald-200 text-xs font-mono text-emerald-900">
              Score: <strong className="text-emerald-700">0 Bytes Lost · Zero Collisions · Both Missions Saved</strong>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. THE 4 PHYSICAL STATION FACTORS EVALUATED               */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            The 4 Physical Factors Evaluated for Every Ground Station
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ORBITOPS does not use abstract math—it checks the real engineering physics of each antenna site.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Factor 1: Dish Size & RF Gain */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <Radio className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              1. Dish Size & RF Gain
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A 7.3m dish provides +5.7 dB higher reception gain than a 5.4m dish. ORBITOPS reserves high-gain dishes for satellites carrying 30+ GB payloads so they can use maximum 256-APSK modulations.
            </p>
          </div>

          {/* Factor 2: Weather & Atmospheric Loss */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <CloudRain className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              2. Weather Rain & Snow Fade
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Snow and rain attenuate X-band signals (-2 to -4 dB loss). ORBITOPS checks live meteorological telemetry and diverts high-throughput passes away from storm-impacted stations.
            </p>
          </div>

          {/* Factor 3: Antenna Slew Speed */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              3. Antenna Movement Speed
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mechanical azimuth motors range from 1.0°/s (slow cryo dishes) to 3.5°/s (agile mounts). ORBITOPS calculates precise turnaround minutes to guarantee zero cable-wrap jams or missed horizons.
            </p>
          </div>

          {/* Factor 4: Data Handling Capacity */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <HardDrive className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              4. Fiber Backhaul Bandwidth
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A ground station with only 1 Gbps microwave backhaul cannot ingest multiple 1,420 Mbps downlinks without buffer overflow. ORBITOPS matches heavy dumps to 10 Gbps optical fiber nodes.
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
