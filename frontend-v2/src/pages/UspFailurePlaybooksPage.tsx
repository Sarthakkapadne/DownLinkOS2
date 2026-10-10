import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';

interface DisruptionContact {
  id: string;
  satelliteName: string;
  originalStation: string;
  alternateStation: string;
  status: 'PRESERVED' | 'REROUTED' | 'DROPPED';
  orbitDelayMin: number;
  priority: string;
  dataGb: number;
  rationale: string;
}

const NOMINAL_CONTACTS: DisruptionContact[] = [
  {
    id: 'c-1',
    satelliteName: 'SuperDove-Flock-4P-21',
    originalStation: 'KSAT Svalbard Ant-1',
    alternateStation: 'Inuvik Dish-2',
    status: 'REROUTED',
    orbitDelayMin: 42,
    priority: 'P3 Routine',
    dataGb: 38.4,
    rationale: 'Polar handover to Inuvik on next quadrant crossing (42 min later).'
  },
  {
    id: 'c-2',
    satelliteName: 'Pelican-Rapid-01',
    originalStation: 'KSAT Svalbard Ant-1',
    alternateStation: 'TrollSat Ant-4',
    status: 'REROUTED',
    orbitDelayMin: 48,
    priority: 'P2 High Urgency',
    dataGb: 42.0,
    rationale: 'Transferred to Antarctic TrollSat pass to empty 86% memory buffer.'
  },
  {
    id: 'c-3',
    satelliteName: 'SkySat-C14',
    originalStation: 'KSAT Svalbard Ant-1',
    alternateStation: 'KSAT Svalbard Ant-1',
    status: 'DROPPED',
    orbitDelayMin: 0,
    priority: 'P2 Dropping Fast',
    dataGb: 48.0,
    rationale: 'Satellite setting below 5° horizon regardless; excluded to protect network.'
  },
  {
    id: 'c-4',
    satelliteName: 'PlanetScope-Dove-108',
    originalStation: 'Inuvik Dish-2',
    alternateStation: 'Inuvik Dish-2',
    status: 'PRESERVED',
    orbitDelayMin: 0,
    priority: 'P3 Routine',
    dataGb: 16.0,
    rationale: 'Station unaffected. Pass preserved with zero disruption.'
  },
  {
    id: 'c-5',
    satelliteName: 'Pelican-Rapid-02',
    originalStation: 'TrollSat Ant-4',
    alternateStation: 'TrollSat Ant-4',
    status: 'PRESERVED',
    orbitDelayMin: 0,
    priority: 'P1 Emergency',
    dataGb: 52.0,
    rationale: 'Station unaffected. Pass preserved with zero disruption.'
  }
];

export interface UspFailurePlaybooksPageProps {
  onBack?: () => void;
  onNavigateToUsp1?: () => void;
}

