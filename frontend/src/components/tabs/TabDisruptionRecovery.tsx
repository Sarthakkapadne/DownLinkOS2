import React from 'react';
import { 
  Flame, 
  Radio, 
  CheckCircle2, 
  AlertOctagon, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  Shuffle, 
  CloudRain,
  ArrowRight
} from 'lucide-react';
import { GroundStation, DisruptionState, ScheduledContact } from '../../types';

interface TabDisruptionRecoveryProps {
  stations: GroundStation[];
  disruptionState: DisruptionState;
  onSimulateOutage: (stationId: string) => void;
  onRestoreStation: (stationId: string) => void;
  isPlainEnglishMode: boolean;
  contacts: ScheduledContact[];
}

export const TabDisruptionRecovery: React.FC<TabDisruptionRecoveryProps> = ({
  stations,
  disruptionState,
  onSimulateOutage,
  onRestoreStation,
  isPlainEnglishMode,
  contacts
}) => {
  const isAnyOutage = disruptionState.disruptedStationId !== null;
  const offlineStation = stations.find(s => s.id === disruptionState.disruptedStationId);

  return (
    <div className="space-y-6">
      {/* Intro & Break-It Vision */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-red-100 text-red-700 rounded-lg">
                <Flame className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900 m-0">
                Track B: Live Outage Resilience & Sub-Second Healing
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 m-0">
              In real flight operations, antenna drives glitch and rain-fade strikes. 
              Click <span className="font-semibold text-red-700">"Simulate Outage"</span> on any ground dish to witness 
              sub-second local graph repair without schedule cascading churn.
            </p>
          </div>

          {isAnyOutage && (
            <button
              onClick={() => offlineStation && onRestoreStation(offlineStation.id)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer self-start md:self-auto shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restore All Dishes to Online</span>
            </button>
          )}
        </div>
      </div>

      {/* OUTAGE METRIC RECOVERY BAR (If an outage is active) */}
      {isAnyOutage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-red-200">
            <div className="flex items-center gap-2 text-red-900">
              <AlertOctagon className="w-5 h-5 text-red-600 animate-bounce" />
              <div>
                <h3 className="text-sm font-bold m-0">
                  Active Station Disruption: {offlineStation?.name}
                </h3>
                <p className="text-xs text-red-700 m-0">
                  Antenna taken OFFLINE. Reactive repair locked completed contacts and re-routed affected passes.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold bg-white text-red-800 px-3 py-1 rounded-md border border-red-200">
              <span>Repair Latency: {disruptionState.replanLatencyMs.toFixed(1)} ms</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
            <div className="p-3 bg-white rounded-lg border border-red-100 shadow-2xs">
              <span className="text-slate-500 block mb-1">Passes Preserved</span>
              <span className="text-xl font-bold text-emerald-700">
                {disruptionState.passesPreserved}
              </span>
              <span className="text-[11px] text-slate-500 block">Surviving dishes & frozen horizon</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-red-100 shadow-2xs">
              <span className="text-slate-500 block mb-1">Passes Re-routed</span>
              <span className="text-xl font-bold text-sky-700">
                {disruptionState.passesRerouted}
              </span>
              <span className="text-[11px] text-slate-500 block">Moved to alternate stations</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-red-100 shadow-2xs">
              <span className="text-slate-500 block mb-1">Schedule Churn</span>
              <span className="text-xl font-bold text-slate-800">
                {disruptionState.churnCount} passes
              </span>
              <span className="text-[11px] text-slate-500 block">Zero widespread thrashing</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-red-100 shadow-2xs">
              <span className="text-slate-500 block mb-1">Value Retained</span>
              <span className="text-xl font-bold text-emerald-700">
                {disruptionState.valueRetainedPct}%
              </span>
              <span className="text-[11px] text-slate-500 block">Of original mission priority score</span>
            </div>
          </div>
        </div>
      )}

      {/* GROUND STATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stations.map((st) => {
          const isOffline = st.status === 'OFFLINE' || st.id === disruptionState.disruptedStationId;
          const assignedContacts = contacts.filter(c => c.stationId === st.id);

          return (
            <div
              key={st.id}
              className={`rounded-xl border transition-all p-5 shadow-xs ${
                isOffline
                  ? 'bg-red-50/70 border-red-300 ring-2 ring-red-400'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${isOffline ? 'bg-red-200 text-red-800' : 'bg-sky-100 text-sky-700'}`}>
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 m-0">{st.name}</h3>
                    <p className="text-xs text-slate-500 m-0">{st.location}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  isOffline 
                    ? 'bg-red-200 text-red-800 border border-red-300' 
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {isOffline ? 'OFFLINE' : 'OPERATIONAL'}
                </span>
              </div>

              {/* Station Parameters */}
              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                <div>
                  <span className="text-slate-500 block">Aperture Size:</span>
                  <span className="font-semibold text-slate-800">{st.dishDiameterM}m Parabolic</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Cable Heading:</span>
                  <span className="font-semibold text-slate-800 font-mono">{st.currentCableDeg}°</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Active Passes:</span>
                  <span className="font-semibold text-slate-800">{assignedContacts.length} contacts</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Atmospheric Loss:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-slate-400" />
                    <span>{st.rainAttenuationDb} dB (Clear)</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-1 flex items-center justify-between">
                {isOffline ? (
                  <button
                    onClick={() => onRestoreStation(st.id)}
                    className="w-full py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restore Antenna to Online</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onSimulateOutage(st.id)}
                    className="w-full py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Simulate Station Outage</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* WHY OUR RECOVERY ENGINE IS UNIQUE (USP EXPLANATION) */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Our Outage Recovery Principles (The 4 Defense Layers)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>1. Frozen Window Lock</span>
            </div>
            <p className="text-slate-600 m-0 leading-relaxed">
              Passes within 30 minutes of AOS are strictly locked. Telecommands are already encrypted and uplinked to the satellite; changing them causes lost contacts.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Shuffle className="w-4 h-4 text-purple-600" />
              <span>2. Local Sub-Graph Repair</span>
            </div>
            <p className="text-slate-600 m-0 leading-relaxed">
              Rather than re-optimizing all 150 satellites from scratch, ORBITOPS isolates only the affected time interval and shifts passes to sibling polar stations.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>3. Churn Penalty Function</span>
            </div>
            <p className="text-slate-600 m-0 leading-relaxed">
              Explicit L1 penalty in the solver objective minimizes schedule thrashing, ensuring ground crews aren't dealing with constantly shifting schedules.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>4. Sub-100ms Latency</span>
            </div>
            <p className="text-slate-600 m-0 leading-relaxed">
              Repairs complete in milliseconds, allowing operators or automated telemetry daemons to respond before satellite AOS over the next station.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
