import React, { useState } from 'react';
import { 
  POWER_FACTOR_USPS, 
  ORBITOPS_TIMELINE_BLOCKS, 
  FCFS_TIMELINE_BLOCKS, 
  ACM_ELEVATION_POINTS,
  EFFICIENCY_METRICS_DATA 
} from '../data/scenarioData';
import { PowerUsp, TimelineGanttBlock } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Clock, 
  HardDrive, 
  Radio, 
  BookmarkCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ArrowRight,
  Flame,
  RotateCw,
  Gauge,
  Sliders,
  Cpu
} from 'lucide-react';

export const ComparativeMissionDashboard: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'ORBITOPS' | 'FCFS' | 'SIDE_BY_SIDE'>('ORBITOPS');
  const [activeUspId, setActiveUspId] = useState<string>('usp-station-custom');
  const [hoveredBlock, setHoveredBlock] = useState<TimelineGanttBlock | null>(null);

  const activeUsp = POWER_FACTOR_USPS.find((u) => u.id === activeUspId) || POWER_FACTOR_USPS[0];
  const metrics = EFFICIENCY_METRICS_DATA;

  // Max timeline span from minute 8 to 20 (12 minutes total)
  const timelineStartMin = 7.5;
  const timelineEndMin = 20.5;
  const totalTimelineMinutes = timelineEndMin - timelineStartMin;

  const getPositionPercent = (min: number) => {
    return Math.max(0, Math.min(100, ((min - timelineStartMin) / totalTimelineMinutes) * 100));
  };

  const getWidthPercent = (start: number, end: number) => {
    return Math.max(2, ((end - start) / totalTimelineMinutes) * 100);
  };

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

        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold self-start lg:self-auto">
          <button
            onClick={() => setSelectedMode('ORBITOPS')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              selectedMode === 'ORBITOPS'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ORBITOPS Autonomous Engine</span>
          </button>

          <button
            onClick={() => setSelectedMode('FCFS')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              selectedMode === 'FCFS'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Legacy FCFS Scheduler</span>
          </button>

          <button
            onClick={() => setSelectedMode('SIDE_BY_SIDE')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              selectedMode === 'SIDE_BY_SIDE'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Side-by-Side View</span>
          </button>
        </div>
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
      {/* 3. CRAZY LEVEL DASHBOARD TIME VISUAL CHARTS (GANTT TRACK) */}
      {/* ======================================================== */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-5 border border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-sm sm:text-base text-white tracking-wide">
                Mission Execution Timeline Gantt (01:08 UTC – 01:20 UTC)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Minute-by-minute comparison of antenna RF allocation, state transitions, and conflict handling.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-sky-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" /> Active Downlink
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Slew Motor
            </span>
            <span className="flex items-center gap-1 text-teal-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-500" /> Checkpoint
            </span>
            <span className="flex items-center gap-1 text-rose-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-600" /> Failure / Shutoff
            </span>
          </div>
        </div>

        {/* Time Scale Axis Marker */}
        <div className="relative h-6 border-b border-slate-800 text-[10px] font-mono text-slate-400">
          {[8, 10, 12, 14, 16, 18, 20].map((min) => (
            <div
              key={min}
              className="absolute transform -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${getPositionPercent(min)}%` }}
            >
              <span>01:{min < 10 ? `0${min}` : min}:00</span>
              <div className="w-px h-2 bg-slate-700 mt-0.5" />
            </div>
          ))}
        </div>

        {/* TRACK 1: ORBITOPS AUTONOMOUS TIMELINE */}
        {(selectedMode === 'ORBITOPS' || selectedMode === 'SIDE_BY_SIDE') && (
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-sky-300 font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                ORBITOPS Autonomous Execution Schedule
              </span>
              <span className="text-[11px] text-emerald-400 font-normal">
                138.4 GB Delivered · 0 Lost Bytes · 0 Overflows
              </span>
            </div>

            <div className="relative h-12 bg-slate-800/80 rounded-xl p-1 border border-slate-700 overflow-hidden flex items-center">
              {ORBITOPS_TIMELINE_BLOCKS.map((block) => {
                const left = getPositionPercent(block.startMinute);
                const width = getWidthPercent(block.startMinute, block.endMinute);
                return (
                  <div
                    key={block.id}
                    onMouseEnter={() => setHoveredBlock(block)}
                    onMouseLeave={() => setHoveredBlock(null)}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    className={`absolute h-9 rounded-lg border px-2 flex items-center justify-between cursor-pointer transition-all hover:brightness-110 hover:z-20 text-[11px] font-mono shadow-xs overflow-hidden ${block.statusColor}`}
                    title={`${block.label} (${block.notes})`}
                  >
                    <span className="font-bold truncate">{block.satelliteName}</span>
                    <span className="text-[10px] opacity-90 hidden sm:inline ml-1 font-bold">
                      {block.dataTransferredGb > 0 ? `+${block.dataTransferredGb}GB` : block.actionType}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TRACK 2: TRADITIONAL FCFS TIMELINE */}
        {(selectedMode === 'FCFS' || selectedMode === 'SIDE_BY_SIDE') && (
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-red-300 font-mono">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                Legacy FCFS (First-Come First-Served) Schedule
              </span>
              <span className="text-[11px] text-red-400 font-normal">
                Only 44.0 GB Delivered · 22.8 GB Wasted · Pelican Camera Shut Off!
              </span>
            </div>

            <div className="relative h-12 bg-slate-800/80 rounded-xl p-1 border border-slate-700 overflow-hidden flex items-center">
              {FCFS_TIMELINE_BLOCKS.map((block) => {
                const left = getPositionPercent(block.startMinute);
                const width = getWidthPercent(block.startMinute, block.endMinute);
                return (
                  <div
                    key={block.id}
                    onMouseEnter={() => setHoveredBlock(block)}
                    onMouseLeave={() => setHoveredBlock(null)}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    className={`absolute h-9 rounded-lg border px-2 flex items-center justify-between cursor-pointer transition-all hover:brightness-110 hover:z-20 text-[11px] font-mono shadow-xs overflow-hidden ${block.statusColor}`}
                    title={`${block.label} (${block.notes})`}
                  >
                    <span className="font-bold truncate">{block.satelliteName}</span>
                    <span className="text-[10px] opacity-90 hidden sm:inline ml-1 font-bold">
                      {block.actionType}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Interactive Event Details Inspector Drawer */}
        <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Inspecting Event:</span>
            <strong className="text-sky-300">
              {hoveredBlock ? hoveredBlock.label : 'Hover over any timeline segment above to inspect telemetry'}
            </strong>
          </div>
          {hoveredBlock && (
            <div className="flex items-center gap-3 text-[11px] text-slate-300">
              <span>Bitrate: <strong className="text-emerald-400">{hoveredBlock.bitrateMbps} Mbps</strong></span>
              <span>Delivered: <strong className="text-white">{hoveredBlock.dataTransferredGb} GB</strong></span>
              <span className="text-slate-400 italic truncate max-w-xs">{hoveredBlock.notes}</span>
            </div>
          )}
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
      {/* 5. THE CORE POWER FACTOR USPs SHOWCASE                   */}
      {/* ======================================================== */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              The Core Power Factor USPs (Aerospace & Network Innovations)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            The mathematical, physical, and architectural differentiators that make ORBITOPS fundamentally superior to naive schedulers.
          </p>
        </div>

        {/* USP Interactive Grid (2 Rows x 3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {POWER_FACTOR_USPS.map((usp) => {
            const isSelected = activeUspId === usp.id;
            return (
              <div
                key={usp.id}
                onClick={() => setActiveUspId(usp.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-50/80 to-white border-indigo-400 ring-2 ring-indigo-200 shadow-sm'
                    : 'bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white text-indigo-700 border border-indigo-200">
                      {usp.badge.split('·')[0]}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {usp.metricGain}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    {usp.title}
                  </h4>

                  <p className="text-[11px] font-mono text-slate-600 mt-1 italic">
                    {usp.subtitle}
                  </p>

                  <div className="mt-3 p-2 bg-slate-900 text-sky-300 rounded-lg text-[10px] font-mono">
                    <code>{usp.formula}</code>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-600 font-bold">Inspect Deep-Dive</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected USP Deep-Dive Drawer */}
        {activeUsp && (
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                    {activeUsp.badge}
                  </span>
                  <h4 className="font-bold text-base text-white">
                    {activeUsp.title}: {activeUsp.subtitle}
                  </h4>
                </div>
              </div>

              <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 font-mono text-xs font-bold">
                {activeUsp.metricGain}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5">
                <span className="text-indigo-300 font-mono text-[10px] uppercase font-bold block">
                  How ORBITOPS Executes It:
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {activeUsp.explanation}
                </p>
              </div>

              <div className="p-3.5 bg-red-950/30 rounded-xl border border-red-500/30 space-y-1.5">
                <span className="text-red-400 font-mono text-[10px] uppercase font-bold block flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Why Traditional FCFS Fails Here:
                </span>
                <p className="text-red-200 leading-relaxed">
                  {activeUsp.fcfsComparison}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
