import React, { useState } from 'react';
import { 
  Cpu, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  HardDrive, 
  RefreshCw, 
  Zap, 
  Play, 
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Flame,
  ArrowDownToLine
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
  // Step in the algorithm explanation (1: Ingest, 2: Contention Detect, 3: CP-SAT Optimization, 4: Outage & Reroute)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSimulatingFailure, setIsSimulatingFailure] = useState<boolean>(false);
  const [simulatedFailureStation, setSimulatedFailureStation] = useState<string>('KSAT-Svalbard-1');

  // Interactive controls for Sat B buffer level
  const [satBBufferFillPct, setSatBBufferFillPct] = useState<number>(94.5);

  // Sat A (Routine) vs Sat B (Disaster Task)
  const satA = satellites.find(s => s.id === 'SuperDove-2112') || satellites[5];
  const satB = satellites.find(s => s.id === 'SuperDove-2104') || satellites[1];

  // Dynamic urgency score formula: Priority + 15 * (Fill / Cap)^3
  const satAUrgency = Number((satA.priority + 15 * Math.pow(satA.currentBufferGb / satA.ssrCapacityGb, 3)).toFixed(1));
  const satBUrgency = Number((satB.priority + 15 * Math.pow(satBBufferFillPct / 100, 3)).toFixed(1));

  return (
    <div className="space-y-6">
      {/* 1. HERO ALGORITHM EXPLAINER HEADER */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-2 border border-sky-400/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>THE CORE SCHEDULING ALGORITHM (STAGE-BY-STAGE)</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              How ORBITOPS Schedules Passes & Heals Downlink Failures
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Commercial ground stations still use First-Come-First-Served (FCFS) slot booking, causing high-priority disaster satellites to drop data when queues get congested. Here is exactly how our mathematical engine resolves conflicts and reroutes failed passes.
            </p>
          </div>

          {/* Quick Step Buttons */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
            {[1, 2, 3, 4].map((stepNum) => (
              <button
                key={stepNum}
                onClick={() => setActiveStep(stepNum)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeStep === stepNum
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                Step {stepNum}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Step Pipeline Progress */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div 
            onClick={() => setActiveStep(1)}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeStep === 1 
                ? 'bg-sky-500/10 border-sky-400 text-white' 
                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-[10px] font-mono text-sky-400 uppercase font-bold">Stage 1 · Ingest</div>
            <div className="text-xs font-bold mt-0.5 text-white">Buffer Urgency Scoring</div>
            <div className="text-[11px] text-slate-400 mt-1">Computes water-tank fullness & time-to-overflow</div>
          </div>

          <div 
            onClick={() => setActiveStep(2)}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeStep === 2 
                ? 'bg-sky-500/10 border-sky-400 text-white' 
                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">Stage 2 · Conflict</div>
            <div className="text-xs font-bold mt-0.5 text-white">Contention Detection</div>
            <div className="text-[11px] text-slate-400 mt-1">2 satellites want 1 antenna at 01:15 UTC</div>
          </div>

          <div 
            onClick={() => setActiveStep(3)}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeStep === 3 
                ? 'bg-sky-500/10 border-sky-400 text-white' 
                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Stage 3 · Solve</div>
            <div className="text-xs font-bold mt-0.5 text-white">Google CP-SAT Solver</div>
            <div className="text-[11px] text-slate-400 mt-1">Assigns pass to highest value & 0 overflow</div>
          </div>

          <div 
            onClick={() => setActiveStep(4)}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeStep === 4 
                ? 'bg-rose-500/10 border-rose-400 text-white' 
                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-[10px] font-mono text-rose-400 uppercase font-bold">Stage 4 · Heal</div>
            <div className="text-xs font-bold mt-0.5 text-white">Outage & Instant Reroute</div>
            <div className="text-[11px] text-slate-400 mt-1">Downlink fails &rarr; reroutes in &lt;50 ms</div>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE STEP CANVAS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        
        {/* STEP 1: INGEST & BUFFER URGENCY */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">STAGE 1: INPUT & URGENCY FORMULA</span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Why Static Priority Fails & How Dynamic Urgency Works
                </h2>
              </div>
              <button
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                Next: See The Conflict <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
              In space, satellite memory is like a water tank. As satellites orbit Earth, optical sensors pour in gigabytes of data. If you only look at static priority (e.g. 1 to 5 stars), a Tier 3 satellite with an empty tank might be scheduled ahead of a Tier 2 satellite whose tank is 99% full and about to overflow.
            </p>

            {/* Visual Formula Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800">
              <div className="font-bold text-slate-900 mb-1">Mathematical Urgency Formula:</div>
              <div className="text-sky-700 text-sm font-semibold">
                Urgency Score (U) = Base Priority + 15 &times; ( Current Buffer / Total SSR Capacity )&sup3;
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Notice the cubic exponent: As a satellite approaches 100% capacity, its urgency score skyrockets exponentially to prevent data overflow.
              </p>
            </div>

            {/* Interactive Sat A vs Sat B Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Satellite A */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                    <span className="font-bold text-slate-900">{satA.name}</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
                    Routine Tier 1
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Memory Fill: 33% (85 GB / 256 GB)</span>
                    <span className="text-emerald-600 font-semibold">171 GB Free (Safe)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '33%' }}></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Calculated Urgency Score:</span>
                  <strong className="text-slate-900 font-mono text-sm">{satAUrgency} pts (LOW)</strong>
                </div>
              </div>

              {/* Satellite B */}
              <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="font-bold text-slate-900">{satB.name}</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 text-rose-800 rounded border border-rose-300">
                    Disaster Task Tier 5
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Memory Fill: {satBBufferFillPct}% ({((satBBufferFillPct / 100) * 256).toFixed(0)} GB / 256 GB)</span>
                    <span className="text-rose-600 font-bold">{(256 - (satBBufferFillPct / 100) * 256).toFixed(0)} GB Free (CRITICAL)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 animate-pulse" style={{ width: `${satBBufferFillPct}%` }}></div>
                  </div>
                </div>

                {/* Slider to adjust Sat B fill level */}
                <div className="pt-1">
                  <label className="text-[11px] text-slate-500 flex justify-between">
                    <span>Drag to test different fill levels:</span>
                    <span className="font-bold font-mono">{satBBufferFillPct}%</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={satBBufferFillPct}
                    onChange={(e) => setSatBBufferFillPct(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                </div>

                <div className="pt-2 border-t border-rose-200 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Calculated Urgency Score:</span>
                  <strong className="text-rose-700 font-mono text-sm">{satBUrgency} pts (EMERGENCY)</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CONTENTION DETECTION */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">STAGE 2: THE CONTENTION TRAP</span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Two Satellites Arrive at Svalbard Dish 1 at 01:15 UTC
                </h2>
              </div>
              <button
                onClick={() => setActiveStep(3)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                Next: Solve with CP-SAT <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Contention Diagram */}
            <div className="bg-slate-900 text-white rounded-xl p-5 relative overflow-hidden">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                ANTENNA CONTENTION SCENARIO (01:10 UTC to 01:25 UTC)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Left: Satellites */}
                <div className="space-y-3">
                  <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <div className="text-xs font-bold text-sky-400">{satA.name}</div>
                    <div className="text-[11px] text-slate-400">Arrives: 01:10 UTC (AOS)</div>
                    <div className="text-[11px] text-emerald-400 font-mono">Booked 3 minutes earlier</div>
                  </div>

                  <div className="bg-slate-800 p-3 rounded-lg border border-rose-500/50">
                    <div className="text-xs font-bold text-rose-400">{satB.name}</div>
                    <div className="text-[11px] text-slate-400">Arrives: 01:13 UTC (AOS)</div>
                    <div className="text-[11px] text-rose-300 font-mono">Wildfire disaster imagery onboard</div>
                  </div>
                </div>

                {/* Center: Conflict Lightning */}
                <div className="text-center p-3">
                  <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-400 mb-2 animate-bounce">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-amber-400">OVERLAPPING CONTACT WINDOW</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Both satellites require Svalbard Dish 1 at 01:15 UTC. The dish can only track 1 satellite at a time.
                  </div>
                </div>

                {/* Right: The Ground Dish */}
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                  <div className="inline-flex p-3 rounded-full bg-sky-500/20 text-sky-400 mb-2">
                    <Radio className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-white">KSAT Svalbard Ant-1</div>
                  <div className="text-[11px] text-slate-400">Single 7.3m Dish</div>
                  <div className="text-[11px] text-slate-500 mt-1">Requires 120s turntable setup time between passes</div>
                </div>
              </div>
            </div>

            {/* The Failure of Legacy FCFS Explained */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900">How Legacy FCFS Causes Data Loss:</h4>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                  Because SuperDove-2112 booked the dish first (at 01:10), standard FCFS gives the dish to SuperDove-2112 and rejects SuperDove-2104. SuperDove-2104 is forced to wait 90 minutes for the next orbit. During those 90 minutes, its optical camera continues taking pictures, <strong>causing its 256 GB memory to overflow and permanently erasing 31 GB of wildfire disaster photos!</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CP-SAT OPTIMIZATION */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">STAGE 3: THE MATHEMATICAL RESOLUTION</span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  How Google OR-Tools CP-SAT Eliminates the Overflow
                </h2>
              </div>
              <button
                onClick={() => setActiveStep(4)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                Next: Test Downlink Failure <Flame className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: What FCFS Does */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">1. Legacy FCFS Scheduler</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 text-rose-800 rounded">
                    1 BUFFER OVERFLOW
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <span className="font-bold text-slate-800">Svalbard Dish 1:</span> Awarded to SuperDove-2112 (Routine)
                  </div>
                  <div className="p-2.5 bg-rose-50 rounded border border-rose-200 text-rose-800">
                    <span className="font-bold">SuperDove-2104 (Disaster):</span> REJECTED &rarr; Buffer Overflows &rarr; <strong>-31 GB Lost!</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-100 rounded text-[11px] text-slate-600 font-mono">
                  Total Delivered: 14.5 GB · Priority Score: 717 pts
                </div>
              </div>

              {/* Right: What ORBITOPS CP-SAT Does */}
              <div className="bg-emerald-50/60 border border-emerald-300 rounded-xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">2. ORBITOPS CP-SAT (Our Algorithm)</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded">
                    0 OVERFLOWS · OPTIMAL
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-emerald-100 rounded border border-emerald-300 text-emerald-900">
                    <span className="font-bold">Svalbard Dish 1:</span> Awarded to SuperDove-2104 (38.2 GB delivered safely)
                  </div>
                  <div className="p-2.5 bg-white rounded border border-slate-200 text-slate-700">
                    <span className="font-bold">SuperDove-2112 (Routine):</span> Shifted to Svalbard Dish 2 or next orbit (no data loss)
                  </div>
                </div>

                <div className="p-3 bg-emerald-100 rounded text-[11px] text-emerald-900 font-mono font-bold">
                  Total Delivered: 38.2 GB (+24.2%) · Priority Score: 942 pts · LP Gap: 0.0%
                </div>
              </div>
            </div>

            {/* Explanation Callout */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-slate-900">Why the CP-SAT formulation is superior:</span>
              <p className="text-slate-600 leading-relaxed">
                CP-SAT models the ground antenna as a non-overlapping discrete interval constraint. It evaluates the entire 24-hour horizon globally rather than greedily booking slots one by one. It mathematically maximizes high-elevation peak bitrates while penalizing buffer overflow risk to zero.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: DOWNLINK FAILURE & INSTANT REROUTE */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">STAGE 4: WHAT IF DOWNLINKING FAILS?</span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Sub-Second Reactive Healing & Autonomous Rerouting
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsSimulatingFailure(!isSimulatingFailure);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSimulatingFailure 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                }`}
              >
                {isSimulatingFailure ? (
                  <>
                    <RefreshCw className="w-4 h-4" /> Restore Svalbard Antenna
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4" /> Simulate Svalbard Antenna Failure
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
              In real mission operations, antennas fail: motors jam, cables snap, or arctic blizzards cause severe radio frequency attenuation. Click the button above to simulate a catastrophic hardware failure at Svalbard Dish 1 and watch our algorithm heal the schedule in under 50 milliseconds.
            </p>

            {/* Failure vs Recovery Flowchart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* State A: The Failure */}
              <div className={`p-4 rounded-xl border transition-all ${
                isSimulatingFailure 
                  ? 'bg-rose-50 border-rose-300' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800">1. Ground Station Status</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    isSimulatingFailure ? 'bg-rose-200 text-rose-900' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isSimulatingFailure ? 'OFFLINE (HARDWARE JAM)' : 'NORMAL OPERATIONAL'}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Station:</span>
                    <strong className="text-slate-800">KSAT Svalbard Ant-1 (78.2°N)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled Contact:</span>
                    <span className="text-slate-800 font-mono">01:13 UTC &rarr; 01:24 UTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">At-Risk Payload:</span>
                    <strong className="text-rose-600">38.2 GB Disaster Imagery</strong>
                  </div>
                </div>

                {isSimulatingFailure && (
                  <div className="mt-3 p-2 bg-rose-100 rounded text-[11px] text-rose-800 font-medium">
                    &times; Svalbard Ant-1 lost motor lock! Downlink failed at minute 01:14 UTC.
                  </div>
                )}
              </div>

              {/* State B: The Autonomous Healing */}
              <div className={`p-4 rounded-xl border transition-all ${
                isSimulatingFailure 
                  ? 'bg-emerald-50 border-emerald-300 shadow-sm' 
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-emerald-900">2. Autonomous Replan Resolution</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-mono">
                    SOLVED IN 42 ms
                  </span>
                </div>

                {isSimulatingFailure ? (
                  <div className="mt-3 space-y-2.5 text-xs text-slate-800">
                    <div className="p-2.5 bg-white rounded border border-emerald-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-emerald-900">Rerouted to SSC Inuvik Ant-1 (68.3°N)</div>
                        <div className="text-[11px] text-slate-600">Next available contact at 01:55 UTC (42 minutes later)</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-center">
                      <div className="bg-emerald-100 p-2 rounded text-emerald-900">
                        <span className="block text-[10px] text-slate-500 uppercase">Data Preserved</span>
                        <strong>38.2 GB (100%)</strong>
                      </div>
                      <div className="bg-emerald-100 p-2 rounded text-emerald-900">
                        <span className="block text-[10px] text-slate-500 uppercase">Frozen Window</span>
                        <strong>&lt;30m Untouched</strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-tight">
                      <strong>Zero Human Panic:</strong> Active passes within 30 minutes remained locked. The high-urgency disaster pass was seamlessly rescheduled to the Canadian arctic station before buffer overflow occurred.
                    </p>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400 italic">
                    Click &quot;Simulate Svalbard Antenna Failure&quot; to test autonomous rerouting.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
