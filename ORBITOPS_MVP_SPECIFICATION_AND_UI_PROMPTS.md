# ORBITOPS (DownlinkOS) — Minimalist MVP Blueprint & UI Prompt Specification
**Planet Labs Challenge SPACE-04: Multi-Satellite Ground Station Scheduling Platform**

---

## EXECUTIVE SUMMARY & PURPOSE
This document serves as the **definitive, end-to-end design blueprint** and **AI prompt specification** for the ORBITOPS platform. It replaces all cluttered or hardcoded concepts with a **minimalist, high-contrast, crystal-clear MVP** that any mission controller, hackathon judge, or ground station director can understand in 5 seconds.

It details:
1. **The Real-World End Users**: Who they are, what legacy systems they currently use, and why those systems fail.
2. **The "Crazy USPs"**: The 5 undeniable wow-factor capabilities that set ORBITOPS apart from any naive scheduler.
3. **Dataset Grounding & Provenance**: Which authentic datasets are used (PlanetScope, SkySat, Celestrak TLEs, KSAT/SSC stations) and why.
4. **The 5 Minimalist MVP Pages**: Exactly what each view displays, how cause-and-effect is visually demonstrated, and how failure conditions are simulated.
5. **Production-Ready AI UI Generation Prompts**: Exhaustive, copy-pasteable prompts containing every layout, component, color token, data contract, and micro-interaction so an AI can generate the perfect UI in one shot.

---

## 1. END USERS & INDUSTRY CONTEXT: WHO ARE THEY & HOW DO THEY OPERATE?

### 1.1 The User Personas
| Persona | Title / Organization | Core Responsibility | The Painful Daily Reality |
|---|---|---|---|
| **Persona A: Flight Ops Controller** | Planet Labs / Satellite Operator | Keeps 200+ Earth observation satellites healthy and downloads raw sensor data. | Satellites generate 30–50 GB per 90-minute orbit. If a satellite cannot downlink within 3 orbits, its onboard memory fills to 100% and fresh disaster/conflict imagery is permanently wiped. |
| **Persona B: Ground Network Allocator** | KSAT / SSC / AWS Ground Station | Manages multi-million dollar parabolic dishes at polar and equatorial sites. | Dishes are contested. At Svalbard (78°N), 15 satellites pass overhead in the same 20-minute window. Current tools book dishes using chronological Google-Calendar-style rules, creating massive bottlenecks. |
| **Persona C: Tasking & Intelligence Officer** | Emergency Response / Defense Customer | Demands urgent downlinks within 30 minutes of wildfire/flood capture. | Legacy schedulers are "black boxes." When a mission is rejected, operators get a cryptic error with zero explanation of why or what it would cost to force it. |

### 1.2 How Their Current Systems Work (And Why They Fail)
1. **The Naive FCFS / Greedy Calendar Paradigm**:
   - Current commercial ground station scheduling still operates primarily on **First-Come-First-Served (FCFS)** or static priority tiers.
   - *Failure Mode:* A low-priority routine telemetry satellite books Svalbard Dish 1 at 10:00–10:12. An ultra-urgent disaster monitoring satellite passes at 10:05–10:16. The legacy system rejects the disaster satellite simply because the routine satellite reserved the slot first.
2. **The Hidden Physics Blindspots**:
   - **Turntable Cable-Wrap:** Parabolic antennas spin on an azimuth turntable. Cables twist inside the pedestal. If an antenna tracks past $\pm 270^\circ$, it hits physical end-stops and must execute an 8-minute "cable unwrap" cycle. Legacy schedulers do not track cable angle history, causing antenna jams mid-pass.
   - **Zenith Keyhole (The Overhead Gimbal Blindspot):** When a satellite passes directly overhead (elevation $>85^\circ$), an azimuth-elevation mount must spin $180^\circ$ infinitely fast to maintain tracking. Physical motors can only slew at $10^\circ–15^\circ/\text{s}$. The dish loses signal lock at the exact point of maximum data rate!
   - **Weather Outages & Arctic Blizzards:** When Svalbard or Inuvik suffers an arctic storm or motor fault, rescheduling is manual, requiring human phone calls and taking 2 to 4 hours. By the time operators re-plan, tens of gigabytes of satellite memory have overflowed.

---

## 2. THE 5 "CRAZY USPs" (THE WOW FACTORS)

These 5 features take the platform from "just another calendar" to an irreplaceable mission control command platform:

