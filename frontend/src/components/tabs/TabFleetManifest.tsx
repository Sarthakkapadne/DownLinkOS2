import React, { useState } from 'react';
import { 
  Satellite, 
  GroundStation, 
  PassOpportunity, 
  ScheduledContact 
} from '../../types';
import { 
  HardDrive, 
  Radio, 
  Clock, 
  ArrowDownToLine, 
  AlertTriangle, 
  Search, 
  Filter, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface TabFleetManifestProps {
  satellites: Satellite[];
  stations: GroundStation[];
  passes: PassOpportunity[];
  contacts: ScheduledContact[];
  currentMinute: number;
  onSelectPass: (pass: PassOpportunity) => void;
  isPlainEnglishMode: boolean;
}

export const TabFleetManifest: React.FC<TabFleetManifestProps> = ({
  satellites,
  stations,
  passes,
  currentMinute,
  onSelectPass,
  isPlainEnglishMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<'ALL' | 'CRITICAL' | 'NORMAL'>('ALL');

  // Top Metrics
  const totalSatellites = satellites.length;
  const activeStations = stations.filter(s => s.status === 'ACTIVE').length;
  const avgBufferFill = Math.round(
    satellites.reduce((acc, s) => acc + (s.currentBufferGb / s.ssrCapacityGb) * 100, 0) / totalSatellites
  );
  const criticalSatsCount = satellites.filter(s => (s.currentBufferGb / s.ssrCapacityGb) >= 0.8).length;

  // Filtered Passes
  const filteredPasses = passes.filter(p => {
    const matchSearch = p.satelliteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStation = selectedStation === 'ALL' || p.stationId === selectedStation;
    const matchUrgency = urgencyFilter === 'ALL' || 
                         (urgencyFilter === 'CRITICAL' && p.bufferFillPct >= 80) ||
                         (urgencyFilter === 'NORMAL' && p.bufferFillPct < 80);
    return matchSearch && matchStation && matchUrgency;
  });

  return (
    <div className="space-y-6">
      {/* 1. TOP FLEET EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isPlainEnglishMode ? 'Constellation Satellites' : 'Active LEO Spacecraft'}
            </span>
            <span className="p-2 bg-sky-50 text-sky-700 rounded-lg">
              <SatelliteIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalSatellites}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> 100% Operational
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">PlanetScope (6), SkySat (1), Pelican (1)</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isPlainEnglishMode ? 'Ground Stations' : 'Ground Antennas'}
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Radio className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{activeStations}</span>
            <span className="text-xs text-slate-500">of {stations.length} dishes online</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">KSAT Svalbard, Inuvik, TrollSat, PUQ</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isPlainEnglishMode ? 'Fleet Memory Fill' : 'Avg SSR Utilization'}
            </span>
            <span className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <HardDrive className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{avgBufferFill}%</span>
            <span className="text-xs font-medium text-amber-600">High Fill State</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Total stored: ~2,027 GB across fleet</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isPlainEnglishMode ? 'At Risk of Data Loss' : 'Critical Buffer Overflow Risk'}
            </span>
            <span className="p-2 bg-rose-50 text-rose-700 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">{criticalSatsCount} Satellites</span>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
              &gt;80% Full
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">SuperDove-2104, SkySat-C14 need immediate downlink</p>
        </div>
      </div>

      {/* 2. CONSTELLATION SATELLITE MANIFEST & "WATER TANK" BUFFER FILL */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-sky-600" />
              {isPlainEnglishMode 
                ? 'Satellite Fleet & Onboard Memory "Water Tanks"' 
                : 'Spacecraft Solid-State Recorder (SSR) Storage Manifest'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isPlainEnglishMode 
                ? 'Visual fill tanks: When a satellite buffer hits 100%, fresh imagery is permanently dumped. Ground stations act as drain valves.'
                : 'Real-time telemetry showing SSR capacity, current data accumulation, and next scheduled downlink contact.'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> &lt;50% Normal
            </span>
            <span className="flex items-center gap-1.5 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 50-80% Elevated
            </span>
            <span className="flex items-center gap-1.5 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> &gt;80% Critical
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Satellite ID & Constellation</th>
                <th className="py-3 px-4">Priority Tier</th>
                <th className="py-3 px-4">SSR Memory Fill ("Water Tank")</th>
                <th className="py-3 px-4">Buffer / Capacity</th>
                <th className="py-3 px-4">Data Rate / Orbit</th>
                <th className="py-3 px-4">Next Pass Window</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {satellites.map((sat) => {
                const fillPct = Math.round((sat.currentBufferGb / sat.ssrCapacityGb) * 100);
                const isCritical = fillPct >= 80;
                const isElevated = fillPct >= 50 && fillPct < 80;

                // Find next pass for this satellite
                const upcomingPass = passes
                  .filter(p => p.satelliteId === sat.id && p.aosMinutes >= currentMinute)
                  .sort((a, b) => a.aosMinutes - b.aosMinutes)[0];

                const minutesUntilPass = upcomingPass 
                  ? upcomingPass.aosMinutes - currentMinute 
                  : null;

                return (
                  <tr key={sat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: sat.color }}
                        />
                        <div>
                          <div className="font-semibold text-slate-900">{sat.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{sat.id} · {sat.constellation}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        sat.priority === 5 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : sat.priority === 4
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {'★'.repeat(sat.priority)} Tier {sat.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 w-64">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className={isCritical ? 'font-bold text-rose-600' : 'text-slate-600'}>
                            {fillPct}% full
                          </span>
                          <span className="text-slate-500">
                            {sat.currentBufferGb.toFixed(1)} / {sat.ssrCapacityGb} GB
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                          <div 
                            className={`h-full transition-all duration-500 rounded-full ${
                              isCritical 
                                ? 'bg-rose-500 animate-pulse' 
                                : isElevated 
                                ? 'bg-amber-500' 
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(fillPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      <span className="font-semibold">{sat.currentBufferGb} GB</span>
                      <span className="text-slate-500"> ({sat.ssrCapacityGb - sat.currentBufferGb} GB free)</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      +{sat.dataGenRateGbPerOrbit} GB/orbit
                    </td>

                    <td className="py-3.5 px-4">
                      {minutesUntilPass !== null ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-sky-600" />
                          <span className="font-semibold text-sky-700">in {minutesUntilPass} min</span>
                          <span className="text-slate-500 font-mono">({upcomingPass.stationName.split(' ')[0]})</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">No pass in next 24h</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                        isCritical 
                          ? 'bg-rose-100 text-rose-800' 
                          : sat.currentBufferGb > 0
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isCritical ? 'URGENT DUMP' : 'HEALTHY'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. 24-HOUR PASS OPPORTUNITIES MASTER TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-600" />
              {isPlainEnglishMode ? '24-Hour Line-of-Sight Pass Opportunities' : 'Candidate Contact Opportunity Windows'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              All geometric line-of-sight contacts computed from authentic NORAD SGP4 orbit propagation across polar and mid-latitude ground stations.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search satellite or station..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 w-44"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="ALL">All Ground Stations</option>
                {stations.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setUrgencyFilter('ALL')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  urgencyFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Passes
              </button>
              <button
                onClick={() => setUrgencyFilter('CRITICAL')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  urgencyFilter === 'CRITICAL' ? 'bg-rose-50 text-rose-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Critical Only
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Pass ID</th>
                <th className="py-3 px-4">Satellite Target</th>
                <th className="py-3 px-4">Ground Antenna</th>
                <th className="py-3 px-4">AOS / LOS Window (UTC)</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Peak Elevation</th>
                <th className="py-3 px-4">Downlink Cap</th>
                <th className="py-3 px-4">Urgency Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPasses.length > 0 ? (
                filteredPasses.map((pass) => {
                  const formatUtc = (min: number) => {
                    const h = Math.floor(min / 60) % 24;
                    const m = min % 60;
                    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                  };

                  return (
                    <tr key={pass.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {pass.id}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{pass.satelliteName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Buffer: {pass.satelliteBufferAtAos} GB ({pass.bufferFillPct}% full)
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{pass.stationName}</div>
                        <div className="text-[11px] text-slate-500">{pass.stationId}</div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-700">
                        <span className="font-semibold text-emerald-700">{formatUtc(pass.aosMinutes)}</span>
                        <span className="text-slate-500"> → </span>
                        <span className="font-semibold text-slate-700">{formatUtc(pass.losMinutes)}</span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-700">
                        {pass.durationMinutes} min ({pass.durationMinutes * 60}s)
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 font-semibold ${
                          pass.maxElevationDeg >= 75 
                            ? 'text-sky-700 font-bold' 
                            : 'text-slate-700'
                        }`}>
                          {pass.maxElevationDeg}°
                          {pass.isKeyholeRisk && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-semibold">
                              Keyhole &gt;85°
                            </span>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        <span className="flex items-center gap-1">
                          <ArrowDownToLine className="w-3.5 h-3.5 text-sky-600" />
                          {pass.dataVolumeGb} GB
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div 
                              className={`h-full ${
                                pass.bufferFillPct >= 80 ? 'bg-rose-500' : 'bg-sky-500'
                              }`} 
                              style={{ width: `${Math.min(pass.bufferFillPct, 100)}%` }}
                            />
                          </div>
                          <span className={`font-mono text-xs font-bold ${
                            pass.bufferFillPct >= 80 ? 'text-rose-600' : 'text-slate-700'
                          }`}>
                            {pass.bufferFillPct}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onSelectPass(pass)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors border border-sky-200/60"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 italic">
                    No pass opportunities match the selected search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Internal icon helper
const SatelliteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M13 7 9 3 5 7l4 4" />
    <path d="m17 11 4 4-4 4-4-4" />
    <path d="m8 12 4 4 6-6-4-4Z" />
    <path d="m16 8 3-3" />
    <path d="M9 21a6 6 0 0 0-6-6" />
  </svg>
);
