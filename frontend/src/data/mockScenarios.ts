import { Satellite, GroundStation, PassOpportunity, ScenarioDefinition } from '../types';

export const INITIAL_GROUND_STATIONS: GroundStation[] = [
  {
    id: 'KSAT-Svalbard-1',
    name: 'KSAT Svalbard Ant-1',
    code: 'SVA-1',
    location: 'Spitsbergen, Norway (78.2°N, 15.6°E)',
    lat: 78.2232,
    lon: 15.6267,
    status: 'ACTIVE',
    currentCableDeg: 12.0,
    dishDiameterM: 7.3,
    rainAttenuationDb: 0.1,
    elevationMaskDeg: 5.0,
    maxSlewRateDegSec: 12.0
  },
  {
    id: 'KSAT-Svalbard-2',
    name: 'KSAT Svalbard Ant-2',
    code: 'SVA-2',
    location: 'Spitsbergen, Norway (78.2°N, 15.6°E)',
    lat: 78.2250,
    lon: 15.6310,
    status: 'ACTIVE',
    currentCableDeg: -45.0,
    dishDiameterM: 11.0,
    rainAttenuationDb: 0.1,
    elevationMaskDeg: 5.0,
    maxSlewRateDegSec: 10.0
  },
  {
    id: 'Inuvik-1',
    name: 'SSC Inuvik Station Ant-1',
    code: 'INU-1',
    location: 'Northwest Territories, Canada (68.3°N, 133.5°W)',
    lat: 68.3607,
    lon: -133.5312,
    status: 'ACTIVE',
    currentCableDeg: 80.0,
    dishDiameterM: 7.3,
    rainAttenuationDb: 0.2,
    elevationMaskDeg: 5.0,
    maxSlewRateDegSec: 12.0
  },
  {
    id: 'Troll-1',
    name: 'KSAT TrollSat Ant-1',
    code: 'TRL-1',
    location: 'Queen Maud Land, Antarctica (72.0°S, 2.5°E)',
    lat: -72.0114,
    lon: 2.5350,
    status: 'ACTIVE',
    currentCableDeg: -110.0,
    dishDiameterM: 7.3,
    rainAttenuationDb: 0.05,
    elevationMaskDeg: 5.0,
    maxSlewRateDegSec: 12.0
  },
  {
    id: 'PuntaArenas-1',
    name: 'SSC Punta Arenas Ant-1',
    code: 'PUQ-1',
    location: 'Patagonia, Chile (53.1°S, 70.9°W)',
    lat: -53.1368,
    lon: -70.9083,
    status: 'ACTIVE',
    currentCableDeg: 15.0,
    dishDiameterM: 5.4,
    rainAttenuationDb: 0.4,
    elevationMaskDeg: 5.0,
    maxSlewRateDegSec: 15.0
  }
];

