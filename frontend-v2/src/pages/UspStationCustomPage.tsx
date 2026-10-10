import React, { useState } from 'react';
import { 
  Radio, 
  CloudRain, 
  Wind, 
  RotateCw, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  ArrowRight, 
  HardDrive, 
  TrendingUp,
  Compass,
  Layers,
  Sparkles,
  Sliders,
  ArrowLeft
} from 'lucide-react';

interface StationProfile {
  id: string;
  name: string;
  code: string;
  location: string;
  latLon: string;
  dishDiameterM: number;
  gainDbi: number;
  weatherCondition: string;
  rainAttenuationDb: number;
  maxSlewRateDegSec: number;
  backhaulBandwidthGbps: number;
  elevationMaskDeg: number;
  statusColor: string;
  optimalRole: string;
  description: string;
}

const STATIONS: StationProfile[] = [
  {
    id: 'svalbard',
    name: 'KSAT Svalbard Ground Station',
    code: 'SVA-Ant-1',
    location: 'Spitsbergen, Norway (High Arctic)',
    latLon: '78.22°N, 15.63°E',
    dishDiameterM: 7.3,
    gainDbi: 54.2,
    weatherCondition: 'Arctic Dry Cold (Zero Rain Fading)',
    rainAttenuationDb: 0.0,
    maxSlewRateDegSec: 2.0,
    backhaulBandwidthGbps: 10.0,
    elevationMaskDeg: 5.0,
    statusColor: 'sky',
    optimalRole: 'Heavy X-Band Tactical Video (40+ GB High-Bitrate Dumps)',
    description: 'High-arctic latitude provides 14 contact passes per day. Equipped with 10 Gbps subsea fiber and high-gain reflector, perfect for peak 1,420 Mbps zenith downloads.'
  },
  {
    id: 'inuvik',
    name: 'Inuvik Satellite Station Facility',
    code: 'INU-Dish-2',
    location: 'Northwest Territories, Canada',
    latLon: '68.36°N, 133.72°W',
    dishDiameterM: 5.4,
    gainDbi: 48.6,
    weatherCondition: 'Active Arctic Blizzard (-1.8 dB Atmospheric Loss)',
    rainAttenuationDb: 1.8,
    maxSlewRateDegSec: 1.5,
    backhaulBandwidthGbps: 2.5,
    elevationMaskDeg: 7.0,
    statusColor: 'amber',
    optimalRole: 'Routine Optical Survey & Medium Payload Passes (<18 GB)',
    description: 'Sub-Arctic Canadian station. Terrestrial microwave backhaul limits throughput to 2.5 Gbps. Blizzard precipitation creates -1.8 dB atmospheric link degradation.'
  },
  {
    id: 'trollsat',
    name: 'Troll Satellite Station (TrollSat)',
    code: 'TRL-Ant-4',
    location: 'Queen Maud Land, Antarctica',
    latLon: '72.01°S, 2.53°E',
    dishDiameterM: 10.0,
    gainDbi: 58.1,
    weatherCondition: 'Katabatic Arctic Winds (Elevated 12° Mask)',
    rainAttenuationDb: 0.4,
    maxSlewRateDegSec: 1.0,
    backhaulBandwidthGbps: 1.0,
    elevationMaskDeg: 12.0,
    statusColor: 'purple',
    optimalRole: 'High-Sensitivity Emergency Passes & Relay Offloading',
    description: 'Giant 10m cryogenic reflector with immense reception sensitivity. Heavy structural inertia limits slew to 1.0°/s; Antarctic wind loads require a 12° elevation safety mask.'
  }
];

export interface UspStationCustomPageProps {
  onBack?: () => void;
  onNavigateToUsp2?: () => void;
}

