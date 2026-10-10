import React, { useState } from 'react';
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
  ArrowRight, 
  ArrowLeft,
  Gauge, 
  Sliders, 
  Cpu,
  Satellite as SatIcon,
  Flame,
  Check
} from 'lucide-react';
import { 
  ORBITOPS_TIMELINE_BLOCKS, 
  FCFS_TIMELINE_BLOCKS, 
  EFFICIENCY_METRICS_DATA 
} from '../data/scenarioData';
import { TimelineGanttBlock } from '../types';

export interface FcfsComparisonGanttPageProps {
  onBack?: () => void;
  onNavigateToUsp1?: () => void;
  onNavigateToUsp2?: () => void;
}

export const FcfsComparisonGanttPage: React.FC<FcfsComparisonGanttPageProps> = ({
  onBack,
  onNavigateToUsp1,
  onNavigateToUsp2
}) => {
  const [selectedMode, setSelectedMode] = useState<'ORBITOPS' | 'FCFS' | 'SIDE_BY_SIDE'>('SIDE_BY_SIDE');
  const [scrubMinute, setScrubMinute] = useState<number>(13.5);
  const [hoveredBlock, setHoveredBlock] = useState<TimelineGanttBlock | null>(null);

  const metrics = EFFICIENCY_METRICS_DATA;

  // Max timeline span from minute 8 to 20 (12 minutes total)
  const timelineStartMin = 8.0;
  const timelineEndMin = 20.0;
  const totalTimelineMinutes = timelineEndMin - timelineStartMin;

  const getPositionPercent = (min: number) => {
    return Math.max(0, Math.min(100, ((min - timelineStartMin) / totalTimelineMinutes) * 100));
  };

  const getWidthPercent = (start: number, end: number) => {
    return Math.max(2, ((end - start) / totalTimelineMinutes) * 100);
  };

  // Derive active events at scrubMinute
  const getOrbitopsEventAtMinute = (minute: number) => {
    return ORBITOPS_TIMELINE_BLOCKS.find((b) => minute >= b.startMinute && minute <= b.endMinute);
  };

  const getFcfsEventAtMinute = (minute: number) => {
    return FCFS_TIMELINE_BLOCKS.find((b) => minute >= b.startMinute && minute <= b.endMinute);
  };

  const activeOrbitopsBlock = getOrbitopsEventAtMinute(scrubMinute);
  const activeFcfsBlock = getFcfsEventAtMinute(scrubMinute);

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
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">Page 4 of 4</span>
          {onNavigateToUsp1 && (
            <button
              onClick={onNavigateToUsp1}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-sky-600 bg-white border border-slate-200 px-3 py-2 rounded-xl transition shadow-2xs cursor-pointer"
            >
              <span>USP 1 (Station-Aware)</span>
            </button>
          )}
          {onNavigateToUsp2 && (
            <button
              onClick={onNavigateToUsp2}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-sky-600 bg-white border border-slate-200 px-3 py-2 rounded-xl transition shadow-2xs cursor-pointer"
            >
              <span>USP 2 (Playbooks)</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
            <span>OPERATIONAL BENCHMARK · MINUTE-BY-MINUTE GANTT CHART</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Legacy FCFS vs ORBITOPS Autonomous Scheduler
          </h1>

          <p className="text-base sm:text-lg text-indigo-200/90 font-medium leading-relaxed">
            See why First-Come, First-Served (FCFS) scheduling causes disaster, and how ORBITOPS extracts 3.1x more data.
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
            Between 01:08 UTC and 01:20 UTC, <strong>3 satellites cross the Svalbard ground station at the exact same time</strong>. Below is the interactive side-by-side Gantt chart showing what naive FCFS does versus what our autonomous physics-grounded algorithm does.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>ORBITOPS Throughput Gain: <strong>+214% (+94.4 GB)</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              Camera Overflows: <strong className="text-emerald-400">0 (Safe) vs 1 in FCFS</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              Retransmission Waste: <strong className="text-teal-300">0.0 GB vs 22.8 GB Wasted</strong>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Clock className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* The 3 Competing Satellites in this Scenario */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            The 3 Competing Satellites in this Pass
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Each spacecraft has different data urgency, memory buffer levels, and sky elevation:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Sat 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Sat 1: SuperDove-21</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">
                78.5° Zenith Pass
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>Payload: <strong>38.4 GB Earth Imagery</strong></div>
              <div>Peak Speed: <strong className="text-emerald-600">1,420 Mbps (256-APSK)</strong></div>
              <div>Key Trait: Thin overhead atmosphere enables blazing download speed.</div>
            </div>
          </div>

          {/* Sat 2 */}
          <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Sat 2: Pelican-01 (Urgent!)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold animate-pulse">
                Memory 86% Critical!
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>Payload: <strong>42.0 GB Tactical Video</strong></div>
              <div>Buffer Fullness: <strong className="text-rose-600">86% (Risk of Camera Shutoff!)</strong></div>
              <div>Key Trait: Will set below horizon in 6 min. Must dump before memory hits 100%!</div>
            </div>
          </div>

          {/* Sat 3 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Sat 3: SkySat-14</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                10.2° Horizon Trap
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>Payload: <strong>22.0 GB Routine Telemetry</strong></div>
              <div>Speed: <strong className="text-amber-600">Slow 250 Mbps (QPSK)</strong></div>
              <div>The Trap: Rose 60 seconds earlier; naive FCFS wastes the dish on this!</div>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* THE INTERACTIVE GANTT CHART (CENTRAL SHOWCASE)           */}
      {/* ======================================================== */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 text-white">
        
        {/* Gantt Header & View Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-base sm:text-lg text-white tracking-wide">
                Mission Execution Timeline Gantt (01:08 UTC – 01:20 UTC)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Drag the time scrubber slider below to inspect antenna tracking, bitrates, and satellite memory at any minute.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 bg-slate-800 rounded-xl border border-slate-700 text-xs font-semibold self-start lg:self-auto">
            <button
              onClick={() => setSelectedMode('SIDE_BY_SIDE')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                selectedMode === 'SIDE_BY_SIDE'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>

            <button
              onClick={() => setSelectedMode('ORBITOPS')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                selectedMode === 'ORBITOPS'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ORBITOPS Only</span>
            </button>

            <button
              onClick={() => setSelectedMode('FCFS')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                selectedMode === 'FCFS'
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Legacy FCFS Only</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-slate-800 pb-3 text-slate-300">
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-sky-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" /> Active Fast Downlink
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Antenna Slew Motor
            </span>
            <span className="flex items-center gap-1 text-teal-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-500" /> Checkpoint Saved
            </span>
            <span className="flex items-center gap-1 text-rose-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-600" /> Camera Shutoff Disaster
            </span>
          </div>

          <div className="text-slate-400 text-[11px]">
            Time Window: <strong>12 Minutes Total</strong>
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

          {/* Current Scrubber Indicator Vertical Needle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-30 transition-all pointer-events-none"
            style={{ left: `${getPositionPercent(scrubMinute)}%` }}
          >
            <div className="w-2 h-2 -ml-[3px] -mt-1 bg-yellow-400 rounded-full shadow-sm" />
          </div>
        </div>

        {/* TRACK 1: ORBITOPS AUTONOMOUS SCHEDULE */}
        {(selectedMode === 'ORBITOPS' || selectedMode === 'SIDE_BY_SIDE') && (
          <div className="space-y-1.5 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold text-sky-300 font-mono gap-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>ORBITOPS Autonomous Schedule (What Our Algorithm Actually Does)</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-normal">
                138.4 GB Delivered · 0 Lost Data · 0 Camera Overflows (3.1x Gain)
              </span>
            </div>

            <div className="relative h-14 bg-slate-800/90 rounded-xl p-1 border border-slate-700 overflow-hidden flex items-center">
              {ORBITOPS_TIMELINE_BLOCKS.map((block) => {
                const left = getPositionPercent(block.startMinute);
                const width = getWidthPercent(block.startMinute, block.endMinute);
                return (
                  <div
                    key={block.id}
                    onMouseEnter={() => setHoveredBlock(block)}
                    onMouseLeave={() => setHoveredBlock(null)}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    className={`absolute h-11 rounded-lg border px-2 flex items-center justify-between cursor-pointer transition-all hover:brightness-125 hover:z-20 text-[11px] font-mono shadow-xs overflow-hidden ${block.statusColor}`}
                  >
                    <div className="flex flex-col truncate">
                      <span className="font-bold truncate text-[11px]">{block.satelliteName}</span>
                      <span className="text-[9.5px] opacity-80 truncate">{block.actionType}</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-90 hidden sm:inline ml-1">
                      {block.dataTransferredGb > 0 ? `+${block.dataTransferredGb} GB` : ''}
                    </span>
                  </div>
                );
              })}

              {/* Scrubber vertical needle across track */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-30 pointer-events-none opacity-80"
                style={{ left: `${getPositionPercent(scrubMinute)}%` }}
              />
            </div>
          </div>
        )}

        {/* TRACK 2: TRADITIONAL FCFS SCHEDULE */}
        {(selectedMode === 'FCFS' || selectedMode === 'SIDE_BY_SIDE') && (
          <div className="space-y-1.5 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold text-red-300 font-mono gap-1">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Legacy FCFS Schedule (What Blind Schedulers Do)</span>
              </span>
              <span className="text-[11px] text-rose-400 font-normal">
                Only 44.0 GB Delivered · 22.8 GB Wasted · Pelican Camera Shut Off!
              </span>
            </div>

            <div className="relative h-14 bg-slate-800/90 rounded-xl p-1 border border-slate-700 overflow-hidden flex items-center">
              {FCFS_TIMELINE_BLOCKS.map((block) => {
                const left = getPositionPercent(block.startMinute);
                const width = getWidthPercent(block.startMinute, block.endMinute);
                return (
                  <div
                    key={block.id}
                    onMouseEnter={() => setHoveredBlock(block)}
                    onMouseLeave={() => setHoveredBlock(null)}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    className={`absolute h-11 rounded-lg border px-2 flex items-center justify-between cursor-pointer transition-all hover:brightness-125 hover:z-20 text-[11px] font-mono shadow-xs overflow-hidden ${block.statusColor}`}
                  >
                    <div className="flex flex-col truncate">
                      <span className="font-bold truncate text-[11px]">{block.satelliteName}</span>
                      <span className="text-[9.5px] opacity-80 truncate">{block.actionType}</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-90 hidden sm:inline ml-1">
                      {block.dataTransferredGb > 0 ? `+${block.dataTransferredGb} GB` : ''}
                    </span>
                  </div>
                );
              })}

              {/* Scrubber vertical needle across track */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-30 pointer-events-none opacity-80"
                style={{ left: `${getPositionPercent(scrubMinute)}%` }}
              />
            </div>
          </div>
        )}

        {/* Interactive Timeline Scrubbing Slider */}
        <div className="pt-2 space-y-2 bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Scrub Time Cursor: <strong>01:{scrubMinute < 10 ? `0${Math.floor(scrubMinute)}` : Math.floor(scrubMinute)}:{(Math.round((scrubMinute % 1) * 60)).toString().padStart(2, '0')} UTC</strong></span>
            </span>
            <span className="text-sky-300 text-[11px]">Drag slider to inspect active events</span>
          </div>

          <input
            type="range"
            min="8.0"
            max="20.0"
            step="0.25"
            value={scrubMinute}
            onChange={(e) => setScrubMinute(parseFloat(e.target.value))}
            className="w-full accent-yellow-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
          />

          {/* Live Minute Inspector Telemetry Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs font-mono">
            
            {/* Active in ORBITOPS */}
            <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between text-emerald-400 text-[11px] font-bold">
                <span>ORBITOPS STATE AT THIS MINUTE:</span>
                <span>{activeOrbitopsBlock ? `${activeOrbitopsBlock.bitrateMbps} Mbps` : 'Idle'}</span>
              </div>
              <div className="font-bold text-white text-sm">
                {activeOrbitopsBlock ? `${activeOrbitopsBlock.satelliteName} (${activeOrbitopsBlock.actionType})` : 'No active pass'}
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-snug">
                {activeOrbitopsBlock ? activeOrbitopsBlock.notes : 'Antenna idle in parking position.'}
              </p>
            </div>

            {/* Active in FCFS */}
            <div className="p-3 rounded-xl bg-slate-900 border border-rose-500/30 space-y-1">
              <div className="flex items-center justify-between text-rose-400 text-[11px] font-bold">
                <span>LEGACY FCFS STATE AT THIS MINUTE:</span>
                <span>{activeFcfsBlock ? `${activeFcfsBlock.bitrateMbps} Mbps` : 'Idle'}</span>
              </div>
              <div className="font-bold text-white text-sm">
                {activeFcfsBlock ? `${activeFcfsBlock.satelliteName} (${activeFcfsBlock.actionType})` : 'No active pass'}
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-snug">
                {activeFcfsBlock ? activeFcfsBlock.notes : 'Antenna waiting for next booking.'}
              </p>
            </div>

          </div>
        </div>

        {/* Hover Inspector Box */}
        {hoveredBlock && (
          <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Hovering Block:</span>
              <strong className="text-sky-300">{hoveredBlock.label}</strong>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-300">
              <span>Bitrate: <strong className="text-emerald-400">{hoveredBlock.bitrateMbps} Mbps</strong></span>
              <span>Delivered: <strong className="text-white">+{hoveredBlock.dataTransferredGb} GB</strong></span>
              <span className="text-slate-400 italic truncate max-w-sm">{hoveredBlock.notes}</span>
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* SIDE-BY-SIDE SCORECARD COMPARISON                        */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Comprehensive Benchmark Scorecard: FCFS vs ORBITOPS
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Real quantifiable differences measured across the exact same 12-minute window:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Legacy FCFS Card */}
          <div className="p-6 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Legacy FCFS Scheduler (First-Come, First-Served)</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                CRITICAL INEFFICIENCY
              </span>
            </div>

            <div className="divide-y divide-rose-200 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Total Data Delivered:</span>
                <strong className="text-slate-900 font-mono text-sm">{metrics.fcfsDataDeliveredGb} GB</strong>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Retransmission Bandwidth Wasted:</span>
                <strong className="text-rose-600 font-mono text-sm">+{metrics.retransmissionWastedGbFcfs} GB Wasted</strong>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Camera Emergency Shutoffs:</span>
                <strong className="text-rose-600 font-mono text-sm">{metrics.bufferOverflowsFcfs} Shutoff Event (Pelican-01)</strong>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Antenna Contact Efficiency:</span>
                <strong className="text-slate-900 font-mono text-sm">{metrics.antennaUtilizationFcfs}% Active</strong>
              </div>
            </div>

            <p className="text-xs text-rose-900 leading-relaxed font-sans pt-1">
              <strong>Why it failed:</strong> Locked onto Sat 3 on the thick low horizon (250 Mbps) for 10 minutes. Starved Sat 2 until Pelican memory filled to 100%, forcing camera shutdown!
            </p>
          </div>

          {/* ORBITOPS Card */}
          <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>ORBITOPS Autonomous Scheduling Engine</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                +214% GAIN (OPTIMAL)
              </span>
            </div>

            <div className="divide-y divide-emerald-200 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Total Data Delivered:</span>
                <strong className="text-emerald-700 font-mono text-sm">{metrics.orbitopsDataDeliveredGb} GB (3.1x More!)</strong>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Retransmission Bandwidth Wasted:</span>
                <strong className="text-emerald-700 font-mono text-sm">0.0 GB (100% Eliminated)</strong>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Camera Emergency Shutoffs:</span>
                <strong className="text-emerald-700 font-mono text-sm">0 Disasters (Buffer Dumped in Time)</strong>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Antenna Contact Efficiency:</span>
                <strong className="text-emerald-700 font-mono text-sm">{metrics.antennaUtilizationOrbitops}% Active</strong>
              </div>
            </div>

            <p className="text-xs text-emerald-900 leading-relaxed font-sans pt-1">
              <strong>Why it won:</strong> Emptied Pelican-01 first before it set, harvested peak 1,420 Mbps Zenith for SuperDove-21, and accounted for antenna slew turnaround (3.5°/s).
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Navigation Strip */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-sky-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition shadow-2xs cursor-pointer w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page (Algorithm & 180° Sky Horizon)</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {onNavigateToUsp1 && (
            <button
              onClick={onNavigateToUsp1}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-sky-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition shadow-2xs cursor-pointer w-full sm:w-auto justify-center"
            >
              <span>Explore USP 1: Per-Station Scheduler</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {onNavigateToUsp2 && (
            <button
              onClick={onNavigateToUsp2}
              className="flex items-center gap-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl transition shadow-2xs cursor-pointer w-full sm:w-auto justify-center"
            >
              <span>Explore USP 2: Pre-Computed Playbooks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
