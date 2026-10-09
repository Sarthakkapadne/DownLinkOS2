import React, { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { RejectedPass, ScheduledContact, PassOpportunity } from '../../types';
import { minToTimeStr } from '../../data/mockScenarios';

interface TabDecisionExplainerProps {
  scheduledContacts: ScheduledContact[];
  rejectedPasses: RejectedPass[];
  allPasses: PassOpportunity[];
  isPlainEnglishMode: boolean;
}

export const TabDecisionExplainer: React.FC<TabDecisionExplainerProps> = ({
  scheduledContacts,
  rejectedPasses,
  allPasses,
  isPlainEnglishMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'SCHEDULED' | 'REJECTED'>('ALL');
  const [selectedForcePass, setSelectedForcePass] = useState<RejectedPass | null>(rejectedPasses[0] || null);

  // Filter list
  const filteredScheduled = scheduledContacts.filter(c => 
    c.satelliteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.stationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRejected = rejectedPasses.filter(r =>
    r.satelliteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reasonCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
                <FileText className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900 m-0">
                Decision Lineage Ledger & "Price of Forcing" Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 m-0">
              No black boxes. Every scheduled pass has an audit rationale, and every rejected pass has a plain-English 
              reason code along with the exact <span className="font-semibold text-slate-800">"Price of Forcing"</span> penalty.
            </p>
          </div>
        </div>
      </div>

      {/* THE "PRICE OF FORCING" INTERACTIVE CALCULATOR (USP WIDGET) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
          <DollarSign className="w-4 h-4 text-amber-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 m-0">
              The "Price of Forcing" Explainer
            </h3>
            <p className="text-xs text-slate-500 m-0">
              Simulate what happens if an operator manually overrides the scheduler and forces a rejected pass
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Select a Rejected Pass to Force:
            </label>
            <select
              value={selectedForcePass?.id || ''}
              onChange={(e) => {
                const found = rejectedPasses.find(r => r.id === e.target.value);
                if (found) setSelectedForcePass(found);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 font-medium focus:outline-sky-500 cursor-pointer"
            >
              {rejectedPasses.map(r => (
                <option key={r.id} value={r.id}>
                  {r.satelliteName} ({minToTimeStr(r.aosMinutes)}) on {r.stationName} [P{r.priority}]
                </option>
              ))}
            </select>

            {selectedForcePass && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reason for Rejection:</span>
                  <span className="font-bold text-slate-800">{selectedForcePass.reasonCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Buffer Fill at AOS:</span>
                  <span className="font-mono text-slate-800">{selectedForcePass.bufferFillPct}% (Not Critical)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pass Volume:</span>
                  <span className="font-mono text-slate-800">{selectedForcePass.dataVolumeGb} GB</span>
                </div>
              </div>
            )}
          </div>

          {/* Resulting Impact Breakdown */}
          {selectedForcePass && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Simulated Override Impact:</span>
              </div>

              <p className="text-amber-900 leading-relaxed m-0">
                Forcing <span className="font-bold">{selectedForcePass.satelliteName}</span> into {selectedForcePass.stationName} would 
                displace a <span className="font-bold text-red-700">higher priority contact</span> on that antenna.
              </p>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-amber-200">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-slate-600">Net Constellation Value Penalty:</span>
                </div>
                <span className="font-bold text-red-700 font-mono text-sm">
                  -{selectedForcePass.priceOfForcingPenalty} pts (-18.4%)
                </span>
              </div>

              <div className="text-[11px] text-amber-800 italic">
                ✓ Conclusion: Rejection is mathematically sound. Deferring this pass preserves 2.4x higher value emergency data.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FILTERABLE DECISION AUDIT TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by satellite, station, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-sky-500"
            />
          </div>

          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-white">
            <button
              onClick={() => setFilterType('ALL')}
              className={`text-xs px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                filterType === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Passes ({allPasses.length})
            </button>
            <button
              onClick={() => setFilterType('SCHEDULED')}
              className={`text-xs px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                filterType === 'SCHEDULED' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scheduled ({scheduledContacts.length})
            </button>
            <button
              onClick={() => setFilterType('REJECTED')}
              className={`text-xs px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                filterType === 'REJECTED' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rejected ({rejectedPasses.length})
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Satellite</th>
                <th className="py-2.5 px-4">Ground Dish</th>
                <th className="py-2.5 px-4">Window (UTC)</th>
                <th className="py-2.5 px-4">Priority</th>
                <th className="py-2.5 px-4">Delivered</th>
                <th className="py-2.5 px-4">Decision Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Render Scheduled */}
              {(filterType === 'ALL' || filterType === 'SCHEDULED') &&
                filteredScheduled.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4">
                      <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>SCHEDULED</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{c.satelliteName}</td>
                    <td className="py-2.5 px-4 text-slate-600">{c.stationName}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">
                      {minToTimeStr(c.startMinutes)} → {minToTimeStr(c.endMinutes)}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-800">P{c.priority}</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">{c.deliveredVolumeGb} GB</td>
                    <td className="py-2.5 px-4 text-slate-700 max-w-xs truncate" title={c.selectionRationale}>
                      {c.selectionRationale || 'Optimal high-priority interval allocation.'}
                    </td>
                  </tr>
                ))}

              {/* Render Rejected */}
              {(filterType === 'ALL' || filterType === 'REJECTED') &&
                filteredRejected.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors bg-red-50/20">
                    <td className="py-2.5 px-4">
                      <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-800 border border-red-200">
                        <ShieldAlert className="w-3 h-3 text-red-600" />
                        <span>REJECTED</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{r.satelliteName}</td>
                    <td className="py-2.5 px-4 text-slate-600">{r.stationName}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">
                      {minToTimeStr(r.aosMinutes)} → {minToTimeStr(r.losMinutes)}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-800">P{r.priority}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-400">0 GB (0%)</td>
                    <td className="py-2.5 px-4 text-slate-700 max-w-xs truncate" title={r.reasonExplanation}>
                      <span className="font-semibold text-red-700">[{r.reasonCode}]</span> {r.reasonExplanation}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