export const UspStationCustomPage: React.FC<UspStationCustomPageProps> = ({
  onBack,
  onNavigateToUsp2
}) => {
  const [selectedStationId, setSelectedStationId] = useState<string>('svalbard');
  const [simulationMode, setSimulationMode] = useState<'ORBITOPS' | 'NAIVE'>('ORBITOPS');

  // Interactive slider controls for the live physics profiler
  const [rainSliderDb, setRainSliderDb] = useState<number>(0.0);
  const [slewSliderDegSec, setSlewSliderDegSec] = useState<number>(2.0);
  const [backhaulSliderGbps, setBackhaulSliderGbps] = useState<number>(10.0);

  const selectedStation = STATIONS.find((s) => s.id === selectedStationId) || STATIONS[0];

  // Dynamic calculation based on physical slider inputs
  const estimatedPeakBitrate = Math.round(
    Math.min(
      1420 * Math.pow(10, -rainSliderDb / 10),
      backhaulSliderGbps * 1000 * 0.95
    )
  );
  const estimatedSlewTurnTimeSec = Math.round(60 / slewSliderDegSec);
  const capacityQualityScore = Math.min(
    100,
    Math.round(
      (estimatedPeakBitrate / 1420) * 60 +
      (Math.max(0, 60 - estimatedSlewTurnTimeSec) / 60) * 40
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-sky-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Algorithm & 180° Sky Horizon</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">Page 2 of 3</span>
          {onNavigateToUsp2 && (
            <button
              onClick={onNavigateToUsp2}
              className="flex items-center gap-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-xl transition shadow-2xs cursor-pointer"
            >
              <span>Next: USP 2 Pre-Computed Playbooks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* ======================================================== */}
      {/* 1. HERO BANNER: USP 1 IDENTITY & PURPOSE                 */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
            <Cpu className="w-3.5 h-3.5" />
            <span>CORE USP 1 · STATION-AWARE SCHEDULING ENGINE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Per-Station Custom Scheduler
          </h1>

          <p className="text-base sm:text-lg text-sky-200/90 font-medium leading-relaxed">
            Every ground station operates differently, so one scheduling strategy cannot fit them all.
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
            ORBITOPS considers each station’s <strong>dish size, local weather attenuation, antenna movement speed, and fiber data-handling capacity</strong> before assigning satellite contacts. This guarantees station-aware scheduling instead of blindly treating every antenna the same.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> 100% Station Capability Matching
            </span>
            <span className="flex items-center gap-1.5 text-sky-300">
              <ShieldCheck className="w-4 h-4" /> Zero Backhaul Bottlenecks
            </span>
            <span className="flex items-center gap-1.5 text-purple-300">
              <RotateCw className="w-4 h-4" /> Zero Motor Overrun Fails
            </span>
          </div>
        </div>

        {/* Background Visual Watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Radio className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. THE 3 CONTRASTING GROUND STATIONS (PHYSICAL CARDS)    */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Radio className="w-5 h-5 text-sky-600" />
              The 3 Contrasting Polar Ground Station Profiles
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any station below to inspect its unique physical limits and how ORBITOPS tailors its schedule.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-600">
            Selected: <strong className="text-sky-700">{selectedStation.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {STATIONS.map((station) => {
            const isSelected = selectedStationId === station.id;
            return (
              <div
                key={station.id}
                onClick={() => {
                  setSelectedStationId(station.id);
                  setRainSliderDb(station.rainAttenuationDb);
                  setSlewSliderDegSec(station.maxSlewRateDegSec);
                  setBackhaulSliderGbps(station.backhaulBandwidthGbps);
                }}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-sky-500 ring-2 ring-sky-200 shadow-lg'
                    : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                        {station.code}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-1.5 leading-snug">
                        {station.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        {station.location} · {station.latLon}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center flex-shrink-0 text-sky-700">
                      <Radio className="w-5 h-5" />
                    </div>
                  </div>

                  {/* 4 Physical Key Factors */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-100">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] text-slate-600 block">DISH DIAMETER</span>
                      <strong className="text-slate-900 text-sm">{station.dishDiameterM}m</strong> ({station.gainDbi} dBi)
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] text-slate-600 block">BACKHAUL FIBER</span>
                      <strong className="text-slate-900 text-sm">{station.backhaulBandwidthGbps} Gbps</strong>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] text-slate-600 block">WEATHER LOSS</span>
                      <strong className={station.rainAttenuationDb > 1 ? 'text-amber-600 text-sm' : 'text-emerald-600 text-sm'}>
                        {station.rainAttenuationDb > 0 ? `-${station.rainAttenuationDb} dB` : '0.0 dB (Clear)'}
                      </strong>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] text-slate-600 block">SLEW RATE</span>
                      <strong className="text-slate-900 text-sm">{station.maxSlewRateDegSec}°/s</strong>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {station.description}
                  </p>
                </div>

                {/* Optimal Role Badge */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    OPTIMAL TASKING ASSIGNED BY ORBITOPS:
                  </span>
                  <div className="text-xs font-semibold text-sky-800 bg-sky-50/70 p-2 rounded-lg border border-sky-200">
                    {station.optimalRole}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. INTERACTIVE SIMULATION: ONE-SIZE-FITS-ALL VS ORBITOPS */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>INTERACTIVE CONTRAST BENCHMARK</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              See the Difference: Blind Uniform Scheduling vs Station-Aware Scheduling
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              What happens when an urgent 48 GB high-rate pass is assigned across stations with different limits?
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setSimulationMode('NAIVE')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                simulationMode === 'NAIVE'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Naive One-Size-Fits-All (FCFS)</span>
            </button>
            <button
              onClick={() => setSimulationMode('ORBITOPS')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                simulationMode === 'ORBITOPS'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ORBITOPS Station-Aware Engine</span>
            </button>
          </div>
        </div>

        {/* Comparison Result Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: What Happens at Inuvik during Blizzard */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">
                Case 1: Heavy 48 GB Pass assigned to Inuvik (Canada)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                2.5 Gbps Fiber · Blizzard Fading
              </span>
            </div>

            {simulationMode === 'NAIVE' ? (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-950 space-y-2">
                <div className="font-bold text-red-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  NAIVE SCHEDULING DISASTER: Severe Packet Drop & Bottleneck
                </div>
                <p className="leading-relaxed">
                  The naive scheduler treated Inuvik like a 10 Gbps fiber station. The blizzard attenuation reduced link SNR by -1.8 dB, and the 2.5 Gbps microwave link saturated immediately.
                </p>
                <div className="p-2 bg-red-100/80 rounded font-mono text-[11px] font-bold text-red-900">
                  Result: 19.2 GB dropped (40% data loss) · Transmitter thermal retry cycle triggered.
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ORBITOPS DECISION: Intelligent Pass Matching
                </div>
                <p className="leading-relaxed">
                  ORBITOPS detected Inuvik's 2.5 Gbps backhaul limit and -1.8 dB blizzard snow fading. It automatically diverted the 48 GB heavy pass to <strong>Svalbard (10 Gbps fiber)</strong>, and assigned Inuvik a lighter 14 GB optical pass that easily fit its link budget.
                </p>
                <div className="p-2 bg-emerald-100/80 rounded font-mono text-[11px] font-bold text-emerald-900">
                  Result: 100% data delivered · 0 GB dropped · Zero microwave congestion.
                </div>
              </div>
            )}
          </div>

          {/* Card 2: What Happens at TrollSat with Slow Motors */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">
                Case 2: Rapid Slew Switch assigned to TrollSat (Antarctica)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                10m Giant Dish · 1.0°/s Slow Slew
              </span>
            </div>

            {simulationMode === 'NAIVE' ? (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-950 space-y-2">
                <div className="font-bold text-red-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  NAIVE SCHEDULING DISASTER: Motor Slew Overrun Miss
                </div>
                <p className="leading-relaxed">
                  The naive scheduler assumed a standard 20s slew between two passes. But TrollSat’s 10m dish weighs 12 tons and slews at only 1.0°/sec! Turning took 55 seconds.
                </p>
                <div className="p-2 bg-red-100/80 rounded font-mono text-[11px] font-bold text-red-900">
                  Result: Missed satellite Acquisition of Signal (AOS) entirely · Pass lost to keyhole overrun.
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ORBITOPS DECISION: Kinematic Acceleration Budgeting
                </div>
                <p className="leading-relaxed">
                  ORBITOPS factored in TrollSat’s 1.0°/sec slew inertia. It scheduled only wide-separation polar passes with generous 60s slew windows, and leveraged TrollSat’s massive 58 dBi gain for long low-elevation tracking.
                </p>
                <div className="p-2 bg-emerald-100/80 rounded font-mono text-[11px] font-bold text-emerald-900">
                  Result: 100% antenna lock acquired before AOS · Zero motor overruns.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. LIVE STATION PROFILER INTERACTIVE SLIDER TOOL         */}
      {/* ======================================================== */}
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-base sm:text-lg text-white">
                Live Station Physics & Capability Estimator
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tweak local station parameters to observe how ORBITOPS computes link budget throughput in real-time.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-500/30">
            Capability Index: {capacityQualityScore} / 100
          </span>
        </div>

        {/* 3 Physical Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Rain/Snow Fading dB */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                Weather Rain/Snow Loss:
              </span>
              <strong className="text-amber-400">{rainSliderDb.toFixed(1)} dB</strong>
            </div>
            <input
              type="range"
              min="0.0"
              max="4.0"
              step="0.2"
              value={rainSliderDb}
              onChange={(e) => setRainSliderDb(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">
              0.0 dB (Clear polar air) → 4.0 dB (Heavy blizzard/monsoon)
            </span>
          </div>

          {/* Slider 2: Motor Slew Speed */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-purple-400" />
                Antenna Slew Speed:
              </span>
              <strong className="text-purple-300">{slewSliderDegSec.toFixed(1)}°/s</strong>
            </div>
            <input
              type="range"
              min="0.8"
              max="3.0"
              step="0.1"
              value={slewSliderDegSec}
              onChange={(e) => setSlewSliderDegSec(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">
              0.8°/s (Heavy 10m dish) → 3.0°/s (Agile 4m terminal)
            </span>
          </div>

          {/* Slider 3: Ground Fiber Backhaul */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                Fiber Backhaul Bandwidth:
              </span>
              <strong className="text-emerald-400">{backhaulSliderGbps.toFixed(1)} Gbps</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={backhaulSliderGbps}
              onChange={(e) => setBackhaulSliderGbps(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">
              1.0 Gbps (Microwave/Sat relay) → 10.0 Gbps (Subsea Arctic fiber)
            </span>
          </div>
        </div>

        {/* Real-time Output Metric Card */}
        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold">
              ACM
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">ESTIMATED MAXIMUM PHYSICAL THROUGHPUT</span>
              <span className="text-lg font-black text-white">{estimatedPeakBitrate} Mbps</span>
              <span className="text-slate-400 ml-2">(Slew overhead: {estimatedSlewTurnTimeSec}s turn)</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-slate-400 text-[10px] block">ORBITOPS ADMISSIBILITY DECISION</span>
            {estimatedPeakBitrate > 800 ? (
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                ADMISSIBLE FOR HIGH-PRIORITY 40+ GB PASSES
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                DOWNGRADED TO ROUTINE TELEMETRY ONLY
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Strip */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-sky-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition shadow-2xs cursor-pointer w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page (Algorithm & 180° Sky Horizon)</span>
        </button>

        {onNavigateToUsp2 && (
          <button
            onClick={onNavigateToUsp2}
            className="flex items-center gap-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl transition shadow-2xs cursor-pointer w-full sm:w-auto justify-center"
          >
            <span>Proceed to USP 2: Pre-Computed Failure Playbooks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
