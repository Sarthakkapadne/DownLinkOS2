import React, { useState } from 'react';
import { PreConditionRule } from '../types';
import { PRE_CONDITION_RULES } from '../data/scenarioData';
import { 
  Flame, 
  RotateCw, 
  Wifi, 
  ArrowUp, 
  Clock, 
  HardDrive, 
  BookmarkCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const PreConditionsGrid: React.FC = () => {
  const [selectedRuleId, setSelectedRuleId] = useState<string>('cond-expiration');

  const getIcon = (type: PreConditionRule['iconType']) => {
    switch (type) {
      case 'priority':
        return <Flame className="w-5 h-5 text-red-600" />;
      case 'slew':
        return <RotateCw className="w-5 h-5 text-amber-600" />;
      case 'cable':
        return <ShieldCheck className="w-5 h-5 text-indigo-600" />;
      case 'elevation':
        return <ArrowUp className="w-5 h-5 text-sky-600" />;
      case 'time':
        return <Clock className="w-5 h-5 text-emerald-600" />;
      case 'storage':
        return <HardDrive className="w-5 h-5 text-purple-600" />;
      case 'checkpoint':
        return <BookmarkCheck className="w-5 h-5 text-teal-600" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-sky-600" />;
    }
  };

  const selectedRule = PRE_CONDITION_RULES.find((r) => r.id === selectedRuleId) || PRE_CONDITION_RULES[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
              The 6 Real-World Conditions Checked Before Making Any Move
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Before commanding the ground dish to turn, the algorithm evaluates all 6 physical conditions simultaneously.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>7 Physics Invariants Checked</span>
        </div>
      </div>

      {/* Grid of the 7 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {PRE_CONDITION_RULES.map((rule) => {
          const isSelected = selectedRuleId === rule.id;
          return (
            <div
              key={rule.id}
              onClick={() => setSelectedRuleId(rule.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-200 shadow-sm'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    {getIcon(rule.iconType)}
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                    Rule {rule.ruleNumber}
                  </span>
                </div>

                <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                  {rule.title}
                </h3>

                <p className="text-xs font-semibold text-sky-800 mt-1.5 italic">
                  "{rule.simpleQuestion}"
                </p>

                <p className="text-[11px] text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {rule.whatItMeans}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                <span className="text-red-700 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Prevents Failure</span>
                </span>
                <span className="text-sky-700 font-bold flex items-center">
                  Details <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Inspection Drawer for Selected Rule */}
      {selectedRule && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-5 border border-slate-700 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
                {getIcon(selectedRule.iconType)}
              </div>
              <div>
                <span className="text-[10px] font-mono text-sky-400 uppercase font-bold tracking-wider">
                  {selectedRule.badge}
                </span>
                <h4 className="font-bold text-base text-white">
                  Rule {selectedRule.ruleNumber}: {selectedRule.title}
                </h4>
              </div>
            </div>
            <div className="text-xs text-slate-300 font-mono bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
              Question: "{selectedRule.simpleQuestion}"
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 font-mono uppercase text-[10px] block mb-1">
                Plain-English Meaning
              </span>
              <p className="text-slate-200 leading-relaxed">
                {selectedRule.whatItMeans}
              </p>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
              <span className="text-sky-400 font-mono uppercase text-[10px] block mb-1">
                Why It Matters
              </span>
              <p className="text-slate-200 leading-relaxed">
                {selectedRule.whyItMatters}
              </p>
            </div>

            <div className="bg-red-950/40 p-3.5 rounded-lg border border-red-500/30">
              <span className="text-red-400 font-mono uppercase text-[10px] block mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Catastrophic Risk If Ignored
              </span>
              <p className="text-red-200 leading-relaxed">
                {selectedRule.dangerIfIgnored}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
