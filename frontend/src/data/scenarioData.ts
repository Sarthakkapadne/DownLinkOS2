import { 
  Satellite, 
  GroundStation, 
  PreConditionRule, 
  SimpleAlgorithmCase, 
  EfficiencyMetrics,
  PowerUsp,
  TimelineGanttBlock
} from '../types';

export const INITIAL_SATELLITES: Satellite[] = [
  {
    id: 'sat-1',
    name: 'SuperDove-Flock-4P-21',
    noradId: 47960,
    constellation: 'PlanetScope 3U CubeSat Fleet',
    altitudeKm: 505,
    orbitType: 'Polar Sun-Synchronous LEO (97.4° Inc)',
    dataType: '8-Band VNIR Surface Reflectance Optical',
    targetMission: 'Daily Agriculture & Forest Canopy Surface Survey',
    priority: 3,
    priorityLabel: 'P3 · Routine Surface Survey',
    priorityColor: 'slate',
    ssrCapacityGb: 256,
    ssrUtilizedGb: 238, // 93% full - Needs to clear buffer!
    ssrFreeGb: 18,
    passDataVolumeGb: 38.4,
    position: {
      elevationDeg: 78.5,
      azimuthDeg: 105.0,
      status: 'ZENITH_PEAK',
      skyXPercent: 50,
      skyYPercent: 18
    },
    window: {
      aosUtc: '01:10:00 UTC',
      losUtc: '01:19:30 UTC',
      timeRemainingSec: 180,
      totalDurationSec: 570
    }
  },
  {
    id: 'sat-2',
    name: 'Pelican-Rapid-01',
    noradId: 58210,
    constellation: 'Planet Pelican Next-Gen Fleet',
    altitudeKm: 480,
    orbitType: 'Polar Sun-Synchronous LEO (97.3° Inc)',
    dataType: '30cm Sub-Meter Thermal & Optical HD Video',
    targetMission: 'Urgent Defense Tasking: Critical Border & Port Corridor',
    priority: 2,
    priorityLabel: 'P2 · High Urgency (Risk Rising!)',
    priorityColor: 'sky',
    ssrCapacityGb: 512,
    ssrUtilizedGb: 440, // 86% full - Risk rapidly climbing!
    ssrFreeGb: 72,
    passDataVolumeGb: 42.0,
    position: {
      elevationDeg: 35.4,
      azimuthDeg: 75.4,
      status: 'ASCENDING_AOS',
      skyXPercent: 76,
      skyYPercent: 44
    },
    window: {
      aosUtc: '01:08:15 UTC',
      losUtc: '01:17:45 UTC',
      timeRemainingSec: 280, // In pass right now!
      totalDurationSec: 570
    }
  },
  {
    id: 'sat-3',
    name: 'SkySat-C14',
    noradId: 41848,
    constellation: 'SkySat Agile High-Resolution Fleet',
    altitudeKm: 450,
    orbitType: 'Polar Sun-Synchronous LEO (97.1° Inc)',
    dataType: '50cm High-Resolution Stereo Imagery',
    targetMission: 'Routine Regional Topography Mapping',
    priority: 2,
    priorityLabel: 'P2 · Dropping Fast (About to Set)',
    priorityColor: 'amber',
    ssrCapacityGb: 512,
    ssrUtilizedGb: 280,
    ssrFreeGb: 232,
    passDataVolumeGb: 48.0,
    position: {
      elevationDeg: 11.2,
      azimuthDeg: 285.3,
      status: 'DESCENDING_LOS',
      skyXPercent: 19,
      skyYPercent: 68
    },
    window: {
      aosUtc: '01:03:00 UTC',
      losUtc: '01:13:30 UTC',
      timeRemainingSec: 55, // Only 55 seconds left before LOS!
      totalDurationSec: 630
    }
  }
];

export const INITIAL_GROUND_STATION: GroundStation = {
  id: 'station-svalbard-1',
  name: 'KSAT Svalbard Ground Station (SVA-1)',
  code: 'SVA-Dish-1',
  location: 'Spitsbergen, Norway (High Arctic)',
  coordinates: '78.22°N, 15.63°E',
  elevationMaskDeg: 5.0,
  dishDiameterM: 7.3,
  maxSlewRateDegPerSec: 2.0,
  status: 'ACTIVE_TRACKING',
  currentElevationDeg: 78.5,
  currentAzimuthDeg: 105.0,
  activeSatelliteId: 'sat-1',
  transferredGb: 22.8,
  totalTargetGb: 38.4,
  currentBitrateMbps: 1420
};