### USP 1: The "Water Tank vs Drain Valve" Physical Mental Model
- Satellites are not abstract dots; they are **flying water tanks**. As they orbit, their optical cameras pour data in (30 GB/orbit).
- Ground station antennas are **high-pressure drain valves**.
- If a satellite's tank reaches 100% capacity before hitting a ground station, the tank overflows: **data is permanently destroyed**.
- *Visual Wow:* An intuitive fill gauge on every satellite and pass. Users immediately see: *"Satellite A is at 94% buffer capacity—if we don't downlink at Inuvik right now, 40 GB of data will be dumped into space."*

### USP 2: Direct Head-to-Head Dual Gantt (Cause & Effect Laid Bare)
- A synchronized, top-and-bottom timeline:
  - **Top Timeline:** Legacy FCFS Schedule (riddled with red "BUFFER OVERFLOW" alerts, priority inversions, and wasted slews).
  - **Bottom Timeline:** ORBITOPS CP-SAT Schedule (zero overflows, optimal high-elevation contacts, green safety stamps).
- Center Delta Badge instantly proves the value: **$+24.2\%$ Data Delivered · $0$ Buffer Overflows · $100\%$ Emergency Fulfillment**.

### USP 3: The Live Satellite Pass & "What-If It Fails" Downlink Simulator
- An animated tactical polar radar skyplot and RF link budget tracker:
  - Watch the satellite rise over the horizon (AOS), the dish acquire lock, and the DVB-S2X dynamic bitrate scale from $300\text{ Mbps}$ at $5^\circ$ elevation up to $1.6\text{ Gbps}$ at peak elevation.
  - Real-time data counters: satellite onboard memory drops from $240\text{ GB} \to 12\text{ GB}$ while ground station storage counts up.
- **The "Chaos Injection" Anomaly Simulator**:
  - Test real failure conditions:
    1. *Zenith Keyhole Anomaly ($>85^\circ$)*: Shows how the dish motor exceeds max slew rate and how ORBITOPS automatically splits the pass into dual lead/lag contacts to preserve data lock.
    2. *Mid-Pass RF Fade (Heavy Rain / Loss of Signal)*: Shows how CFDP Class 2 frame checkpointing preserves the first $18\text{ GB}$ and automatically queues only the remaining $12\text{ GB}$ for the next station.
    3. *Cable-Wrap Limit Hit*: Shows the antenna unwrap safety boundary.

### USP 4: The 1-Click "Break It" Outage Sandbox & Sub-Second Healing
- A dedicated disaster simulation control. Click **"Kill Svalbard Ant-1 (Blizzard / Motor Jam)"**.
- In **$< 50\text{ milliseconds}$**, the system replans the entire constellation:
  - **Frozen Horizon Lock ($t < 30\text{m}$):** Passes already active or occurring within 30 minutes are untouched so flight controllers aren't panicked.
  - **Smart Constellation Reroute:** Contended passes instantly bounce to Inuvik and TrollSat with minimal schedule churn.
  - Retains **$>95\%$** of fleet data throughput with zero human intervention.

### USP 5: "The Price of Forcing It" (Opportunity Cost Transparency)
- Solves the friction between AI optimization and human flight controllers.
- If a flight director insists: *"I don't care about your algorithm, force satellite SuperDove-2101 to downlink right now!"*
- The system does not say "Access Denied." Instead, it displays the **Opportunity Cost Invoice**:
  > *"Forcing SuperDove-2101 will cancel Svalbard Contact #4 for SkySat-C14. You will lose 38.2 GB of imagery and 75 priority points. SLA penalty: \$14,500. Do you accept this trade-off?"*

---

## 3. DATASET GROUNDING & PROVENANCE

### 3.1 Which Dataset Is Used & Why
The system uses authentic, publicly verifiable orbital ephemeris and ground network coordinates:
1. **Constellation Ephemeris (Planet Labs Fleet)**:
   - **PlanetScope (Flock 4p/4s)**: 3U CubeSats in Sun-Synchronous Orbit (SSO, ~500 km altitude, 97.4° inclination, 94.6 min orbital period). SSR Capacity: 256 GB.
   - **SkySat (Sub-meter Imaging)**: Agile high-resolution microsatellites (~450 km altitude). SSR Capacity: 512 GB.
   - **Pelican (Next-Gen Rapid Revisit)**: High-throughput LEO (~550 km altitude). SSR Capacity: 1024 GB.
   - Sourced from authentic NORAD Two-Line Element (TLE) sets via CelesTrak.
