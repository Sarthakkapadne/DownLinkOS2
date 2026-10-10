import React from 'react';
import { Satellite } from '../types';
import { 
  HardDrive, 
  Clock, 
  Compass, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Eye, 
  Leaf
} from 'lucide-react';

interface SatelliteInfoCardProps {
  satellite: Satellite;
  isConnected: boolean;
  transferredGb?: number;
  isHighlighted?: boolean;
  positionLabel: string;
}

export const SatelliteInfoCard: React.FC<SatelliteInfoCardProps> = ({
  satellite,
  isConnected,
  transferredGb,
  isHighlighted,
  positionLabel
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
          cardBorder: isConnected ? 'border-red-400 ring-2 ring-red-100' : 'border-red-200',
          accent: 'text-red-700',
          icon: Flame
        };
      case 2:
        return {
          badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
          dotBg: 'bg-sky-500',
          cardBorder: isConnected ? 'border-sky-400 ring-2 ring-sky-100' : 'border-sky-200',
          accent: 'text-sky-700',
          icon: Eye
        };
      case 3:
      default:
        return {
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
          dotBg: 'bg-slate-500',
          cardBorder: isConnected ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-slate-200',
          accent: 'text-slate-700',
          icon: Leaf
        };
    }
  };

  const theme = getPriorityTheme(satellite.priority);
  const MissionIcon = theme.icon;

  return (
    <div
      className={`w-72 sm:w-80 bg-white rounded-xl shadow-lg border p-3.5 transition-all duration-300 ${
        isHighlighted
          ? 'ring-2 ring-amber-400 border-amber-300 shadow-amber-100'
          : theme.cardBorder
      } ${isConnected ? 'bg-gradient-to-b from-white to-sky-50/30' : ''}`}
    >
      {/* Header: Name, NORAD & Position */}
      <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
              {satellite.name}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            NORAD #{satellite.noradId} · {satellite.constellation.split(' ')[0]} ({satellite.altitudeKm}km)
          </div>
        </div>

        {/* Priority Badge: Lower the better */}
        <div className="flex flex-col items-end">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${theme.badgeBg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${theme.dotBg}`} />
            PRIORITY {satellite.priority}
          </span>
          <span className="text-[9px] text-slate-600 mt-0.5 font-medium">
            (Lower = Higher)
          </span>
        </div>
      </div>

      {/* Observation & Data Payload Info */}
      <div className="mt-2 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-slate-700">
          <MissionIcon className={`w-3.5 h-3.5 flex-shrink-0 ${theme.accent}`} />
          <span className="font-semibold text-slate-800 truncate">
            {satellite.targetMission}
          </span>
        </div>

        <div className="text-[11px] text-slate-600 pl-5">
          <span className="text-slate-600">Payload:</span> {satellite.dataType}
        </div>
      </div>

      {/* Pass Timing & Elevation */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5 text-[11px]">
        <div className="flex items-center gap-1 text-slate-600">
          <Compass className="w-3 h-3 text-slate-600" />
          <span>El: <strong className="text-slate-800">{satellite.position.elevationDeg}°</strong></span>
          <span className="text-[10px] text-slate-600">({positionLabel})</span>
        </div>
        <div className="flex items-center gap-1 text-slate-600 justify-end">
          <Clock className="w-3 h-3 text-slate-600" />
          <span className="font-mono text-slate-800">
            {satellite.window.timeRemainingSec}s left
          </span>
        </div>
      </div>

      {/* Onboard Solid-State Storage (SSR) - Utilized vs Free Line Bar */}
      <div className="mt-2.5 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <div className="flex items-center gap-1 text-slate-700">
            <HardDrive className="w-3 h-3 text-slate-600" />
            <span className="font-medium">Onboard Memory (SSR):</span>
          </div>
          <span className="font-mono font-bold text-slate-800">
            {satellite.ssrUtilizedGb} / {satellite.ssrCapacityGb} GB ({utilizedPercent}%)
          </span>
        </div>

        {/* Progress Bar: Utilized vs Free */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
          <div
            className={`h-full transition-all duration-500 ${
              isBufferCritical
                ? 'bg-red-500'
                : utilizedPercent > 70
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${utilizedPercent}%` }}
          />
          <div
            className="h-full bg-slate-200"
            style={{ width: `${100 - utilizedPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-600 mt-1">
          <span>Free: <strong className="text-slate-700">{satellite.ssrFreeGb} GB</strong></span>
          {isBufferCritical && (
            <span className="text-red-600 font-bold flex items-center gap-0.5">
              <AlertTriangle className="w-2.5 h-2.5" />
              Overflow Danger!
            </span>
          )}
          <span>Pass: <strong className="text-slate-700">{satellite.passDataVolumeGb} GB</strong></span>
        </div>
      </div>

      {/* Active Downlink Status Indicator */}
      {isConnected && (
        <div className="mt-2 pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] bg-emerald-50/60 -mx-3.5 -mb-3.5 p-2 rounded-b-xl border-t">
          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
            <span>DOWNLINKING NOW</span>
          </div>
          <div className="text-[10px] font-mono text-emerald-700">
            {transferredGb?.toFixed(1) ?? '22.8'} / {satellite.passDataVolumeGb} GB
          </div>
        </div>
      )}
    </div>
  );
};
