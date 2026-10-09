import React, { useState, useEffect } from 'react';
import { Satellite, GroundStation } from '../types';
import { 
  Radio, 
  Play, 
  Pause, 
  HardDrive, 
  Clock, 
  Compass, 
  Flame, 
  Eye, 
  Leaf, 
  AlertTriangle,
  Zap,
  BookmarkCheck,
  CheckCircle2
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
                LIVE PASS TRACKING
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {groundStation.location} · Lat {groundStation.coordinates} · Elevation Mask: {groundStation.elevationMaskDeg}° · Dish: {groundStation.dishDiameterM}m Parabolic
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
      <div className="relative p-3 sm:p-5 lg:p-6 bg-gradient-to-b from-sky-50/50 via-white to-slate-50 border-b border-slate-200 overflow-hidden">
        
        {/* Sky Background Grid & Horizon Container */}
        <div className="w-full max-w-6xl mx-auto relative h-[600px] sm:h-[620px]">
          
          {/* SVG 180-Degree Horizon Sky Dome */}
          <svg
            className="w-full h-full absolute inset-0 overflow-visible"
            viewBox="0 0 1000 520"
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
              x1="40"
              y1="470"
              x2="960"
              y2="470"
              stroke="#64748b"
              strokeWidth="2.5"
            />
            {/* 5° Elevation Mask Line */}
            <line
              x1="40"
              y1="450"
              x2="960"
              y2="450"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text x="50" y="444" fill="#94a3b8" fontSize="11" fontFamily="monospace">
              5° Terrain / Elevation Mask Threshold
            </text>

            {/* 180-Degree Sky Horizon Outer Arch (90° Zenith at top) */}
            <path
              d="M 80 470 A 420 390 0 0 1 920 470"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            {/* 60° Elevation Arc */}
            <path
              d="M 210 470 A 290 270 0 0 1 790 470"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="1.5"
            />
            {/* 30° Elevation Arc */}
            <path
              d="M 350 470 A 150 150 0 0 1 650 470"
              fill="none"
              stroke="#f8fafc"
              strokeWidth="1.5"
            />

            {/* Horizon Left: AOS 0° */}
            <text x="60" y="488" fill="#475569" fontSize="12" fontWeight="bold">
              0° AOS Horizon (North)
            </text>
            <text x="60" y="502" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              Ascending Horizon
            </text>

            {/* Zenith Center: 90° Zenith */}
            <text x="500" y="26" fill="#0369a1" fontSize="13" fontWeight="bold" textAnchor="middle">
              90° ZENITH (Peak Overhead)
            </text>
            <text x="500" y="40" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
              Shortest Distance (505 km) · Maximum Speed (1,420 Mbps)
            </text>

            {/* Horizon Right: LOS 0° */}
            <text x="940" y="488" fill="#475569" fontSize="12" fontWeight="bold" textAnchor="end">
              0° LOS Horizon (South)
            </text>
            <text x="940" y="502" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">
              Descending Horizon
            </text>

            {/* Active RF Downlink Beam (Center Dish to Sat 1) */}
            {activeSatelliteId === 'sat-1' && (
              <g>
                <polygon
                  points="496,440 504,440 508,90 492,90"
                  fill="url(#beamGradient)"
                  opacity="0.35"
                />
                <line
                  x1="500"
                  y1="440"
                  x2="500"
                  y2="90"
                  stroke="#0284c7"
                  strokeWidth="3"
                  filter="url(#glow)"
                />
                {/* Flowing Data Pulses */}
                <circle cx="500" cy="160" r="4" fill="#38bdf8">
                  <animate attributeName="cy" from="90" to="430" dur="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.8;0.2" dur="1.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="500" cy="260" r="4.5" fill="#0284c7">
                  <animate attributeName="cy" from="90" to="430" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.8;0.2" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="500" cy="350" r="4" fill="#38bdf8">
                  <animate attributeName="cy" from="90" to="430" dur="1.2s" begin="0.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.8;0.2" dur="1.2s" begin="0.8s" repeatCount="indefinite" />
                </circle>
              </g>
            )}

            {/* Slew Arc Line from Center to Sat 2 when selected */}
            {activeSatelliteId === 'sat-2' && (
              <line
                x1="500"
                y1="440"
                x2="850"
                y2="310"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
            )}

            {/* Slew Arc Line from Center to Sat 3 when selected */}
            {activeSatelliteId === 'sat-3' && (
              <line
                x1="500"
                y1="440"
                x2="150"
                y2="330"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
            )}

            {/* ======================================================== */}
            {/* SVG LEADER CONNECTOR LINES (Satellite -> Dialogue Box)    */}
            {/* ======================================================== */}
            {/* Sat 3 Leader Line (Left, from 150,330 to callout at 180,260) */}
            <g stroke="#ef4444" strokeWidth="1.5" opacity="0.75">
              <line x1="150" y1="310" x2="185" y2="250" />
              <line x1="185" y1="250" x2="215" y2="250" />
              <circle cx="150" cy="310" r="3" fill="#ef4444" />
            </g>

            {/* Sat 1 Leader Line (Zenith, from 500,75 to callout at 550,60) */}
            <g stroke="#0284c7" strokeWidth="1.5" opacity="0.75">
              <line x1="520" y1="75" x2="560" y2="60" />
              <line x1="560" y1="60" x2="585" y2="60" />
              <circle cx="520" cy="75" r="3" fill="#0284c7" />
            </g>

            {/* Sat 2 Leader Line (Right, from 850,300 to callout at 790,240) */}
            <g stroke="#0284c7" strokeWidth="1.5" opacity="0.75">
              <line x1="850" y1="285" x2="805" y2="235" />
              <line x1="805" y1="235" x2="775" y2="235" />
              <circle cx="850" cy="285" r="3" fill="#0284c7" />
            </g>

            {/* ======================================================== */}
            {/* THE PARABOLIC GROUND ANTENNA DISH (Center Bottom at 500,460) */}
            {/* ======================================================== */}
            <g transform="translate(500, 460)">
              {/* Pedestal Concrete Base */}
              <rect x="-35" y="0" width="70" height="15" fill="#475569" rx="3" />
              <rect x="-25" y="-12" width="50" height="14" fill="#64748b" rx="2" />

              {/* Azimuth Turntable Ring */}
              <ellipse cx="0" cy="-12" rx="28" ry="6" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Tilting Dish Assembly */}
              <g transform={`rotate(${dishRotation}, 0, -20)`} className="transition-transform duration-700 ease-out">
                {/* Elevation Yoke Support Arms */}
                <path d="M -16 -12 L -10 -26 L 10 -26 L 16 -12 Z" fill="#64748b" />

                {/* Parabolic Dish Back Structure */}
                <ellipse cx="0" cy="-35" rx="42" ry="14" fill="#0f172a" />
                <ellipse cx="0" cy="-36" rx="40" ry="12" fill="#e2e8f0" stroke="#0284c7" strokeWidth="2.5" />
                <ellipse cx="0" cy="-36" rx="32" ry="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

                {/* Feed Horn Struts */}
                <line x1="-32" y1="-36" x2="0" y2="-58" stroke="#475569" strokeWidth="2" />
                <line x1="32" y1="-36" x2="0" y2="-58" stroke="#475569" strokeWidth="2" />
                <line x1="0" y1="-44" x2="0" y2="-58" stroke="#475569" strokeWidth="2" />

                {/* Sub-Reflector Feed Horn */}
                <circle cx="0" cy="-58" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
              </g>

              {/* Antenna Label */}
              <text x="0" y="30" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">
                7.3m S/X-Band Parabolic Dish (SVA-1)
              </text>
            </g>

            {/* SATELLITE 1 ICON (Zenith Peak - Top Center at 500, 75) */}
            <g
              transform="translate(500, 75)"
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectSatellite?.('sat-1')}
            >
              {activeSatelliteId === 'sat-1' && (
                <circle cx="0" cy="0" r="24" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.6">
                  <animate attributeName="r" values="18;32;18" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Solar Panels */}
              <rect x="-30" y="-8" width="16" height="16" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" rx="1" />
              <line x1="-22" y1="-8" x2="-22" y2="8" stroke="#38bdf8" strokeWidth="1" />
              <rect x="14" y="-8" width="16" height="16" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" rx="1" />
              <line x1="22" y1="-8" x2="22" y2="8" stroke="#38bdf8" strokeWidth="1" />
              {/* Central Satellite Body */}
              <rect x="-10" y="-12" width="20" height="24" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" rx="2" />
              <circle cx="0" cy="2" r="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <line x1="0" y1="12" x2="0" y2="18" stroke="#64748b" strokeWidth="1.5" />
            </g>

            {/* SATELLITE 2 ICON (Descending Near LOS - Right Horizon at 850, 300) */}
            <g
              transform="translate(850, 300)"
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectSatellite?.('sat-2')}
            >
              <line x1="0" y1="-15" x2="18" y2="18" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
              <rect x="-26" y="-7" width="14" height="14" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" rx="1" />
              <rect x="12" y="-7" width="14" height="14" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" rx="1" />
              <rect x="-9" y="-10" width="18" height="20" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" rx="2" />
              <circle cx="0" cy="1" r="4" fill="#0284c7" />
            </g>

            {/* SATELLITE 3 ICON (Ascending Near AOS - Left Horizon at 150, 320) */}
            <g
              transform="translate(150, 320)"
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectSatellite?.('sat-3')}
            >
              <line x1="-15" y1="18" x2="8" y2="-12" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
              <rect x="-26" y="-7" width="14" height="14" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" rx="1" />
              <rect x="12" y="-7" width="14" height="14" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" rx="1" />
              <rect x="-9" y="-10" width="18" height="20" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" rx="2" />
              <circle cx="0" cy="1" r="4" fill="#ef4444" />
            </g>
          </svg>

          {/* ======================================================== */}
          {/* 3 CONCISE CONNECTED DIALOGUE BOXES BESIDE EACH SATELLITE */}
          {/* ======================================================== */}
          
          {/* 1. DIALOGUE BOX FOR SATELLITE 3 (Left · Rising AOS) */}
          <div 
            onClick={() => onSelectSatellite?.('sat-3')}
            className={`absolute top-[28%] sm:top-[30%] left-[16%] sm:left-[21%] w-60 sm:w-68 bg-white/95 backdrop-blur-md rounded-xl p-3 border shadow-md transition-all cursor-pointer ${
              activeSatelliteId === 'sat-3' 
                ? 'border-red-400 ring-2 ring-red-200 shadow-red-100 scale-105' 
                : 'border-red-200 hover:border-red-300'
            }`}
          >
            {/* Header: Name + Priority */}
            <div className="flex items-center justify-between pb-1.5 border-b border-red-100">
              <div className="font-bold text-xs text-slate-900 truncate">
                3. SkySat-C14
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 text-red-600" />
                P1 (Highest)
              </span>
            </div>

            {/* Mission & Clock */}
            <div className="mt-1.5 space-y-1 text-[11px]">
              <div className="text-red-950 font-semibold truncate">
                Active Wildfire Front
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-600 font-mono">
                <span>12° AOS (Rising)</span>
                <span className="text-emerald-700 font-bold">11m 00s remaining</span>
              </div>
            </div>

            {/* Storage Line */}
            <div className="mt-2 pt-1.5 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] mb-1 text-slate-600 font-mono">
                <span>Memory:</span>
                <strong className="text-slate-800">420/512 GB (82%)</strong>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            {/* Payload Note */}
            <div className="mt-1.5 text-[10px] text-slate-500 truncate">
              Payload: <strong className="text-slate-700">58.0 GB</strong> · High-Res Stereo
            </div>
          </div>

          {/* 2. DIALOGUE BOX FOR SATELLITE 1 (Center · Zenith Overhead) */}
          <div 
            onClick={() => onSelectSatellite?.('sat-1')}
            className={`absolute top-[4%] sm:top-[6%] left-[53%] sm:left-[57%] w-60 sm:w-68 bg-white/95 backdrop-blur-md rounded-xl p-3 border shadow-md transition-all cursor-pointer ${
              activeSatelliteId === 'sat-1' 
                ? 'border-sky-400 ring-2 ring-sky-200 shadow-sky-100 scale-105' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Header: Name + Priority */}
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <div className="font-bold text-xs text-slate-900 truncate">
                1. SuperDove-21
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                <Leaf className="w-2.5 h-2.5 text-slate-500" />
                P3 (Routine)
              </span>
            </div>

            {/* Mission & Clock */}
            <div className="mt-1.5 space-y-1 text-[11px]">
              <div className="text-slate-800 font-semibold truncate flex items-center justify-between">
                <span>Daily Surface Survey</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  DOWNLINKING
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-600 font-mono">
                <span>78.5° Zenith Peak</span>
                <span className="text-sky-700 font-bold">1,420 Mbps Rate</span>
              </div>
            </div>

            {/* Storage Line */}
            <div className="mt-2 pt-1.5 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] mb-1 text-slate-600 font-mono">
                <span>Memory (Critical!):</span>
                <strong className="text-red-700">238/256 GB (93%)</strong>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '93%' }} />
              </div>
            </div>

            {/* Downlink Progress */}
            <div className="mt-1.5 text-[10px] text-emerald-700 font-mono font-medium flex items-center justify-between">
              <span>Sent: <strong>{transferredGb.toFixed(1)} / 38.4 GB</strong></span>
              <span>Rem: <strong>{(38.4 - transferredGb).toFixed(1)} GB</strong></span>
            </div>
          </div>

          {/* 3. DIALOGUE BOX FOR SATELLITE 2 (Right · Setting LOS) */}
          <div 
            onClick={() => onSelectSatellite?.('sat-2')}
            className={`absolute top-[26%] sm:top-[28%] right-[22%] sm:right-[26%] w-60 sm:w-68 bg-white/95 backdrop-blur-md rounded-xl p-3 border shadow-md transition-all cursor-pointer ${
              activeSatelliteId === 'sat-2' 
                ? 'border-sky-400 ring-2 ring-sky-200 shadow-sky-100 scale-105' 
                : 'border-sky-200 hover:border-sky-300'
            }`}
          >
            {/* Header: Name + Priority */}
            <div className="flex items-center justify-between pb-1.5 border-b border-sky-100">
              <div className="font-bold text-xs text-slate-900 truncate">
                2. Pelican-01
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1">
                <Eye className="w-2.5 h-2.5 text-sky-600" />
                P2 (Expiring!)
              </span>
            </div>

            {/* Mission & Clock */}
            <div className="mt-1.5 space-y-1 text-[11px]">
              <div className="text-slate-800 font-semibold truncate">
                Tactical Port Security
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-600 font-mono">
                <span>22.4° LOS (Setting)</span>
                <span className="text-amber-700 font-bold flex items-center gap-0.5">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  3m 30s left!
                </span>
              </div>
            </div>

            {/* Storage Line */}
            <div className="mt-2 pt-1.5 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] mb-1 text-slate-600 font-mono">
                <span>Memory:</span>
                <strong className="text-slate-800">310/512 GB (60%)</strong>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            {/* Payload Note */}
            <div className="mt-1.5 text-[10px] text-slate-500 truncate">
              Payload: <strong className="text-slate-700">42.0 GB</strong> · 30cm HD Video
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