2. **Ground Station Network Topology**:
   - Real-world polar and sub-polar ground stations operated by KSAT and SSC:
     - **KSAT Svalbard (SVA-1 & SVA-2)**: Spitsbergen, Norway ($78.22^\circ\text{N}, 15.63^\circ\text{E}$). Sees 14 of 14 polar orbits per day.
     - **SSC Inuvik (INU-1)**: Northwest Territories, Canada ($68.36^\circ\text{N}, 133.53^\circ\text{W}$). Primary North American arctic link.
     - **KSAT TrollSat (TRL-1)**: Queen Maud Land, Antarctica ($72.01^\circ\text{S}, 2.54^\circ\text{E}$). Enables dual-pole dump every 45 minutes.
     - **SSC Punta Arenas (PUQ-1)**: Patagonia, Chile ($53.14^\circ\text{S}, 70.91^\circ\text{W}$). Mid-latitude fallback.
3. **RF Link Model**:
   - DVB-S2X ACM (Adaptive Coding & Modulation) dynamic bitrate function grounded in ITU-R P.618 propagation:
     $$R(\theta) = 200 + 1400 \cdot \sin(\theta)^{0.65} \text{ Mbps}$$

---

## 4. THE 5 MINIMALIST MVP PAGES: ARCHITECTURE & WORKFLOW

```
+----------------------------------------------------------------------------------------------------+
|                                    GLOBAL HEADER & MISSION CLOCK                                    |
| [Logo: ORBITOPS]  [24h Clock Scrub: 01:15 UTC] [Play/Pause 5x] [Plain English / Telemetry Toggle] |
| KPI: +24.2% Volume Delivered | 0 Buffer Overflows | $0 SLA Penalties | Safety: PASS (0 Violations)  |
+----------------------------------------------------------------------------------------------------+
| TABS: [1. Fleet & Passes] [2. Dual-Gantt Compare] [3. Downlink Sim] [4. Outage Sandbox] [5. Explainer] |
+----------------------------------------------------------------------------------------------------+
```

### Page 1: Fleet & Pass Master Manifest (The Operational Dashboard)
- **Top Summary Cards**: Total Satellites (8), Ground Dishes (5), Average Buffer Fill (72%), Approaching Critical Overflow (2).
- **Satellite Health & Water Tanks**: Card/Table grid of all satellites showing:
  - Constellation, Priority (1–5), Total SSR Capacity vs Current Buffer (visual water-tank bar).
  - Next Pass Countdown timer.
  - Today's Downlinked Volume vs Data Generated.
- **Pass Opportunities Table**:
  - Filterable list of all upcoming line-of-sight passes over the next 24 hours.
  - Columns: Satellite, Ground Station, AOS/LOS time, Duration, Max Elevation, Buffer Urgency Score ($1–100$).

### Page 2: Dual-Gantt Schedule Comparison (The Head-to-Head Proof)
- **Visual Contrast**:
  - Top Gantt: **Naive FCFS Baseline** with red conflict badges, dropped emergency passes, and warning icons.
  - Bottom Gantt: **ORBITOPS Intelligent Schedule** with optimal contact blocks, setup buffers, and zero overflows.
- **Interactive Scrubber**: Synchronized across both timelines.
- **Click to Inspect**: Clicking any pass opens a side drawer with exact pass details, elevation curve, and cable angle.

### Page 3: Live Downlink & Satellite Pass Simulator (The "Satellite Comes & Downlinks" View)
- **Radar Polar Skyplot**: High-contrast 2D polar circle ($0^\circ–360^\circ$ azimuth, concentric circles for $0^\circ, 30^\circ, 60^\circ, 90^\circ$ elevation).
- **Real-Time Pass Animation**: Satellite dot moves across the skyplot. Crosshairs follow with dish pointing azimuth/elevation.
- **Real-Time Bitrate & SSR Drainage**:
  - Speedometer dial showing current DVB-S2X throughput ($200\text{ Mbps} \to 1.6\text{ Gbps}$).
  - Live Water-Tank animation: Satellite onboard memory drops from $240\text{ GB} \to 15\text{ GB}$; Ground station storage counter increments.
- **Failure & Anomaly Simulator Controls**:
  - *Button: "Inject Zenith Keyhole (>85°)"* -> Dish freezes at zenith; shows how ORBITOPS automatically splits the pass.
  - *Button: "Inject Rain Fade / Link Drop"* -> RF signal cuts; CFDP Class 2 checkpoint saves partial data.
  - *Button: "Inject Cable Wrap Limit"* -> Shows turntable unwinding safety stop.