// ============================================================================
// THE 6 CORE PRE-DECISION CONDITIONS
// ============================================================================
export const PRE_CONDITION_RULES: PreConditionRule[] = [
  {
    id: 'cond-expiration',
    ruleNumber: 1,
    title: 'The Horizon Expiration Deadline (Time-to-LOS)',
    badge: 'RULE 1: EXPIRATION CLOCK',
    simpleQuestion: 'Will the satellite go below the horizon before we can finish talking?',
    whatItMeans:
      'Satellites ascend from the right, cross overhead, and set below the horizon on the left. If a satellite is only 55 seconds from disappearing, turning a 5-ton dish towards it is futile because it drops below the mountains before receiving data.',
    whyItMatters:
      'Never chase an expiring satellite that will set before the dish can even acquire RF carrier lock.',
    dangerIfIgnored:
      'The dish turns for 45s, gets 10 seconds of signal, the satellite disappears below the horizon, and both satellites are ruined.',
    iconType: 'time'
  },
  {
    id: 'cond-risk',
    ruleNumber: 2,
    title: 'Memory Overflow Escalation (Buffer Fullness Risk)',
    badge: 'RULE 2: MEMORY RISK',
    simpleQuestion: 'Which satellite is at highest risk of shutting down its camera?',
    whatItMeans:
      'Sat 2 is at 86% memory fullness and continuing to capture high-res video. If Sat 2 is skipped, its memory will overflow past 100%, forcing its camera to shut down. Its risk is climbing rapidly.',
    whyItMatters:
      'We must service the satellite whose risk of catastrophic data loss is rising fastest.',
    dangerIfIgnored:
      'Sat 2 hits 100% memory: camera automatically shuts off, wiping out new tactical imagery.',
    iconType: 'storage'
  },
  {
    id: 'cond-slew',
    ruleNumber: 3,
    title: 'Dish Turning Speed vs Available Window',
    badge: 'RULE 3: MOTOR LATENCY',
    simpleQuestion: 'Does the 5-ton dish have enough time to turn and still downlink?',
    whatItMeans:
      'The dish turns at 2° per second. Slewing to Sat 3 on the left takes 45 seconds. But Sat 3 leaves in 55 seconds! That leaves only 10 seconds of connection. Meanwhile, slewing to Sat 2 on the right takes only 22 seconds, leaving over 4 minutes of usable contact!',
    whyItMatters:
      'Only select satellites where usable contact duration exceeds the motor turn time by a safe operational margin.',
    dangerIfIgnored:
      'Spending motor energy to chase an expiring pass that vanishes right after lock.',
    iconType: 'slew'
  },
  {
    id: 'cond-checkpoint',
    ruleNumber: 4,
    title: 'The Saved State Bookmark (CFDP Checkpoint)',
    badge: 'RULE 4: SAVED STATE',
    simpleQuestion: 'If we switch away from Sat 1, can we save our exact point?',
    whatItMeans:
      'When Sat 1 is paused, the ground issues a digital receipt: "22.8 GB saved and verified." Sat 1 bookmarks this exact byte. In the next pass, Sat 1 connects and resumes right from that saved point without starting from zero!',
    whyItMatters:
      'Allows us to safely yield the dish to Sat 2 without throwing away a single megabyte of Sat 1.',
    dangerIfIgnored:
      'Discarding partial transfers and forcing satellites to re-send 20+ GB files from scratch.',
    iconType: 'checkpoint'
  },
  {
    id: 'cond-elevation',
    ruleNumber: 5,
    title: 'Elevation Speed Difference (Zenith vs Horizon)',
    badge: 'RULE 5: ATMOSPHERE SPEED',
    simpleQuestion: 'Is the satellite overhead in thin air or down in thick smog?',
    whatItMeans:
      'Straight overhead at Zenith (70°–90°), data transmits at 1,420 Mbps through thin air. Down near the horizon (10°–15°), thick atmosphere slows data to only 250 Mbps.',
    whyItMatters:
      'Prioritizing passes higher in the sky yields 5x more data per minute than scraping the horizon.',
    dangerIfIgnored:
      'Wasting dish time on low-speed horizon passes while fast overhead slots sit idle.',
    iconType: 'elevation'
  },
  {
    id: 'cond-nextpass',
    ruleNumber: 6,
    title: 'Next Pass Reconnection Guarantee',
    badge: 'RULE 6: NEXT PASS CONTINUITY',
    simpleQuestion: 'When does the paused satellite return to finish its data?',
    whatItMeans:
      'Satellites circle Earth every 90 minutes. Sat 1 will cross polar ground stations on its next pass. Because we saved its state, it will download only its remaining 15.6 GB, finishing 100% of its payload.',
    whyItMatters:
      'A paused satellite is never abandoned—it is seamlessly completed on its next scheduled window.',
    dangerIfIgnored:
      'Viewing a pass as a one-time gamble instead of an ongoing orbital pipeline.',
    iconType: 'priority'
  }
];

