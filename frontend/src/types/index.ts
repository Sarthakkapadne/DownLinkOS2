export type PriorityTier = 1 | 2 | 3 | 4 | 5;

export interface Satellite {
  id: string;
  name: string;
  constellation: 'PlanetScope' | 'SkySat' | 'Pelican';
  ssrCapacityGb: number;
  currentBufferGb: number;
  dataGenRateGbPerOrbit: number;
  maxSspaPowerW: number;
  thermalCooldownMin: number;
  lastContactEndTime: number | null;
  priority: PriorityTier;
  color: string;
}

export interface GroundStation {
  id: string;
  name: string;
  code: string;
  location: string;
  lat: number;
  lon: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';
  currentCableDeg: number;
  dishDiameterM: number;
  rainAttenuationDb: number;
  elevationMaskDeg: number;
  maxSlewRateDegSec: number;
}

export interface PassOpportunity {
  id: string;
  satelliteId: string;
  satelliteName: string;
  stationId: string;
  stationName: string;
  aosMinutes: number; // Minutes from 00:00 UTC (0-1440)
  losMinutes: number;
  durationMinutes: number;
  maxElevationDeg: number;
  priority: PriorityTier;
  dataVolumeGb: number;
  isKeyholeRisk: boolean; // Elevation > 85 deg
  cableAngleAos: number;
  cableAngleLos: number;
  satelliteBufferAtAos: number; // GB in buffer
  bufferFillPct: number;
  freshnessMin: number;
}

export interface ScheduledContact {
  id: string;
  passId: string;
  satelliteId: string;
  satelliteName: string;
  stationId: string;
  stationName: string;
  startMinutes: number;
  endMinutes: number;
  durationMinutes: number;
  deliveredVolumeGb: number;
  priority: PriorityTier;
  isFrozen: boolean;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'PREEMPTED' | 'REROUTED';
  rejectionReason?: string;
  selectionRationale?: string;
  priceOfForcing?: number; // Value cost if this pass was displaced
  cableAngleStart: number;
  cableAngleEnd: number;
}

export interface RejectedPass extends PassOpportunity {
  reasonCode: 
    | 'ANTENNA_CONTENTION'
    | 'BUFFER_NOT_CRITICAL'
    | 'CABLE_WRAP_VIOLATION'
    | 'SSPA_THERMAL_COOLING'
    | 'ZENITH_KEYHOLE_SLEW_LIMIT'
    | 'SETUP_TIME_STARVATION'
    | 'SOLAR_RFI_BLINDING';
  reasonExplanation: string;
  competingPassId?: string;
  competingSatelliteName?: string;
  priceOfForcingPenalty: number; // Score lost if forced
}

export interface ScheduleMetrics {
  totalDeliveredGb: number;
  priorityWeightedScore: number;
  bufferOverflowCount: number;
  antennaUtilizationPct: number;
  scheduledCount: number;
  rejectedCount: number;
  emergencyFulfillmentPct: number; // Priority 4 & 5
  averageLatencyMinutes: number;
  optimalityGapPct?: number;
  validatorViolations: number;
  solverStatus?: string;
}

export interface DisruptionState {
  disruptedStationId: string | null;
  disruptionStartTimeMin: number | null;
  passesPreserved: number;
  passesRerouted: number;
  passesDropped: number;
  valueRetainedPct: number;
  replanLatencyMs: number;
  churnCount: number;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  satellites: Satellite[];
  stations: GroundStation[];
  passes: PassOpportunity[];
  horizonMinutes: number;
}