### Page 4: Disruption Outage Sandbox ("The Chaos Lab")
- **Ground Station Status Cards**: 4 stations with live health indicators.
- **"Break It" Action**: Click **"Simulate Mechanical Failure"** on KSAT Svalbard Ant-1.
- **Sub-Second Repair Visualization**:
  - Station card turns red (`OFFLINE`).
  - Repair panel appears in $<50\text{ms}$:
    - Passes Preserved (Frozen Horizon $<30\text{m}$): 3 contacts locked.
    - Passes Rerouted: 4 contacts seamlessly moved to Inuvik & TrollSat.
    - Retention Rate: $96.4\%$ data preserved.
- **Restore Button**: Re-enables the dish and recalculates global schedule.

### Page 5: Flight-Ops Decision Explainer & "Price of Forcing It"
- **Pass Decision Inspector**: Select any scheduled or rejected pass:
  - Generates plain-English flight rationale: *"Scheduled: High urgency score (98.5) and 82.5° elevation maximized DVB-S2X throughput."*
- **Interactive "Price of Forcing It" Sandbox**:
  - Flight controller selects an unscheduled pass and clicks **"Force This Pass"**.
  - System outputs exact opportunity cost:
    - Conflicting passes displaced.
    - Net gigabytes lost.
    - Priority point deficit.

---

## 5. PRODUCTION-READY AI UI GENERATION PROMPTS

Below are the exact, copy-pasteable UI generation prompts for each page. Use these directly in any AI coding agent or design tool.

```markdown
<!-- MASTER DESIGN SYSTEM SPECIFICATION -->
Generate a clean, modern, enterprise-grade web application using:
- Theme: Pure White (#FFFFFF), Slate (#F8FAFC, #F1F5F9), Charcoal text (#0F172A, #334155).
- Accents: Deep Sky Blue (#0284C7), Emerald Green (#059669 for PASS/OK), Crimson (#DC2626 for FAIL/CRITICAL), Amber (#D97706 for WARNING).
- Typography: Inter or SF Pro for UI; JetBrains Mono or Fira Code for all timestamps, azimuths, and data counters.
- Constraints: NO dark neon, NO cyberpunk styling, NO hardcoded cluttered text. High contrast, generous padding (p-6), clear borders (border-slate-200), subtle drop shadows (shadow-sm).
```

---

### PROMPT 1: Global Header & Mission Clock Component
```text
Create a React 18 + TypeScript + Tailwind CSS component named "MissionControlHeader".
Include:
1. Top Brand Bar:
   - Title: "ORBITOPS" in bold slate-900 with a badge "PLANET LABS SPACE-04".
   - Subtitle: "Autonomous Multi-Satellite Ground Station Scheduling Platform".
   - Plain English vs Deep Telemetry toggle switch with clear active indicator.
2. 24-Hour Scrubbable Mission Clock:
   - Scrub slider spanning 0 to 1440 minutes with UTC timestamp display (e.g., "01:15 UTC / T+75m").
   - Controls: Play/Pause button, Rewind to 00:00 button, and Speed selector buttons (1x, 5x, 10x, 30x).
3. Executive KPI Metric Pill Strip:
   - Metric 1: Total Delivered Data: "1,248.5 GB" (+24.2% vs FCFS in green).
   - Metric 2: Buffer Overflows: "0 Overflows" (green badge) vs "3 Overflows" in FCFS.
   - Metric 3: Emergency Mission Fulfillment: "100.0%".
   - Metric 4: Independent Referee: "PASS · 0 VIOLATIONS" in bold emerald-700.
Use clean slate-100 backgrounds with subtle borders and crisp typography.
```

---

