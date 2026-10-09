import React from 'react';
import { Satellite } from '../types';
import { 
  HardDrive, 
  Clock, 
  Compass, 
  Radio, 
  AlertTriangle, 
  Flame, 
  Eye, 
  Leaf,
  Wifi,
  RotateCw,
  Cpu
} from 'lucide-react';

interface SatelliteInfoCardProps {
  satellite: Satellite;
  isConnected: boolean;
  transferredGb?: number;
  isHighlighted?: boolean;
  positionLabel: string;
  arrowPosition?: 'bottom-center' | 'bottom-left' | 'bottom-right' | 'none';
  onClick?: () => void;
}

export const SatelliteInfoCard: React.FC<SatelliteInfoCardProps> = ({
  satellite,
  isConnected,
  transferredGb,
  isHighlighted,
  positionLabel,
  arrowPosition = 'none',
  onClick
}) => {
  const utilizedPercent = Math.round((satellite.ssrUtilizedGb / satellite.ssrCapacityGb) * 100);
  const isBufferCritical = utilizedPercent >= 85;

  // Priority color styling (Lower number = higher priority)
  const getPriorityTheme = (p: number) => {
    switch (p) {
      case 1:
        return {
          badgeBg: 'bg-red-50 text-red-700 border-red-200',
          dotBg: 'bg-red-500',
          cardBorder: isConnected ? 'border-red-400 ring-2 ring-red-100 shadow-red-100' : 'border-red-200/90 hover:border-red-300',
          accent: 'text-red-700',
          arrowBorder: 'border-red-300',
          icon: Flame,
          label: 'PRIORITY 1 (HIGHEST)'
        };
      case 2:
        return {
          badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
          dotBg: 'bg-sky-500',
          cardBorder: isConnected ? 'border-sky-400 ring-2 ring-sky-100 shadow-sky-100' : 'border-sky-200/90 hover:border-sky-300',
          accent: 'text-sky-700',
          arrowBorder: 'border-sky-300',
          icon: Eye,
          label: 'PRIORITY 2 (EXPIRING!)'
        };
      case 3:
      default:
        return {
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dotBg: 'bg-emerald-500',
          cardBorder: isConnected ? 'border-emerald-400 ring-2 ring-emerald-100 shadow-emerald-100' : 'border-slate-200/90 hover:border-slate-300',
          accent: 'text-emerald-700',
          arrowBorder: 'border-emerald-300',
          icon: Leaf,
          label: 'PRIORITY 3 (ROUTINE)'
        };
    }
  };

  const theme = getPriorityTheme(satellite.priority);
  const MissionIcon = theme.icon;

  const currentSentGb = transferredGb ?? (isConnected ? 22.8 : 0);
  const passTargetGb = satellite.passDataVolumeGb;
  const transferPercent = Math.min(100, Math.round((currentSentGb / passTargetGb) * 100));
  const remainingGb = Math.max(0, parseFloat((passTargetGb - currentSentGb).toFixed(1)));

  return (
    <div className="relative">
      <div
        onClick={onClick}
        className={`w-72 sm:w-80 md:w-84 bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border p-3.5 sm:p-4 transition-all duration-300 cursor-pointer ${
          isHighlighted
            ? 'ring-2 ring-amber-400 border-amber-400 shadow-amber-200/50 scale-[1.02]'
            : theme.cardBorder
        } ${isConnected ? 'bg-gradient-to-b from-white via-white to-sky-50/40' : ''}`}
      >
        {/* 1. HEADER: SATELLITE NAME, NORAD ID, CCSDS ADDRESS & PRIORITY BADGE */}
        <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight truncate">
                {satellite.name}
              </span>
            </div>
            
            {/* Real Spacecraft Identifiers */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5 flex-wrap">
              <span className="bg-slate-100 px-1 py-0.2 rounded border border-slate-200 font-semibold text-slate-700">
                NORAD #{satellite.noradId}
              </span>
              <span>SCID: <strong className="text-slate-700">{satellite.scidHex || '0x4A12'}</strong></span>
              <span>&bull;</span>
              <span>{satellite.altitudeKm}km SSO</span>
            </div>
          </div>

          {/* Priority Badge with "(Lower = Higher)" rule explanation */}
          <div className="flex flex-col items-end flex-shrink-0">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 shadow-2xs ${theme.badgeBg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${theme.dotBg}`} />
              {theme.label}
            </span>
            <span className="text-[9px] text-slate-500 mt-0.5 font-medium">
              (Lower # = Higher Urgency)
            </span>
          </div>
        </div>

        {/* 2. OBSERVATION MISSION & PAYLOAD TYPE */}
        <div className="mt-2.5 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-800">
            <MissionIcon className={`w-3.5 h-3.5 flex-shrink-0 ${theme.accent}`} />
            <span className="font-semibold truncate">
              {satellite.targetMission}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 pl-5">
            <span className="truncate">
              Payload: <strong className="text-slate-800">{satellite.dataType}</strong>
            </span>
            <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-700 flex-shrink-0">
              {satellite.passDataVolumeGb} GB
            </span>
          </div>
        </div>

        {/* 3. PASS TIMING, ELEVATION & DISH SLEW TRANSIT */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-1 text-slate-600">
            <Compass className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">
              El: <strong className="text-slate-900">{satellite.position.elevationDeg}°</strong>{' '}
              <span className="text-[10px] text-slate-500 font-mono">({positionLabel})</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-600 justify-end">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className={`font-mono text-xs font-semibold ${
              satellite.window.timeRemainingSec <= 210 && satellite.priority === 2 
                ? 'text-amber-600 animate-pulse' 
                : 'text-slate-800'
            }`}>
              {satellite.window.timeRemainingSec}s left
            </span>
          </div>

          {/* AOS / LOS Timestamps & Dish Slew Angle */}
          <div className="col-span-2 flex items-center justify-between text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
            <span>AOS {satellite.window.aosUtc.split(' ')[0]} &rarr; LOS {satellite.window.losUtc.split(' ')[0]}</span>
            <span className="text-slate-700 flex items-center gap-1 font-semibold">
              <RotateCw className="w-2.5 h-2.5 text-sky-600" />
              {satellite.slewAngleDeg === undefined || satellite.slewAngleDeg === 0 
                ? '0° Zenith Lock' 
                : `${satellite.slewAngleDeg > 0 ? '+' : ''}${satellite.slewAngleDeg}° (${satellite.slewTimeSec ?? 30}s Slew)`}
            </span>
          </div>
        </div>

        {/* 4. ONBOARD SOLID-STATE STORAGE (SSR) - UTILIZED VS FREE "WATER TANK" */}
        <div className="mt-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <div className="flex items-center gap-1 text-slate-700">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium">Onboard Memory (SSR):</span>
            </div>
            <span className="font-mono font-bold text-slate-900">
              {satellite.ssrUtilizedGb} / {satellite.ssrCapacityGb} GB ({utilizedPercent}%)
            </span>
          </div>

          {/* Visual Memory Bar: Utilized vs Free */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
            <div
              className={`h-full transition-all duration-500 ${
                isBufferCritical
                  ? 'bg-red-500 animate-pulse'
                  : utilizedPercent > 70
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${utilizedPercent}%` }}
            />
            <div
              className="h-full bg-slate-200/80"
              style={{ width: `${100 - utilizedPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>Free: <strong className="text-slate-700 font-semibold">{satellite.ssrFreeGb} GB</strong></span>
            {isBufferCritical && (
              <span className="text-red-600 font-bold flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                Overflow Danger (93%)!
              </span>
            )}
            <span>Pass: <strong className="text-slate-700 font-semibold">{satellite.passDataVolumeGb} GB</strong></span>
          </div>
        </div>

        {/* 5. RF CARRIER, BITRATE & LIVE DOWNLINK / SCHEDULER VERDICT */}
        {isConnected ? (
          /* ACTIVE DOWNLINKING: LIVE DOTTED TRANSMISSION STREAM */
          <div className="mt-2.5 pt-2 border-t border-emerald-100 bg-emerald-50/70 -mx-3.5 -mb-3.5 sm:-mx-4 sm:-mb-4 p-2.5 sm:p-3 rounded-b-2xl border-t">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                <span>RF DOWNLINK ACTIVE (SVA-1)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                1,420 Mbps Rate
              </span>
            </div>

            {/* DOTTED DATA TRANSFER PROGRESS STREAM */}
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-900">
                <span>Sent: <strong>{currentSentGb.toFixed(1)} / {passTargetGb} GB</strong></span>
                <span className="font-bold text-emerald-700">{transferPercent}%</span>
                <span>Rem: <strong>{remainingGb} GB</strong></span>
              </div>

              {/* Animated Dotted Progress Track */}
              <div className="relative w-full h-2 bg-emerald-100/90 rounded-full overflow-hidden border border-emerald-300">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 rounded-full transition-all duration-300 relative"
                  style={{ width: `${transferPercent}%` }}
                >
                  {/* Flowing animated stream dots inside the bar */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] bg-[size:6px_6px] animate-[pulse_1s_infinite] opacity-60" />
                </div>
              </div>
            </div>

            <div className="mt-1.5 text-[9px] text-emerald-700 font-mono truncate">
              Carrier: {satellite.rfCarrier || '8.25 GHz X-Band RHCP'} &bull; DVB-S2X ACM
            </div>
          </div>
        ) : (
          /* QUEUED SATELLITE: SCHEDULER ALGORITHM VERDICT */
          <div className="mt-2.5 pt-2 border-t border-slate-100 bg-slate-50 -mx-3.5 -mb-3.5 sm:-mx-4 sm:-mb-4 p-2.5 rounded-b-2xl">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 mb-1">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-sky-600" />
                Scheduler Logic:
              </span>
              <span className="text-slate-500">{satellite.bitrateText?.split('·')[0] || 'DVB-S2X'}</span>
            </div>
            <p className="text-[10px] text-slate-700 leading-tight">
              {satellite.algorithmAction || 'Queued for optimal deconfliction pass window.'}
            </p>
          </div>
        )}
      </div>

      {/* 6. CONNECTOR SPEECH BUBBLE ARROWS POINTING TO SATELLITES */}
      {arrowPosition === 'bottom-center' && (
        <div className="hidden sm:block absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-slate-300 transform rotate-45 shadow-sm" />
      )}
      {arrowPosition === 'bottom-left' && (
        <div className="hidden sm:block absolute -bottom-2.5 left-16 w-4 h-4 bg-white border-b border-r border-slate-300 transform rotate-45 shadow-sm" />
      )}
      {arrowPosition === 'bottom-right' && (
        <div className="hidden sm:block absolute -bottom-2.5 right-16 w-4 h-4 bg-white border-b border-r border-slate-300 transform rotate-45 shadow-sm" />
      )}
    </div>
  );
};