export const INITIAL_SATELLITES: Satellite[] = [
  {
    id: 'SuperDove-2101',
    name: 'SuperDove-2101 (Flock 4p)',
    constellation: 'PlanetScope',
    ssrCapacityGb: 256,
    currentBufferGb: 198,
    dataGenRateGbPerOrbit: 32,
    maxSspaPowerW: 25,
    thermalCooldownMin: 20,
    lastContactEndTime: null,
    priority: 3,
    color: '#0284C7' // Sky 600
  },
  {
    id: 'SuperDove-2104',
    name: 'SuperDove-2104 (Disaster Rapid Task)',
    constellation: 'PlanetScope',
    ssrCapacityGb: 256,
    currentBufferGb: 242, // 94% full! High risk of overflow
    dataGenRateGbPerOrbit: 45,
    maxSspaPowerW: 25,
    thermalCooldownMin: 20,
    lastContactEndTime: null,
    priority: 5, // Top priority emergency
    color: '#E11D48' // Rose 600
  },
  {
    id: 'SuperDove-2108',
    name: 'SuperDove-2108 (Agricultural Belt)',
    constellation: 'PlanetScope',
    ssrCapacityGb: 256,
    currentBufferGb: 140,
    dataGenRateGbPerOrbit: 28,
    maxSspaPowerW: 25,
    thermalCooldownMin: 20,
    lastContactEndTime: null,
    priority: 2,
    color: '#10B981' // Emerald 500
  },
  {
    id: 'SkySat-C14',
    name: 'SkySat-C14 (Sub-meter Video)',
    constellation: 'SkySat',
    ssrCapacityGb: 512,
    currentBufferGb: 430, // 84% full
    dataGenRateGbPerOrbit: 60,
    maxSspaPowerW: 40,
    thermalCooldownMin: 35,
    lastContactEndTime: null,
    priority: 4,
    color: '#8B5CF6' // Purple 500
  },
  {
    id: 'Pelican-01',
    name: 'Pelican-01 (Very High Res Agile)',
    constellation: 'Pelican',
    ssrCapacityGb: 1024,
    currentBufferGb: 710,
    dataGenRateGbPerOrbit: 90,
    maxSspaPowerW: 50,
    thermalCooldownMin: 30,
    lastContactEndTime: null,
    priority: 4,
    color: '#F59E0B' // Amber 500
  },
  {
    id: 'SuperDove-2112',
    name: 'SuperDove-2112 (Routine Background)',
    constellation: 'PlanetScope',
    ssrCapacityGb: 256,
    currentBufferGb: 85,
    dataGenRateGbPerOrbit: 25,
    maxSspaPowerW: 25,
    thermalCooldownMin: 20,
    lastContactEndTime: null,
    priority: 1, // Calibration / routine
    color: '#64748B' // Slate 500
  },
  {
    id: 'SuperDove-2115',
    name: 'SuperDove-2115 (Maritime Coastal)',
    constellation: 'PlanetScope',
    ssrCapacityGb: 256,
    currentBufferGb: 185,
    dataGenRateGbPerOrbit: 30,
    maxSspaPowerW: 25,
    thermalCooldownMin: 20,
    lastContactEndTime: null,
    priority: 3,
    color: '#06B6D4' // Cyan 500
  },
  {
    id: 'SuperDove-2120',
    name: 'SuperDove-2120 (Forestry Monitoring)',
    constellation: 'PlanetScope',
    ssrCapacityGb: 256,
    currentBufferGb: 220, // 86% full
    dataGenRateGbPerOrbit: 35,
    maxSspaPowerW: 25,
    thermalCooldownMin: 20,
    lastContactEndTime: null,
    priority: 3,
    color: '#14B8A6' // Teal 500
  }
];