export const UspFailurePlaybooksPage: React.FC<UspFailurePlaybooksPageProps> = ({
  onBack,
  onNavigateToUsp1
}) => {
  const [isOutageActive, setIsOutageActive] = useState<boolean>(false);
  const [activePlaybookTab, setActivePlaybookTab] = useState<'A' | 'B' | 'C'>('B');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Navigation Bar */}
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
      
      {/* ======================================================== */}
      {/* 1. HERO BANNER: USP 2 IDENTITY & PURPOSE                 */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Cpu className="w-3.5 h-3.5" />
            <span>CORE USP 2 · RESILIENCE & DISRUPTION MANAGEMENT</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Pre-Computed Failure Playbooks
          </h1>

          <p className="text-base sm:text-lg text-indigo-200/90 font-medium leading-relaxed">
            A scheduling plan must be ready for unexpected failures, not just normal operations.
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
            ORBITOPS prepares alternative schedules in advance for possible ground station failures. When a station goes offline, the system selects a suitable backup plan and validates it against remaining constraints in <strong>under 100 milliseconds</strong>.
          </p>

          <p className="text-xs text-sky-300 font-semibold italic pt-1">
            "The goal is simple: prepare for disruptions before they happen, rather than starting from scratch after a failure."
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Zap className="w-4 h-4" /> &lt;100ms Re-route Latency
            </span>
            <span className="flex items-center gap-1.5 text-sky-300">
              <ShieldCheck className="w-4 h-4" /> 94.2% Mission Value Retained
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Lock className="w-4 h-4" /> 30-Min Frozen Horizon Lock (Zero Thrash)
            </span>
          </div>
        </div>

        {/* Background Visual Watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Activity className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. INTERACTIVE LIVE OUTAGE DISASTER SIMULATOR            */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${isOutageActive ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Live Station Outage & Playbook Execution Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Click the button below to simulate an unexpected transmitter/power failure at Svalbard and observe ORBITOPS contingency execution.
            </p>
          </div>

          {/* Disaster Trigger Button */}
          <button
            onClick={() => setIsOutageActive(!isOutageActive)}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition shadow-md cursor-pointer flex items-center gap-2 ${
              isOutageActive
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
            }`}
          >
            {isOutageActive ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Reset to Normal Operations (Playbook A)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>Simulate Svalbard Station Failure</span>
              </>
            )}
          </button>
        </div>

        {/* Live Station Health Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Station 1: Svalbard */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isOutageActive
                ? 'bg-red-50 border-red-300 ring-2 ring-red-200'
                : 'bg-emerald-50/60 border-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-700">KSAT Svalbard Ant-1</span>
              {isOutageActive ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-600 text-white animate-pulse">
                  OFFLINE (POWER FAULT)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-600 text-white">
                  ONLINE · NOMINAL
                </span>
              )}
            </div>
            <div className="text-xs space-y-1 text-slate-600 font-mono">
              <div>Role: Primary High-Latitude Gateway</div>
              <div>Status: {isOutageActive ? 'Disrupted (0 Mbps)' : 'Active Tracking (1,420 Mbps)'}</div>
            </div>
            {isOutageActive && (
              <div className="mt-3 p-2 bg-red-100/80 rounded-lg text-[11px] text-red-900 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                <span>Playbook B triggered: 2 passes automatically rerouted</span>
              </div>
            )}
          </div>

          {/* Station 2: Inuvik (Backup 1) */}
          <div className="p-5 rounded-2xl border bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-700">Inuvik Satellite Facility</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-600 text-white">
                ONLINE · HEALTHY
              </span>
            </div>
            <div className="text-xs space-y-1 text-slate-600 font-mono">
              <div>Role: Canadian Polar Backup Relay</div>
              <div>Buffer: {isOutageActive ? 'Absorbing SuperDove-21 (+38.4 GB)' : 'Normal Load'}</div>
            </div>
            {isOutageActive && (
              <div className="mt-3 p-2 bg-emerald-100/80 rounded-lg text-[11px] text-emerald-900 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Backup slot reserved at 01:54 UTC (+42m)</span>
              </div>
            )}
          </div>

          {/* Station 3: TrollSat (Backup 2) */}
          <div className="p-5 rounded-2xl border bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-700">TrollSat Antarctica</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-600 text-white">
                ONLINE · HEALTHY
              </span>
            </div>
            <div className="text-xs space-y-1 text-slate-600 font-mono">
              <div>Role: Antarctic Deep Polar Relay</div>
              <div>Buffer: {isOutageActive ? 'Absorbing Pelican (+42.0 GB)' : 'Normal Load'}</div>
            </div>
            {isOutageActive && (
              <div className="mt-3 p-2 bg-emerald-100/80 rounded-lg text-[11px] text-emerald-900 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Pelican memory buffer protected from overflow</span>
              </div>
            )}
          </div>
        </div>

        {/* Recovery Scorecard Strip */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">
                {isOutageActive ? 'Contingency Playbook B Executed Successfully' : 'Nominal Operational State (Playbook A Active)'}
              </div>
              <div className="text-xs text-slate-300">
                {isOutageActive
                  ? 'All healthy satellites protected. Alternate polar contacts confirmed with zero human intervention.'
                  : 'Continuous background generation of pre-computed failure schedules for every ground station.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <div className="text-slate-400 text-[10px]">MISSION VALUE RETAINED</div>
              <div className="text-emerald-400 font-bold text-sm">94.2%</div>
            </div>
            <div className="text-right border-l border-slate-700 pl-4">
              <div className="text-slate-400 text-[10px]">RECOVERY LATENCY</div>
              <div className="text-sky-300 font-bold text-sm">38.4 ms</div>
            </div>
            <div className="text-right border-l border-slate-700 pl-4">
              <div className="text-slate-400 text-[10px]">SCHEDULE THRASH</div>
              <div className="text-white font-bold text-sm">0 Chaos</div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. THE 3 CORE PILLARS OF PLAYBOOK EXECUTION              */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            How Pre-Computed Failure Playbooks Actually Work
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            The three engineering principles built into ORBITOPS to eliminate disruption delays:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
              PILLAR 1 · ZERO THRASHING
            </span>
            <h4 className="font-bold text-base text-slate-900">
              The 30-Min Frozen Horizon Lock
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              When an outage strikes, never touch passes that are already running or starting within 30 minutes (t &lt; t_curr + 30m). Those passes are frozen in green. This eliminates fleet panic and preserves spacecraft telemetry lineage.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <RotateCw className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded">
              PILLAR 2 · ORBITAL RELAY
            </span>
            <h4 className="font-bold text-base text-slate-900">
              Sub-Graph Alternate Station Rerouting
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instead of resolving the entire global network from scratch, ORBITOPS re-routes only the specific disrupted passes to available stations within the 95-minute polar pass corridor (e.g. Inuvik or TrollSat), verified against their slew and elevation limits.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
              PILLAR 3 · SPEED
            </span>
            <h4 className="font-bold text-base text-slate-900">
              Sub-Second (&lt;100ms) Execution
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Because playbooks are pre-computed in memory before the pass begins, the reaction time is virtually instant (38.4 ms). The ground network switches to the backup schedule before spacecraft flight computers even log a carrier loss.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. SIDE-BY-SIDE: OLD WAY VS PRE-COMPUTED PLAYBOOKS       */}
      {/* ======================================================== */}
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-bold text-base sm:text-lg text-white">
            Direct Comparison: What Happens When a Station Fails?
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            The difference between legacy reactive human rescheduling vs ORBITOPS pre-computed playbooks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Old Way */}
          <div className="p-5 rounded-2xl bg-red-950/30 border border-red-500/30 space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              The Old Way: Starting from Scratch After Failure
            </div>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
              <li>Station drops offline at 01:12 UTC during Arctic blizzard.</li>
              <li>Schedulers crash; operators receive emergency pagers and panic.</li>
              <li>Engineers spend <strong>2 to 4 hours manually redrawing contact timetables</strong>.</li>
              <li>Pelican memory hits 100% fullness while waiting; camera emergency shuts down.</li>
              <li>Total Result: <strong>65% data loss, massive recovery delays, high human stress</strong>.</li>
            </ul>
          </div>

          {/* ORBITOPS Way */}
          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              The ORBITOPS Way: Pre-Computed Failure Playbooks
            </div>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
              <li>Station drops offline at 01:12 UTC.</li>
              <li>ORBITOPS detects carrier loss and activates <strong>Playbook B in 38.4 ms</strong>.</li>
              <li>Passes within 30 min are locked; Pelican pass transferred to TrollSat (Antarctica).</li>
              <li>SuperDove-21 pass transferred to Inuvik (Canada) 42 minutes later.</li>
              <li>Total Result: <strong>94.2% data preserved, 0 camera shutoffs, zero human panic</strong>.</li>
            </ul>
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