// ============================================================================
// THE 7 STEP-BY-STEP ALGORITHM CASES (Exact logical flow requested by user)
// ============================================================================
export const SIMPLE_ALGORITHM_CASES: SimpleAlgorithmCase[] = [
  {
    id: 1,
    stepNumber: 1,
    phaseTitle: 'The Active Pass & Contention',
    badge: 'STEP 1: CURRENT STATE',
    headline: 'Dish is Busy with Sat 1 While Sat 2 and Sat 3 Compete',
    storyContext:
      'Svalbard Dish 1 is actively downloading Satellite 1 straight overhead at 90° Zenith (22.8 GB received so far). Meanwhile, two other satellites are in view: Satellite 2 is ascending from the right with memory buffer fullness climbing (86% full) and needs a connection. Satellite 3 is down near the left horizon setting rapidly.',
    naiveMistake:
      'Old systems either ignore the other satellites completely until Sat 1 finishes, or make a blind guess without calculating expiration deadlines.',
    whyItFailsInRealLife: [
      'If you stay blindly on Sat 1 until the very end, Sat 2 and Sat 3 both leave the sky.',
      'Sat 2\'s memory fullness will climb past 100%, causing its camera to shut down.',
      'We must evaluate whether to switch to Sat 2 or Sat 3.'
    ],
    smartAlgorithmChoice:
      'ORBITOPS pauses and runs the feasibility check: Test whether Sat 3 or Sat 2 can be safely served, and prepare to save Sat 1\'s state.',
    simpleOutcomeSummary:
      'Active link on Sat 1 maintained while checking Sat 3 vs Sat 2 feasibility.',
    miniVisualState: {
      dishAngleDeg: 0,
      dishElevationDeg: 78.5,
      connectedSatelliteId: 'sat-1',
      highlightSatelliteId: 'sat-2',
      slewPathTargetId: null,
      isSlewing: false,
      bitrateMbps: 1420,
      alertMessage: 'Active Pass: Sat 1 downloading (22.8 GB). Sat 2 risk rising. Sat 3 setting fast.',
      alertType: 'warning',
      transferredGb: 22.8,
      targetGb: 38.4
    }
  },
  {
    id: 2,
    stepNumber: 2,
    phaseTitle: 'Expiration Check: Sat 3 Rejected',
    badge: 'STEP 2: EXPIRATION CHECK',
    headline: 'Why We Couldn\'t Pick Sat 3 (Would Dip Below Horizon)',
    storyContext:
      'Let\'s evaluate Satellite 3 on the left: Sat 3 has high tasking priority, but it is at only 11° elevation and dropping fast towards the left horizon. It has only 55 seconds left before dipping below 5°! The 5-ton dish takes 45 seconds to slew left. By the time the dish turns, Sat 3 drops below the horizon and is gone! Meanwhile, if we chased Sat 3, Sat 2\'s memory risk would hit catastrophic overflow!',
    naiveMistake:
      'Attempting to chase Sat 3 because it\'s expiring first, without calculating that it will vanish before the dish can finish turning.',
    whyItFailsInRealLife: [
      'Turning to Sat 3 takes 45 seconds. Sat 3 leaves in 55 seconds. You get barely 10 seconds of connection before it dips below the mountains!',
      'While wasting 45 seconds chasing Sat 3, Sat 2 on the right is neglected, and its buffer hits 100% overflow.',
      'The Smart Choice: REJECT Sat 3 completely. Do not chase an expiring satellite that will drop below horizon!'
    ],
    smartAlgorithmChoice:
      'REJECT SAT 3. It will dip below the horizon before the dish can establish useful contact. Chasing it causes double failure.',
    simpleOutcomeSummary:
      'Sat 3 rejected: Leaves in 55s, would drop below horizon before useful data transfer.',
    miniVisualState: {
      dishAngleDeg: -45,
      dishElevationDeg: 11.2,
      connectedSatelliteId: null,
      highlightSatelliteId: 'sat-3',
      slewPathTargetId: 'sat-3',
      isSlewing: true,
      bitrateMbps: 0,
      alertMessage: 'Sat 3 REJECTED: Leaves in 55s (drops below horizon!). 45s slew leaves only 10s usable link.',
      alertType: 'warning',
      transferredGb: 22.8,
      targetGb: 38.4
    }
  },
  {
    id: 3,
    stepNumber: 3,
    phaseTitle: 'The Critical Decision: Sat 2 Chosen',
    badge: 'STEP 3: SMART SELECTION',
    headline: 'Why Sat 2 Was Chosen: Won\'t Be Lost & Clears Critical Risk',
    storyContext:
      'Now evaluate Satellite 2 on the right: Sat 2 is ascending in its pass with over 4 minutes of open sky ahead. However, its memory buffer is at 86% fullness and climbing rapidly as it captures defense video. If ignored, its buffer hits 100% and shuts its camera off!',
    naiveMistake:
      'Ignoring Sat 2\'s escalating buffer risk or assuming it can wait for another orbit.',
    whyItFailsInRealLife: [
      'Slewing to Sat 2 takes only 22 seconds.',
      'Sat 2 has 280 seconds (over 4.5 minutes) remaining in its contact window.',
      'Usable contact time: 280s - 22s = 258 seconds—more than enough to download all 42.0 GB!',
      'Sat 2 won\'t be lost, its memory risk is eliminated, and its camera is protected.'
    ],
    smartAlgorithmChoice:
      'CHOOSE SAT 2! Sat 2 will not be lost. Repositioning to Sat 2 safely empties its 86% memory buffer and delivers 42.0 GB of tactical data.',
    simpleOutcomeSummary:
      'Sat 2 selected: High-risk memory buffer prioritized for immediate clearance.',
    miniVisualState: {
      dishAngleDeg: 35,
      dishElevationDeg: 35.4,
      connectedSatelliteId: null,
      highlightSatelliteId: 'sat-2',
      slewPathTargetId: 'sat-2',
      isSlewing: true,
      bitrateMbps: 0,
      alertMessage: 'Sat 2 CHOSEN: 4+ minutes usable pass. Clears critical 86% memory buffer!',
      alertType: 'warning',
      transferredGb: 22.8,
      targetGb: 38.4
    }
  },
  {
    id: 4,
    stepNumber: 4,
    phaseTitle: 'State Saving on Sat 1 (Checkpoint Bookmark)',
    badge: 'STEP 4: STATE SAVED',
    headline: 'First, Sat 1 is Saved with a Digital Bookmark',
    storyContext:
      'Before slewing the dish over to Satellite 2, what happens to Satellite 1? Sat 1 already transferred 22.8 GB. We do NOT discard its progress!',
    naiveMistake:
      'Old systems abort connections without saving state, forcing satellites to re-send the entire 38.4 GB file from scratch next time.',
    whyItFailsInRealLife: [
      'Throwing away 22.8 GB wastes battery, transmitter wear, and ground dish time.',
      'ORBITOPS issues a digital receipt: "Receipt #47960: Packets 1 to 22,800 saved and verified."',
      'Sat 1 stores this bookmark on its onboard computer. It knows exactly where it stopped.',
      'Now, the dish can safely disengage and turn to Sat 2 with zero lost data.'
    ],
    smartAlgorithmChoice:
      'COMMIT SAVED STATE BOOKMARK (22.8 GB). Sat 1\'s state is frozen and secured in non-volatile memory. Dish released to turn to Sat 2.',
    simpleOutcomeSummary:
      'Saved State Confirmed: 22.8 GB locked in storage. Zero bytes lost.',
    miniVisualState: {
      dishAngleDeg: 0,
      dishElevationDeg: 78.5,
      connectedSatelliteId: 'sat-1',
      highlightSatelliteId: 'sat-1',
      slewPathTargetId: null,
      isSlewing: false,
      bitrateMbps: 1420,
      alertMessage: 'STATE SAVED: Sat 1 bookmarked at 22.8 GB. Ready to turn to Sat 2!',
      alertType: 'info',
      transferredGb: 22.8,
      targetGb: 38.4,
      checkpointSavedGb: 22.8
    }
  },
  {
    id: 5,
    stepNumber: 5,
    phaseTitle: 'Connecting to Sat 2 & Eliminating Risk',
    badge: 'STEP 5: BUFFER CLEARED',
    headline: 'Dish Turns to Sat 2: High-Risk Buffer Safely Cleared',
    storyContext:
      'The dish turns smoothly to Satellite 2 on the right at 35.4° elevation. Signal carrier locks. The high-speed downlink stream begins.',
    naiveMistake:
      'Letting Sat 2 sit in the sky while its memory fills to 100% and shuts off its imaging camera.',
    whyItFailsInRealLife: [
      'Sat 2 had over 4 minutes of usable contact window.',
      'Dish tracks Sat 2 across its pass, downloading all 42.0 GB of tactical video at 1,150 Mbps.',
      'Sat 2\'s onboard memory drops from 86% full down to 20% full!',
      'Sat 2 is now completely safe from overflow, and its mission is 100% accomplished before it sets.'
    ],
    smartAlgorithmChoice:
      'DOWNLINK COMPLETE ON SAT 2: 42.0 GB delivered. Sat 2 memory safely emptied (86% -> 20%). Risk eliminated!',
    simpleOutcomeSummary:
      'Sat 2 saved: 42.0 GB delivered, memory cleared, camera protected.',
    miniVisualState: {
      dishAngleDeg: 55,
      dishElevationDeg: 35.4,
      connectedSatelliteId: 'sat-2',
      highlightSatelliteId: 'sat-2',
      slewPathTargetId: 'sat-2',
      isSlewing: false,
      bitrateMbps: 1150,
      alertMessage: 'Sat 2 Active Link: 42.0 GB delivered. Buffer emptied from 86% -> 20% (Safe!).',
      alertType: 'success',
      transferredGb: 42.0,
      targetGb: 42.0
    }
  },
  {
    id: 6,
    stepNumber: 6,
    phaseTitle: 'Next Pass: Sat 1 Reconnects from Saved Point',
    badge: 'STEP 6: NEXT PASS RESUME',
    headline: 'In the Next Pass, Sat 1 Connects from the Exact Saved Point',
    storyContext:
      'One orbit later (90 minutes), Satellite 1 circles back and enters Svalbard\'s visibility window for its next pass. What happens now?',
    naiveMistake:
      'Starting from 0 GB and re-downloading the entire 38.4 GB file, wasting 15 minutes of antenna time.',
    whyItFailsInRealLife: [
      'Because Sat 1 has the saved state bookmark, it does NOT start from 0 GB!',
      'Sat 1 connects to the ground dish and checks its bookmark: "22.8 GB already received."',
      'Sat 1 transmits ONLY the remaining 15.6 GB (from GB 22.9 to GB 38.4)!',
      'The pass finishes in only 88 seconds! Sat 1\'s entire payload is now 100% completed with ZERO wasted retransmissions.'
    ],
    smartAlgorithmChoice:
      'RESUME FROM SAVED POINT (GB 22.9): Sat 1 sends only remaining 15.6 GB. Total 38.4 GB completed with zero duplicate data!',
    simpleOutcomeSummary:
      'Next Pass Resumed: Sat 1 completed 100% of data. Zero duplicate bytes transmitted.',
    miniVisualState: {
      dishAngleDeg: 0,
      dishElevationDeg: 78.5,
      connectedSatelliteId: 'sat-1',
      highlightSatelliteId: 'sat-1',
      slewPathTargetId: null,
      isSlewing: false,
      bitrateMbps: 1420,
      alertMessage: 'NEXT PASS RESUME: Sat 1 connected from GB 22.9! Only 15.6 GB sent. 100% complete!',
      alertType: 'success',
      transferredGb: 38.4,
      targetGb: 38.4,
      isNextPass: true
    }
  },
  {
    id: 7,
    stepNumber: 7,
    phaseTitle: 'Visual Efficiency Proof & Scorecard Charts',
    badge: 'STEP 7: PERFORMANCE PROOF',
    headline: 'Visual Proof: How Much Data Was Saved & How Efficient It Is',
    storyContext:
      'Here are the visual charts and scorecards showing the concrete difference between the Old Naive Way and the ORBITOPS Autonomous Way across all operational metrics.',
    naiveMistake:
      'Old Naive Scheduler: Got only 44.0 GB total, wasted 22.8 GB in aborted retransmissions, and caused 2 camera overflow shutoffs.',
    whyItFailsInRealLife: [
      'Data Captured: ORBITOPS delivered 138.4 GB vs Naive 44.0 GB (+214.5% Data Gain).',
      'Retransmission Waste: Naive wasted 22.8 GB re-sending files; ORBITOPS wasted 0 GB due to Saved State bookmarks.',
      'Camera Shutoff Disasters: Naive lost 2 satellites to memory overflows; ORBITOPS had 0 overflows.',
      'Antenna Utilization: ORBITOPS kept the dish 89.5% active vs only 48.2% in naive operations.'
    ],
    smartAlgorithmChoice:
      'PROVEN SYSTEM EFFICIENCY: +214.5% Data Delivered · 0 GB Wasted Retransmissions · 0 Buffer Overflows · 89.5% Dish Efficiency.',
    simpleOutcomeSummary:
      'Visual charts prove 138.4 GB delivered (+214% Gain) with zero wasted retransmissions!',
    miniVisualState: {
      dishAngleDeg: 0,
      dishElevationDeg: 78.5,
      connectedSatelliteId: null,
      highlightSatelliteId: null,
      slewPathTargetId: null,
      isSlewing: false,
      bitrateMbps: 1420,
      alertMessage: 'EFFICIENCY PROVEN: 138.4 GB delivered (+214% gain) · Zero retransmission waste!',
      alertType: 'success',
      transferredGb: 138.4,
      targetGb: 138.4,
      showCharts: true
    }
  }
];

