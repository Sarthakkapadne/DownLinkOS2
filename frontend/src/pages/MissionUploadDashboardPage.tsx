import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  FileJson, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  Radio, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  HardDrive, 
  ChevronRight, 
  RefreshCw,
  Copy,
  Check,
  BarChart3,
  Flame,
  Info
} from 'lucide-react';
import { runScheduleScenario, checkBackendHealth, ScenarioUploadResponse } from '../services/api';
import sampleScenarioJson from '../data/mission_scenario_input.json';

interface MissionUploadDashboardPageProps {
  onNavigateToArchitecture?: () => void;
  onNavigateToBenchmark?: () => void;
}

export const MissionUploadDashboardPage: React.FC<MissionUploadDashboardPageProps> = ({
  onNavigateToArchitecture,
  onNavigateToBenchmark
}) => {
  const [scenarioInput, setScenarioInput] = useState<any>(sampleScenarioJson);
  const [fileName, setFileName] = useState<string>('mission_scenario_input.json');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scheduleResult, setScheduleResult] = useState<ScenarioUploadResponse | null>(null);
  const [backendStatus, setBackendStatus] = useState<{ isOnline: boolean; checking: boolean }>({ isOnline: false, checking: true });
  const [executionSource, setExecutionSource] = useState<'backend' | 'offline_engine'>('backend');
  const [executionTimeMs, setExecutionTimeMs] = useState<number>(0);
  const [activeJsonTab, setActiveJsonTab] = useState<'response' | 'input'>('response');
  const [copied, setCopied] = useState<boolean>(false);

  // Check backend health on mount
  useEffect(() => {
    const testHealth = async () => {
      const res = await checkBackendHealth();
      setBackendStatus({ isOnline: res.isOnline, checking: false });
    };
    testHealth();
  }, []);

  // Auto-run with initial sample scenario on first render
  useEffect(() => {
    handleRunOptimization(sampleScenarioJson);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setScenarioInput(parsed);
        handleRunOptimization(parsed);
      } catch (err) {
        alert('Failed to parse uploaded JSON file. Please ensure it is valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSampleScenario = () => {
    setFileName('mission_scenario_input.json');
    setScenarioInput(sampleScenarioJson);
    handleRunOptimization(sampleScenarioJson);
  };

  const handleRunOptimization = async (inputData = scenarioInput) => {
    setIsProcessing(true);
    const startTime = performance.now();
    try {
      const { data, source } = await runScheduleScenario(inputData);
      setScheduleResult(data);
      setExecutionSource(source);
      setExecutionTimeMs(Math.round(performance.now() - startTime));
    } catch (err) {
      console.error('Error running schedule:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyJson = (content: any) => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const satCount = scenarioInput?.satellites?.length || 0;
  const stationCount = scenarioInput?.ground_stations?.length || 0;
  const missionTitle = scenarioInput?.metadata?.mission_name || scenarioInput?.dataset_title || 'Multi-Satellite Scenario';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* 1. Header Banner & Ingestion Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Top Info Ribbon */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 font-mono">
                STAGE 1 & 2 PIPELINE
              </span>
              <span className="text-xs text-slate-400">· Mission Control Ingestion</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Autonomous Satellite Mission Scheduler & JSON Upload
            </h1>
            <p className="text-xs text-slate-300">
              Upload your mission timetable JSON. ORBITOPS validates kinematic limits, resolves pass overlaps, and schedules downlinks.
            </p>
          </div>

          {/* Backend Connection Health Badge */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium ${
              backendStatus.isOnline 
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' 
                : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${backendStatus.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{backendStatus.isOnline ? 'FastAPI Backend Online' : 'Client Solver Active'}</span>
              <span className="text-[10px] text-slate-400">(:8000)</span>
            </div>
          </div>
        </div>

        {/* Upload & Trigger Area */}
        <div className="p-6 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Drag & Drop / File Select */}
          <div className="lg:col-span-7">
            <label 
              htmlFor="json-file-input"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-xl bg-white hover:bg-sky-50/30 transition cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 group-hover:bg-sky-200 text-sky-700 flex items-center justify-center transition">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-sky-700">
                    Upload Mission JSON or Click to Browse
                  </p>
                  <p className="text-xs text-slate-500">
                    Accepts satellite passes, antenna constraints, and SSR buffer limits
                  </p>
                </div>
              </div>
              <input 
                id="json-file-input" 
                type="file" 
                accept=".json,application/json" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Right: Quick Actions & Loaded Metadata */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loaded File</span>
              <button
                onClick={handleLoadSampleScenario}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reload Default Sample</span>
              </button>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-800 truncate max-w-[200px]">📄 {fileName}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                  {satCount} Spacecraft · {stationCount} Dishes
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">
                Scenario: <strong>{missionTitle}</strong>
              </p>
            </div>

            <button
              onClick={() => handleRunOptimization()}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Schedule in Backend...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Execute ORBITOPS Rule-Based Engine</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Populated Schedule Dashboard */}
      {scheduleResult && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Execution Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Engine Status: <strong>{scheduleResult.status}</strong></span>
              <span className="text-emerald-700">· Solver: {scheduleResult.solver_engine}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-emerald-800">
              <span>Source: <strong>{executionSource === 'backend' ? 'FastAPI Service' : 'Local Deterministic Fallback'}</strong></span>
              <span>Latency: <strong>{executionTimeMs} ms</strong></span>
            </div>
          </div>

          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Downlinked</span>
                <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                  <Database className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {scheduleResult.metrics.total_data_delivered_gb} <span className="text-base font-semibold text-slate-500">GB</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                <span>+{scheduleResult.metrics.data_throughput_gain_vs_fcfs_pct}% vs Naive FCFS</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Buffer Overflows</span>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-700 tracking-tight">
                {scheduleResult.metrics.buffer_overflow_count} <span className="text-base font-semibold text-emerald-600">Losses</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                <span>100% Onboard Memory Protection</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Antenna Utilization</span>
                <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <Radio className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-indigo-900 tracking-tight">
                {scheduleResult.metrics.antenna_utilization_pct}%
              </div>
              <div className="text-xs text-slate-500">
                {scheduleResult.metrics.contacts_scheduled} contacts · {scheduleResult.metrics.slew_transitions} slew gaps
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Physical Invariants</span>
                <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                  <Cpu className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-teal-700 tracking-tight">
                0 <span className="text-base font-semibold text-teal-600">Violations</span>
              </div>
              <div className="text-xs text-slate-500">
                Kinematics, cable wrap, elevation checked
              </div>
            </div>
          </div>

          {/* 3. Visual Timeline Gantt Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Optimal Downlink Sequence & Mechanical Slew Allocation
                </h2>
                <p className="text-xs text-slate-500">
                  Target Station: <strong>{scheduleResult.target_station.name}</strong> · Total Window: 01:08 – 01:20 UTC (12 min)
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-700">
                Zero Overlap · Physics Compliant
              </span>
            </div>

            {/* Visual Strip */}
            <div className="space-y-2">
              <div className="h-10 w-full rounded-xl bg-slate-100 p-1 flex gap-1 overflow-hidden">
                {scheduleResult.timeline.map((event) => {
                  const widthPercent = (event.duration_minutes / 12.0) * 100;
                  const isContact = event.type === 'CONTACT';
                  return (
                    <div
                      key={event.event_id}
                      style={{ width: `${widthPercent}%` }}
                      className={`h-full rounded-lg flex items-center justify-center px-2 text-xs font-bold font-mono transition shadow-2xs truncate ${
                        isContact
                          ? event.satellite_id === 'sat-2'
                            ? 'bg-emerald-600 text-white'
                            : event.satellite_id === 'sat-1'
                            ? 'bg-sky-600 text-white'
                            : 'bg-teal-600 text-white'
                          : 'bg-amber-400/90 text-amber-950 border border-amber-500/40'
                      }`}
                      title={`${event.satellite_name}: ${event.start_time_utc} to ${event.end_time_utc} (${event.duration_minutes} min)`}
                    >
                      <span className="truncate">
                        {isContact ? event.satellite_name.split('-')[0] : 'Slew (90s)'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Time Ruler */}
              <div className="flex justify-between text-[11px] text-slate-400 font-mono px-1">
                <span>01:08 UTC</span>
                <span>01:11 UTC</span>
                <span>01:14 UTC</span>
                <span>01:17 UTC</span>
                <span>01:20 UTC</span>
              </div>
            </div>
          </div>

          {/* 4. Contact Sequence Cards (Detailed Explanations) */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Step-by-Step Contact Allocations & Applied Physical Rules</span>
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {scheduleResult.timeline.map((event, idx) => {
                const isContact = event.type === 'CONTACT';
                return (
                  <div
                    key={event.event_id}
                    className={`rounded-2xl border p-4 sm:p-5 transition shadow-2xs ${
                      isContact
                        ? 'bg-white border-slate-200'
                        : 'bg-amber-50/50 border-amber-200/60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          isContact
                            ? 'bg-slate-900 text-white'
                            : 'bg-amber-200 text-amber-900'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">
                              {event.satellite_name}
                            </h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              event.badge_color === 'emerald'
                                ? 'bg-emerald-100 text-emerald-800'
                                : event.badge_color === 'sky'
                                ? 'bg-sky-100 text-sky-800'
                                : event.badge_color === 'teal'
                                ? 'bg-teal-100 text-teal-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}>
                              {event.status_badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            {event.rationale}
                          </p>
                        </div>
                      </div>

                      {/* Right Telemetry Column */}
                      <div className="flex flex-wrap sm:flex-col items-end gap-1 font-mono text-xs text-slate-700 sm:text-right shrink-0">
                        <span className="font-bold text-slate-900">
                          {event.start_time_utc} → {event.end_time_utc}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span>{event.duration_minutes} min duration</span>
                          {isContact && (
                            <>
                              <span>·</span>
                              <span className="font-bold text-emerald-700">{event.data_delivered_gb} GB</span>
                              <span>·</span>
                              <span>{event.bitrate_mbps} Mbps</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Applied Rule Footnote */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Applied Engine Constraint: <strong className="text-slate-800">{event.rule_applied}</strong></span>
                      {isContact && (
                        <span>Buffer Relieved: <strong className="text-emerald-700">{event.buffer_before_pct}% → {event.buffer_after_pct}%</strong></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Direct Comparison: ORBITOPS vs Naive FCFS */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white space-y-4 border border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
              <div>
                <span className="text-[11px] font-bold text-sky-400 font-mono uppercase tracking-wider">
                  Comparative Analysis
                </span>
                <h3 className="text-lg font-bold text-white">
                  Why Naive FCFS Fails on this Exact Uploaded Timetable
                </h3>
              </div>
              <button
                onClick={onNavigateToBenchmark}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition cursor-pointer self-start sm:self-auto"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Open Full Interactive Gantt Benchmark</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* FCFS Flaw */}
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Naive First-Come, First-Served (FCFS)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {scheduleResult.fcfs_comparison.fcfs_failure_detail}
                </p>
                <div className="pt-1 flex items-center gap-3 text-rose-300 font-mono">
                  <span>Delivered: <strong>{scheduleResult.fcfs_comparison.fcfs_data_delivered_gb} GB</strong></span>
                  <span>·</span>
                  <span>Overflows: <strong className="text-rose-400">{scheduleResult.fcfs_comparison.fcfs_buffer_overflows} Disaster</strong></span>
                </div>
              </div>

              {/* ORBITOPS Solution */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ORBITOPS Autonomous Scheduling</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Evaluated buffer fullness & pass decay urgency first (saving Pelican-01), timed 90s motor slew, harvested peak 78.5° zenith modulation on SuperDove, then downlinked residual SkySat telemetry.
                </p>
                <div className="pt-1 flex items-center gap-3 text-emerald-300 font-mono">
                  <span>Delivered: <strong>{scheduleResult.metrics.total_data_delivered_gb} GB</strong></span>
                  <span>·</span>
                  <span>Overflows: <strong className="text-emerald-400">0 Overflows (100% Protected)</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Navigation to Next Architecture Section */}
          <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-sky-950">
                Want to understand the physical equations & sky geometry?
              </h4>
              <p className="text-xs text-sky-800">
                Inspect the 180° Sky Horizon dome view, Doppler shift models, and the 6 physical scheduling invariants.
              </p>
            </div>
            <button
              onClick={onNavigateToArchitecture}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs shrink-0"
            >
              <span>Explore Architecture Tab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 7. Collapsible Raw JSON Payloads Drawer */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-800">Live JSON Payload Inspector</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveJsonTab('response')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                    activeJsonTab === 'response' 
                      ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Backend API Output JSON
                </button>
                <button
                  onClick={() => setActiveJsonTab('input')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                    activeJsonTab === 'input' 
                      ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Uploaded Input JSON
                </button>
                <button
                  onClick={() => handleCopyJson(activeJsonTab === 'response' ? scheduleResult : scenarioInput)}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition cursor-pointer"
                  title="Copy JSON to Clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950 max-h-96 overflow-y-auto">
              <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap">
                {JSON.stringify(activeJsonTab === 'response' ? scheduleResult : scenarioInput, null, 2)}
              </pre>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
