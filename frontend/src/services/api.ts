import {
  PassOpportunity,
  GroundStation,
  Satellite,
  ScheduledContact,
  DisruptionState
} from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export class ApiService {
  /**
   * Health check to see if backend is running.
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch('http://127.0.0.1:8000/', { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Call backend CP-SAT optimizer.
   */
  static async optimizeSchedule(
    passes: PassOpportunity[],
    stations: GroundStation[],
    satellites: Satellite[],
    offlineStationId?: string | null
  ) {
    const res = await fetch(`${API_BASE_URL}/schedule/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passes,
        stations,
        satellites,
        offline_station_id: offlineStationId,
        max_solve_time_seconds: 5.0
      })
    });
    if (!res.ok) throw new Error('CP-SAT optimization request failed');
    return res.json();
  }

  /**
   * Call backend reactive disruption replanner.
   */
  static async handleDisruption(
    offlineStationId: string,
    currentMinute: number,
    originalSchedule: ScheduledContact[],
    passes: PassOpportunity[],
    stations: GroundStation[],
    satellites: Satellite[]
  ): Promise<DisruptionState> {
    const res = await fetch(`${API_BASE_URL}/schedule/disrupt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        offline_station_id: offlineStationId,
        current_mission_time_min: currentMinute,
        original_schedule: originalSchedule,
        passes,
        stations,
        satellites
      })
    });
    if (!res.ok) throw new Error('Disruption replan request failed');
    const data = await res.json();
    return {
      disruptedStationId: data.disrupted_station_id,
      disruptionStartTimeMin: currentMinute,
      passesPreserved: data.passes_preserved,
      passesRerouted: data.passes_rerouted,
      passesDropped: data.passes_dropped,
      valueRetainedPct: data.value_retained_pct,
      replanLatencyMs: data.replan_latency_ms,
      churnCount: data.churn_count
    };
  }
}
