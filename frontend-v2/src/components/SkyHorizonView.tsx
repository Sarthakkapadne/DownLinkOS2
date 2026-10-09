import React, { useState, useEffect } from 'react';
import { Satellite, GroundStation } from '../types';
import { SatelliteInfoCard } from './SatelliteInfoCard';
import { 
  Radio, 
  Play, 
  Pause,
  Compass,
  Flame,
  Eye,
  Leaf
} from 'lucide-react';

interface SkyHorizonViewProps {
  satellites: Satellite[];
  groundStation: GroundStation;
  activeSatelliteId: string | null;
  onSelectSatellite?: (satId: string) => void;
}

export const SkyHorizonView: React.FC<SkyHorizonViewProps> = ({
  satellites,
  groundStation,
  activeSatelliteId = 'sat-1',
  onSelectSatellite
}) => {
  // Live simulation tick for the downlinking progress
  const [transferredGb, setTransferredGb] = useState<number>(groundStation.transferredGb);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const activeSat = satellites.find((s) => s.id === activeSatelliteId) || satellites[0];
  const targetGb = activeSat?.passDataVolumeGb || 38.4;

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

  // Dish rotation calculation:
  // Sat 1 at center (0 deg vertical), Sat 3 left (-52 deg), Sat 2 right (+52 deg)
  const getDishAngleDeg = () => {
    if (activeSatelliteId === 'sat-1') return 0;
    if (activeSatelliteId === 'sat-3') return -52;
    if (activeSatelliteId === 'sat-2') return 52;
    return 0;
  };

  const dishRotation = getDishAngleDeg();

  const sat3 = satellites.find((s) => s.id === 'sat-3') || satellites[2]; // Ascending (Left)
  const sat1 = satellites.find((s) => s.id === 'sat-1') || satellites[0]; // Zenith (Center)
  const sat2 = satellites.find((s) => s.id === 'sat-2') || satellites[1]; // Descending (Right)

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
                LIVE 180° PASS HORIZON
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {groundStation.location} &bull; Lat {groundStation.coordinates} &bull; Elevation Mask: {groundStation.elevationMaskDeg}° &bull; Dish: {groundStation.dishDiameterM}m Parabolic
            </p>
          </div>
        </div>

        {/* Live Downlink Metric Strip & Simulation Control */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">Target:</span>{' '}
            <strong className="text-sky-300">{activeSat.name.split('-')[0]}</strong>
          </div>
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 hidden sm:block">
            <span className="text-slate-400">DVB-S2X Rate:</span>{' '}
            <strong className="text-emerald-400">
              {activeSatelliteId === 'sat-1' ? '1,420 Mbps' : activeSatelliteId === 'sat-2' ? '420 Mbps' : '280 Mbps'}
            </strong>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-sans text-xs font-medium transition cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Satellite Switcher Bar (visible below lg) */}
      <div className="lg:hidden bg-slate-100 border-b border-slate-200 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex-shrink-0">
          Focus Satellite:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectSatellite?.('sat-3')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              activeSatelliteId === 'sat-3'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Flame className="w-3 h-3" />
            3. SkySat (P1)
          </button>
          <button
            onClick={() => onSelectSatellite?.('sat-1')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              activeSatelliteId === 'sat-1'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Leaf className="w-3 h-3" />
            1. SuperDove (P3 Active)
          </button>
          <button
            onClick={() => onSelectSatellite?.('sat-2')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              activeSatelliteId === 'sat-2'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            2. Pelican (P2 Expiring)
          </button>
        </div>
      </div>

      {/* Main 180° Sky Dome Canvas Area */}
      <div className="relative p-2 sm:p-4 bg-gradient-to-b from-sky-50/70 via-white to-slate-50 border-b border-slate-200 overflow-hidden">
        
        {/* Sky Container with 740px Height for Spacious Non-Overlapping Dialogue Cards */}
        <div className="w-full max-w-7xl mx-auto relative h-[720px] lg:h-[750px]">
          
          {/* SVG 180-Degree Horizon Sky Dome */}
          <svg
            className="w-full h-full absolute inset-0 overflow-visible pointer-events-none"
            viewBox="0 0 1200 680"
            preserveAspectRatio="xMidYMax meet"
          >
            <defs>
              {/* Downlink Beam Gradient */}
              <linearGradient id="beamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
              </linearGradient>

              {/* Pulse Animation Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Ground Horizon Base Line at Y = 570 */}
            <line
              x1="40"
              y1="570"
              x2="1160"
              y2="570"
              stroke="#475569"
              strokeWidth="2.5"
            />
            {/* 5° Elevation Mask Line at Y = 545 */}
            <line
              x1="40"
              y1="545"
              x2="1160"
              y2="545"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text x="50" y="538" fill="#94a3b8" fontSize="11" fontFamily="monospace">
              5° Terrain / Elevation Mask Cutoff Threshold
            </text>

            {/* 180-Degree Sky Horizon Outer Arch (Apex at 600, 260) */}
            <path
              d="M 100 570 A 500 310 0 0 1 1100 570"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            {/* 60° Elevation Arc */}
            <path
              d="M 260 570 A 340 210 0 0 1 940 570"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="1.5"
            />
            {/* 30° Elevation Arc */}
            <path
              d="M 420 570 A 180 110 0 0 1 780 570"
              fill="none"
              stroke="#f8fafc"
              strokeWidth="1.5"
            />

            {/* Horizon Left: AOS 0° */}
            <text x="60" y="592" fill="#334155" fontSize="12" fontWeight="bold">
              0° AOS Horizon (North)
            </text>
            <text x="60" y="608" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              Ascending Pass Ingress
            </text>

            {/* Horizon Right: LOS 0° */}
            <text x="1140" y="592" fill="#334155" fontSize="12" fontWeight="bold" textAnchor="end">
              0° LOS Horizon (South)
            </text>
            <text x="1140" y="608" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">
              Descending Pass Egress
            </text>

            {/* ======================================================== */}
            {/* ACTIVE RF DOWNLINK BEAM (Center Dish to Sat 1 Zenith)     */}
            {/* ======================================================== */}
            {activeSatelliteId === 'sat-1' && (
              <g>
                {/* Translucent RF Cone */}
                <polygon
                  points="596,550 604,550 610,268 590,268"
                  fill="url(#beamGradient)"
                  opacity="0.4"
                />
                {/* Core Carrier Beam Line */}
                <line
                  x1="600"
                  y1="550"
                  x2="600"
                  y2="268"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  filter="url(#glow)"
                />
                {/* Flowing Data Pulses Downward */}
                <circle cx="600" cy="320" r="4.5" fill="#38bdf8">
                  <animate attributeName="cy" from="268" to="545" dur="1.1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.9;0.1" dur="1.1s" repeatCount="indefinite" />
                </circle>
                <circle cx="600" cy="400" r="5" fill="#0284c7">
                  <animate attributeName="cy" from="268" to="545" dur="1.1s" begin="0.35s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.9;0.1" dur="1.1s" begin="0.35s" repeatCount="indefinite" />
                </circle>
                <circle cx="600" cy="480" r="4.5" fill="#38bdf8">
                  <animate attributeName="cy" from="268" to="545" dur="1.1s" begin="0.7s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.9;0.1" dur="1.1s" begin="0.7s" repeatCount="indefinite" />
                </circle>
              </g>
            )}

            {/* Slew Arc Line from Dish to Sat 2 when selected */}
            {activeSatelliteId === 'sat-2' && (
              <line
                x1="600"
                y1="550"
                x2="1010"
                y2="420"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
            )}

            {/* Slew Arc Line from Dish to Sat 3 when selected */}
            {activeSatelliteId === 'sat-3' && (
              <line
                x1="600"
                y1="550"
                x2="190"
                y2="420"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
            )}

            {/* ======================================================== */}
            {/* SVG LEADER LINES CONNECTING CARDS TO SATELLITE ICONS     */}
            {/* ======================================================== */}
            {/* Sat 1 Leader Line: From bottom of Center-Top Card (600, 238) down to Sat 1 (600, 260) */}
            <g stroke="#0284c7" strokeWidth="2" opacity="0.9">
              <line x1="600" y1="236" x2="600" y2="252" />
              <polygon points="600,256 596,248 604,248" fill="#0284c7" />
            </g>

            {/* Sat 3 Leader Line: From bottom of Left Card (190, 340) down to Sat 3 (190, 410) */}
            <g stroke="#ef4444" strokeWidth="2" opacity="0.85">
              <line x1="190" y1="340" x2="190" y2="408" strokeDasharray="3 3" />
              <polygon points="190,412 186,402 194,402" fill="#ef4444" />
            </g>

            {/* Sat 2 Leader Line: From bottom of Right Card (1010, 340) down to Sat 2 (1010, 410) */}
            <g stroke="#0284c7" strokeWidth="2" opacity="0.85">
              <line x1="1010" y1="340" x2="1010" y2="408" strokeDasharray="3 3" />
              <polygon points="1010,412 1006,402 1014,402" fill="#0284c7" />
            </g>

            {/* ======================================================== */}
            {/* THE SVALBARD PARABOLIC GROUND ANTENNA DISH (Center Base) */}
            {/* ======================================================== */}
            <g transform="translate(600, 560)">
              {/* Pedestal Concrete Base */}
              <rect x="-40" y="0" width="80" height="16" fill="#334155" rx="3" />
              <rect x="-28" y="-14" width="56" height="16" fill="#475569" rx="2" />

              {/* Azimuth Turntable Ring */}
              <ellipse cx="0" cy="-14" rx="32" ry="7" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Tilting Dish Assembly */}
              <g transform={`rotate(${dishRotation}, 0, -22)`} className="transition-transform duration-700 ease-out">
                {/* Elevation Yoke Support Arms */}
                <path d="M -18 -14 L -12 -28 L 12 -28 L 18 -14 Z" fill="#64748b" />

                {/* Parabolic Dish Back Structure */}
                <ellipse cx="0" cy="-38" rx="46" ry="16" fill="#0f172a" />
                <ellipse cx="0" cy="-39" rx="44" ry="14" fill="#e2e8f0" stroke="#0284c7" strokeWidth="2.5" />
                <ellipse cx="0" cy="-39" rx="36" ry="9" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

                {/* Feed Horn Struts */}
                <line x1="-34" y1="-39" x2="0" y2="-62" stroke="#475569" strokeWidth="2" />
                <line x1="34" y1="-39" x2="0" y2="-62" stroke="#475569" strokeWidth="2" />
                <line x1="0" y1="-48" x2="0" y2="-62" stroke="#475569" strokeWidth="2" />

                {/* Sub-Reflector Feed Horn */}
                <circle cx="0" cy="-62" r="5.5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              </g>

              {/* Antenna Registry Label */}
              <text x="0" y="32" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
                7.3m S/X-Band Parabolic Tracking Dish (SVA-1)
              </text>
            </g>

            {/* ======================================================== */}
            {/* SATELLITE 1 ICON (Zenith Peak - 600, 260)                */}
            {/* ======================================================== */}
            <g
              transform="translate(600, 260)"
              className="cursor-pointer pointer-events-auto"
              onClick={() => onSelectSatellite?.('sat-1')}
            >
              {activeSatelliteId === 'sat-1' && (
                <circle cx="0" cy="0" r="28" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.6">
                  <animate attributeName="r" values="22;36;22" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Solar Panels */}
              <rect x="-32" y="-9" width="18" height="18" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" rx="1.5" />
              <line x1="-23" y1="-9" x2="-23" y2="9" stroke="#38bdf8" strokeWidth="1" />
              <rect x="14" y="-9" width="18" height="18" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" rx="1.5" />
              <line x1="23" y1="-9" x2="23" y2="9" stroke="#38bdf8" strokeWidth="1" />
              {/* Central Satellite Body */}
              <rect x="-11" y="-13" width="22" height="26" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" rx="2" />
              <circle cx="0" cy="2" r="5.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <line x1="0" y1="13" x2="0" y2="20" stroke="#64748b" strokeWidth="2" />
            </g>

            {/* ======================================================== */}
            {/* SATELLITE 2 ICON (Descending Near LOS - Right: 1010, 420)*/}
            {/* ======================================================== */}
            <g
              transform="translate(1010, 420)"
              className="cursor-pointer pointer-events-auto"
              onClick={() => onSelectSatellite?.('sat-2')}
            >
              <line x1="0" y1="-16" x2="20" y2="20" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
              <rect x="-28" y="-8" width="16" height="16" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" rx="1.5" />
              <rect x="12" y="-8" width="16" height="16" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" rx="1.5" />
              <rect x="-10" y="-11" width="20" height="22" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" rx="2" />
              <circle cx="0" cy="1" r="4.5" fill="#0284c7" />
            </g>

            {/* ======================================================== */}
            {/* SATELLITE 3 ICON (Ascending Near AOS - Left: 190, 420)   */}
            {/* ======================================================== */}
            <g
              transform="translate(190, 420)"
              className="cursor-pointer pointer-events-auto"
              onClick={() => onSelectSatellite?.('sat-3')}
            >
              <line x1="-16" y1="20" x2="10" y2="-14" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
              <rect x="-28" y="-8" width="16" height="16" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" rx="1.5" />
              <rect x="12" y="-8" width="16" height="16" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" rx="1.5" />
              <rect x="-10" y="-11" width="20" height="22" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" rx="2" />
              <circle cx="0" cy="1" r="4.5" fill="#ef4444" />
            </g>
          </svg>

          {/* ========================================================================= */}
          {/* 3 FULL-FIDELITY CONNECTED DIALOGUE CARDS (Separate Non-Overlapping Zones)  */}
          {/* ========================================================================= */}
          
          {/* 1. SATELLITE 3 DIALOGUE CARD (Dedicated Left Quadrant) */}
          <div 
            className={`absolute top-4 sm:top-8 left-2 sm:left-4 lg:left-6 z-20 transition-all ${
              activeSatelliteId === 'sat-3' ? 'opacity-100 scale-[1.02]' : 'opacity-95 hover:opacity-100'
            } ${activeSatelliteId !== 'sat-3' ? 'hidden lg:block' : 'block'}`}
          >
            <SatelliteInfoCard
              satellite={sat3}
              isConnected={activeSatelliteId === 'sat-3'}
              transferredGb={activeSatelliteId === 'sat-3' ? transferredGb : undefined}
              positionLabel="12° AOS (Rising North)"
              isHighlighted={activeSatelliteId === 'sat-3'}
              arrowPosition="bottom-center"
              onClick={() => onSelectSatellite?.('sat-3')}
            />
          </div>

          {/* 2. SATELLITE 1 DIALOGUE CARD (Dedicated Center-Top: Cleanly Above Zenith) */}
          <div 
            className={`absolute top-1 sm:top-2 left-1/2 -translate-x-1/2 z-20 transition-all ${
              activeSatelliteId === 'sat-1' ? 'opacity-100 scale-[1.02]' : 'opacity-95 hover:opacity-100'
            } ${activeSatelliteId !== 'sat-1' ? 'hidden lg:block' : 'block'}`}
          >
            <SatelliteInfoCard
              satellite={sat1}
              isConnected={activeSatelliteId === 'sat-1'}
              transferredGb={activeSatelliteId === 'sat-1' ? transferredGb : undefined}
              positionLabel="78.5° Zenith (Overhead Peak)"
              isHighlighted={activeSatelliteId === 'sat-1'}
              arrowPosition="bottom-center"
              onClick={() => onSelectSatellite?.('sat-1')}
            />
          </div>

          {/* 3. SATELLITE 2 DIALOGUE CARD (Dedicated Right Quadrant) */}
          <div 
            className={`absolute top-4 sm:top-8 right-2 sm:right-4 lg:right-6 z-20 transition-all ${
              activeSatelliteId === 'sat-2' ? 'opacity-100 scale-[1.02]' : 'opacity-95 hover:opacity-100'
            } ${activeSatelliteId !== 'sat-2' ? 'hidden lg:block' : 'block'}`}
          >
            <SatelliteInfoCard
              satellite={sat2}
              isConnected={activeSatelliteId === 'sat-2'}
              transferredGb={activeSatelliteId === 'sat-2' ? transferredGb : undefined}
              positionLabel="22.4° LOS (Setting South)"
              isHighlighted={activeSatelliteId === 'sat-2'}
              arrowPosition="bottom-center"
              onClick={() => onSelectSatellite?.('sat-2')}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
