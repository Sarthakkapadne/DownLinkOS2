import React from 'react';
import { 
  ACM_ELEVATION_POINTS,
  EFFICIENCY_METRICS_DATA 
} from '../data/scenarioData';
import { 
  BarChart3, 
  HardDrive, 
  Radio, 
  BookmarkCheck, 
  Sparkles,
  ArrowRight,
  Gauge,
  Cpu,
  Zap
} from 'lucide-react';

interface ComparativeMissionDashboardProps {
  onNavigate?: (page: 'landing' | 'usp1' | 'usp2' | 'comparison') => void;
}

export const ComparativeMissionDashboard: React.FC<ComparativeMissionDashboardProps> = ({
  onNavigate
}) => {

  const metrics = EFFICIENCY_METRICS_DATA;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-8 p-6 sm:p-8">
      
      {/* ======================================================== */}
      {/* 1. EXECUTIVE DASHBOARD HEADER & MODE SELECTOR            */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              EXECUTIVE COMPARATIVE DASHBOARD
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Mission Operations Benchmark: ORBITOPS vs Legacy FCFS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time multi-dimensional comparison showcasing physical execution timelines, ACM throughput curves, and core USPs.
          </p>
        </div>

        {/* Direct Link to Dedicated Gantt Benchmark Page */}
        {onNavigate && (
          <button
            onClick={() => onNavigate('comparison')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm cursor-pointer border border-slate-700 self-start lg:self-auto"
          >
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <span>Open Dedicated Gantt Chart Benchmark</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. LIVE KPI SCORECARD COMPARISON                         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Total Data Delivered */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-200">
          <div className="flex items-center justify-between text-xs text-sky-800 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-sky-600" />
              Total Payload Delivered
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              +{metrics.dataGainPercent}%
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-sky-950 font-mono">
              {metrics.orbitopsDataDeliveredGb} <span className="text-sm font-sans font-bold text-sky-700">GB</span>
            </span>
            <span className="text-xs text-slate-600 font-mono line-through">
              {metrics.fcfsDataDeliveredGb} GB (FCFS)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            <strong>3.1x throughput gain:</strong> avoided horizon traps & harvested zenith.
          </p>
        </div>

        {/* Metric 2: Retransmission Waste Eliminated */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-white border border-teal-200">
          <div className="flex items-center justify-between text-xs text-teal-800 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <BookmarkCheck className="w-3.5 h-3.5 text-teal-600" />
              Retransmission Waste
            </span>
            <span className="text-[10px] font-mono text-teal-700 font-bold bg-teal-100/60 px-1.5 py-0.5 rounded">
              100% ELIMINATED
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-teal-950 font-mono">
              0.0 <span className="text-sm font-sans font-bold text-teal-700">GB</span>
            </span>
            <span className="text-xs text-red-600 font-mono font-bold">
              +{metrics.retransmissionWastedGbFcfs} GB Wasted (FCFS)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            <strong>CFDP Class 2 Bookmarks</strong> resume at exact verified byte.
          </p>
        </div>

        {/* Metric 3: Camera Overflows Prevented */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200">
          <div className="flex items-center justify-between text-xs text-purple-800 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-purple-600" />
              Camera Sensor Overflows
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              ZERO DISASTERS
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-950 font-mono">
              0 <span className="text-sm font-sans font-bold text-purple-700">Events</span>
            </span>
            <span className="text-xs text-red-600 font-mono font-bold">
              {metrics.bufferOverflowsFcfs} Shutoffs (FCFS)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            <strong>Buffer Depletion Heuristic</strong> empties Pelican before 95% limit.
          </p>
        </div>

        {/* Metric 4: Antenna Active Contact Efficiency */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-200">
          <div className="flex items-center justify-between text-xs text-indigo-800 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-indigo-600" />
              Ground Dish Utilization
            </span>
            <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-100/60 px-1.5 py-0.5 rounded">
              +{Math.round(metrics.antennaUtilizationOrbitops - metrics.antennaUtilizationFcfs)}% GAIN
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-950 font-mono">
              {metrics.antennaUtilizationOrbitops}%
            </span>
            <span className="text-xs text-slate-600 font-mono">
              {metrics.antennaUtilizationFcfs}% (FCFS)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            <strong>Minimal idle latency:</strong> shortest-arc slew and zero cable jams.
          </p>
        </div>
      </div>



      {/* ======================================================== */}
      {/* 4. DVB-S2X DYNAMIC ACM ATMOSPHERIC BITRATE CURVE         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ACM Visual Curve (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  DVB-S2X Adaptive Coding & Modulation (ACM) Throughput Curve
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical Arctic Tropospheric Attenuation: Bitrate vs Elevation Angle θ(t)
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-sky-100 text-sky-800 font-bold border border-sky-200">
              Peak: 1,420 Mbps
            </span>
          </div>

          {/* SVG Bitrate vs Elevation Curve */}
          <div className="w-full h-56 relative bg-white rounded-xl border border-slate-200 p-2 shadow-inner">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="acmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="30" x2="480" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="130" x2="480" y2="130" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="175" x2="480" y2="175" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="175" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Y Axis Labels (Mbps) */}
              <text x="35" y="34" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">1400</text>
              <text x="35" y="84" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">1000</text>
              <text x="35" y="134" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">500</text>
              <text x="35" y="175" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">0</text>

              {/* X Axis Labels (Elevation Deg) */}
              <text x="50" y="190" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">10°</text>
              <text x="140" y="190" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">25°</text>
              <text x="240" y="190" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">45°</text>
              <text x="350" y="190" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">70°</text>
              <text x="460" y="190" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">90° Zenith</text>

              {/* Area Under Curve */}
              <path
                d="M 50 175 L 50 160 Q 140 130 240 70 T 460 30 L 460 175 Z"
                fill="url(#acmGradient)"
              />

              {/* Smooth Spline Curve Line */}
              <path
                d="M 50 160 Q 140 130 240 70 T 460 30"
                fill="none"
                stroke="#0284c7"
                strokeWidth="3"
              />

              {/* Operating Point 1: 10° Horizon (250 Mbps) */}
              <circle cx="50" cy="160" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              <text x="55" y="152" fill="#b45309" fontSize="8" fontWeight="bold">Sat 3 Horizon: 250 Mbps</text>

              {/* Operating Point 2: 35.4° Mid-Sky (850-1,150 Mbps) */}
              <circle cx="195" cy="98" r="4.5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <text x="205" y="94" fill="#0369a1" fontSize="8" fontWeight="bold">Sat 2 In-Pass: 1,150 Mbps</text>

              {/* Operating Point 3: 78.5°-90° Zenith (1,420 Mbps) */}
              <circle cx="430" cy="33" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <text x="420" y="24" fill="#047857" fontSize="8" fontWeight="bold" textAnchor="end">Sat 1 Zenith: 1,420 Mbps (Peak)</text>
            </svg>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Why ORBITOPS Beats FCFS:</strong> At 10° elevation, thick Arctic atmosphere limits signal to QPSK (250 Mbps). Overhead at 78°–90° Zenith, thin air allows 256-APSK (1,420 Mbps). ORBITOPS schedules high-elevation passes first, extracting <strong>4.2x more data per minute</strong>.
          </p>
        </div>

        {/* Real Modulation ModCod Table (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 text-white space-y-3.5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-sky-400">
                DVB-S2X ACM MODCOD TABLE
              </span>
              <span className="text-[10px] text-slate-400 font-mono">CCSDS / ETSI 302 307-2</span>
            </div>

            <div className="mt-3 divide-y divide-slate-800 text-xs font-mono">
              {ACM_ELEVATION_POINTS.map((pt, idx) => (
                <div key={idx} className="py-1.5 flex items-center justify-between">
                  <span className="text-slate-300">
                    θ = {pt.elevationDeg}°: <span className="text-slate-400 font-sans">{pt.modCod}</span>
                  </span>
                  <span className={`font-bold ${pt.elevationDeg >= 70 ? 'text-emerald-400' : pt.elevationDeg >= 30 ? 'text-sky-300' : 'text-amber-400'}`}>
                    {pt.bitrateMbps} Mbps
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <span className="text-sky-400 font-bold block mb-1">PHY-Layer Heuristic:</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Maximizing $\int R_b(\theta(t)) \, dt$ rather than contact duration guarantees the ground station extracts peak gigabytes during every polar contact.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. DEDICATED USP DEEP-DIVE EXPLORER BANNER               */}
      {/* ======================================================== */}
      <div className="pt-4 border-t border-slate-200">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-5 border border-slate-800 shadow-md">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono text-sky-400 font-bold bg-sky-500/20 border border-sky-400/30">
              <Sparkles className="w-3 h-3" />
              <span>CORE SYSTEM USPs · DEDICATED PAGES</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Explore the 2 Fundamental System USPs on Dedicated Interactive Pages
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Inspect how ORBITOPS tailors schedules station-by-station (dish size, weather loss, slew rate) and activates pre-computed failure playbooks in under 100 milliseconds without schedule thrashing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            {onNavigate && (
              <>
                <button
                  onClick={() => onNavigate('usp1')}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Open USP 1 (Station-Aware)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('usp2')}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Open USP 2 (Playbooks)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('comparison')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition shadow-sm border border-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  <span>FCFS vs ORBITOPS Gantt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