export const EFFICIENCY_METRICS_DATA: EfficiencyMetrics = {
  orbitopsDataDeliveredGb: 138.4,
  fcfsDataDeliveredGb: 44.0,
  dataGainPercent: 214.5,
  retransmissionWastedGbFcfs: 22.8,
  retransmissionWastedGbOrbitops: 0.0,
  bufferOverflowsFcfs: 2,
  bufferOverflowsOrbitops: 0,
  antennaUtilizationFcfs: 48.2,
  antennaUtilizationOrbitops: 89.5
};

export const POWER_FACTOR_USPS: PowerUsp[] = [
  {
    id: 'usp-station-custom',
    badge: 'USP 1 · NETWORK ARCHITECTURE',
    title: 'Per-Station Custom Scheduler',
    subtitle: 'Station-Aware Capabilities vs One-Size-Fits-All Scheduling',
    formula: 'Capacity_stn = f(Dish_m, Rain_dB, Slew_rate, Backhaul_Gbps)',
    explanation:
      'Every ground station operates differently, so one scheduling strategy cannot fit them all. ORBITOPS considers each station’s dish size, weather conditions, antenna movement speed, and data-handling capacity before assigning satellite contacts. This helps the scheduler estimate how much data each station can handle and choose opportunities that match its actual capabilities. The result is station-aware scheduling instead of treating every antenna the same.',
    fcfsComparison:
      'FCFS treats every antenna the same, causing severe throughput bottlenecks and slew overruns on slower dishes.',
    metricGain: '100% Station Capability Match',
    category: 'STATION_AWARE'
  },
  {
    id: 'usp-failure-playbooks',
    badge: 'USP 2 · RESILIENCE & RECOVERY',
    title: 'Pre-Computed Failure Playbooks',
    subtitle: 'Proactive Disruption Recovery (<100ms Sub-Second Replanning)',
    formula: 'Plan_contingency = Optimize(G \\ {stn_fail}, Frozen_Lock = 30m)',
    explanation:
      'A scheduling plan must be ready for unexpected failures, not just normal operations. ORBITOPS prepares alternative schedules in advance for possible ground station failures. When a station goes offline, the system can select a suitable backup plan and validate it against the remaining constraints. This helps reduce recovery delays and protects critical satellite data wherever alternative contact opportunities are available. The goal is simple: prepare for disruptions before they happen, rather than starting from scratch after a failure.',
    fcfsComparison:
      'FCFS crashes upon station failure; requires full manual rescheduling from scratch, losing urgent passes.',
    metricGain: '<100ms Re-route Latency (Zero Thrash)',
    category: 'RESILIENCE'
  },
  {
    id: 'usp-acm',
    badge: 'USP 3 · PHY LAYER INNOVATION',
    title: 'Dynamic Atmospheric ACM Profiling',
    subtitle: 'DVB-S2X Elevation Adaptive ModCod (250 → 1,420 Mbps)',
    formula: 'R_b(θ) = B_w · log₂(1 + SINR(θ)) · η_atm',
    explanation: 'Legacy FCFS treats contact windows as flat bitrate blocks (e.g. static 500 Mbps). ORBITOPS models tropospheric attenuation dynamically: down at 10° horizon, thick atmosphere forces QPSK (250 Mbps); overhead at 75°–90° Zenith, thin air allows 256-APSK (1,420 Mbps). Prioritizing high-elevation slots delivers 4.2x higher data density per second.',
    fcfsComparison: 'FCFS: Flat static bitrate assumption, wastes antenna time at low horizon angles.',
    metricGain: '+320% Peak Bitrate Density',
    category: 'PHY_LAYER'
  },
  {
    id: 'usp-cfdp',
    badge: 'USP 4 · PROTOCOL INNOVATION',
    title: 'CFDP Class 2 Fractional Resumption',
    subtitle: 'Zero Retransmission Waste via CCSDS 727.0-B-4 Bookmarks',
    formula: 'Offset_resume = EOF_Ack(LastVerifiedPDU) + 1 byte',
    explanation: 'When higher-priority traffic or horizon limits require yielding the dish, ORBITOPS never aborts into the trash. It generates a verified cryptographic EOF receipt: "22.8 GB confirmed." On the next pass (Svalbard or Inuvik polar handoff), the satellite resumes from byte 22.800001 GB, saving 100% of partial passes.',
    fcfsComparison: 'FCFS: Aborts incomplete passes; forces re-downloading entire 38 GB file next time.',
    metricGain: '0.0 GB Wasted Retransmissions',
    category: 'PROTOCOL'
  },
  {
    id: 'usp-buffer',
    badge: 'USP 5 · STORAGE HEURISTIC',
    title: 'SSR Buffer Depletion Heuristic',
    subtitle: 'Predictive Camera Sensor Protection (Zero Sensor Shutoffs)',
    formula: 'Urgency(t) = P · [d(SSR)/dt] / [Capacity - SSR(t)]',
    explanation: 'Solid-State Recorders (SSR) fill as cameras capture images. If SSR hits 95%, onboard fault protection commands emergency camera shutdown, destroying mission intelligence. ORBITOPS calculates buffer fullness velocity, automatically preempting routine tracks to clear critical spacecraft (like Pelican at 86%) before camera shutoff.',
    fcfsComparison: 'FCFS: Blindly finishes routine passes while high-risk satellites overflow and lose data.',
    metricGain: '0 Camera Overflows (vs 2 in FCFS)',
    category: 'STORAGE_HEURISTIC'
  },
  {
    id: 'usp-cable',
    badge: 'USP 6 · KINEMATICS SAFETY',
    title: 'Cable-Wrap Turntable Accumulator Modeling',
    subtitle: 'Shortest-Arc Slew with Zero Emergency Mechanical Jams',
    formula: '|Σ ΔAzimuth| ≤ 270° · (ω_az = 2.0°/s)',
    explanation: 'Large 7.3m ground dishes have internal RF coaxial and waveguide cables wrapped through the pedestal. Exceeding ±270° trips a hardware limit switch, forcing an 8-minute emergency unwinding cycle that blacks out subsequent passes. ORBITOPS models cable accumulator state, choosing slew paths that keep wrap within safe margins.',
    fcfsComparison: 'FCFS: Naive slews cross 270° boundary, triggering 8-minute antenna unwrap lockouts.',
    metricGain: '0 Mechanical Blackouts (100% Safety)',
    category: 'KINEMATICS'
  }
];

