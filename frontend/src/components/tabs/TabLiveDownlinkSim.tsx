import React, { useState, useEffect } from 'react';
import { Satellite, GroundStation, ScheduledContact } from '../../types';
import { 
  Radio, 
  Activity, 
  ArrowDownToLine, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  ShieldAlert, 
  Zap, 
  Gauge, 
  Compass,
  FileCheck2
} from 'lucide-react';

interface TabLiveDownlinkSimProps {
  satellites: Satellite[];
  stations: GroundStation[];
  contacts: ScheduledContact[];
  currentMinute: number;
  isPlainEnglishMode: boolean;
}

export const TabLiveDownlinkSim: React.FC<TabLiveDownlinkSimProps> = ({
  satellites,
  stations,
  contacts,
  currentMinute,
  isPlainEnglishMode
}) => {
  // Active Simulated Pass
  const [activeContactId, setActiveContactId] = useState<string>(contacts[0]?.id || 'contact-0');
  const [passProgress, setPassProgress] = useState<number>(45); // 0% to 100% of pass duration
  const [isSimPlaying, setIsSimPlaying] = useState<boolean>(true);

  // Failure Mode Injections
  const [injectedFailure, setInjectedFailure] = useState<'NONE' | 'KEYHOLE' | 'RAIN_FADE' | 'CABLE_WRAP'>('NONE');

  const selectedContact = contacts.find(c => c.id === activeContactId) || contacts[0];
  const selectedSat = satellites.find(s => s.id === selectedContact?.satelliteId) || satellites[1];
  const selectedStation = stations.find(s => s.id === selectedContact?.stationId) || stations[0];

  // Auto-progress pass animation
  useEffect(() => {
    if (!isSimPlaying) return;
    const interval = setInterval(() => {
      setPassProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 400);
    return () => clearInterval(interval);
  }, [isSimPlaying]);

  // Compute Elevation and Azimuth across trajectory (AOS to LOS)
  // Peak elevation in center (progress = 50%)
  const peakElevation = 82.5;
  const currentElevationDeg = Math.max(
    5.0,
    Math.round(5.0 + (peakElevation - 5.0) * Math.sin((passProgress / 100) * Math.PI))
  );

  // Azimuth sweeping from South-East (135 deg) to North-West (315 deg)
  const currentAzimuthDeg = Math.round(135 + ((315 - 135) * (passProgress / 100)));

  // DVB-S2X Dynamic Bitrate based on elevation angle R(θ) = 200 + 1400 * sin(θ)^0.65
  const rawBitrateMbps = Math.round(
    200 + 1400 * Math.pow(Math.sin((currentElevationDeg * Math.PI) / 180), 0.65)
  );

  // If Rain fade injected, bitrate drops drastically
  const currentBitrateMbps = injectedFailure === 'RAIN_FADE' && passProgress > 40 && passProgress < 75 
    ? 0 
    : rawBitrateMbps;

  // Real-time Buffer drainage
  const initialSatBufferGb = selectedSat?.currentBufferGb || 242.0;
  const totalVolumeToDeliver = selectedContact?.deliveredVolumeGb || 38.2;
  const deliveredSoFarGb = Number(((passProgress / 100) * totalVolumeToDeliver).toFixed(2));
  const currentSatRemainingGb = Math.max(0, Number((initialSatBufferGb - deliveredSoFarGb).toFixed(2)));

  // Radar Skyplot geometry (Polar coordinates -> Cartesian SVG)
  // Radius: 140px. 0 deg elevation = 140px (outer ring), 90 deg = 0px (center)
  const center = 150;
  const maxRadius = 120;
  const elevationRadius = maxRadius * (1 - currentElevationDeg / 90);
  const azimuthRad = ((currentAzimuthDeg - 90) * Math.PI) / 180; // Standard compass SVG rotation
  const satX = center + elevationRadius * Math.cos(azimuthRad);
  const satY = center + elevationRadius * Math.sin(azimuthRad);

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & CONTACT SELECTOR */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
              PHYSICAL PASS SIMULATOR
            </span>
            <span className="text-xs text-slate-500 font-mono">DVB-S2X ACM · DYNAMIC RF LINK</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            {isPlainEnglishMode 
              ? 'Live Satellite Pass Tracking & Downlink Stream' 
              : 'Kinematic Polar Tracking & Adaptive Modulation Telemetry'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time mechanical dish tracking, adaptive RF link rate, and onboard Solid-State Recorder buffer drainage.
          </p>
        </div>

        {/* Contact Switcher & Playback */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={activeContactId}
            onChange={(e) => {
              setActiveContactId(e.target.value);
              setPassProgress(0);
              setInjectedFailure('NONE');
            }}
            className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.satelliteName} @ {c.stationName.split(' ')[0]} ({c.deliveredVolumeGb} GB)
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsSimPlaying(!isSimPlaying)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              isSimPlaying 
                ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isSimPlaying ? 'Pause Pass' : 'Resume Pass'}
          </button>

          <button
            onClick={() => {
              setPassProgress(0);
              setInjectedFailure('NONE');
            }}
            className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            title="Reset to AOS"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. THREE-PANEL OPERATIONAL DISPLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PANEL 1: TACTICAL POLAR RADAR SKYPLOT */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-600" />
                Polar Radar Skyplot (Dish View)
              </span>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                SIGNAL LOCKED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Viewing from <strong className="text-slate-800">{selectedStation?.name}</strong>. Horizon is 0° (outer rim), Zenith is 90° (center).
            </p>
          </div>

          {/* SVG Polar Radar Display */}
          <div className="flex justify-center my-4">
            <svg width="300" height="300" className="bg-slate-900 rounded-full shadow-inner border-4 border-slate-800">
              {/* Concentric Elevation Rings */}
              <circle cx="150" cy="150" r="120" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="150" cy="150" r="80" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="150" cy="150" r="40" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="150" cy="150" r="15" fill="none" stroke="#475569" strokeWidth="1" />

              {/* Cardinal Axes */}
              <line x1="150" y1="20" x2="150" y2="280" stroke="#334155" strokeWidth="1" />
              <line x1="20" y1="150" x2="280" y2="150" stroke="#334155" strokeWidth="1" />

              {/* Cardinal Labels */}
              <text x="150" y="16" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">N (0°)</text>
              <text x="286" y="153" fill="#94a3b8" fontSize="10" textAnchor="start" fontWeight="bold">E (90°)</text>
              <text x="150" y="295" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">S (180°)</text>
              <text x="12" y="153" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="bold">W (270°)</text>

              {/* Elevation Marks */}
              <text x="155" y="75" fill="#64748b" fontSize="8">60°</text>
              <text x="155" y="115" fill="#64748b" fontSize="8">30°</text>
              <text x="155" y="142" fill="#64748b" fontSize="8">Zenith 90°</text>

              {/* Pass Trajectory Arc */}
              <path
                d="M 235 235 Q 150 50 65 65"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {/* Dish Pointing Crosshairs */}
              <line x1={satX - 12} y1={satY} x2={satX + 12} y2={satY} stroke="#38bdf8" strokeWidth="1.5" />
              <line x1={satX} y1={satY - 12} x2={satX} y2={satY + 12} stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx={satX} cy={satY} r="8" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />

              {/* Moving Satellite Dot */}
              <circle cx={satX} cy={satY} r="5" fill="#f43f5e" className="animate-pulse" />
              <text x={satX + 8} y={satY - 6} fill="#ffffff" fontSize="9" fontWeight="bold">
                {selectedSat?.name.split(' ')[0]}
              </text>
            </svg>
          </div>

          {/* Slew & Angle Telemetry Bar */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono">
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Elevation Angle</span>
              <strong className="text-slate-900 text-sm">{currentElevationDeg}°</strong>
              <span className="text-slate-500 text-[10px] block">Peak: {peakElevation}°</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Azimuth Bearing</span>
              <strong className="text-slate-900 text-sm">{currentAzimuthDeg}°</strong>
              <span className="text-slate-500 text-[10px] block">Slew: 10.4°/s</span>
            </div>
          </div>
        </div>

        {/* PANEL 2: RF LINK SPEEDOMETER & BUFFER DRAINAGE */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-emerald-600" />
                Adaptive RF Bitrate & Buffer Valve
              </span>
              <span className="text-[11px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-semibold">
                DVB-S2X ACM
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Bitrate scales with elevation: higher elevation reduces atmospheric loss, enabling higher-order modulation.
            </p>
          </div>

          {/* Dynamic Bitrate Speedometer Metric */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-4 my-3 shadow-sm border border-slate-700">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>REAL-TIME THROUGHPUT</span>
              <span className="font-mono text-emerald-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                {injectedFailure === 'RAIN_FADE' ? 'ATTENUATED' : 'ACTIVE LOCK'}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-3xl font-mono font-bold tracking-tight text-white">
                {currentBitrateMbps.toLocaleString()} <span className="text-base font-normal text-slate-400">Mbps</span>
              </div>
              <div className="text-xs font-mono text-sky-300">
                ModCod: 64APSK 3/4
              </div>
            </div>

            {/* Bitrate Progress Bar */}
            <div className="mt-3 w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${Math.min((currentBitrateMbps / 1600) * 100, 100)}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-mono">
              <span>200 Mbps (Horizon)</span>
              <span>1,600 Mbps (Peak ACM)</span>
            </div>
          </div>

          {/* Dual Water Tank Drainage Visualization */}
          <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
            {/* Satellite Onboard Tank */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  Satellite Memory Buffer
                </span>
                <span className="font-mono text-slate-600">
                  {currentSatRemainingGb} GB / {selectedSat?.ssrCapacityGb} GB
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <div 
                  className="h-full bg-sky-600 transition-all duration-300"
                  style={{ width: `${Math.min((currentSatRemainingGb / (selectedSat?.ssrCapacityGb || 256)) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                <ArrowDownToLine className="w-3 h-3 text-emerald-600" />
                Draining into ground station at ~{currentBitrateMbps > 0 ? (currentBitrateMbps / 8000).toFixed(2) : 0} GB/s
              </span>
            </div>

            {/* Ground Station Ingest Bucket */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Ground Station Storage Ingest
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  +{deliveredSoFarGb} GB Received
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.min((deliveredSoFarGb / totalVolumeToDeliver) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 3: CHAOS & ANOMALY INJECTION LAB */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                Failure Mode Anomaly Injector
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                CHAOS TESTING
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Inject real-world operational hazards to see how ORBITOPS safeguards the physical antenna and preserves downlink telemetry.
            </p>
          </div>

          {/* Anomaly Buttons */}
          <div className="space-y-2.5 my-3">
            {/* Button 1: Zenith Keyhole */}
            <button
              onClick={() => setInjectedFailure('KEYHOLE')}
              className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                injectedFailure === 'KEYHOLE'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>1. Zenith Keyhole Hazard (&gt;85° Elevation)</span>
                {injectedFailure === 'KEYHOLE' && <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-mono">ACTIVE</span>}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Overhead pass requires 180° instant azimuth spin, exceeding motor slew rate.
              </p>
            </button>

            {/* Button 2: Rain Fade RF Loss */}
            <button
              onClick={() => setInjectedFailure('RAIN_FADE')}
              className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                injectedFailure === 'RAIN_FADE'
                  ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>2. Severe Rain/Snow Fade (Mid-Pass RF Loss)</span>
                {injectedFailure === 'RAIN_FADE' && <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded font-mono">ACTIVE</span>}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Atmospheric cloud attenuation cuts signal at minute 4 of contact.
              </p>
            </button>

            {/* Button 3: Cable-Wrap Limit */}
            <button
              onClick={() => setInjectedFailure('CABLE_WRAP')}
              className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                injectedFailure === 'CABLE_WRAP'
                  ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>3. Turntable Cable-Wrap Boundary (±270°)</span>
                {injectedFailure === 'CABLE_WRAP' && <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded font-mono">ACTIVE</span>}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Dish pedestal rotates to +265° azimuth near physical safety stop.
              </p>
            </button>
          </div>

          {/* Autonomous Resolution Response Callout */}
          <div className="bg-slate-900 text-white p-3 rounded-lg text-xs font-mono space-y-1">
            <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              ORBITOPS AUTONOMOUS MITIGATION:
            </div>
            {injectedFailure === 'KEYHOLE' && (
              <p className="text-slate-300 text-[11px]">
                Pass split into dual contacts: Entry contact (AOS to 84°) + Exit contact (84° to LOS). Motor slew rate kept &le;12°/s. Zero RF lock lost.
              </p>
            )}
            {injectedFailure === 'RAIN_FADE' && (
              <p className="text-slate-300 text-[11px]">
                CFDP Class 2 checkpoint saved {deliveredSoFarGb} GB downlinked. Remaining {(totalVolumeToDeliver - deliveredSoFarGb).toFixed(1)} GB automatically queued for next pass at Inuvik.
              </p>
            )}
            {injectedFailure === 'CABLE_WRAP' && (
              <p className="text-slate-300 text-[11px]">
                Controlled unwrap executed in preceding 120s setup window. Turntable reset to -45° before AOS. Cable safety factor: 100%.
              </p>
            )}
            {injectedFailure === 'NONE' && (
              <p className="text-slate-400 text-[11px]">
                Nominal DVB-S2X ACM tracking active. 0 physical constraint violations detected.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