// Helper to convert HH:MM to minutes from midnight
export const timeToMin = (hh: number, mm: number) => hh * 60 + mm;
export const minToTimeStr = (min: number) => {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} UTC`;
};

// Realistic pass opportunities over a 24-hour simulation cycle (1440 minutes)
export const RAW_PASS_OPPORTUNITIES: PassOpportunity[] = [
  // --- ORBIT 1 CONVERGENCE (01:00 - 02:30 UTC) ---
  // Contention cluster at Svalbard: P1 routine arrives 2 min before P5 emergency!
  {
    id: 'PASS-101',
    satelliteId: 'SuperDove-2112',
    satelliteName: 'SuperDove-2112',
    stationId: 'KSAT-Svalbard-1',
    stationName: 'KSAT Svalbard Ant-1',
    aosMinutes: 70, // 01:10 UTC
    losMinutes: 81, // 01:21 UTC (11 min)
    durationMinutes: 11,
    maxElevationDeg: 42.0,
    priority: 1, // LOW PRIORITY
    dataVolumeGb: 14.5,
    isKeyholeRisk: false,
    cableAngleAos: 15.0,
    cableAngleLos: 75.0,
    satelliteBufferAtAos: 85,
    bufferFillPct: 33,
    freshnessMin: 45
  },
  {
    id: 'PASS-102',
    satelliteId: 'SuperDove-2104',
    satelliteName: 'SuperDove-2104 (Disaster Task)',
    stationId: 'KSAT-Svalbard-1',
    stationName: 'KSAT Svalbard Ant-1',
    aosMinutes: 73, // 01:13 UTC (Overlaps PASS-101!)
    losMinutes: 84, // 01:24 UTC
    durationMinutes: 11,
    maxElevationDeg: 82.5,
    priority: 5, // CRITICAL EMERGENCY PRIORITY
    dataVolumeGb: 38.2, // High volume due to steep pass
    isKeyholeRisk: false,
    cableAngleAos: 20.0,
    cableAngleLos: 88.0,
    satelliteBufferAtAos: 242,
    bufferFillPct: 94.5,
    freshnessMin: 12
  },
  {
    id: 'PASS-103',
    satelliteId: 'SuperDove-2101',
    satelliteName: 'SuperDove-2101',
    stationId: 'KSAT-Svalbard-2',
    stationName: 'KSAT Svalbard Ant-2',
    aosMinutes: 78, // 01:18 UTC
    losMinutes: 89, // 01:29 UTC
    durationMinutes: 11,
    maxElevationDeg: 68.0,
    priority: 3,
    dataVolumeGb: 26.4,
    isKeyholeRisk: false,
    cableAngleAos: -30.0,
    cableAngleLos: 40.0,
    satelliteBufferAtAos: 198,
    bufferFillPct: 77.3,
    freshnessMin: 28
  },
  {
    id: 'PASS-104',
    satelliteId: 'SkySat-C14',
    satelliteName: 'SkySat-C14',
    stationId: 'Inuvik-1',
    stationName: 'SSC Inuvik Station Ant-1',
    aosMinutes: 115, // 01:55 UTC
    losMinutes: 126, // 02:06 UTC
    durationMinutes: 11,
    maxElevationDeg: 74.0,
    priority: 4,
    dataVolumeGb: 58.0,
    isKeyholeRisk: false,
    cableAngleAos: 70.0,
    cableAngleLos: 145.0,
    satelliteBufferAtAos: 430,
    bufferFillPct: 83.9,
    freshnessMin: 18
  },
  {
    id: 'PASS-105',
    satelliteId: 'Pelican-01',
    satelliteName: 'Pelican-01',
    stationId: 'Inuvik-1',
    stationName: 'SSC Inuvik Station Ant-1',
    aosMinutes: 122, // 02:02 UTC (Overlaps PASS-104!)
    losMinutes: 134, // 02:14 UTC
    durationMinutes: 12,
    maxElevationDeg: 87.2, // KEYHOLE SINGULARITY RISK (>85°)
    priority: 4,
    dataVolumeGb: 72.5,
    isKeyholeRisk: true,
    cableAngleAos: 65.0,
    cableAngleLos: 185.0,
    satelliteBufferAtAos: 710,
    bufferFillPct: 69.3,
    freshnessMin: 22
  },

  // --- ORBIT 2 CONVERGENCE (02:45 - 04:15 UTC) ---
  {
    id: 'PASS-201',
    satelliteId: 'SuperDove-2108',
    satelliteName: 'SuperDove-2108',
    stationId: 'Troll-1',
    stationName: 'KSAT TrollSat Ant-1',
    aosMinutes: 180, // 03:00 UTC
    losMinutes: 191, // 03:11 UTC
    durationMinutes: 11,
    maxElevationDeg: 55.0,
    priority: 2,
    dataVolumeGb: 21.0,
    isKeyholeRisk: false,
    cableAngleAos: -105.0,
    cableAngleLos: -40.0,
    satelliteBufferAtAos: 140,
    bufferFillPct: 54.6,
    freshnessMin: 65
  },
  {
    id: 'PASS-202',
    satelliteId: 'SuperDove-2120',
    satelliteName: 'SuperDove-2120',
    stationId: 'Troll-1',
    stationName: 'KSAT TrollSat Ant-1',
    aosMinutes: 188, // 03:08 UTC (Overlaps PASS-201)
    losMinutes: 199, // 03:19 UTC
    durationMinutes: 11,
    maxElevationDeg: 79.0,
    priority: 3,
    dataVolumeGb: 29.5,
    isKeyholeRisk: false,
    cableAngleAos: -90.0,
    cableAngleLos: -15.0,
    satelliteBufferAtAos: 220,
    bufferFillPct: 85.9,
    freshnessMin: 30
  },
  {
    id: 'PASS-203',
    satelliteId: 'SuperDove-2104',
    satelliteName: 'SuperDove-2104 (Disaster Task)',
    stationId: 'PuntaArenas-1',
    stationName: 'SSC Punta Arenas Ant-1',
    aosMinutes: 215, // 03:35 UTC
    losMinutes: 224, // 03:44 UTC
    durationMinutes: 9,
    maxElevationDeg: 46.0,
    priority: 5,
    dataVolumeGb: 24.8,
    isKeyholeRisk: false,
    cableAngleAos: 10.0,
    cableAngleLos: 60.0,
    satelliteBufferAtAos: 210,
    bufferFillPct: 82.0,
    freshnessMin: 15
  },

  // --- ORBIT 3 POLAR CONVERGENCE (04:30 - 06:15 UTC) ---
  {
    id: 'PASS-301',
    satelliteId: 'SuperDove-2101',
    satelliteName: 'SuperDove-2101',
    stationId: 'KSAT-Svalbard-1',
    stationName: 'KSAT Svalbard Ant-1',
    aosMinutes: 280, // 04:40 UTC
    losMinutes: 291,
    durationMinutes: 11,
    maxElevationDeg: 62.0,
    priority: 3,
    dataVolumeGb: 25.0,
    isKeyholeRisk: false,
    cableAngleAos: 25.0,
    cableAngleLos: 85.0,
    satelliteBufferAtAos: 230, // Getting fuller!
    bufferFillPct: 89.8,
    freshnessMin: 50
  },
  {
    id: 'PASS-302',
    satelliteId: 'SuperDove-2115',
    satelliteName: 'SuperDove-2115',
    stationId: 'KSAT-Svalbard-1',
    stationName: 'KSAT Svalbard Ant-1',
    aosMinutes: 286, // Overlaps 301
    losMinutes: 297,
    durationMinutes: 11,
    maxElevationDeg: 58.0,
    priority: 3,
    dataVolumeGb: 23.4,
    isKeyholeRisk: false,
    cableAngleAos: 30.0,
    cableAngleLos: 90.0,
    satelliteBufferAtAos: 185,
    bufferFillPct: 72.2,
    freshnessMin: 40
  },
  {
    id: 'PASS-303',
    satelliteId: 'SkySat-C14',
    satelliteName: 'SkySat-C14',
    stationId: 'KSAT-Svalbard-2',
    stationName: 'KSAT Svalbard Ant-2',
    aosMinutes: 290,
    losMinutes: 302,
    durationMinutes: 12,
    maxElevationDeg: 81.0,
    priority: 4,
    dataVolumeGb: 64.0,
    isKeyholeRisk: false,
    cableAngleAos: -35.0,
    cableAngleLos: 55.0,
    satelliteBufferAtAos: 400,
    bufferFillPct: 78.1,
    freshnessMin: 25
  },

  // --- ORBIT 4 POLAR CONVERGENCE (06:30 - 08:30 UTC) ---
  {
    id: 'PASS-401',
    satelliteId: 'SuperDove-2104',
    satelliteName: 'SuperDove-2104 (Disaster Task)',
    stationId: 'Inuvik-1',
    stationName: 'SSC Inuvik Station Ant-1',
    aosMinutes: 410, // 06:50 UTC
    losMinutes: 421,
    durationMinutes: 11,
    maxElevationDeg: 78.0,
    priority: 5,
    dataVolumeGb: 36.0,
    isKeyholeRisk: false,
    cableAngleAos: 75.0,
    cableAngleLos: 155.0,
    satelliteBufferAtAos: 190,
    bufferFillPct: 74.2,
    freshnessMin: 20
  },
  {
    id: 'PASS-402',
    satelliteId: 'Pelican-01',
    satelliteName: 'Pelican-01',
    stationId: 'Inuvik-1',
    stationName: 'SSC Inuvik Station Ant-1',
    aosMinutes: 416, // Contention with P5!
    losMinutes: 428,
    durationMinutes: 12,
    maxElevationDeg: 65.0,
    priority: 4,
    dataVolumeGb: 68.0,
    isKeyholeRisk: false,
    cableAngleAos: 80.0,
    cableAngleLos: 160.0,
    satelliteBufferAtAos: 680,
    bufferFillPct: 66.4,
    freshnessMin: 35
  },

  // --- ORBIT 5 MIDDAY HARVEST (09:00 - 12:00 UTC) ---
  {
    id: 'PASS-501',
    satelliteId: 'SuperDove-2108',
    satelliteName: 'SuperDove-2108',
    stationId: 'KSAT-Svalbard-1',
    stationName: 'KSAT Svalbard Ant-1',
    aosMinutes: 560,
    losMinutes: 571,
    durationMinutes: 11,
    maxElevationDeg: 49.0,
    priority: 2,
    dataVolumeGb: 18.0,
    isKeyholeRisk: false,
    cableAngleAos: 10.0,
    cableAngleLos: 70.0,
    satelliteBufferAtAos: 195,
    bufferFillPct: 76.1,
    freshnessMin: 70
  },
  {
    id: 'PASS-502',
    satelliteId: 'SuperDove-2120',
    satelliteName: 'SuperDove-2120',
    stationId: 'KSAT-Svalbard-2',
    stationName: 'KSAT Svalbard Ant-2',
    aosMinutes: 565,
    losMinutes: 576,
    durationMinutes: 11,
    maxElevationDeg: 72.0,
    priority: 3,
    dataVolumeGb: 27.5,
    isKeyholeRisk: false,
    cableAngleAos: -20.0,
    cableAngleLos: 50.0,
    satelliteBufferAtAos: 248, // 96.8% BUFFER OVERFLOW IMMINENT!
    bufferFillPct: 96.8,
    freshnessMin: 45
  },
  {
    id: 'PASS-503',
    satelliteId: 'SuperDove-2112',
    satelliteName: 'SuperDove-2112',
    stationId: 'KSAT-Svalbard-2',
    stationName: 'KSAT Svalbard Ant-2',
    aosMinutes: 562, // Arrives 3 min before 502! FCFS picks this low priority pass!
    losMinutes: 573,
    durationMinutes: 11,
    maxElevationDeg: 40.0,
    priority: 1,
    dataVolumeGb: 13.0,
    isKeyholeRisk: false,
    cableAngleAos: -15.0,
    cableAngleLos: 45.0,
    satelliteBufferAtAos: 95,
    bufferFillPct: 37.1,
    freshnessMin: 85
  },

  // --- ORBIT 6 AFTERNOON PASSES (13:00 - 16:30 UTC) ---
  {
    id: 'PASS-601',
    satelliteId: 'SuperDove-2101',
    satelliteName: 'SuperDove-2101',
    stationId: 'Troll-1',
    stationName: 'KSAT TrollSat Ant-1',
    aosMinutes: 800,
    losMinutes: 811,
    durationMinutes: 11,
    maxElevationDeg: 66.0,
    priority: 3,
    dataVolumeGb: 26.0,
    isKeyholeRisk: false,
    cableAngleAos: -100.0,
    cableAngleLos: -30.0,
    satelliteBufferAtAos: 250, // 97% Full!
    bufferFillPct: 97.6,
    freshnessMin: 60
  },
  {
    id: 'PASS-602',
    satelliteId: 'SuperDove-2115',
    satelliteName: 'SuperDove-2115',
    stationId: 'Troll-1',
    stationName: 'KSAT TrollSat Ant-1',
    aosMinutes: 805, // Contention at Troll
    losMinutes: 816,
    durationMinutes: 11,
    maxElevationDeg: 54.0,
    priority: 3,
    dataVolumeGb: 21.5,
    isKeyholeRisk: false,
    cableAngleAos: -95.0,
    cableAngleLos: -25.0,
    satelliteBufferAtAos: 195,
    bufferFillPct: 76.1,
    freshnessMin: 55
  },
  {
    id: 'PASS-603',
    satelliteId: 'SuperDove-2104',
    satelliteName: 'SuperDove-2104 (Disaster Task)',
    stationId: 'PuntaArenas-1',
    stationName: 'SSC Punta Arenas Ant-1',
    aosMinutes: 840,
    losMinutes: 849,
    durationMinutes: 9,
    maxElevationDeg: 58.0,
    priority: 5,
    dataVolumeGb: 28.0,
    isKeyholeRisk: false,
    cableAngleAos: 15.0,
    cableAngleLos: 65.0,
    satelliteBufferAtAos: 160,
    bufferFillPct: 62.5,
    freshnessMin: 10
  },

  // --- ORBIT 7 EVENING CONVERGENCE (17:00 - 20:30 UTC) ---
  {
    id: 'PASS-701',
    satelliteId: 'SkySat-C14',
    satelliteName: 'SkySat-C14',
    stationId: 'KSAT-Svalbard-1',
    stationName: 'KSAT Svalbard Ant-1',
    aosMinutes: 1050,
    losMinutes: 1062,
    durationMinutes: 12,
    maxElevationDeg: 83.0,
    priority: 4,
    dataVolumeGb: 65.0,
    isKeyholeRisk: false,
    cableAngleAos: 18.0,
    cableAngleLos: 82.0,
    satelliteBufferAtAos: 410,
    bufferFillPct: 80.0,
    freshnessMin: 30
  },
  {
    id: 'PASS-702',
    satelliteId: 'Pelican-01',
    satelliteName: 'Pelican-01',
    stationId: 'KSAT-Svalbard-2',
    stationName: 'KSAT Svalbard Ant-2',
    aosMinutes: 1055,
    losMinutes: 1068,
    durationMinutes: 13,
    maxElevationDeg: 78.0,
    priority: 4,
    dataVolumeGb: 74.0,
    isKeyholeRisk: false,
    cableAngleAos: -25.0,
    cableAngleLos: 60.0,
    satelliteBufferAtAos: 690,
    bufferFillPct: 67.3,
    freshnessMin: 40
  },
  {
    id: 'PASS-703',
    satelliteId: 'SuperDove-2112',
    satelliteName: 'SuperDove-2112',
    stationId: 'KSAT-Svalbard-1',
    stationName: 'KSAT Svalbard Ant-1',
    aosMinutes: 1048, // Arrives 2m before SkySat!
    losMinutes: 1059,
    durationMinutes: 11,
    maxElevationDeg: 35.0,
    priority: 1,
    dataVolumeGb: 11.2,
    isKeyholeRisk: false,
    cableAngleAos: 12.0,
    cableAngleLos: 68.0,
    satelliteBufferAtAos: 110,
    bufferFillPct: 42.9,
    freshnessMin: 95
  },

  // --- ORBIT 8 NIGHT CLOSEOUT (21:00 - 23:45 UTC) ---
  {
    id: 'PASS-801',
    satelliteId: 'SuperDove-2104',
    satelliteName: 'SuperDove-2104 (Disaster Task)',
    stationId: 'Inuvik-1',
    stationName: 'SSC Inuvik Station Ant-1',
    aosMinutes: 1280,
    losMinutes: 1291,
    durationMinutes: 11,
    maxElevationDeg: 80.0,
    priority: 5,
    dataVolumeGb: 37.0,
    isKeyholeRisk: false,
    cableAngleAos: 72.0,
    cableAngleLos: 150.0,
    satelliteBufferAtAos: 180,
    bufferFillPct: 70.3,
    freshnessMin: 14
  },
  {
    id: 'PASS-802',
    satelliteId: 'SuperDove-2108',
    satelliteName: 'SuperDove-2108',
    stationId: 'Inuvik-1',
    stationName: 'SSC Inuvik Station Ant-1',
    aosMinutes: 1285,
    losMinutes: 1296,
    durationMinutes: 11,
    maxElevationDeg: 44.0,
    priority: 2,
    dataVolumeGb: 16.5,
    isKeyholeRisk: false,
    cableAngleAos: 75.0,
    cableAngleLos: 140.0,
    satelliteBufferAtAos: 160,
    bufferFillPct: 62.5,
    freshnessMin: 60
  },
  {
    id: 'PASS-803',
    satelliteId: 'SuperDove-2120',
    satelliteName: 'SuperDove-2120',
    stationId: 'Troll-1',
    stationName: 'KSAT TrollSat Ant-1',
    aosMinutes: 1330,
    losMinutes: 1341,
    durationMinutes: 11,
    maxElevationDeg: 71.0,
    priority: 3,
    dataVolumeGb: 26.5,
    isKeyholeRisk: false,
    cableAngleAos: -95.0,
    cableAngleLos: -20.0,
    satelliteBufferAtAos: 235,
    bufferFillPct: 91.8,
    freshnessMin: 40
  }
];

export const PRIMARY_SCENARIO: ScenarioDefinition = {
  id: 'planetscope-polar-24h',
  name: 'PlanetScope & SkySat 24-Hour Polar Convergence',
  description: 'Realistic 8-satellite constellation over 5 high-latitude dishes experiencing acute contention clusters and emergency wildfire preemptions.',
  satellites: INITIAL_SATELLITES,
  stations: INITIAL_GROUND_STATIONS,
  passes: RAW_PASS_OPPORTUNITIES,
  horizonMinutes: 1440
};
