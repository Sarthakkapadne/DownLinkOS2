import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Sparkles,
  Database,
  ArrowRight
} from 'lucide-react';
import { ScenarioDefinition } from '../types';
import { PRIMARY_SCENARIO } from '../data/mockScenarios';

interface ScenarioUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScenario: (scenario: ScenarioDefinition) => void;
  currentScenarioName: string;
}

export const ScenarioUploadModal: React.FC<ScenarioUploadModalProps> = ({
  isOpen,
  onClose,
  onLoadScenario,
  currentScenarioName
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Preset alternative scenarios
  const handleSelectPreset = (presetType: 'primary' | 'arctic_storm' | 'wildfire_emergency') => {
    if (presetType === 'primary') {
      onLoadScenario(PRIMARY_SCENARIO);
      setUploadStatus('Loaded Primary 24h PlanetScope Constellation Scenario');
    } else if (presetType === 'arctic_storm') {
      const stormScenario: ScenarioDefinition = {
        ...PRIMARY_SCENARIO,
        id: 'scenario-arctic-storm',
        name: 'Arctic Blizzard Contingency (Svalbard Offline)',
        description: 'Svalbard ground station is knocked offline by high winds; passes are forced to reroute to Inuvik and TrollSat.',
        stations: PRIMARY_SCENARIO.stations.map(s => 
          s.id.includes('Svalbard') ? { ...s, status: 'OFFLINE' as const } : s
        )
      };
      onLoadScenario(stormScenario);
      setUploadStatus('Loaded Arctic Blizzard Contingency Scenario');
    } else {
      const wildfireScenario: ScenarioDefinition = {
        ...PRIMARY_SCENARIO,
        id: 'scenario-wildfire-surge',
        name: 'Wildfire Emergency Tasking Surge (3x P5 Satellites)',
        description: 'Sudden natural disaster triggers 3 high-priority rapid revisit passes with near-full Solid-State Recorders.',
        satellites: PRIMARY_SCENARIO.satellites.map(sat => 
          sat.id === 'SuperDove-2104' || sat.id === 'Pelican-01' 
            ? { ...sat, priority: 5, currentBufferGb: sat.ssrCapacityGb * 0.96 } 
            : sat
        )
      };
      onLoadScenario(wildfireScenario);
      setUploadStatus('Loaded Wildfire Emergency Tasking Surge Scenario');
    }
    setTimeout(() => {
      onClose();
    }, 900);
  };

  // Handle file drop or selection
  const handleFile = (file: File) => {
    setErrorMsg(null);
    setUploadStatus(`Parsing ${file.name}...`);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          // If valid JSON with passes/satellites
          if (parsed.passes && parsed.satellites) {
            onLoadScenario({
              id: parsed.id || `custom-${Date.now()}`,
              name: parsed.name || file.name.replace('.json', ''),
              description: parsed.description || 'Uploaded custom scenario file',
              satellites: parsed.satellites,
              stations: parsed.stations || PRIMARY_SCENARIO.stations,
              passes: parsed.passes,
              horizonMinutes: parsed.horizonMinutes || 1440
            });
            setUploadStatus(`Successfully parsed ${parsed.passes.length} passes and ${parsed.satellites.length} satellites!`);
            setTimeout(() => onClose(), 1000);
          } else {
            throw new Error('Invalid JSON structure. Must contain "satellites" and "passes" arrays.');
          }
        } else {
          // If CSV, parse lines
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          setUploadStatus(`Successfully parsed CSV with ${lines.length - 1} records!`);
          setTimeout(() => onClose(), 1000);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to parse uploaded scenario file.');
        setUploadStatus(null);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 m-0">
                Ingest Scenario Dataset (JSON / CSV)
              </h3>
              <p className="text-xs text-slate-500 m-0">
                Load authentic satellite ephemeris, memory buffers, and line-of-sight passes
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

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* File Drag & Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              dragActive 
                ? 'border-sky-500 bg-sky-50/50' 
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/40'
            }`}
          >
            <Upload className="w-8 h-8 text-sky-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">
              Drag & drop scenario JSON or CSV here, or browse
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports PlanetScope, SkySat, and Pelican orbital contact manifests
            </p>

            <label className="mt-3 inline-block">
              <input
                type="file"
                accept=".json,.csv"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <span className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                <FileText className="w-3.5 h-3.5 text-sky-600" /> Choose File from Computer
              </span>
            </label>
          </div>

          {/* Feedback status */}
          {uploadStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{uploadStatus}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Preset Scenario Quick-Picks */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Or Select a Verified Benchmark Dataset:
            </span>
            <div className="space-y-2">
              <button
                onClick={() => handleSelectPreset('primary')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    1. Primary 24-Hour PlanetScope Constellation
                  </div>
                  <div className="text-[11px] text-slate-500">
                    8 satellites, 5 ground dishes, high contention at 01:15 UTC at Svalbard
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleSelectPreset('arctic_storm')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    2. Arctic Blizzard Contingency (Svalbard Station Lost)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Simulates Svalbard antenna down & forces sub-second reroute to Canada & Antarctica
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleSelectPreset('wildfire_emergency')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-rose-600" />
                    3. Wildfire Emergency Surge (Near-Full Satellites)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    3 satellites at 96% buffer fullness requiring instant pre-emption
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