### PROMPT 2: Page 1 — Fleet & Pass Master Manifest
```text
Create a React 18 + TypeScript + Tailwind CSS page named "FleetAndPassManifestPage".
This page acts as the operational master inventory for constellation satellites and ground passes.
Requirements:
1. Top Fleet Metric Cards (4 cards in a grid):
   - Active Satellites (8 online, 0 offline).
   - Ground Stations (4 active, 1 standby).
   - Fleet Average Buffer Fill (72.4% full).
   - Critical Satellites (>85% full, 2 satellites requiring immediate downlink).
2. Constellation Satellite Inventory Table:
   - Columns: Satellite Name (e.g. SuperDove-2104, SkySat-C14, Pelican-01), Constellation Badge (PlanetScope, SkySat, Pelican), Priority Tier (1-5 stars), SSR Total Capacity (GB), Current SSR Buffer (visual horizontal progress bar that fills up from green at <50%, amber at 50-80%, to pulsing crimson at >80%), Next Available Pass (countdown timer in minutes), Operational Status (Imaging, Idle, Downlinking).
3. 24-Hour Pass Opportunities Table:
   - Filter controls: Search by satellite name, Filter by Ground Station dropdown, Urgency Level toggle.
   - Columns: Pass ID, Satellite, Ground Station (with flag/location), AOS Time (UTC), LOS Time (UTC), Duration (minutes), Peak Elevation (degrees with badge), Data Volume Capacity (GB), Dynamic Urgency Score (1-100 formula badge).
   - Row hover state with a "View Pass Details" action button.
Style: Clean white cards with border-slate-200, crisp typography, and intuitive progress bars.
```

---

### PROMPT 3: Page 2 — Dual-Gantt Head-to-Head Schedule Comparison
```text
Create a React 18 + TypeScript + Tailwind CSS component named "DualGanttComparisonPage".
This page is the visual proof comparing legacy First-Come-First-Served (FCFS) against ORBITOPS CP-SAT.
Requirements:
1. Comparison Header:
   - Side-by-side summary bar showing:
     - Left: "Legacy FCFS Baseline" (Score: 717 pts, Overflows: 3, Throughput: 1,020 GB).
     - Right: "ORBITOPS CP-SAT" (Score: 942 pts, Overflows: 0, Throughput: 1,248 GB, +22.4% Gain).
2. The Dual-Gantt Canvas:
   - Time axis header spanning 00:00 to 06:00 UTC with 15-minute tick marks.
   - A vertical red cursor line tracking the current mission minute across both Gantt charts.
   - SECTION A: "Legacy FCFS Schedule"
     - One horizontal track per Ground Station (Svalbard Ant-1, Svalbard Ant-2, Inuvik, TrollSat, Punta Arenas).
     - Contact blocks rendered in slate-400 or muted colors.
     - Contention conflict callouts: Render a red pulsing badge over Svalbard Ant-1 at 01:15 UTC labeled "CONFLICT: SuperDove-2112 scheduled, SuperDove-2104 (Disaster Task) REJECTED -> BUFFER OVERFLOW".
   - SECTION B: "ORBITOPS Intelligent Schedule (Provably Optimal)"
     - Same Ground Station horizontal tracks.
     - Contact blocks rendered in rich color-coded badges based on satellite priority.
     - Between consecutive passes, show a light-slate diagonal pattern representing the 120-second dish slew & setup overhead.
     - At 01:15 UTC, show that SuperDove-2104 is scheduled, preserving 38.2 GB of disaster data.
3. Interactive Features:
   - Hovering any contact block displays a tooltip with: Satellite, Duration, Peak Elevation, Delivered GB, Cable Angle.
   - Clicking a contact opens an inspector panel.
```

---

### PROMPT 4: Page 3 — Live Downlink & Satellite Pass Physics Simulator
```text
Create a React 18 + TypeScript + Tailwind CSS component named "LiveDownlinkSimulatorPage".
This page provides the visual "wow factor" of a satellite approaching a ground station, tracking across the sky, and downlinking data, including real-world failure mode simulations.
Requirements:
1. Left Panel: Tactical Polar Radar Skyplot (SVG or Canvas)
   - Circular polar skyplot with concentric rings for 0° (horizon), 30°, 60°, and 90° (zenith).
   - Compass directions (N, E, S, W) with degree markers.
   - Orbit trajectory arc representing a pass over Svalbard from South-East to North-West.
   - Moving satellite dot that follows the mission clock.
   - Dish antenna crosshairs that point directly at the satellite.
2. Center Panel: RF Link & Data Drainage Gauge
   - Dynamic Bitrate Dial: Displays DVB-S2X ACM throughput in real time (e.g. "1,420 Mbps"), scaling dynamically based on elevation angle R(θ) = 200 + 1400*sin(θ)^0.65.
   - Satellite "Water Tank" SSR Buffer: Animated vertical cylinder or gauge showing onboard memory draining from 242 GB down to 18 GB during the pass.
   - Ground Station Storage Bucket: Animated counter ticking up (+1.4 GB/sec) as data arrives.
3. Right Panel: "Chaos & Failure Injection" Interactive Lab
   - Provide 3 simulation scenario buttons:
     - Button 1: "Inject Zenith Keyhole (>85°)" -> Triggers simulation where elevation reaches 88°. An alert pops up explaining: "Azimuth motor exceeds 15°/s slew limit at zenith! ORBITOPS splits pass into dual 4-minute contacts, avoiding lock loss."
     - Button 2: "Inject Mid-Pass RF Drop (Severe Snow Fade)" -> Signal cuts at minute 6. Displays: "CFDP Class 2 checkpoint saved 22.4 GB. Remaining 15.8 GB automatically queued for Inuvik."
     - Button 3: "Test Cable-Wrap Limit (+270°)" -> Displays turntable rotating to +265° and safely initiating controlled unwrap.
Clean white enterprise theme with interactive sliders and real-time numerical updates.
```

