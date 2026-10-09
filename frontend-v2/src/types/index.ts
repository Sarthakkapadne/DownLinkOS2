export type PriorityLevel = 1 | 2 | 3; // 1 = Highest (Emergency), 2 = High, 3 = Routine (lower number = better)

export interface Satellite {
  id: string;
  name: string;
  noradId: number;
  constellation: string;
  altitudeKm: number;
  orbitType: string;
  dataType: string;
  targetMission: string;
  priority: PriorityLevel;
  priorityLabel: string;
  priorityColor: string;
  ssrCapacityGb: number;
  ssrUtilizedGb: number;
  ssrFreeGb: number;
  passDataVolumeGb: number;
  position: {
    elevationDeg: number;
    azimuthDeg: number;
    status: 'ZENITH_PEAK' | 'DESCENDING_LOS' | 'ASCENDING_AOS';
    skyXPercent: number;
    skyYPercent: number;
  };
  window: {
    aosUtc: string;
    losUtc: string;
    timeRemainingSec: number;
    totalDurationSec: number;
  };
}

export interface GroundStation {
  id: string;
  name: string;
  code: string;
  location: string;
  coordinates: string;
  elevationMaskDeg: number;
  dishDiameterM: number;
  maxSlewRateDegPerSec: number;
  status: 'ACTIVE_TRACKING' | 'SLEWING' | 'IDLE';
  currentElevationDeg: number;
  currentAzimuthDeg: number;
  activeSatelliteId: string | null;
  transferredGb: number;
  totalTargetGb: number;
  currentBitrateMbps: number;
}

export interface PreConditionRule {
  id: string;
  ruleNumber: number;
  title: string;
  badge: string;
  simpleQuestion: string;
  whatItMeans: string;
  whyItMatters: string;
  dangerIfIgnored: string;
  iconType: 'priority' | 'slew' | 'cable' | 'elevation' | 'time' | 'storage' | 'checkpoint';
}

export interface SimpleAlgorithmCase {
  id: number;
  stepNumber: number;
  phaseTitle: string;
  badge: string;
  headline: string;
  storyContext: string;
  naiveMistake: string;
  whyItFailsInRealLife: string[];
  smartAlgorithmChoice: string;
  simpleOutcomeSummary: string;
  miniVisualState: {
    dishAngleDeg: number;
    dishElevationDeg: number;
    connectedSatelliteId: string | null;
    highlightSatelliteId: string | null;
    slewPathTargetId: string | null;
    isSlewing: boolean;
    bitrateMbps: number;
    alertMessage: string;
    alertType: 'warning' | 'success' | 'info';
    transferredGb: number;
    targetGb: number;
    checkpointSavedGb?: number;
    isNextPass?: boolean;
    showCharts?: boolean;
  };
}

export interface EfficiencyMetrics {
  orbitopsDataDeliveredGb: number;
  fcfsDataDeliveredGb: number;
  dataGainPercent: number;
  retransmissionWastedGbFcfs: number;
  retransmissionWastedGbOrbitops: number;
  bufferOverflowsFcfs: number;
  bufferOverflowsOrbitops: number;
  antennaUtilizationFcfs: number;
  antennaUtilizationOrbitops: number;
}