export const ORBITOPS_TIMELINE_BLOCKS: TimelineGanttBlock[] = [
  {
    id: 'orb-1',
    satelliteId: 'sat-1',
    satelliteName: 'SuperDove-21 (Zenith)',
    startMinute: 8,
    endMinute: 12,
    actionType: 'DOWNLINK',
    label: 'High-Bitrate Zenith Downlink (1,420 Mbps)',
    bitrateMbps: 1420,
    dataTransferredGb: 22.8,
    statusColor: 'bg-sky-500 border-sky-400 text-white',
    notes: 'Downlinked 22.8 GB during peak overhead elevation (78°).'
  },
  {
    id: 'orb-2',
    satelliteId: 'sat-1',
    satelliteName: 'SuperDove-21',
    startMinute: 12,
    endMinute: 12.3,
    actionType: 'SAVED_STATE',
    label: 'CFDP Checkpoint Bookmark Saved',
    bitrateMbps: 0,
    dataTransferredGb: 0,
    statusColor: 'bg-teal-500 border-teal-400 text-white',
    notes: 'Digital receipt issued: 22.8 GB confirmed. Zero bytes discarded.'
  },
  {
    id: 'orb-3',
    satelliteId: 'station',
    satelliteName: 'KSAT SVA-1 Dish',
    startMinute: 12.3,
    endMinute: 12.7,
    actionType: 'SLEW',
    label: 'Optimized Motor Slew (22s)',
    bitrateMbps: 0,
    dataTransferredGb: 0,
    statusColor: 'bg-amber-500 border-amber-400 text-slate-900',
    notes: 'Smooth 44° turn right to Pelican. Cable accumulator +115° (safe).'
  },
  {
    id: 'orb-4',
    satelliteId: 'sat-2',
    satelliteName: 'Pelican (High Risk)',
    startMinute: 12.7,
    endMinute: 16.5,
    actionType: 'DOWNLINK',
    label: 'Pelican Downlink: Buffer Cleared (42.0 GB)',
    bitrateMbps: 1150,
    dataTransferredGb: 42.0,
    statusColor: 'bg-emerald-500 border-emerald-400 text-white',
    notes: 'SSR dropped from 86% -> 20%. Camera protected from overflow.'
  },
  {
    id: 'orb-5',
    satelliteId: 'sat-3',
    satelliteName: 'SkySat (Setting)',
    startMinute: 13,
    endMinute: 13.9,
    actionType: 'IDLE',
    label: 'Sat 3 Horizon Trap Safely Avoided',
    bitrateMbps: 0,
    dataTransferredGb: 0,
    statusColor: 'bg-slate-300 border-slate-400 text-slate-700',
    notes: 'Avoided futile 45s turn to setting satellite. Set at 01:13:30.'
  },
  {
    id: 'orb-6',
    satelliteId: 'sat-1',
    satelliteName: 'SuperDove-21 (Next Pass)',
    startMinute: 18,
    endMinute: 20,
    actionType: 'DOWNLINK',
    label: 'Next Pass Resumed from GB 22.9 (+15.6 GB)',
    bitrateMbps: 1420,
    dataTransferredGb: 15.6,
    statusColor: 'bg-indigo-500 border-indigo-400 text-white',
    notes: 'Completed 100% of payload in 88s. Zero duplicate bytes transmitted.'
  }
];

