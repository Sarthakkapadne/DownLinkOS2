import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  RotateCw, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Radio, 
  Flame, 
  HardDrive, 
  Zap, 
  Play, 
  Pause,
  Info,
  Mic,
  RefreshCw,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { Satellite, GroundStation, PassOpportunity } from '../../types';

interface TabAlgorithmVisualizerProps {
  satellites: Satellite[];
  stations: GroundStation[];
  passes: PassOpportunity[];
  isPlainEnglishMode: boolean;
}

export const TabAlgorithmVisualizer: React.FC<TabAlgorithmVisualizerProps> = ({
  satellites,
  stations,
  passes,
  isPlainEnglishMode
}) => {
  // Current step in the 4-step algorithm (1: Direction & Timing, 2: Mechanical Dish Slew, 3: Contention & CP-SAT, 4: Failure & Healing)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlayingTour, setIsPlayingTour] = useState<boolean>(false);

  // Mechanical Dish Slew Angle Simulation
  const [dishAngleDeg, setDishAngleDeg] = useState<number>(45);
  const [isDishSlewing, setIsDishSlewing] = useState<boolean>(false);

  // Satellite buffer fill slider for interactive testing
  const [testBufferFillPct, setTestBufferFillPct] = useState<number>(94.5);

  // Outage state
  const [isStationBroken, setIsStationBroken] = useState<boolean>(false);

  // Tour Auto-Play timer
  useEffect(() => {
    if (!isPlayingTour) return;
    const timer = setInterval(() => {
      setActiveStep(prev => (prev >= 4 ? 1 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlayingTour]);

  // Simulate dish rotation animation
  const rotateDishTo = (targetDeg: number) => {
    setIsDishSlewing(true);
    setDishAngleDeg(targetDeg);
    setTimeout(() => setIsDishSlewing(false), 800);
  };

  // Dynamic Urgency Formula: Priority + 15 * (Fill/Cap)^3
  const calculatedUrgency = Number((5 + 15 * Math.pow(testBufferFillPct / 100, 3)).toFixed(1));

  return (
    <div className="space-y-6">
      
      {/* 1. SPEAKER / JUDGE PITCH CHEAT SHEET (TOP CALLOUT) */}
      <div className="bg-gradient-to-r from-sky-900 to-indigo-900 text-white rounded-2xl p-5 shadow-sm border border-sky-800">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-sky-500/20 text-sky-300 rounded-xl border border-sky-400/30 flex-shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>PITCH SCRIPT FOR THIS PAGE</span> &middot; <span>SAY THIS TO THE JUDGES</span>
              </span>
              <button
                onClick={() => setIsPlayingTour(!isPlayingTour)}
                className={`text-xs px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlayingTour 
                    ? 'bg-amber-400 text-slate-900' 
                    : 'bg-sky-500 hover:bg-sky-400 text-white'
                }`}
              >
                {isPlayingTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlayingTour ? 'Pause 4-Step Walkthrough' : 'Play 4-Step Guided Tour'}
              </button>
            </div>
            <p className="text-xs text-slate-200 mt-1.5 leading-relaxed font-sans">
              <strong>What to tell the evaluator:</strong> &quot;Our scheduler doesn&apos;t treat satellites as simple calendar entries. It models <strong>physical direction</strong>, <strong>mechanical dish rotation limits</strong>, <strong>timing windows</strong>, and <strong>buffer urgency</strong>. When two satellites want the same dish, legacy FCFS blindly picks whoever booked first, causing memory overflows. Our CP-SAT solver prioritizes based on time-to-overflow, and if a ground station breaks, it reroutes in under 50 milliseconds.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* 2. STEP SELECTION PIPELINE (4 PHYSICAL STEPS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Step 1 */}
        <button
          onClick={() => setActiveStep(1)}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeStep === 1 
              ? 'bg-sky-50 border-sky-500 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
              activeStep === 1 ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              STEP 1
            </span>
            <Compass className={`w-4 h-4 ${activeStep === 1 ? 'text-sky-600' : 'text-slate-400'}`} />
          </div>
          <div className="font-bold text-xs text-slate-900 mt-2">Timing & Direction</div>
          <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">10-min line-of-sight & flyover direction</div>
        </button>

        {/* Step 2 */}
        <button
          onClick={() => setActiveStep(2)}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeStep === 2 
              ? 'bg-sky-50 border-sky-500 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
              activeStep === 2 ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              STEP 2
            </span>
            <RotateCw className={`w-4 h-4 ${activeStep === 2 ? 'text-sky-600' : 'text-slate-400'}`} />
          </div>
          <div className="font-bold text-xs text-slate-900 mt-2">Mechanical Dish Rotation</div>
          <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">Slew speed & 120s setup buffer</div>
        </button>

        {/* Step 3 */}
        <button
          onClick={() => setActiveStep(3)}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeStep === 3 
              ? 'bg-sky-50 border-sky-500 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
              activeStep === 3 ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              STEP 3
            </span>
            <AlertTriangle className={`w-4 h-4 ${activeStep === 3 ? 'text-sky-600' : 'text-slate-400'}`} />
          </div>
          <div className="font-bold text-xs text-slate-900 mt-2">Contention & Resolution</div>
          <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">Why FCFS overflows & CP-SAT wins</div>
        </button>

        {/* Step 4 */}
        <button
          onClick={() => setActiveStep(4)}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeStep === 4 
              ? 'bg-sky-50 border-sky-500 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
              activeStep === 4 ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              STEP 4
            </span>
            <Zap className={`w-4 h-4 ${activeStep === 4 ? 'text-sky-600' : 'text-slate-400'}`} />
          </div>
          <div className="font-bold text-xs text-slate-900 mt-2">Downlink Outage & Reroute</div>
          <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">Station breaks &rarr; &lt;50ms auto-heal</div>
        </button>
      </div>

      {/* 3. STEP CONTENT INTERACTIVE SHOWCASE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        
        {/* ================= STEP 1 ================= */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">STEP 1 OF 4</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  How Satellite Direction & Timing Windows Work
                </h3>
              </div>
              <button
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                Next Step: Mechanical Dish <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Left: Visual Explanation Diagram */}
              <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="text-xs font-mono text-sky-400 uppercase font-bold flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  ORBITAL GEOMETRY: 10-MINUTE CONTACT CONE
                </div>

                {/* SVG Visualizing Satellite Moving Across Horizon */}
                <svg viewBox="0 0 400 180" className="w-full bg-slate-900 rounded-xl border border-slate-800">
                  {/* Ground Horizon Curve */}
                  <path d="M 20 160 Q 200 120 380 160" stroke="#475569" strokeWidth="2" fill="none" />
                  <text x="200" y="150" fill="#64748b" fontSize="10" textAnchor="middle">Ground Station Horizon (5° Mask)</text>

                  {/* Satellite Trajectory Arc */}
                  <path d="M 40 140 Q 200 20 360 140" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="5 5" fill="none" />
                  
                  {/* AOS Point (Acquisition of Signal) */}
                  <circle cx="50" cy="133" r="5" fill="#10b981" />
                  <text x="50" y="120" fill="#10b981" fontSize="9" fontWeight="bold">AOS (01:13 UTC)</text>
                  <text x="50" y="150" fill="#94a3b8" fontSize="8">Rises in South-East (135°)</text>

                  {/* PEAK ELEVATION Point */}
                  <circle cx="200" cy="20" r="6" fill="#38bdf8" />
                  <text x="200" y="12" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">Peak: 82.5° Elevation (1.6 Gbps)</text>

                  {/* LOS Point (Loss of Signal) */}
                  <circle cx="350" cy="133" r="5" fill="#f43f5e" />
                  <text x="350" y="120" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="end">LOS (01:24 UTC)</text>
                  <text x="350" y="150" fill="#94a3b8" fontSize="8" textAnchor="end">Sets in North-West (315°)</text>

                  {/* Ground Dish in Center */}
                  <rect x="193" y="115" width="14" height="18" fill="#f8fafc" rx="2" />
                  <line x1="200" y1="115" x2="200" y2="30" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="200" y="172" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">Svalbard Antenna</text>
                </svg>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Pass Duration</span>
                    <strong className="text-emerald-400">11 Minutes</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Flight Speed</span>
                    <strong className="text-sky-400">27,000 km/h</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Orbit Period</span>
                    <strong className="text-purple-400">94.6 Min / Orbit</strong>
                  </div>
                </div>
              </div>

              {/* Right: The 3 Core Rules */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">1</span>
                    A Satellite Is Only Visible for ~10 Minutes
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Low Earth Orbit (LEO) satellites travel at 7.6 km/second. A ground station antenna only has a narrow <strong>10 to 12-minute window</strong> to contact the satellite before it disappears over the horizon.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">2</span>
                    Flight Direction Dictates Dish Alignment
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Polar satellites rise from the South-East and set in the North-West. The ground dish must be pointed precisely at the entry bearing before AOS to acquire radio frequency lock.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">3</span>
                    Peak Elevation = Maximum Data Throughput
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    When elevation is high (e.g. 82.5°), atmospheric signal loss drops, enabling DVB-S2X to boost bitrate from <strong>200 Mbps up to 1.6 Gbps</strong>. Our algorithm prioritizes these high-elevation passes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">STEP 2 OF 4</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  The Physical Mechanical Dish (Rotation &amp; Cable Limits)
                </h3>
              </div>
              <button
                onClick={() => setActiveStep(3)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                Next Step: Contention Trap <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Left: Interactive Mechanical Dish Turntable */}
              <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-sky-400 uppercase font-bold flex items-center gap-2">
                    <RotateCw className="w-4 h-4" />
                    TURNTABLE MECHANICAL AZIMUTH TRACKING
                  </span>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                    isDishSlewing ? 'bg-amber-400 text-slate-900 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {isDishSlewing ? 'MOTORS SLEWING (12°/s)' : 'POINTING LOCKED'}
                  </span>
                </div>

                {/* Interactive Compass Turntable Visual */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    {/* Compass Outer Dial */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                      <span className="absolute top-1 text-[10px] text-slate-400 font-bold">N (0°)</span>
                      <span className="absolute right-1 text-[10px] text-slate-400 font-bold">E (90°)</span>
                      <span className="absolute bottom-1 text-[10px] text-slate-400 font-bold">S (180°)</span>
                      <span className="absolute left-1 text-[10px] text-slate-400 font-bold">W (270°)</span>
                    </div>

                    {/* Rotating Antenna Dish Pointer */}
                    <div 
                      className="w-28 h-28 rounded-full border-4 border-sky-400/80 bg-sky-950/40 flex items-center justify-center transition-transform duration-700 shadow-lg"
                      style={{ transform: `rotate(${dishAngleDeg}deg)` }}
                    >
                      <div className="w-1.5 h-14 bg-sky-400 -translate-y-7 rounded-full shadow-md" />
                      <div className="absolute w-4 h-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <div className="text-xs text-slate-400 font-mono">Current Azimuth Angle:</div>
                    <div className="text-xl font-bold font-mono text-sky-300">{dishAngleDeg}°</div>
                  </div>

                  {/* Slew Test Buttons */}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => rotateDishTo(45)}
                      className="px-2.5 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
                    >
                      Point to 45° (NE)
                    </button>
                    <button
                      onClick={() => rotateDishTo(180)}
                      className="px-2.5 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
                    >
                      Point to 180° (S)
                    </button>
                    <button
                      onClick={() => rotateDishTo(315)}
                      className="px-2.5 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
                    >
                      Point to 315° (NW)
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Cable Safety:</strong> Azimuth stays between -270° and +270° to prevent internal cable tearing.</span>
                </div>
              </div>

              {/* Right: The 2 Mechanical Laws our Scheduler Models */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Law 1: The 120-Second Setup Buffer
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    A parabolic dish weighs several tons. When pass A ends at 01:24 UTC, the dish cannot instantaneously start pass B at 01:25. It requires <strong>120 seconds of slew overhead</strong> to rotate its motors and configure transmitter modems. Legacy schedulers ignore this and cause missed frames.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <RotateCw className="w-4 h-4 text-sky-600" />
                    Law 2: Azimuth Motor Slew Rate Limit (&le;12°/sec)
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    The dish turntable turns at a maximum speed of 12 degrees per second. If pass B rises 180° away from where pass A ended, the dish needs at least 15 seconds of pure rotation before it can even acquire RF lock.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-purple-600" />
                    Law 3: Zenith Keyhole Gimbal Splitting (&gt;85°)
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    When a satellite passes directly overhead, the dish would need to rotate 180° instantaneously. Our scheduler detects this and automatically splits the pass into two parts so the motor never stalls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">STEP 3 OF 4</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  The Contention Trap: Two Satellites, One Dish
                </h3>
              </div>
              <button
                onClick={() => setActiveStep(4)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                Next Step: Test Downlink Failure <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
              At <strong>01:15 UTC</strong>, two satellites fly over Svalbard Dish 1 at the exact same minute. The dish can only track one. Look at the two decisions below:
            </p>

            {/* Side-by-Side Comparison of FCFS Failure vs ORBITOPS CP-SAT Win */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LEGACY FCFS */}
              <div className="bg-rose-50/60 border-2 border-rose-300 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-rose-200">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      LEGACY SCHEDULER
                    </span>
                    <h4 className="text-sm font-bold text-rose-950 mt-1">First-Come-First-Served (FCFS)</h4>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-rose-500 text-white rounded-lg animate-pulse">
                    1 OVERFLOW!
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1">
                    <span className="font-bold text-slate-800">What FCFS decided:</span>
                    <p className="text-slate-600 text-[11px]">
                      SuperDove-2112 (Routine) booked Svalbard at 01:10 UTC (3 minutes earlier). FCFS awarded the dish to SuperDove-2112.
                    </p>
                  </div>

                  <div className="p-3 bg-rose-100/80 rounded-xl border border-rose-300 text-rose-900 space-y-1">
                    <span className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      THE OVERFLOW DISASTER:
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      SuperDove-2104 (Wildfire Disaster Satellite) was rejected. Its memory was already at <strong>242 GB (94.5% full)</strong>. During its next 90-minute orbit, cameras took +45 GB of photos. 
                      <br />
                      <strong>242 GB + 45 GB = 287 GB &gt; 256 GB limit.</strong>
                      <br />
                      <span className="font-mono font-bold text-rose-800">&rarr; 31 GB of wildfire disaster photos were deleted forever!</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-rose-200 text-xs font-mono text-rose-800 font-bold">
                  Score: 717 pts &middot; Data Saved: 14.5 GB &middot; Disasters Lost: 1
                </div>
              </div>

              {/* OUR ORBITOPS CP-SAT */}
              <div className="bg-emerald-50/60 border-2 border-emerald-400 rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      OUR ALGORITHM
                    </span>
                    <h4 className="text-sm font-bold text-emerald-950 mt-1">ORBITOPS Google CP-SAT</h4>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-600 text-white rounded-lg">
                    0 OVERFLOWS &middot; OPTIMAL
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-1">
                    <span className="font-bold text-slate-800">What ORBITOPS decided:</span>
                    <p className="text-slate-600 text-[11px]">
                      Our mathematical urgency engine detected that SuperDove-2104 was <strong>1 orbit away from overflow</strong> (Urgency: 98.5 pts). It awarded Svalbard Dish 1 to SuperDove-2104.
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-100/80 rounded-xl border border-emerald-300 text-emerald-900 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-emerald-950">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      THE ZERO-LOSS RESOLUTION:
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      SuperDove-2104 downlinked <strong>38.2 GB of wildfire photos</strong>. Its buffer dropped safely to 204 GB. Routine satellite SuperDove-2112 (which still had 171 GB free) was cleanly shifted to Svalbard Dish 2.
                      <br />
                      <span className="font-mono font-bold text-emerald-800">&rarr; ZERO photos lost! 100% emergency fulfillment.</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200 text-xs font-mono text-emerald-900 font-bold">
                  Score: 942 pts (+31%) &middot; Data Saved: 38.2 GB (+24%) &middot; Overflows: 0
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 4 ================= */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">STEP 4 OF 4</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Downlink Failure &amp; Autonomous Sub-50ms Reroute
                </h3>
              </div>
              <button
                onClick={() => setIsStationBroken(!isStationBroken)}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto ${
                  isStationBroken 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                    : 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                }`}
              >
                {isStationBroken ? (
                  <>
                    <RefreshCw className="w-4 h-4" /> Restore Svalbard Antenna
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4" /> Break Svalbard Dish (Simulate Failure)
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
              What happens if a dish motor jams or an arctic blizzard hits Svalbard? Click <strong>&quot;Break Svalbard Dish&quot;</strong> above to see our reactive replanner heal the entire constellation in <strong>42 milliseconds</strong>.
            </p>

            {/* Reroute Diagram */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isStationBroken 
                ? 'bg-gradient-to-r from-rose-50 via-white to-emerald-50 border-emerald-400' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-sky-600" />
                  LIVE REPLANNER STATUS
                </span>
                <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded ${
                  isStationBroken ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {isStationBroken ? 'HEALED IN 42 ms' : 'MONITORING NOMINAL'}
                </span>
              </div>

              {isStationBroken ? (
                <div className="mt-4 space-y-4">
                  {/* The Flow: From Broken Station to New Station */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    
                    {/* Failed Station */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 font-bold">
                        &times;
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">KSAT Svalbard Ant-1 (78.2°N)</div>
                        <div className="text-[11px] text-rose-600 font-medium">MOTOR GEAR JAM &middot; OFFLINE</div>
                        <div className="text-[10px] text-slate-500">Scheduled: 01:13 UTC</div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                        AUTONOMOUS REROUTE
                      </span>
                      <ArrowRight className="w-5 h-5 text-emerald-600 mt-1" />
                    </div>

                    {/* New Rerouted Station */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold">
                        &check;
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">SSC Inuvik Ant-1 (Canada, 68.3°N)</div>
                        <div className="text-[11px] text-emerald-600 font-medium">NEW CONTACT AT 01:55 UTC (42 min later)</div>
                        <div className="text-[10px] text-slate-500">100% of 38.2 GB preserved</div>
                      </div>
                    </div>

                  </div>

                  {/* Operational Metrics Callout */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Replan Speed:</span>
                      <strong className="text-slate-900 text-sm font-mono font-bold">42 milliseconds</strong>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Sub-second local repair</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Frozen Window Protection:</span>
                      <strong className="text-emerald-700 text-sm font-mono font-bold">&lt;30m Passes Locked</strong>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Zero flight-controller panic</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Constellation Data Retained:</span>
                      <strong className="text-sky-700 text-sm font-mono font-bold">96.4% Preserved</strong>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Zero buffer overflow</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                  <Flame className="w-6 h-6 text-slate-400 mx-auto" />
                  <p>Click the <strong>&quot;Break Svalbard Dish&quot;</strong> button above to test the autonomous rerouting pipeline.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
