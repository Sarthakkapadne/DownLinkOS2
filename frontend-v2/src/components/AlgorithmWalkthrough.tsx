import React, { useState, useEffect } from 'react';
import { SimpleAlgorithmCase, Satellite, GroundStation } from '../types';
import { SIMPLE_ALGORITHM_CASES, EFFICIENCY_METRICS_DATA } from '../data/scenarioData';
import { EfficiencyCharts } from './EfficiencyCharts';
import { 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCw, 
  BookmarkCheck,
  TrendingUp,
  Layers,
  HelpCircle,
  RefreshCw,
  BarChart3
} from 'lucide-react';

interface AlgorithmWalkthroughProps {
  satellites: Satellite[];
  groundStation: GroundStation;
}

export const AlgorithmWalkthrough: React.FC<AlgorithmWalkthroughProps> = ({
  satellites,
  groundStation
}) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [showWhatIfCost, setShowWhatIfCost] = useState<boolean>(false);

  const cases = SIMPLE_ALGORITHM_CASES;
  const currentCase = cases[activeCaseIndex];

  // Auto-play stepper timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveCaseIndex((prev) => (prev + 1) % cases.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, cases.length]);

  return (
    <div className="space-y-8">
      {/* 2-Pane Interactive Walkthrough Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Walkthrough Section Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
              <h2 className="font-bold text-base sm:text-lg tracking-wide text-white">
                Step-by-Step Algorithm Walkthrough (The 7 Real-World Steps)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              How ORBITOPS resolves multi-satellite contention: Sat 3 rejected, Sat 2 picked, Sat 1 bookmarked & resumed
            </p>
          </div>

          {/* Stepper Controls & Autoplay */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCaseIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeCaseIndex === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition cursor-pointer"
              title="Previous Step"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono px-2 py-1 bg-slate-800 rounded text-slate-300 border border-slate-700">
              Step {currentCase.stepNumber} of {cases.length}
            </span>

            <button
              onClick={() => setActiveCaseIndex((prev) => Math.min(cases.length - 1, prev + 1))}
              disabled={activeCaseIndex === cases.length - 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition cursor-pointer"
              title="Next Step"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ml-1 ${
                isAutoPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-sky-600 hover:bg-sky-500 text-white'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isAutoPlaying ? 'Pause' : 'Auto Play'}
            </button>
          </div>
        </div>

        {/* Stepper Navigation Bar (All 7 Steps) */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex space-x-2 overflow-x-auto">
          {cases.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => setActiveCaseIndex(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                activeCaseIndex === idx
                  ? 'bg-white shadow-xs text-sky-700 border border-sky-300 font-semibold'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  activeCaseIndex === idx
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {c.stepNumber}
              </span>
              <span>{c.phaseTitle}</span>
            </button>
          ))}
        </div>

        {/* ======================================================== */}
        {/* 2-PANE WORKSPACE AREA                                    */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* ====================================================== */}
          {/* LEFT PANE: Plain-English Step Logic & Case Story       */}
          {/* ====================================================== */}
          <div className="lg:col-span-7 p-6 sm:p-7 space-y-5">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-sky-100 text-sky-800 border border-sky-200">
                  {currentCase.badge}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Step {currentCase.stepNumber} of 7 Execution Trace
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {currentCase.headline}
              </h3>
            </div>

            {/* Story Context Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-600 mb-1">
                <Layers className="w-3.5 h-3.5 text-slate-600" />
                What Is Happening In the Sky
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {currentCase.storyContext}
              </p>
            </div>

            {/* Naive Mistake Box */}
            <div className="bg-red-50/70 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-red-800 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                The Naive Trap (What Old Systems Do)
              </div>
              <p className="text-sm text-red-950 font-medium leading-relaxed">
                {currentCase.naiveMistake}
              </p>
            </div>

            {/* Why It Fails In Real Life */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-slate-600" />
                Physical Realities & Reasoning:
              </h4>
              <div className="space-y-2">
                {currentCase.whyItFailsInRealLife.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 border border-slate-300">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Choice */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-800 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                What ORBITOPS Decides
              </div>
              <p className="text-sm text-emerald-950 font-semibold leading-relaxed">
                {currentCase.smartAlgorithmChoice}
              </p>
            </div>

            {/* Outcome Badge */}
            <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900 font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-700 flex-shrink-0" />
              <span>Outcome: {currentCase.simpleOutcomeSummary}</span>
            </div>
          </div>

          {/* ====================================================== */}
          {/* RIGHT PANE: Synchronized Mini-Sky Visual               */}
          {/* ====================================================== */}
          <div className="lg:col-span-5 p-6 bg-slate-50/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-sky-600 animate-spin-slow" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    Real-Time Geometry (Step {currentCase.stepNumber} of 7)
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Dish: {currentCase.miniVisualState.dishAngleDeg}°
                </span>
              </div>

              {/* Mini Sky Canvas */}
              {/* Correct Geometry: Ascent from RIGHT (0° AOS), Zenith in CENTER, Descent to LEFT (0° LOS) */}
              <div className="relative w-full h-[280px] bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden p-2">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 500 260"
                  preserveAspectRatio="xMidYMax meet"
                >
                  <defs>
                    <linearGradient id="miniBeamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>

                  {/* Ground Line */}
                  <line x1="20" y1="230" x2="480" y2="230" stroke="#64748b" strokeWidth="2" />
                  <line x1="20" y1="215" x2="480" y2="215" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Outer 180° Sky Arc */}
                  <path d="M 50 230 A 200 180 0 0 1 450 230" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 4" />

                  {/* Horizon Labels: Left = 0° LOS, Center = 90° Zenith, Right = 0° AOS */}
                  <text x="25" y="244" fill="#64748b" fontSize="9" fontWeight="bold">0° LOS (Setting)</text>
                  <text x="250" y="25" fill="#0284c7" fontSize="10" fontWeight="bold" textAnchor="middle">90° ZENITH</text>
                  <text x="475" y="244" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="end">0° AOS (Rising)</text>

                  {/* BEAMS & STATES ACCORDING TO STEP */}

                  {/* Step 1: Active on Sat 1 Zenith */}
                  {currentCase.stepNumber === 1 && (
                    <g>
                      <line x1="250" y1="225" x2="250" y2="60" stroke="#0284c7" strokeWidth="2.5" />
                      <polygon points="248,225 252,225 254,60 246,60" fill="url(#miniBeamGradient)" opacity="0.4" />
                    </g>
                  )}

                  {/* Step 2: Red Reject Arc on Sat 3 on the LEFT (leaves in 55s, would dip below horizon) */}
                  {currentCase.stepNumber === 2 && (
                    <g>
                      {/* Red dashed line pointing to setting Sat 3 on the LEFT (90, 190) */}
                      <line x1="250" y1="225" x2="90" y2="190" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 3" />
                      <circle cx="90" cy="190" r="16" fill="none" stroke="#ef4444" strokeWidth="2">
                        <animate attributeName="r" values="10;20;10" dur="1.2s" repeatCount="indefinite" />
                      </circle>
                      <text x="90" y="220" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle">
                        REJECTED (leaves in 55s!)
                      </text>
                    </g>
                  )}

                  {/* Step 3: Green highlight on Sat 2 on the RIGHT (risk climbing, selected to clear buffer) */}
                  {currentCase.stepNumber === 3 && (
                    <g>
                      <line x1="250" y1="225" x2="370" y2="130" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" />
                      <circle cx="370" cy="130" r="18" fill="none" stroke="#10b981" strokeWidth="2">
                        <animate attributeName="r" values="14;22;14" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                      <text x="370" y="110" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle">
                        CHOSEN: Sat 2 (Clears Buffer!)
                      </text>
                    </g>
                  )}

                  {/* Step 4: Sat 1 State Saved Bookmark */}
                  {currentCase.stepNumber === 4 && (
                    <g>
                      <circle cx="250" cy="50" r="22" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeDasharray="4 3">
                        <animate attributeName="r" values="16;24;16" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <text x="250" y="24" fill="#0d9488" fontSize="9" fontWeight="bold" textAnchor="middle">
                        STATE SAVED: 22.8 GB
                      </text>
                    </g>
                  )}

                  {/* Step 5: Dish turned right to Sat 2, active downlink beam */}
                  {currentCase.stepNumber === 5 && (
                    <g>
                      <line x1="250" y1="225" x2="370" y2="130" stroke="#0284c7" strokeWidth="2.5" />
                      <polygon points="248,225 252,225 374,130 366,130" fill="url(#miniBeamGradient)" opacity="0.4" />
                      <circle cx="370" cy="130" r="16" fill="none" stroke="#10b981" strokeWidth="2" />
                      <text x="370" y="110" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle">
                        42.0 GB DELIVERED! (SAFE)
                      </text>
                    </g>
                  )}

                  {/* Step 6: NEXT PASS RESUME! Sat 1 returns overhead */}
                  {currentCase.stepNumber === 6 && (
                    <g>
                      <line x1="250" y1="225" x2="250" y2="60" stroke="#10b981" strokeWidth="3" />
                      <polygon points="247,225 253,225 255,60 245,60" fill="#10b981" opacity="0.3" />
                      <text x="250" y="22" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">
                        NEXT PASS: RESUMING FROM GB 22.9
                      </text>
                      <text x="250" y="34" fill="#64748b" fontSize="8" textAnchor="middle">
                        Only 15.6 GB sent · 100% complete!
                      </text>
                    </g>
                  )}

                  {/* Step 7: Scorecard Charts Badge */}
                  {currentCase.stepNumber === 7 && (
                    <g>
                      <circle cx="250" cy="120" r="48" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
                      <text x="250" y="112" fill="#0369a1" fontSize="9" fontWeight="bold" textAnchor="middle">EFFICIENCY PROVEN</text>
                      <text x="250" y="126" fill="#16a34a" fontSize="9" fontWeight="bold" textAnchor="middle">138.4 GB (+214% Gain)</text>
                      <text x="250" y="138" fill="#64748b" fontSize="8" textAnchor="middle">0 GB Wasted Retransmissions</text>
                    </g>
                  )}

                  {/* Mini Dish Base & Head */}
                  <g transform="translate(250, 225)">
                    <rect x="-18" y="0" width="36" height="8" fill="#475569" rx="1" />
                    <rect x="-12" y="-6" width="24" height="6" fill="#64748b" />
                    <g transform={`rotate(${currentCase.miniVisualState.dishAngleDeg}, 0, -10)`} className="transition-transform duration-700 ease-out">
                      <ellipse cx="0" cy="-18" rx="22" ry="7" fill="#e2e8f0" stroke="#0284c7" strokeWidth="1.5" />
                      <line x1="-16" y1="-18" x2="0" y2="-30" stroke="#475569" strokeWidth="1" />
                      <line x1="16" y1="-18" x2="0" y2="-30" stroke="#475569" strokeWidth="1" />
                      <circle cx="0" cy="-30" r="2.5" fill="#0284c7" />
                    </g>
                  </g>

                  {/* Satellites */}
                  {/* Sat 3: Setting on LEFT (11.2°, 55s left) */}
                  <g transform="translate(90, 190)">
                    <rect x="-12" y="-3" width="6" height="6" fill="#1e293b" rx="1" />
                    <rect x="6" y="-3" width="6" height="6" fill="#1e293b" rx="1" />
                    <rect x="-4" y="-5" width="8" height="10" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" rx="1" />
                    <text x="0" y="15" fill="#b45309" fontSize="8" fontWeight="bold" textAnchor="middle">Sat 3 (55s left)</text>
                  </g>

                  {/* Sat 1: Zenith (Center Top at 250, 50) */}
                  <g transform="translate(250, 50)">
                    <rect x="-14" y="-4" width="8" height="8" fill="#1e293b" rx="1" />
                    <rect x="6" y="-4" width="8" height="8" fill="#1e293b" rx="1" />
                    <rect x="-5" y="-6" width="10" height="12" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" rx="1" />
                    <text x="0" y="16" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">
                      {currentCase.miniVisualState.isNextPass ? 'Sat 1 (Next Pass)' : 'Sat 1 (Zenith)'}
                    </text>
                  </g>

                  {/* Sat 2: Ascending on RIGHT (35.4° El at 370, 130) */}
                  <g transform="translate(370, 130)">
                    <rect x="-12" y="-3" width="6" height="6" fill="#1e293b" rx="1" />
                    <rect x="6" y="-3" width="6" height="6" fill="#1e293b" rx="1" />
                    <rect x="-4" y="-5" width="8" height="10" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.5" rx="1" />
                    <text x="0" y="15" fill="#0369a1" fontSize="8" fontWeight="bold" textAnchor="middle">Sat 2 (P2 · Risk)</text>
                  </g>
                </svg>

                {/* In-Canvas Mini Status Overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 text-white rounded-lg px-2.5 py-1.5 text-[11px] font-mono flex items-center justify-between border border-slate-700">
                  <span className="text-slate-300 truncate">
                    {currentCase.miniVisualState.alertMessage}
                  </span>
                  <span className="text-emerald-400 font-bold ml-2 flex-shrink-0">
                    {currentCase.miniVisualState.bitrateMbps > 0 ? `${currentCase.miniVisualState.bitrateMbps} Mbps` : '0 Mbps (Slewing)'}
                  </span>
                </div>
              </div>

              {/* Checkpoint Badge in Step 4 */}
              {currentCase.miniVisualState.checkpointSavedGb && (
                <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-950 flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-teal-700 flex-shrink-0" />
                  <span>
                    <strong>State Saved:</strong> {currentCase.miniVisualState.checkpointSavedGb} GB bookmarked. Satellite resumes from GB {currentCase.miniVisualState.checkpointSavedGb + 0.1} in next pass!
                  </span>
                </div>
              )}

              {/* Next Pass Badge in Step 6 */}
              {currentCase.miniVisualState.isNextPass && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-700 flex-shrink-0 animate-spin-slow" />
                  <span>
                    <strong>Next Pass Reconnection:</strong> Sat 1 connected right from GB 22.9. Only 15.6 GB sent! Zero duplicate bytes!
                  </span>
                </div>
              )}
            </div>

            {/* "What-If" Interactive Drawer */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowWhatIfCost(!showWhatIfCost)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200/70 text-slate-800 text-xs font-medium transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5 font-bold">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                  What if an operator chased Sat 3 anyway?
                </span>
                <span className="text-[10px] font-mono text-slate-600">
                  {showWhatIfCost ? 'Hide' : 'Calculate Risk'}
                </span>
              </button>

              {showWhatIfCost && (
                <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5 animate-fadeIn">
                  <div className="font-bold text-amber-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Why Chasing Sat 3 Causes Double Failure:
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900">
                    • <strong>Sat 3 disappears:</strong> 45s turn leaves only 10s of signal before Sat 3 sets below mountains.
                    <br />• <strong>Sat 2 is abandoned:</strong> Sat 2 memory fills past 100%, causing its camera to shut down.
                    <br />• <strong>Result:</strong> Both passes fail! ORBITOPS avoids this by picking Sat 2 immediately.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Efficiency Charts at the end of the approach */}
      <section aria-label="Visual Efficiency Proof Charts">
        <EfficiencyCharts />
      </section>
    </div>
  );
};