---

### PROMPT 5: Page 4 — Disruption Outage Sandbox ("The Chaos Lab")
```text
Create a React 18 + TypeScript + Tailwind CSS component named "DisruptionOutageSandboxPage".
This page allows users to intentionally break ground station hardware and observe sub-second reactive healing.
Requirements:
1. Ground Station Network Grid (4 Cards):
   - KSAT Svalbard Ant-1, KSAT Svalbard Ant-2, SSC Inuvik Ant-1, KSAT TrollSat Ant-1.
   - Each card displays: Status Badge (ACTIVE green or OFFLINE red), Location, Dish Diameter, Current Cable Angle, and an action button: "Simulate Mechanical Failure" (or "Restore Station" if offline).
2. Outage Reactive Healing Panel (Triggers when a station is set to OFFLINE):
   - Execution Speed Badge: "Replan Latency: 42 ms" (lightning icon).
   - Metric 1: Frozen Horizon Protection: "3 passes locked within <30m window (zero flight disruption)".
   - Metric 2: Autonomous Pass Rerouting: "4 passes moved to Inuvik and TrollSat".
   - Metric 3: Fleet Data Retained: "96.4% of total mission volume preserved".
   - Schedule Churn Counter: "Churn: 2 contact shifts".
3. Visual Reroute Flowchart / Diff View:
   - Shows the displaced passes:
     - Original: "SuperDove-2104 at Svalbard (01:15 UTC)" -> REROUTED TO -> "Inuvik (01:55 UTC)".
     - Data saved: 38.2 GB preserved from overflow.
```

---

### PROMPT 6: Page 5 — Flight-Ops Decision Explainer & "Price of Forcing It"
```text
Create a React 18 + TypeScript + Tailwind CSS component named "DecisionExplainerAndForcingPage".
This page removes the "AI black box" and provides operational transparency for every scheduling decision.
Requirements:
1. Search & Pass Decision Lineage:
   - Search input to select any Pass ID from the 24-hour horizon.
   - Detailed Decision Breakdown Card:
     - Pass ID, Satellite, Target Ground Station, Priority, Duration.
     - Decision Badge: "SCHEDULED" (green) or "REJECTED" (slate).
     - Rationale Box: Plain-English explanation (e.g. "Scheduled because satellite buffer is at 94.5% fill and peak elevation of 82.5° provides 38.2 GB of DVB-S2X throughput, out-ranking lower-urgency passes.") or rejection reason (e.g. "Rejected due to antenna contention at Svalbard Ant-1 with higher-priority disaster task.").
2. "Price of Forcing It" Opportunity Cost Calculator:
   - Dropdown of rejected passes with a primary button: "Calculate Price of Forcing".
   - Interactive Calculation Result Modal/Card:
     - Warning Callout: "Manual Override Opportunity Cost Invoice".
     - Table of Displaced Satellites: Lists satellites that must be dropped if this pass is forced.
     - Total Data Volume Lost: "-38.2 GB".
     - Priority Point Deficit: "-85 Priority Points".
     - Financial SLA Risk: "$14,500 Estimated SLA Penalty".
     - Confirmation actions: "Confirm Manual Flight Override" (red) or "Keep Optimal Schedule" (blue).
3. Independent Safety Referee Stamp:
   - A dedicated audit card verifying all 5 physical invariants:
     1. Dish No-Overlap (>=120s buffer): 0 Violations.
     2. Turntable Slew Limit (<=12°/s): 0 Violations.
     3. Zenith Keyhole (>85°): 0 Violations.
     4. Station Outage Compliance: 0 Violations.
     5. SSR Buffer Non-Negative: 0 Violations.
   - Green seal: "OFFICIALLY CERTIFIED · 0 SAFETY VIOLATIONS".
```
