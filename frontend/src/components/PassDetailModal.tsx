import React from 'react';
import { X, Satellite, Radio, Clock, TrendingUp, AlertCircle, ShieldAlert } from 'lucide-react';
import { ScheduledContact, PassOpportunity } from '../types';
import { minToTimeStr } from '../data/mockScenarios';

interface PassDetailModalProps {
  contact: ScheduledContact | null;
  rawPass?: PassOpportunity | null;
  onClose: () => void;
  isPlainEnglishMode: boolean;
}

export const PassDetailModal: React.FC<PassDetailModalProps> = ({
  contact,
  rawPass,
  onClose,
  isPlainEnglishMode
}) => {
  if (!contact) return null;

  const priorityColors: Record<number, { bg: string; text: string; label: string }> = {
    5: { bg: 'bg-red-100 border-red-300', text: 'text-red-800', label: 'Priority 5 · Emergency Rapid Tasking' },
    4: { bg: 'bg-purple-100 border-purple-300', text: 'text-purple-800', label: 'Priority 4 · High-Resolution Video' },
    3: { bg: 'bg-sky-100 border-sky-300', text: 'text-sky-800', label: 'Priority 3 · Standard Commercial Imagery' },
    2: { bg: 'bg-emerald-100 border-emerald-300', text: 'text-emerald-800', label: 'Priority 2 · Regional Environmental Belt' },
    1: { bg: 'bg-slate-100 border-slate-300', text: 'text-slate-800', label: 'Priority 1 · Routine Instrument Calibration' }
  };

  const pConfig = priorityColors[contact.priority] || priorityColors[3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 m-0">
                {contact.satelliteName}
              </h3>
              <p className="text-xs text-slate-500 m-0">
                Contact ID: <span className="font-mono">{contact.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Priority Badge */}
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-between ${pConfig.bg} ${pConfig.text}`}>
            <span>{pConfig.label}</span>
            <span className="font-mono">P{contact.priority}</span>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Radio className="w-3.5 h-3.5" />
                <span>Ground Station</span>
              </div>
              <div className="font-semibold text-slate-900">{contact.stationName}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Contact Window</span>
              </div>
              <div className="font-semibold text-slate-900 font-mono">
                {minToTimeStr(contact.startMinutes)} → {minToTimeStr(contact.endMinutes)}
              </div>
              <div className="text-[11px] text-slate-500 font-normal">
                Duration: {contact.durationMinutes} minutes
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Delivered Volume</span>
              </div>
              <div className="text-base font-bold text-emerald-700">
                {contact.deliveredVolumeGb} GB
              </div>
              <div className="text-[11px] text-slate-500">
                Integrated DVB-S2X ACM yield
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-sky-600" />
                <span>Dish Azimuth Slewing</span>
              </div>
              <div className="font-semibold text-slate-900 font-mono">
                {contact.cableAngleStart}° → {contact.cableAngleEnd}°
              </div>
              <div className="text-[11px] text-emerald-700">
                ✓ Within ±270° cable-wrap limit
              </div>
            </div>
          </div>

          {/* Operational Selection Rationale */}
          <div className="p-3.5 rounded-lg bg-sky-50 border border-sky-200 text-xs">
            <div className="font-bold text-sky-900 flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-4 h-4 text-sky-700" />
              <span>{isPlainEnglishMode ? 'Why This Pass Was Chosen' : 'Algorithmic Optimization Proof'}</span>
            </div>
            <p className="text-sky-800 leading-relaxed m-0">
              {contact.selectionRationale || 
                `High priority-weighted value pass. Scheduled over competing routine passes to prevent SSR buffer saturation.`}
            </p>
            {contact.priceOfForcing && (
              <div className="mt-2 pt-2 border-t border-sky-200 text-[11px] text-sky-900 font-medium">
                ⚡ <span className="font-semibold">Price of Forcing:</span> If displaced, the constellation loses{' '}
                <span className="font-bold">{contact.priceOfForcing} priority-volume points</span>.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
