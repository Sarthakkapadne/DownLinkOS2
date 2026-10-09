import React from 'react';
import { EfficiencyMetrics } from '../types';
import { EFFICIENCY_METRICS_DATA } from '../data/scenarioData';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  HardDrive, 
  Radio, 
  BookmarkCheck, 
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface EfficiencyChartsProps {
  metrics?: EfficiencyMetrics;
}

export const EfficiencyCharts: React.FC<EfficiencyChartsProps> = ({
  metrics = EFFICIENCY_METRICS_DATA
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
              Visual Efficiency Proof: How Much Data Was Saved
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Direct quantitative comparison between the Old Naive Way vs the ORBITOPS Autonomous Way
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>+{metrics.dataGainPercent}% Net Throughput Gain</span>
        </div>
      </div>

      {/* Grid of Visual Comparison Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* CHART 1: Total Data Delivered (GB) */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-sky-600" />
              Total Payload Data Delivered (GB)
            </span>
            <span className="text-[11px] font-bold text-emerald-600 font-mono">
              +{metrics.orbitopsDataDeliveredGb - metrics.fcfsDataDeliveredGb} GB More Data
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {/* ORBITOPS Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-sky-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-600" />
                  ORBITOPS (Autonomous Engine):
                </span>
                <span className="font-mono text-sky-700 font-bold">
                  {metrics.orbitopsDataDeliveredGb} GB (100% of Missions)
                </span>
              </div>
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-1000 relative overflow-hidden"
                  style={{ width: '100%' }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div>

            {/* Naive Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Naive Old Scheduler (FCFS):
                </span>
                <span className="font-mono text-slate-600">
                  {metrics.fcfsDataDeliveredGb} GB (Only 31%)
                </span>
              </div>
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                <div
                  className="h-full bg-slate-400 rounded-full transition-all duration-1000"
                  style={{ width: `${(metrics.fcfsDataDeliveredGb / metrics.orbitopsDataDeliveredGb) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
            By avoiding the horizon trap on Sat 3, clearing Sat 2 before it set, and bookmarking Sat 1 for its next pass, ORBITOPS delivered <strong>3.1x more total data</strong>.
          </p>
        </div>

        {/* CHART 2: Retransmission Waste Eliminated (GB) */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BookmarkCheck className="w-4 h-4 text-teal-600" />
              Retransmission Waste Eliminated
            </span>
            <span className="text-[11px] font-bold text-teal-700 font-mono">
              0 GB Wasted
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {/* Old Way Waste */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-red-900 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  Old Way (No Checkpoint):
                </span>
                <span className="font-mono text-red-600 font-bold">
                  {metrics.retransmissionWastedGbFcfs} GB Thrown Away & Re-sent
                </span>
              </div>
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* ORBITOPS Zero Waste */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-teal-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  ORBITOPS (Saved State Resume):
                </span>
                <span className="font-mono text-teal-700 font-bold">
                  0.0 GB Wasted (100% Retained)
                </span>
              </div>
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '3%' }} />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
            The saved-state bookmark receipt allowed Sat 1 to resume in the next pass from GB 22.9 without re-sending the first 22.8 GB!
          </p>
        </div>

        {/* CHART 3: Camera Shutoffs from Buffer Overflows */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-purple-600" />
              Camera Shutoffs (Buffer Overflows)
            </span>
            <span className="text-[11px] font-bold text-emerald-700 font-mono">
              0 Overflows
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
              <span className="text-2xl font-black text-red-600 block">
                {metrics.bufferOverflowsFcfs}
              </span>
              <span className="text-[10px] text-red-800 font-semibold block mt-0.5">
                Spacecraft Cameras Shut Off (Old Way)
              </span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
              <span className="text-2xl font-black text-emerald-600 block">
                {metrics.bufferOverflowsOrbitops}
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
                Buffer Overflows (ORBITOPS)
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
            Sat 2's memory fullness dropped from 86% to 22%, protecting its camera from emergency sensor shutdown on the next orbit.
          </p>
        </div>

        {/* CHART 4: Ground Dish Antenna Utilization % */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-indigo-600" />
              Ground Dish Contact Utilization %
            </span>
            <span className="text-[11px] font-bold text-indigo-700 font-mono">
              {metrics.antennaUtilizationOrbitops}% Active
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">ORBITOPS Utilization:</span>
              <strong className="text-indigo-700 font-mono">{metrics.antennaUtilizationOrbitops}%</strong>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${metrics.antennaUtilizationOrbitops}%` }} />
            </div>

            <div className="flex justify-between text-xs pt-1">
              <span className="text-slate-500">Old Naive Utilization:</span>
              <span className="text-slate-600 font-mono">{metrics.antennaUtilizationFcfs}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-slate-400 rounded-full" style={{ width: `${metrics.antennaUtilizationFcfs}%` }} />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
            The $2M ground dish spent 89.5% of its time actively moving data rather than sitting idle during poor slews.
          </p>
        </div>

      </div>

      {/* Summary Scorecard Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="font-bold text-sm text-white">
              End-to-End System Performance Summary
            </div>
            <div className="text-xs text-slate-300">
              Sat 1 (100% delivered across 2 passes) · Sat 2 (42.0 GB saved, risk cleared) · Sat 3 (horizon trap avoided).
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <div className="text-slate-400 text-[10px]">TOTAL DELIVERED</div>
            <div className="text-emerald-400 font-bold text-sm">138.4 GB</div>
          </div>
          <div className="text-right border-l border-slate-700 pl-4">
            <div className="text-slate-400 text-[10px]">WASTED DATA</div>
            <div className="text-sky-300 font-bold text-sm">0.0 GB</div>
          </div>
          <div className="text-right border-l border-slate-700 pl-4">
            <div className="text-slate-400 text-[10px]">CAMERA SHUTOFFS</div>
            <div className="text-white font-bold text-sm">0</div>
          </div>
        </div>
      </div>
    </div>
  );
};
