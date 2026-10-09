import React, { useState } from 'react';
import { Header } from './components/Header';
import { SkyHorizonView } from './components/SkyHorizonView';
import { PreConditionsGrid } from './components/PreConditionsGrid';
import { AlgorithmWalkthrough } from './components/AlgorithmWalkthrough';
import { INITIAL_SATELLITES, INITIAL_GROUND_STATION } from './data/scenarioData';
import { Satellite, GroundStation } from './types';
import { 
  ArrowDown, 
  Cpu, 
  ShieldCheck, 
  Radio, 
  Layers, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export const App: React.FC = () => {
  const [satellites] = useState<Satellite[]>(INITIAL_SATELLITES);
  const [groundStation] = useState<GroundStation>(INITIAL_GROUND_STATION);
  const [activeSatelliteId, setActiveSatelliteId] = useState<string>('sat-1');

  const activeSat = satellites.find((s) => s.id === activeSatelliteId) || satellites[0];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-sky-200 selection:text-sky-900">
      {/* 1. Global Mission Header */}
      <Header
        currentUtcTime="01:12:45 UTC"
        activeSatelliteName={activeSat.name}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Intro / Context Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden border border-slate-800">
          <div className="relative z-10 max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
              <Cpu className="w-3.5 h-3.5" />
              PHYSICS-GROUNDED SCHEDULING ENGINE
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Real-Time Horizon Deconfliction & Downlink Allocation
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              At polar ground stations like KSAT Svalbard (78.2°N), multiple Earth Observation satellites cross the horizon at the exact same minute. Below is the live sky geometry showing 3 competing spacecraft and how ORBITOPS intelligently allocates limited ground dish time without dropping urgent data or overloading onboard memory.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToSection('preconditions-section')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-sm cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>See The 6 Physical Rules</span>
              </button>
              <button
                onClick={() => scrollToSection('algorithm-walkthrough-section')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700 cursor-pointer"
              >
                <span>Step-by-Step Algorithm</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Decorative Background Symbol */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
            <Radio className="w-72 h-72 text-white" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 1: TOP 180° HORIZON SKY SCENE WITH 3 SATELLITES  */}
        {/* ======================================================== */}
        <section aria-label="180-Degree Sky Horizon Scene">
          <SkyHorizonView
            satellites={satellites}
            groundStation={groundStation}
            activeSatelliteId={activeSatelliteId}
            onSelectSatellite={setActiveSatelliteId}
          />
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: THE 6 REAL-WORLD RULES / PRE-CONDITIONS       */}
        {/* ======================================================== */}
        <section id="preconditions-section" aria-label="The 6 Pre-Conditions Evaluated Before Decisions">
          <PreConditionsGrid />
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: 2-PANE ALGORITHM CASES WALKTHROUGH            */}
        {/* ======================================================== */}
        <section id="algorithm-walkthrough-section" aria-label="Step-by-Step Algorithm Walkthrough">
          <AlgorithmWalkthrough
            satellites={satellites}
            groundStation={groundStation}
          />
        </section>

      </main>

      {/* Enterprise Mission Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ORBITOPS (DownlinkOS)</span>
            <span>· Planet Labs Challenge SPACE-04</span>
            <span className="text-slate-600 hidden md:inline">· Autonomous Ground Station Decision Support</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Invariants: <strong className="text-emerald-700">0 Violations</strong></span>
            <span>Checkpoints: <strong className="text-teal-700">CFDP Class 2 Saved</strong></span>
            <span>Memory Retention: <strong className="text-slate-800">100% Buffer Safety</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
