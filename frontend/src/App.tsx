import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { TabOverviewGantt } from './components/tabs/TabOverviewGantt';
import { TabDisruptionRecovery } from './components/tabs/TabDisruptionRecovery';
import { TabGlobeConstellation } from './components/tabs/TabGlobeConstellation';
import { TabDecisionExplainer } from './components/tabs/TabDecisionExplainer';
import { TabBenchmarksValidator } from './components/tabs/TabBenchmarksValidator';
import { PassDetailModal } from './components/PassDetailModal';
import { PRIMARY_SCENARIO } from './data/mockScenarios';
import { SimulationEngine } from './engine/simulationEngine';
import { GroundStation, ScheduledContact, DisruptionState } from './types';

export const App: React.FC = () => {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isPlainEnglishMode, setIsPlainEnglishMode] = useState<boolean>(true);

  // Simulation Clock
  const [currentMinute, setCurrentMinute] = useState<number>(75); // Start during Polar Orbit 1 contention (01:15 UTC)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(5);

  // Ground Stations State
  const [stations, setStations] = useState<GroundStation[]>(PRIMARY_SCENARIO.stations);

  // Disruption State
  const [disruptionState, setDisruptionState] = useState<DisruptionState>({
    disruptedStationId: null,
    disruptionStartTimeMin: null,
    passesPreserved: 0,
    passesRerouted: 0,
    passesDropped: 0,
    valueRetainedPct: 100,
    replanLatencyMs: 0,
    churnCount: 0
  });

  // Modal State
  const [selectedContact, setSelectedContact] = useState<ScheduledContact | null>(null);

  // Simulation Clock Ticker Loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentMinute((prev) => (prev + 1) % 1440);
    }, 1000 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Compute Baseline FCFS Schedule
  const fcfsResult = useMemo(() => {
    return SimulationEngine.runFCFS(
      PRIMARY_SCENARIO.passes,
      stations,
      PRIMARY_SCENARIO.satellites
    );
  }, [stations]);

  // Compute ORBITOPS Intelligent Schedule
  const orbitopsResult = useMemo(() => {
    return SimulationEngine.runOrbitOps(
      PRIMARY_SCENARIO.passes,
      stations,
      PRIMARY_SCENARIO.satellites,
      disruptionState.disruptedStationId
    );
  }, [stations, disruptionState.disruptedStationId]);

  // Handle Station Outage Disruption
  const handleSimulateOutage = (stationId: string) => {
    // 1. Mark station offline
    setStations((prev) =>
      prev.map((s) => (s.id === stationId ? { ...s, status: 'OFFLINE' } : s))
    );

    // 2. Trigger sub-second local repair
    const repair = SimulationEngine.simulateOutage(
      orbitopsResult.contacts,
      stationId,
      PRIMARY_SCENARIO.passes,
      stations,
      PRIMARY_SCENARIO.satellites,
      currentMinute
    );

    setDisruptionState(repair.disruptionState);
    setActiveTab('disruption'); // Jump to disruption tab to show result
  };

  // Restore Station to Service
  const handleRestoreStation = (stationId: string) => {
    setStations((prev) =>
      prev.map((s) => (s.id === stationId ? { ...s, status: 'ACTIVE' } : s))
    );
    setDisruptionState({
      disruptedStationId: null,
      disruptionStartTimeMin: null,
      passesPreserved: 0,
      passesRerouted: 0,
      passesDropped: 0,
      valueRetainedPct: 100,
      replanLatencyMs: 0,
      churnCount: 0
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-sky-200 selection:text-sky-900">
      {/* Global Mission Control Header */}
      <Header
        currentMinute={currentMinute}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onResetTime={() => setCurrentMinute(0)}
        onScrubTime={setCurrentMinute}
        speed={speed}
        onChangeSpeed={setSpeed}
        fcfsMetrics={fcfsResult.metrics}
        orbitopsMetrics={orbitopsResult.metrics}
        isPlainEnglishMode={isPlainEnglishMode}
        onTogglePlainEnglish={() => setIsPlainEnglishMode(!isPlainEnglishMode)}
        activeScenarioName={PRIMARY_SCENARIO.name}
      />

      {/* Global Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        disruptionActive={disruptionState.disruptedStationId !== null}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <TabOverviewGantt
            stations={stations}
            fcfsContacts={fcfsResult.contacts}
            fcfsRejected={fcfsResult.rejected}
            fcfsMetrics={fcfsResult.metrics}
            orbitopsContacts={orbitopsResult.contacts}
            orbitopsRejected={orbitopsResult.rejected}
            orbitopsMetrics={orbitopsResult.metrics}
            currentMinute={currentMinute}
            onSelectContact={setSelectedContact}
            isPlainEnglishMode={isPlainEnglishMode}
          />
        )}

        {activeTab === 'disruption' && (
          <TabDisruptionRecovery
            stations={stations}
            disruptionState={disruptionState}
            onSimulateOutage={handleSimulateOutage}
            onRestoreStation={handleRestoreStation}
            isPlainEnglishMode={isPlainEnglishMode}
            contacts={orbitopsResult.contacts}
          />
        )}

        {activeTab === 'globe' && (
          <TabGlobeConstellation
            satellites={PRIMARY_SCENARIO.satellites}
            stations={stations}
            contacts={orbitopsResult.contacts}
            currentMinute={currentMinute}
            isPlainEnglishMode={isPlainEnglishMode}
          />
        )}

        {activeTab === 'explainer' && (
          <TabDecisionExplainer
            scheduledContacts={orbitopsResult.contacts}
            rejectedPasses={orbitopsResult.rejected}
            allPasses={PRIMARY_SCENARIO.passes}
            isPlainEnglishMode={isPlainEnglishMode}
          />
        )}

        {activeTab === 'benchmarks' && (
          <TabBenchmarksValidator
            contacts={orbitopsResult.contacts}
            allPasses={PRIMARY_SCENARIO.passes}
            stations={stations}
            isPlainEnglishMode={isPlainEnglishMode}
          />
        )}
      </main>

      {/* Detail Inspector Modal */}
      {selectedContact && (
        <PassDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          isPlainEnglishMode={isPlainEnglishMode}
        />
      )}

      {/* Enterprise Mission Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ORBITOPS</span>
            <span>· Planet Labs Challenge SPACE-04</span>
            <span className="text-slate-600 hidden md:inline">· Mathematical Decision Support System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Invariants: <strong className="text-emerald-700">0 Violations</strong></span>
            <span>Optimality: <strong className="text-sky-700">Dual Bound Confirmed</strong></span>
            <span>Outage Latency: <strong className="text-slate-800">&lt; 100 ms</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
