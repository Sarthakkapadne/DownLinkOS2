import React, { useState, useEffect } from 'react';
import { Satellite, GroundStation } from '../types';
import { SatelliteInfoCard } from './SatelliteInfoCard';
import { 
  Radio, 
  Play, 
  Pause, 
  Layers, 
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  HardDrive
} from 'lucide-react';

interface SkyHorizonViewProps {
  satellites: Satellite[];
  groundStation: GroundStation;
  activeSatelliteId: string | null;
  onSelectSatellite?: (satId: string) => void;
}

// Satellite positions on 1000 x 460 SVG canvas:
// Ascending is from RIGHT (AOS), overhead is ZENITH, descending is to LEFT (LOS)
const SAT_POSITIONS: Record<string, { x: number; y: number; angleDeg: number }> = {
  'sat-1': { x: 500, y: 75, angleDeg: 0 },    // 90° Zenith (Overhead Peak)
  'sat-2': { x: 760, y: 190, angleDeg: 55 },  // Ascending on Right (35.4° El)
  'sat-3': { x: 180, y: 310, angleDeg: -65 }  // Descending on Left (11.2° El, setting)
};

export const SkyHorizonView: React.FC<SkyHorizonViewProps> = ({
  satellites,
  groundStation,
  activeSatelliteId = 'sat-1',
  onSelectSatellite
}) => {
  // Live simulation tick for downlinking progress
  const [transferredGb, setTransferredGb] = useState<number>(groundStation.transferredGb);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const activeSat = satellites.find((s) => s.id === activeSatelliteId) || satellites[0];
  const targetGb = activeSat?.passDataVolumeGb || 38.4;
  const progressPercent = Math.min(100, Math.round((transferredGb / targetGb) * 100));

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTransferredGb((prev) => {
        if (prev >= targetGb) return 22.8; // loop simulation
        return parseFloat((prev + 0.15).toFixed(2));
      });
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying, targetGb]);

  // Find individual satellites
  const sat1 = satellites.find((s) => s.id === 'sat-1') || satellites[0]; // Zenith (Center)
  const sat2 = satellites.find((s) => s.id === 'sat-2') || satellites[1]; // Ascending on Right
  const sat3 = satellites.find((s) => s.id === 'sat-3') || satellites[2]; // Descending on Left

  // Dynamic beam coordinates based on active satellite
  const currentPos = SAT_POSITIONS[activeSatelliteId || 'sat-1'] || SAT_POSITIONS['sat-1'];
  const dishAngleDeg = currentPos.angleDeg;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Top Banner: Station Registry & Status Bar */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
            <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base tracking-wide text-white">
                {groundStation.name}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE PASS TRACKING
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {groundStation.location} · Lat {groundStation.coordinates} · Mask: {groundStation.elevationMaskDeg}° · Dish: {groundStation.dishDiameterM}m Parabolic
            </p>
          </div>
        </div>

        {/* Live Downlink Metric Strip */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">Current Target:</span>{' '}
            <strong className="text-sky-300">{activeSat.name}</strong>
          </div>
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 hidden sm:block">
            <span className="text-slate-400">Rate:</span>{' '}
            <strong className="text-emerald-400">{groundStation.currentBitrateMbps} Mbps</strong>
            <span className="text-[10px] text-slate-400 ml-1">(DVB-S2X ACM)</span>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-sans text-xs font-medium transition cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause Sim' : 'Resume Sim'}
          </button>
        </div>
      </div>

      {/* Main 180° Sky Dome Canvas Area */}
      <div className="relative p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-sky-50/40 via-white to-slate-50 border-b border-slate-200 overflow-hidden">
        
        {/* Sky Background Grid & Horizon Markings */}
        <div className="w-full max-w-5xl mx-auto relative h-[440px] sm:h-[480px]">
          
          {/* SVG 180-Degree Horizon Sky Dome */}
          <svg
            className="w-full h-full absolute inset-0 overflow-visible"
            viewBox="0 0 1000 460"
            preserveAspectRatio="xMidYMax meet"
          >
            <defs>
              {/* Downlink Beam Gradient */}
              <linearGradient id="beamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
              </linearGradient>

              {/* Pulse Animation Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Ground Horizon Base Line */}
            <line
              x1="50"
              y1="410"
              x2="950"
              y2="410"
              stroke="#64748b"
              strokeWidth="2.5"
            />
            {/* 5° Elevation Mask Line */}
            <line
              x1="50"
              y1="390"
              x2="950"
              y2="390"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text x="60" y="384" fill="#94a3b8" fontSize="11" fontFamily="monospace">
              5° Terrain / Elevation Mask Threshold
            </text>

            {/* 180-Degree Sky Horizon Outer Arch (90° Zenith at top) */}
            <path
              d="M 100 410 A 400 370 0 0 1 900 410"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            {/* 60° Elevation Arc */}
            <path
              d="M 230 410 A 270 250 0 0 1 770 410"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="1.5"
            />
            {/* 30° Elevation Arc */}
            <path
              d="M 370 410 A 130 130 0 0 1 630 410"
              fill="none"
              stroke="#f8fafc"
              strokeWidth="1.5"
            />

            {/* Trajectory Direction Guide Line across the sky */}
            <path
              d="M 850 360 Q 500 50 150 360"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="1.5"
              strokeDasharray="5 5"
              opacity="0.6"
            />

            {/* ======================================================== */}
            {/* ELEVATION & HORIZON LABELS                               */}
            {/* ASCENT FROM RIGHT (AOS), OVERHEAD (ZENITH), DESCENT TO LEFT (LOS) */}
            {/* ======================================================== */}
            
            {/* LEFT: 0° LOS Horizon (Descending / Setting to West) */}
            <text x="75" y="428" fill="#475569" fontSize="12" fontWeight="bold">
              0° LOS Horizon (Descending / Setting)
            </text>
            <text x="75" y="442" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              Loss of Signal (West Horizon)
            </text>

            {/* CENTER: 90° Zenith (Overhead Peak) */}
            <text x="500" y="30" fill="#0369a1" fontSize="13" fontWeight="bold" textAnchor="middle">
              90° ZENITH (Peak Overhead Elevation)
            </text>
            <text x="500" y="46" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
              Shortest Slant Range (505 km) · Maximum DVB-S2X Bitrate (1,420 Mbps)
            </text>

            {/* RIGHT: 0° AOS Horizon (Ascending / Rising from East) */}
            <text x="925" y="428" fill="#475569" fontSize="12" fontWeight="bold" textAnchor="end">
              0° AOS Horizon (Ascending / Rising)
            </text>
            <text x="925" y="442" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">
              Acquisition of Signal (East Horizon)
            </text>

            {/* ======================================================== */}
            {/* DYNAMIC RF DOWNLINK BEAM (Points from Dish to Active Sat) */}
            {/* ======================================================== */}
            <g>
              {/* Dynamic RF Beam Line */}
              <line
                x1="500"
                y1="365"
                x2={currentPos.x}
                y2={currentPos.y}
                stroke="#0284c7"
                strokeWidth="3"
                filter="url(#glow)"
              />
              {/* Conical RF Energy Shroud */}
              <line
                x1="500"
                y1="365"
                x2={currentPos.x}
                y2={currentPos.y}
                stroke="#38bdf8"
                strokeWidth="8"
                strokeOpacity="0.25"
              />

              {/* Animated Data Pulses Traveling Along the Exact Line */}
              <circle
                cx={500 + (currentPos.x - 500) * 0.25}
                cy={365 + (currentPos.y - 365) * 0.25}
                r="4.5"
                fill="#38bdf8"
              >
                <animate
                  attributeName="cx"
                  values={`${currentPos.x};${500}`}
                  dur="1.2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${currentPos.y};${365}`}
                  dur="1.2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="1;0.7;0.1"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={500 + (currentPos.x - 500) * 0.65}
                cy={365 + (currentPos.y - 365) * 0.65}
                r="4"
                fill="#0284c7"
              >
                <animate
                  attributeName="cx"
                  values={`${currentPos.x};${500}`}
                  dur="1.2s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${currentPos.y};${365}`}
                  dur="1.2s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="1;0.7;0.1"
                  dur="1.2s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>

            {/* ======================================================== */}
            {/* THE PARABOLIC GROUND ANTENNA DISH (Center Bottom at 500,400) */}
            {/* ======================================================== */}
            <g transform="translate(500, 400)">
              {/* Pedestal Concrete Base */}
              <rect x="-35" y="0" width="70" height="15" fill="#475569" rx="3" />
              <rect x="-25" y="-12" width="50" height="14" fill="#64748b" rx="2" />

              {/* Azimuth Turntable Ring */}
              <ellipse cx="0" cy="-12" rx="28" ry="6" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Tilting Dish Sub-Assembly (Rotates smoothly to point directly at active satellite) */}
              <g
                transform={`rotate(${dishAngleDeg}, 0, -25)`}
                className="transition-transform duration-700 ease-out"
              >
                {/* Elevation Yoke Support Arms */}
                <path d="M -16 -12 L -10 -26 L 10 -26 L 16 -12 Z" fill="#64748b" />

                {/* Parabolic Dish Back Structure & Truss */}
                <ellipse cx="0" cy="-35" rx="42" ry="14" fill="#0f172a" />
                {/* Parabolic Dish Main Reflector Bowl */}
                <ellipse cx="0" cy="-36" rx="40" ry="12" fill="#e2e8f0" stroke="#0284c7" strokeWidth="2.5" />
                <ellipse cx="0" cy="-36" rx="32" ry="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

                {/* Feed Horn Struts (Tripod) */}
                <line x1="-32" y1="-36" x2="0" y2="-58" stroke="#475569" strokeWidth="2" />
                <line x1="32" y1="-36" x2="0" y2="-58" stroke="#475569" strokeWidth="2" />
                <line x1="0" y1="-44" x2="0" y2="-58" stroke="#475569" strokeWidth="2" />

                {/* Sub-Reflector Feed Horn at Prime Focus */}
                <circle cx="0" cy="-58" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="0" cy="-58" r="8" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
              </g>

              {/* Antenna Label */}
              <text x="0" y="30" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">
                7.3m S-Band/X-Band Dish (SVA-1)
              </text>
            </g>

            {/* ======================================================== */}
            {/* SATELLITE 1: ZENITH PEAK (Center Top at 500, 75)        */}
            {/* ======================================================== */}
            <g
              transform="translate(500, 75)"
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectSatellite?.('sat-1')}
            >
              {/* Glowing Pulse Ring if connected */}
              {activeSatelliteId === 'sat-1' && (
                <circle cx="0" cy="0" r="26" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.7">
                  <animate attributeName="r" values="18;32;18" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Solar Panels (Left & Right Wings) */}
              <rect x="-30" y="-8" width="16" height="16" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" rx="1" />
              <line x1="-22" y1="-8" x2="-22" y2="8" stroke="#38bdf8" strokeWidth="1" />
              <rect x="14" y="-8" width="16" height="16" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" rx="1" />
              <line x1="22" y1="-8" x2="22" y2="8" stroke="#38bdf8" strokeWidth="1" />

              {/* Central Satellite Body */}
              <rect x="-10" y="-12" width="20" height="24" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" rx="2" />
              {/* Camera Lens Aperture */}
              <circle cx="0" cy="2" r="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              {/* Antenna Boom */}
              <line x1="0" y1="12" x2="0" y2="18" stroke="#64748b" strokeWidth="1.5" />

              {/* Tag Label */}
              <rect x="-44" y="22" width="88" height="18" fill="#ffffff" stroke="#cbd5e1" rx="4" filter="url(#glow)" />
              <text x="0" y="34" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">
                1. SuperDove-21
              </text>
            </g>

            {/* ======================================================== */}
            {/* SATELLITE 2: IN-PASS ON RIGHT (Ascending Track at 760, 190) */}
            {/* ======================================================== */}
            <g
              transform="translate(760, 190)"
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectSatellite?.('sat-2')}
            >
              {/* Glowing Pulse Ring if connected */}
              {activeSatelliteId === 'sat-2' && (
                <circle cx="0" cy="0" r="26" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.7">
                  <animate attributeName="r" values="18;32;18" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Ascent Vector Arrow (Rising from right towards zenith) */}
              <line x1="16" y1="16" x2="-8" y2="-8" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
              <polyline points="-4,-10 -10,-8 -8,-2" fill="none" stroke="#0284c7" strokeWidth="1.5" />

              {/* Solar Panels */}
              <rect x="-26" y="-7" width="14" height="14" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" rx="1" />
              <rect x="12" y="-7" width="14" height="14" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" rx="1" />
              {/* Body */}
              <rect x="-9" y="-10" width="18" height="20" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" rx="2" />
              <circle cx="0" cy="1" r="4" fill="#0284c7" />

              {/* Tag Label */}
              <rect x="-65" y="20" width="130" height="20" fill="#ffffff" stroke="#bae6fd" rx="4" />
              <text x="0" y="34" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">
                2. Pelican (86% Memory Risk)
              </text>
            </g>

            {/* ======================================================== */}
            {/* SATELLITE 3: SETTING ON LEFT (Near 0° LOS Horizon at 180, 310) */}
            {/* ======================================================== */}
            <g
              transform="translate(180, 310)"
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectSatellite?.('sat-3')}
            >
              {/* Glowing Pulse Ring if connected */}
              {activeSatelliteId === 'sat-3' && (
                <circle cx="0" cy="0" r="26" fill="none" stroke="#d97706" strokeWidth="2" opacity="0.7">
                  <animate attributeName="r" values="18;32;18" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Descent Vector Arrow (Setting to the left towards horizon) */}
              <line x1="8" y1="-8" x2="-16" y2="16" stroke="#d97706" strokeWidth="2" strokeDasharray="3 3" />
              <polyline points="-12,18 -18,16 -16,10" fill="none" stroke="#d97706" strokeWidth="1.5" />

              {/* Solar Panels */}
              <rect x="-24" y="-6" width="12" height="12" fill="#1e293b" stroke="#d97706" strokeWidth="1.5" rx="1" />
              <rect x="12" y="-6" width="12" height="12" fill="#1e293b" stroke="#d97706" strokeWidth="1.5" rx="1" />
              {/* Body */}
              <rect x="-8" y="-9" width="16" height="18" fill="#fef3c7" stroke="#d97706" strokeWidth="2" rx="2" />
              <circle cx="0" cy="1" r="3.5" fill="#d97706" />

              {/* Tag Label */}
              <rect x="-55" y="20" width="110" height="20" fill="#ffffff" stroke="#fde68a" rx="4" />
              <text x="0" y="34" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="bold">
                3. SkySat (55s to LOS!)
              </text>
            </g>
          </svg>

          {/* Dotted Line Transfer Bar Overlay for the active satellite */}
          {activeSat && (
            <div className="absolute top-2 sm:top-6 right-2 sm:right-6 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 shadow-md max-w-xs text-xs font-sans">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                  Active Downlink Stream
                </span>
                <span className="font-mono text-sky-700 font-bold">{progressPercent}%</span>
              </div>

              {/* Data Volumes Counter */}
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-slate-500">Transferred:</span>
                <span className="font-mono font-bold text-slate-900">
                  {transferredGb.toFixed(1)} GB / {targetGb} GB
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-sky-600 rounded-full transition-all duration-300 relative overflow-hidden"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                </div>
              </div>

              {/* Remaining volume note */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                <span>Remaining: <strong className="text-slate-700">{(targetGb - transferredGb).toFixed(1)} GB</strong></span>
                <span className="text-emerald-600 font-semibold">1,420 Mbps</span>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 3 SATELLITE SQUARE DIALOGUE CARDS BESIDE EACH POSITION   */}
        {/* ======================================================== */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              Visible Satellite Telemetry Cards (Square Dialogue Inspectors)
            </h3>
            <span className="text-xs text-slate-600 font-mono">
              3 Spacecraft in Contention · Select any card to evaluate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Zenith Peak (Center Top - Currently Connected) */}
            <div
              className={`cursor-pointer transition-all ${
                activeSatelliteId === 'sat-1' ? 'scale-[1.02]' : 'hover:opacity-95'
              }`}
              onClick={() => onSelectSatellite?.('sat-1')}
            >
              <SatelliteInfoCard
                satellite={sat1}
                isConnected={activeSatelliteId === 'sat-1'}
                transferredGb={activeSatelliteId === 'sat-1' ? transferredGb : undefined}
                positionLabel="Zenith Peak (Connected)"
              />
            </div>

            {/* Card 2: In Pass on Right (86% Memory Risk Climbing!) */}
            <div
              className={`cursor-pointer transition-all ${
                activeSatelliteId === 'sat-2' ? 'scale-[1.02]' : 'hover:opacity-95'
              }`}
              onClick={() => onSelectSatellite?.('sat-2')}
            >
              <SatelliteInfoCard
                satellite={sat2}
                isConnected={activeSatelliteId === 'sat-2'}
                transferredGb={activeSatelliteId === 'sat-2' ? transferredGb : undefined}
                positionLabel="Ascending on Right (86% Risk)"
              />
            </div>

            {/* Card 3: Setting on Left Horizon (Low El, 55s left) */}
            <div
              className={`cursor-pointer transition-all ${
                activeSatelliteId === 'sat-3' ? 'scale-[1.02]' : 'hover:opacity-95'
              }`}
              onClick={() => onSelectSatellite?.('sat-3')}
            >
              <SatelliteInfoCard
                satellite={sat3}
                isConnected={activeSatelliteId === 'sat-3'}
                transferredGb={activeSatelliteId === 'sat-3' ? transferredGb : undefined}
                positionLabel="Setting on Left (55s to LOS)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