export const FCFS_TIMELINE_BLOCKS: TimelineGanttBlock[] = [
  {
    id: 'fcfs-1',
    satelliteId: 'sat-1',
    satelliteName: 'SuperDove-21',
    startMinute: 8,
    endMinute: 15,
    actionType: 'DOWNLINK',
    label: 'Blindly Stays on Sat 1 Until End of Pass',
    bitrateMbps: 850,
    dataTransferredGb: 38.4,
    statusColor: 'bg-slate-500 border-slate-600 text-white',
    notes: 'Ignores other competing satellites until Sat 1 window ends.'
  },
  {
    id: 'fcfs-2',
    satelliteId: 'station',
    satelliteName: 'KSAT SVA-1 Dish',
    startMinute: 15,
    endMinute: 15.8,
    actionType: 'SLEW',
    label: 'Futile Slew to Sat 3 (45s Slew)',
    bitrateMbps: 0,
    dataTransferredGb: 0,
    statusColor: 'bg-amber-600 border-amber-700 text-white',
    notes: 'Turns dish towards Sat 3 even though Sat 3 already set below horizon!'
  },
  {
    id: 'fcfs-3',
    satelliteId: 'sat-3',
    satelliteName: 'SkySat',
    startMinute: 15.8,
    endMinute: 17,
    actionType: 'FAILED_PASS',
    label: 'FAILED: Sat 3 Already Below Horizon (0 GB)',
    bitrateMbps: 0,
    dataTransferredGb: 0,
    statusColor: 'bg-red-500 border-red-600 text-white',
    notes: 'Signal lock failed: Sat 3 dropped below 5° mask at 01:13:30.'
  },
  {
    id: 'fcfs-4',
    satelliteId: 'sat-2',
    satelliteName: 'Pelican',
    startMinute: 14.5,
    endMinute: 18,
    actionType: 'OVERFLOW_SHUTDOWN',
    label: 'CATASTROPHIC: Pelican Memory Hits 100% (Camera Off)',
    bitrateMbps: 0,
    dataTransferredGb: 0,
    statusColor: 'bg-rose-700 border-rose-800 text-white',
    notes: 'Neglected Pelican hits 100% buffer fullness: camera emergency shutdown!'
  }
];

export const ACM_ELEVATION_POINTS = [
  { elevationDeg: 5, bitrateMbps: 150, modCod: 'QPSK 1/4 (Low Signal)' },
  { elevationDeg: 10, bitrateMbps: 250, modCod: 'QPSK 1/2' },
  { elevationDeg: 20, bitrateMbps: 550, modCod: '8-PSK 2/3' },
  { elevationDeg: 35, bitrateMbps: 850, modCod: '16-APSK 3/4' },
  { elevationDeg: 55, bitrateMbps: 1180, modCod: '64-APSK 5/6' },
  { elevationDeg: 75, bitrateMbps: 1380, modCod: '128-APSK 7/8' },
  { elevationDeg: 90, bitrateMbps: 1420, modCod: '256-APSK 8/9 (Zenith Peak)' }
];

