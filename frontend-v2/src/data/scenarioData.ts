import { Satellite, GroundStation, PreConditionRule, SimpleAlgorithmCase } from '../types';

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
    priorityLabel: 'P3 · Routine Survey',
    priorityColor: 'slate',
    ssrCapacityGb: 256,
    ssrUtilizedGb: 238, // 93% full - High overflow danger!
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
      timeRemainingSec: 210,
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
    targetMission: 'High-Priority Tactical Port & Border Security',
    priority: 2, // Moderate/High priority (less than Sat 3, but EXPIRING!)
    priorityLabel: 'P2 · Tactical Security (Expiring!)',
    priorityColor: 'sky',
    ssrCapacityGb: 512,
    ssrUtilizedGb: 310,
    ssrFreeGb: 202,
    passDataVolumeGb: 42.0,
    position: {
      elevationDeg: 22.4,
      azimuthDeg: 195.4,
      status: 'DESCENDING_LOS',
      skyXPercent: 84,
      skyYPercent: 58
    },
    window: {
      aosUtc: '01:04:15 UTC',
      losUtc: '01:15:45 UTC',
      timeRemainingSec: 210, // Exactly 3.5 minutes remaining before it dips below 5°!
      totalDurationSec: 585
    }
  },
  {
    id: 'sat-3',
    name: 'SkySat-C14',
    noradId: 41848,
    constellation: 'SkySat Agile High-Resolution Fleet',
    altitudeKm: 450,
    orbitType: 'Polar Sun-Synchronous LEO (97.1° Inc)',
    dataType: '50cm High-Resolution Stereo & Thermal Imagery',
    targetMission: 'Emergency Disaster Relief: Active California Wildfire Perimeter',
    priority: 1, // HIGHEST PRIORITY! But RISING with plenty of time!
    priorityLabel: 'P1 · Emergency Wildfire Front',
    priorityColor: 'red',
    ssrCapacityGb: 512,
    ssrUtilizedGb: 420,
    ssrFreeGb: 92,
    passDataVolumeGb: 58.0,
    position: {
      elevationDeg: 12.0,
      azimuthDeg: 12.3,
      status: 'ASCENDING_AOS',
      skyXPercent: 16,
      skyYPercent: 66
    },
    window: {
      aosUtc: '01:12:00 UTC',
      losUtc: '01:23:00 UTC',
      timeRemainingSec: 660, // Full 11-min contact window ahead!
      totalDurationSec: 660
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
// THE 6 PRE-DECISION CONDITIONS EVALUATED BEFORE ANY SCHEDULING ACTION
// ============================================================================
export const PRE_CONDITION_RULES: PreConditionRule[] = [
  {
    id: 'cond-expiration',
    ruleNumber: 1,
    title: 'The Expiration Clock (Time Left in Pass)',
    badge: 'CONDITION 1: EXPIRATION',
    simpleQuestion: 'How many seconds before each satellite dips below the mountains?',
    whatItMeans:
      'Sat 2 is setting on the horizon with only 3.5 minutes left. Sat 3 is rising with a full 11 minutes ahead. If you don\'t talk to Sat 2 right now, it is gone forever.',
    whyItMatters:
      'A satellite with lower priority but an expiring deadline must be caught before its window closes.',
    dangerIfIgnored:
      'Sat 2 drops below 5° elevation, its signal is permanently lost, and its data is wasted.',
    iconType: 'time'
  },
  {
    id: 'cond-priority-deadline',
    ruleNumber: 2,
    title: 'Priority vs Deadline ("Dual Harvest" Test)',
    badge: 'CONDITION 2: DUAL HARVEST',
    simpleQuestion: 'Do we pick Sat 3 because of priority, or Sat 2 because of time?',
    whatItMeans:
      'Sat 3 has Priority 1 (highest!). Sat 2 has Priority 2 (lower). But if you choose Sat 3 first, Sat 2 dies. If you choose Sat 2 first, you can STILL catch Sat 3 right after because Sat 3 has 8 minutes of slack!',
    whyItMatters:
      'Choosing Sat 2 first gets BOTH satellites! Choosing Sat 3 first gets ONLY Sat 3 and destroys Sat 2.',
    dangerIfIgnored:
      'Greedy priority scheduling sacrifices expiring satellites unnecessarily.',
    iconType: 'priority'
  },
  {
    id: 'cond-slew',
    ruleNumber: 3,
    title: 'Dish Motor Slew & Usable Time',
    badge: 'CONDITION 3: MOTOR SPEED',
    simpleQuestion: 'Can the 5-ton dish turn to Sat 2 and still have usable time?',
    whatItMeans:
      'The dish turns at 2°/second. Turning 50° to Sat 2 takes 25 seconds. Sat 2 has 210 seconds left. 210s - 25s = 185 seconds (over 3 minutes) of usable high-speed connection!',
    whyItMatters:
      'We must verify that after turning, enough time remains to download meaningful data.',
    dangerIfIgnored:
      'Spending motor energy to turn to a satellite that disappears before signal lock is acquired.',
    iconType: 'slew'
  },
  {
    id: 'cond-elevation',
    ruleNumber: 4,
    title: 'Elevation Speed Curve (Zenith vs Horizon)',
    badge: 'CONDITION 4: SPEED SWEET SPOT',
    simpleQuestion: 'Where is data transmission fastest in the sky?',
    whatItMeans:
      'At 12° horizon, thick atmosphere restricts speed to 250 Mbps. Overhead at 65°–85° zenith, speed jumps to 1,420 Mbps! Waiting 3 minutes for Sat 3 to climb actually makes Sat 3 download 5x faster!',
    whyItMatters:
      'Delaying Sat 3 slightly while we catch Sat 2 is actually a benefit, because Sat 3 climbs into its fastest transmission window.',
    dangerIfIgnored:
      'Downloading data at the murky horizon instead of waiting for the satellite to reach peak overhead speed.',
    iconType: 'elevation'
  },
  {
    id: 'cond-checkpoint',
    ruleNumber: 5,
    title: 'Bookmark & Resume (CFDP Checkpoint)',
    badge: 'CONDITION 5: DATA BOOKMARK',
    simpleQuestion: 'What happens to Sat 1 if we pause it right now?',
    whatItMeans:
      'Sat 1 already transferred 22.8 GB. The ground station saves a digital bookmark: "22.8 GB verified." Sat 1 remembers this. On its next pass over Canada, it only sends the remaining 15.6 GB. Zero data is lost!',
    whyItMatters:
      'Enables safe preemption: we can yield the dish to Sat 2 and Sat 3 without wasting any of Sat 1\'s work.',
    dangerIfIgnored:
      'Discarding partial downloads and forcing satellites to re-send entire files from scratch.',
    iconType: 'checkpoint'
  },
  {
    id: 'cond-storage',
    ruleNumber: 6,
    title: 'Onboard Memory Buffer Fullness (SSR)',
    badge: 'CONDITION 6: MEMORY SAFETY',
    simpleQuestion: 'Is any satellite memory about to hit 100% and shut off its camera?',
    whatItMeans:
      'Sat 1 is at 93% full (18 GB free). Sat 3 is at 82% full. Sat 2 is at 60% full. We must ensure no satellite camera shuts off due to full memory.',
    whyItMatters:
      'A satellite whose memory hits 100% must shut down its camera, wiping out future photography.',
    dangerIfIgnored:
      'Spacecraft storage overflows, permanently destroying newly captured terrain photos.',
    iconType: 'storage'
  }
];

// ============================================================================
// THE 7 STEP-BY-STEP ALGORITHM CASES (Explaining the exact logical sequence)
// ============================================================================
export const SIMPLE_ALGORITHM_CASES: SimpleAlgorithmCase[] = [
  {
    id: 1,
    stepNumber: 1,
    phaseTitle: 'The Multi-Satellite Dilemma',
    badge: 'CASE 1: THREE SATS IN VIEW',
    headline: 'Three Satellites in the Sky at the Exact Same Minute',
    storyContext:
      'Svalbard Dish 1 is currently connected to Sat 1 (Routine P3) straight overhead. Suddenly, two other satellites compete for the dish: Sat 2 is setting on the right horizon (P2, only 3.5 minutes left!). Sat 3 is rising on the left horizon with Priority 1 Emergency Wildfire data (11 minutes left).',
    naiveMistake:
      'A naive scheduler only looks at priority: "Sat 3 has Priority 1! Slew to Sat 3 immediately!"',
    whyItFailsInRealLife: [
      'Blindly chasing Priority 1 ignores the clock: Sat 2 is leaving the sky!',
      'If you turn to Sat 3 now, Sat 2 will set below the horizon while you are busy with Sat 3.',
      'Sat 2\'s valuable tactical data will be permanently lost!'
    ],
    smartAlgorithmChoice:
      'ORBITOPS pauses and checks the deadlines of both satellites: Can we catch Sat 2 FIRST, and still have time for Sat 3 SECOND?',
    simpleOutcomeSummary:
      'Identified the "Dual Harvest" opportunity: Sat 2 is expiring, but Sat 3 has 8 minutes of slack time!',
    miniVisualState: {
      dishAngleDeg: 0,
      dishElevationDeg: 78.5,
      connectedSatelliteId: 'sat-1',
      highlightSatelliteId: 'sat-2',
      slewPathTargetId: null,
      isSlewing: false,
      bitrateMbps: 1420,
      alertMessage: 'Contention: Sat 3 has P1 (rising), but Sat 2 has P2 and is EXPIRING in 3.5m!',
      alertType: 'warning',
      transferredGb: 22.8,
      targetGb: 38.4
    }
  },
  {
    id: 2,
    stepNumber: 2,
    phaseTitle: 'The Naive Priority Trap',
    badge: 'CASE 2: THE GREEDY MISTAKE',
    headline: 'Why Choosing Sat 3 First Destroys Sat 2 Completely',
    storyContext:
      'Let\'s see what happens if we make the naive mistake and turn to Sat 3 first just because it has Priority 1.',
    naiveMistake:
      'Slewing the dish to Sat 3 immediately because its badge says Priority 1.',
    whyItFailsInRealLife: [
      'Turning to Sat 3 takes 35 seconds. Downloading Sat 3 takes 6 to 8 minutes.',
      'Meanwhile, Sat 2 only had 3.5 minutes left in the sky.',
      'By minute 4, Sat 2 has dipped below 5° elevation and disappeared behind the mountains forever!',
      'Result: You got Sat 3, but you LOST 100% of Sat 2 (42 GB destroyed).'
    ],
    smartAlgorithmChoice:
      'REJECT CHOOSING SAT 3 FIRST. Recognize that Sat 3 has plenty of time ahead, while Sat 2 has zero margin for error.',
    simpleOutcomeSummary:
      'Greedy choice rejected: Prioritizing Sat 3 first would cause total loss of Sat 2.',
    miniVisualState: {
      dishAngleDeg: -45,
      dishElevationDeg: 25.0,
      connectedSatelliteId: null,
      highlightSatelliteId: 'sat-3',
      slewPathTargetId: 'sat-3',
      isSlewing: true,
      bitrateMbps: 0,
      alertMessage: 'FATAL TRAP: If dish turns to Sat 3 first, Sat 2 drops below horizon and dies!',
      alertType: 'warning',
      transferredGb: 22.8,
      targetGb: 38.4
    }
  },
  {
    id: 3,
    stepNumber: 3,
    phaseTitle: 'The Deadline Slew Calculation',
    badge: 'CASE 3: THE SMART SEQUENCE',
    headline: 'Choosing Sat 2 First: The "Dual Harvest" Decision',
    storyContext:
      'ORBITOPS calculates the math: Can we turn to Sat 2, download its data, and still have enough time to catch Sat 3 afterwards?',
    naiveMistake:
      'Believing you must sacrifice one satellite to get the other.',
    whyItFailsInRealLife: [
      'Motor Slew to Sat 2 takes 25 seconds. Sat 2 has 210 seconds left. 210s - 25s = 185 seconds (over 3 minutes) of solid connection!',
      'In 3 minutes, we download all 42.0 GB of Sat 2\'s payload.',
      'When Sat 2 finishes at minute 3.5, Sat 3 STILL HAS 8 MINUTES LEFT in the sky!',
      'Decision: Serve Sat 2 FIRST, then swing to Sat 3 SECOND. We get BOTH!'
    ],
    smartAlgorithmChoice:
      'SCHEDULE SAT 2 FIRST, SAT 3 SECOND. Catch Sat 2 before it sets, then catch Sat 3 as it climbs. Both missions succeed!',
    simpleOutcomeSummary:
      'Smart sequencing unlocked: 100% of Sat 2 saved + 100% of Sat 3 saved!',
    miniVisualState: {
      dishAngleDeg: 52,
      dishElevationDeg: 22.4,
      connectedSatelliteId: 'sat-2',
      highlightSatelliteId: 'sat-2',
      slewPathTargetId: 'sat-2',
      isSlewing: false,
      bitrateMbps: 850,
      alertMessage: 'Dual Harvest Active: Slew to Sat 2 (3 mins usable) -> Sat 3 has 8 mins slack!',
      alertType: 'success',
      transferredGb: 42.0,
      targetGb: 42.0
    }
  },
  {
    id: 4,
    stepNumber: 4,
    phaseTitle: 'The Elevation Speed Bonus',
    badge: 'CASE 4: HIGH-SPEED ZONE',
    headline: 'Why Waiting 3 Minutes Makes Sat 3 Five Times Faster',
    storyContext:
      'Here is the beauty of this decision: While the dish is busy downloading Sat 2, Sat 3 is steadily climbing in the sky.',
    naiveMistake:
      'Assuming that waiting 3 minutes hurts Sat 3.',
    whyItFailsInRealLife: [
      'When Sat 3 first rose at 12°, thick atmosphere limited its radio speed to only 250 Mbps.',
      'During the 3 minutes we spent on Sat 2, Sat 3 climbed from 12° up to 65° elevation!',
      'When the dish now swings to Sat 3, Sat 3 is in the high-speed zenith zone running at 1,420 Mbps!',
      'We download Sat 3\'s 58.0 GB in half the time because the air is thin and the speed is maximum.'
    ],
    smartAlgorithmChoice:
      'SWING DISH TO SAT 3 AT 65° ZENITH. Harvest Sat 3 at peak 1,420 Mbps speed over its remaining 8-minute pass.',
    simpleOutcomeSummary:
      'Speed bonus achieved: Sat 3 reached 65° elevation, downloading 5x faster than at the horizon!',
    miniVisualState: {
      dishAngleDeg: -35,
      dishElevationDeg: 65.0,
      connectedSatelliteId: 'sat-3',
      highlightSatelliteId: 'sat-3',
      slewPathTargetId: 'sat-3',
      isSlewing: false,
      bitrateMbps: 1420,
      alertMessage: 'Peak Elevation Lock: Sat 3 now at 65° Zenith! Downloading at 1,420 Mbps!',
      alertType: 'success',
      transferredGb: 58.0,
      targetGb: 58.0
    }
  },
  {
    id: 5,
    stepNumber: 5,
    phaseTitle: 'The Bookmark Rule (CFDP)',
    badge: 'CASE 5: ZERO LOST DATA',
    headline: 'What Happened to Sat 1? (Digital Checkpoint Saved)',
    storyContext:
      'When we paused Sat 1 to catch Sat 2, did we throw away Sat 1\'s download? Absolutely not.',
    naiveMistake:
      'Assuming that interrupting a satellite loses all the gigabytes already sent.',
    whyItFailsInRealLife: [
      'Sat 1 had already transferred 22.8 GB before yielding the dish.',
      'Our system uses CFDP Class 2 digital bookmarks: Svalbard ground station saves a receipt: "22.8 GB confirmed."',
      'Sat 1 records this receipt. In 42 minutes, Sat 1 flies over Inuvik Ground Station in Canada.',
      'At Inuvik, Sat 1 resumes from GB 22.9, downloading only its remaining 15.6 GB. Zero duplicate data!'
    ],
    smartAlgorithmChoice:
      'COMMIT BOOKMARK RECEIPT (22.8 GB). Pre-book the remaining 15.6 GB at Inuvik Ground Station for the next orbit.',
    simpleOutcomeSummary:
      'Zero wasted data: Sat 1 bookmarked at 22.8 GB and automatically resumes at Inuvik.',
    miniVisualState: {
      dishAngleDeg: 0,
      dishElevationDeg: 78.5,
      connectedSatelliteId: 'sat-1',
      highlightSatelliteId: 'sat-1',
      slewPathTargetId: null,
      isSlewing: false,
      bitrateMbps: 1420,
      alertMessage: 'Bookmark Saved: Sat 1 (22.8 GB) confirmed. Resumes from GB 22.9 in Canada!',
      alertType: 'info',
      transferredGb: 22.8,
      targetGb: 38.4,
      checkpointSavedGb: 22.8
    }
  },
  {
    id: 6,
    stepNumber: 6,
    phaseTitle: 'The Cable-Wrap Protection',
    badge: 'CASE 6: MECHANICAL SAFETY',
    headline: 'Checking Internal Cables to Avoid an 8-Minute Jam',
    storyContext:
      'As the dish swings from Sat 2 (on the right) to Sat 3 (on the left), its internal turntable rotates.',
    naiveMistake:
      'Forgetting that metal antennas have cables inside that can twist and hit mechanical end-stops.',
    whyItFailsInRealLife: [
      'If the turntable spins past ±270°, an emergency safety limit switch trips.',
      'The dish must immediately abort tracking and spend 8 minutes slowly unwinding its cord in reverse.',
      'ORBITOPS tracks the exact cable degrees (+115° cumulative) and confirms the turn is 100% safe within limits.'
    ],
    smartAlgorithmChoice:
      'VERIFY CABLE TRAJECTORY: Slew trajectory confirmed safe (+115° within ±270° boundary). Zero unwraps needed.',
    simpleOutcomeSummary:
      'Hardware protected: Dish operates smoothly without hitting cable limits or pausing.',
    miniVisualState: {
      dishAngleDeg: -35,
      dishElevationDeg: 65.0,
      connectedSatelliteId: 'sat-3',
      highlightSatelliteId: null,
      slewPathTargetId: null,
      isSlewing: false,
      bitrateMbps: 1420,
      alertMessage: 'Cable Safety PASS: Rotation is +115° (well within ±270° limit switch).',
      alertType: 'info',
      transferredGb: 58.0,
      targetGb: 58.0
    }
  },
  {
    id: 7,
    stepNumber: 7,
    phaseTitle: 'The Final Scorecard',
    badge: 'CASE 7: PROOF OF VALUE',
    headline: 'The Grand Comparison: Old Way vs ORBITOPS',
    storyContext:
      'Let\'s look at the final scoreboard across all three satellites.',
    naiveMistake:
      'Old Naive Schedulers: Got only Sat 3 (Sat 2 died on the horizon; Sat 1 was thrown away). Total: 46.2 GB.',
    whyItFailsInRealLife: [
      'Naive approach lost Sat 2 completely (42.0 GB destroyed).',
      'Naive approach discarded Sat 1\'s partial pass (22.8 GB wasted).',
      'Naive total data captured: only 46.2 GB.'
    ],
    smartAlgorithmChoice:
      'ORBITOPS Scorecard: Sat 2 (100% saved = 42.0 GB) + Sat 3 (100% saved = 58.0 GB) + Sat 1 (22.8 GB bookmarked + 15.6 GB at Inuvik = 38.4 GB). Total Data Captured: 141.4 GB (+206% Gain)!',
    simpleOutcomeSummary:
      'All 3 satellites saved! 141.4 GB delivered vs 46.2 GB naive (+206% Gain) · 0 overflows · 0 lost passes.',
    miniVisualState: {
      dishAngleDeg: 0,
      dishElevationDeg: 78.5,
      connectedSatelliteId: null,
      highlightSatelliteId: null,
      slewPathTargetId: null,
      isSlewing: false,
      bitrateMbps: 1450,
      alertMessage: 'Mission Complete: ALL 3 SATELLITES SAVED! 141.4 GB delivered (+206% gain)!',
      alertType: 'success',
      transferredGb: 141.4,
      targetGb: 141.4
    }
  }
];
