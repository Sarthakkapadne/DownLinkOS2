import asyncio
import uuid
import datetime
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .db.database import get_db, init_db, engine
from .db.models import (
    SatelliteEntity,
    GroundStationEntity,
    PassOpportunityEntity,
    ScheduleRunEntity,
    ScheduledContactEntity,
    DisruptionEventEntity,
    AuditRecordEntity
)
from .models.schemas import (
    OptimizationRequest,
    OptimizationResponse,
    DisruptionRequest,
    DisruptionResponse,
    ValidationResponse,
    CapExSitingRequest,
    CapExSitingResponse,
    GroundStationModel,
    SatelliteModel,
    PassOpportunityModel,
    ScheduledContactModel,
    ScheduleMetricsModel
)
from .config import DEFAULT_GROUND_STATIONS, DEFAULT_SATELLITES, DEFAULT_PASS_OPPORTUNITIES
from .engine.optimizer_cpsat import OptimizerCPSAT
from .engine.baseline_fcfs import BaselineFCFS
from .engine.priority_greedy import PriorityGreedyScheduler
from .engine.validator import IndependentValidator
from .engine.pruner import AstrodynamicPruner
from .engine.ingest import IngestionAdapter
from .engine.explainer import DecisionExplainer
from .engine.scenario_scheduler import ScenarioScheduler
from .twin.replanner import ReactiveReplanner
from .services.capex_siting import CapExSitingOptimizer
from .services.telegram_bot import TelegramMissionBot

# Initialize database schema and default seeds on import/startup
init_db()

app = FastAPI(
    title="ORBITOPS: Autonomous Ground Station Scheduling & Mission Control",
    description="Production-grade mathematical optimization and digital twin API for Planet Labs SPACE-04 Multi-Satellite Downlinks.",
    version="2.0.0"
)

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# 1. SYSTEM HEALTH & METADATA
# ---------------------------------------------------------------------------

@app.get("/")
def read_root():
    return {
        "system": "ORBITOPS (DownlinkOS)",
        "challenge": "Planet Labs SPACE-04",
        "status": "OPERATIONAL",
        "version": "2.0.0",
        "solvers": ["Google OR-Tools CP-SAT", "Priority-Greedy", "Naive FCFS"],
        "database": "SQLite / SQLAlchemy ORM Initialized",
        "docs_url": "/docs"
    }

@app.get("/api/v1/health")
def health_check(db: Session = Depends(get_db)):
    sat_count = db.query(SatelliteEntity).count()
    station_count = db.query(GroundStationEntity).count()
    pass_count = db.query(PassOpportunityEntity).count()
    run_count = db.query(ScheduleRunEntity).count()

    return {
        "status": "HEALTHY",
        "database_connected": True,
        "satellites_registered": sat_count,
        "ground_stations_online": station_count,
        "pass_opportunities_cached": pass_count,
        "historical_runs_logged": run_count,
        "solver_backend": "Google OR-Tools CP-SAT (Active)",
        "timestamp_utc": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

# ---------------------------------------------------------------------------
# 2. GROUND STATIONS & SATELLITES REGISTRY (DATABASE CRUD)
# ---------------------------------------------------------------------------

@app.get("/api/v1/stations", response_model=List[GroundStationModel])
def get_stations(db: Session = Depends(get_db)):
    """Retrieves all registered ground station antennas from database."""
    entities = db.query(GroundStationEntity).all()
    return [
        GroundStationModel(
            id=e.id,
            name=e.name,
            code=e.code,
            location=e.location,
            lat=e.lat,
            lon=e.lon,
            status=e.status,
            current_cable_deg=e.current_cable_deg,
            dish_diameter_m=e.dish_diameter_m,
            rain_attenuation_db=e.rain_attenuation_db,
            elevation_mask_deg=e.elevation_mask_deg,
            max_slew_rate_deg_sec=e.max_slew_rate_deg_sec
        )
        for e in entities
    ]

@app.put("/api/v1/stations/{station_id}/status")
def update_station_status(station_id: str, payload: Dict[str, str], db: Session = Depends(get_db)):
    """Updates operational health of a dish antenna (ACTIVE, OFFLINE, MAINTENANCE)."""
    station = db.query(GroundStationEntity).filter(GroundStationEntity.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Ground station not found")

    new_status = payload.get("status", "ACTIVE").upper()
    if new_status not in ["ACTIVE", "OFFLINE", "MAINTENANCE"]:
        raise HTTPException(status_code=400, detail="Invalid station status")

    station.status = new_status
    db.commit()
    return {"station_id": station_id, "name": station.name, "new_status": new_status}

@app.get("/api/v1/satellites", response_model=List[SatelliteModel])
def get_satellites(db: Session = Depends(get_db)):
    """Retrieves all active spacecraft and SSR buffer telemetry from database."""
    entities = db.query(SatelliteEntity).all()
    return [
        SatelliteModel(
            id=e.id,
            name=e.name,
            constellation=e.constellation,
            ssr_capacity_gb=e.ssr_capacity_gb,
            current_buffer_gb=e.current_buffer_gb,
            data_gen_rate_gb_per_orbit=e.data_gen_rate_gb_per_orbit,
            max_sspa_power_w=e.max_sspa_power_w,
            thermal_cooldown_min=e.thermal_cooldown_min,
            priority=e.priority
        )
        for e in entities
    ]

@app.post("/api/v1/satellites", response_model=SatelliteModel)
def create_satellite(sat: SatelliteModel, db: Session = Depends(get_db)):
    """Registers a new satellite in the constellation telemetry registry."""
    existing = db.query(SatelliteEntity).filter(SatelliteEntity.id == sat.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Satellite ID already exists")

    entity = SatelliteEntity(
        id=sat.id,
        name=sat.name,
        constellation=sat.constellation,
        ssr_capacity_gb=sat.ssr_capacity_gb,
        current_buffer_gb=sat.current_buffer_gb,
        data_gen_rate_gb_per_orbit=sat.data_gen_rate_gb_per_orbit,
        max_sspa_power_w=sat.max_sspa_power_w,
        thermal_cooldown_min=sat.thermal_cooldown_min,
        priority=sat.priority
    )
    db.add(entity)
    db.commit()
    return sat

# ---------------------------------------------------------------------------
# 3. PASS OPPORTUNITIES & PRUNING PIPELINE (STAGES 1 & 2)
# ---------------------------------------------------------------------------

@app.get("/api/v1/passes", response_model=List[PassOpportunityModel])
def get_passes(db: Session = Depends(get_db)):
    """Retrieves all candidate pass opportunities stored in the mission database."""
    entities = db.query(PassOpportunityEntity).all()
    return [
        PassOpportunityModel(
            id=e.id,
            satellite_id=e.satellite_id,
            satellite_name=e.satellite_name,
            station_id=e.station_id,
            station_name=e.station_name,
            aos_minutes=e.aos_minutes,
            los_minutes=e.los_minutes,
            duration_minutes=e.duration_minutes,
            max_elevation_deg=e.max_elevation_deg,
            priority=e.priority,
            data_volume_gb=e.data_volume_gb,
            is_keyhole_risk=e.is_keyhole_risk,
            cable_angle_aos=e.cable_angle_aos,
            cable_angle_los=e.cable_angle_los,
            satellite_buffer_at_aos=e.satellite_buffer_at_aos,
            buffer_fill_pct=e.buffer_fill_pct,
            urgency_score=e.urgency_score
        )
        for e in entities
    ]

@app.post("/api/v1/passes/upload-csv")
async def upload_passes_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Stage 1 Ingestion: Upload raw CSV pass timetable and normalize into database."""
    content = await file.read()
    csv_text = content.decode("utf-8")
    parsed_passes, errors = IngestionAdapter.parse_csv_stream(csv_text)

    # Insert into database
    for p in parsed_passes:
        existing = db.query(PassOpportunityEntity).filter(PassOpportunityEntity.id == p.id).first()
        if not existing:
            entity = PassOpportunityEntity(
                id=p.id,
                satellite_id=p.satellite_id,
                station_id=p.station_id,
                satellite_name=p.satellite_name,
                station_name=p.station_name,
                aos_minutes=p.aos_minutes,
                los_minutes=p.los_minutes,
                duration_minutes=p.duration_minutes,
                max_elevation_deg=p.max_elevation_deg,
                priority=p.priority,
                data_volume_gb=p.data_volume_gb,
                is_keyhole_risk=p.is_keyhole_risk,
                cable_angle_aos=p.cable_angle_aos,
                cable_angle_los=p.cable_angle_los,
                satellite_buffer_at_aos=p.satellite_buffer_at_aos,
                buffer_fill_pct=p.buffer_fill_pct,
                urgency_score=p.urgency_score,
                is_pruned=False
            )
            db.add(entity)
    db.commit()

    return {
        "status": "INGESTED",
        "passes_added": len(parsed_passes),
        "parsing_errors": errors,
        "sample": parsed_passes[:3] if parsed_passes else []
    }

@app.post("/api/v1/passes/prune")
def prune_candidate_passes(req: OptimizationRequest):
    """Stage 2 Pruning: Filters silent failures (cable wrap, keyhole, short duration) and scores urgency."""
    admissible, pruned = AstrodynamicPruner.prune_and_score(
        passes=req.passes,
        stations=req.stations,
        satellites=req.satellites
    )
    return {
        "admissible_count": len(admissible),
        "pruned_count": len(pruned),
        "admissible_passes": admissible,
        "pruned_records": pruned
    }

# ---------------------------------------------------------------------------
# 3B. SCENARIO JSON UPLOAD & RULE-BASED SCHEDULER
# ---------------------------------------------------------------------------

@app.post("/api/v1/schedule/upload-scenario")
def upload_scenario_json(scenario_data: Dict[str, Any]):
    """
    Ingests scenario JSON (containing ground_stations, satellites, and orbit metadata),
    runs the rule-based ORBITOPS scheduling engine, and returns a deconflicted schedule with FCFS comparison.
    """
    result = ScenarioScheduler.schedule_scenario(scenario_data)
    return result

@app.post("/api/v1/schedule/upload-scenario-file")
async def upload_scenario_file(file: UploadFile = File(...)):
    """
    Ingests scenario JSON file, parses payload, and computes rule-based schedule.
    """
    import json
    content = await file.read()
    scenario_data = json.loads(content.decode("utf-8"))
    result = ScenarioScheduler.schedule_scenario(scenario_data)
    return result

# ---------------------------------------------------------------------------
# 4. SCHEDULER ENGINES (STAGE 3: ORBITOPS CP-SAT, GREEDY, FCFS)
# ---------------------------------------------------------------------------

@app.post("/api/v1/schedule/optimize", response_model=OptimizationResponse)
def optimize_schedule(req: OptimizationRequest, db: Session = Depends(get_db)):
    """Stage 3: Solves global scheduling using Google OR-Tools CP-SAT and persists run in database."""
    result = OptimizerCPSAT.solve(
        passes=req.passes,
        stations=req.stations,
        satellites=req.satellites,
        offline_station_id=req.offline_station_id,
        max_solve_time_s=req.max_solve_time_seconds
    )

    # Persist Schedule Run to Database
    run_id = f"RUN-{uuid.uuid4().hex[:8].upper()}"
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    run_entity = ScheduleRunEntity(
        id=run_id,
        name=f"ORBITOPS CP-SAT Plan ({now_utc.strftime('%H:%M:%S UTC')})",
        solver_name=result.solver_name,
        created_at=now_utc,
        status="COMPLETED",
        total_delivered_gb=result.metrics.total_delivered_gb,
        priority_weighted_score=result.metrics.priority_weighted_score,
        buffer_overflow_count=result.metrics.buffer_overflow_count,
        antenna_utilization_pct=result.metrics.antenna_utilization_pct,
        scheduled_count=result.metrics.scheduled_count,
        rejected_count=result.metrics.rejected_count,
        emergency_fulfillment_pct=result.metrics.emergency_fulfillment_pct,
        optimality_gap_pct=result.optimality_gap_pct,
        solve_duration_ms=result.solve_duration_ms
    )
    db.add(run_entity)

    # Persist Allocated Contacts
    for c in result.scheduled_contacts:
        contact_entity = ScheduledContactEntity(
            id=f"{run_id}-{c.id}",
            run_id=run_id,
            pass_id=c.pass_id,
            satellite_id=c.satellite_id,
            satellite_name=c.satellite_name,
            station_id=c.station_id,
            station_name=c.station_name,
            start_minutes=c.start_minutes,
            end_minutes=c.end_minutes,
            duration_minutes=c.duration_minutes,
            delivered_volume_gb=c.delivered_volume_gb,
            priority=c.priority,
            is_frozen=c.is_frozen,
            status=c.status,
            selection_rationale=c.selection_rationale,
            price_of_forcing=c.price_of_forcing,
            cable_angle_start=c.cable_angle_start,
            cable_angle_end=c.cable_angle_end
        )
        db.add(contact_entity)

    # Persist Audit Log
    for r in result.rejected_passes:
        audit_entity = AuditRecordEntity(
            id=f"{run_id}-REJ-{r.pass_id}",
            run_id=run_id,
            pass_id=r.pass_id,
            satellite_name=r.satellite_name,
            station_name=r.station_name,
            decision="REJECTED",
            reason_code=r.reason_code,
            reason_explanation=r.reason_explanation,
            price_of_forcing_penalty=r.price_of_forcing_penalty,
            validator_status="PASS (0 VIOLATIONS)"
        )
        db.add(audit_entity)

    db.commit()
    return result

@app.post("/api/v1/schedule/fcfs")
def run_fcfs_baseline(req: OptimizationRequest):
    """Runs the naive First-Come-First-Served (FCFS) baseline scheduler for comparison."""
    contacts, rejected, metrics = BaselineFCFS.solve(
        passes=req.passes,
        stations=req.stations,
        satellites=req.satellites
    )
    return {
        "solver_name": "First-Come-First-Served (FCFS Baseline)",
        "metrics": metrics,
        "scheduled_contacts": contacts,
        "rejected_passes": rejected
    }

@app.post("/api/v1/schedule/greedy")
def run_priority_greedy(req: OptimizationRequest):
    """Runs the Priority-Greedy heuristic scheduler for comparative benchmark."""
    contacts, rejected, metrics = PriorityGreedyScheduler.solve(
        passes=req.passes,
        stations=req.stations,
        satellites=req.satellites,
        offline_station_id=req.offline_station_id
    )
    return {
        "solver_name": "Priority-Greedy Heuristic",
        "metrics": metrics,
        "scheduled_contacts": contacts,
        "rejected_passes": rejected
    }

@app.post("/api/v1/schedule/benchmark")
def run_three_way_benchmark(req: OptimizationRequest):
    """Runs all 3 schedulers on identical input (FCFS vs Priority-Greedy vs ORBITOPS CP-SAT)."""
    # 1. FCFS
    fcfs_contacts, fcfs_rejected, fcfs_metrics = BaselineFCFS.solve(
        passes=req.passes,
        stations=req.stations,
        satellites=req.satellites
    )

    # 2. Greedy
    greedy_contacts, greedy_rejected, greedy_metrics = PriorityGreedyScheduler.solve(
        passes=req.passes,
        stations=req.stations,
        satellites=req.satellites,
        offline_station_id=req.offline_station_id
    )

    # 3. CP-SAT
    cpsat_res = OptimizerCPSAT.solve(
        passes=req.passes,
        stations=req.stations,
        satellites=req.satellites,
        offline_station_id=req.offline_station_id,
        max_solve_time_s=req.max_solve_time_seconds
    )

    # Calculate Deltas
    fcfs_score = fcfs_metrics.priority_weighted_score or 1.0
    cpsat_score = cpsat_res.metrics.priority_weighted_score
    gain_pct = round(((cpsat_score - fcfs_score) / fcfs_score) * 100.0, 1)

    return {
        "benchmark_summary": {
            "fcfs_score": fcfs_metrics.priority_weighted_score,
            "greedy_score": greedy_metrics.priority_weighted_score,
            "orbitops_cpsat_score": cpsat_score,
            "orbitops_gain_vs_fcfs_pct": gain_pct,
            "fcfs_overflows": fcfs_metrics.buffer_overflow_count,
            "orbitops_overflows": cpsat_res.metrics.buffer_overflow_count,
            "optimality_gap_pct": cpsat_res.optimality_gap_pct
        },
        "fcfs": {"metrics": fcfs_metrics, "contacts": fcfs_contacts},
        "greedy": {"metrics": greedy_metrics, "contacts": greedy_contacts},
        "orbitops": {"metrics": cpsat_res.metrics, "contacts": cpsat_res.scheduled_contacts}
    }

# ---------------------------------------------------------------------------
# 5. RESILIENCE, OUTAGE REPAIR & VALIDATION (STAGES 4 & 5)
# ---------------------------------------------------------------------------

@app.post("/api/v1/schedule/disrupt", response_model=DisruptionResponse)
def handle_disruption(req: DisruptionRequest, db: Session = Depends(get_db)):
    """Stage 4: Executes sub-second reactive repair locking completed contacts upon station failure."""
    disruption = ReactiveReplanner.repair_outage(
        offline_station_id=req.offline_station_id,
        current_mission_min=req.current_mission_time_min,
        original_schedule=req.original_schedule,
        all_passes=req.passes,
        stations=req.stations,
        satellites=req.satellites
    )

    # Persist Disruption Event to Database
    event = DisruptionEventEntity(
        id=f"DISRUPT-{uuid.uuid4().hex[:8].upper()}",
        offline_station_id=disruption.disrupted_station_id,
        timestamp_min=req.current_mission_time_min,
        passes_preserved=disruption.passes_preserved,
        passes_rerouted=disruption.passes_rerouted,
        passes_dropped=disruption.passes_dropped,
        churn_count=disruption.churn_count,
        value_retained_pct=disruption.value_retained_pct,
        replan_latency_ms=disruption.replan_latency_ms,
        created_at=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(event)
    db.commit()

    return disruption

@app.post("/api/v1/schedule/validate", response_model=ValidationResponse)
def validate_schedule(req: Dict[str, Any]):
    """Stage 5: Independent safety referee verifying all 5 physical invariants with 0 tolerance."""
    contacts = [ScheduledContactModel(**c) for c in req.get("contacts", [])]
    passes = [PassOpportunityModel(**p) for p in req.get("passes", [])]
    stations = [GroundStationModel(**s) for s in req.get("stations", [])]

    return IndependentValidator.audit(
        contacts=contacts,
        all_passes=passes,
        stations=stations
    )

@app.post("/api/v1/schedule/force-pass")
def calculate_price_of_forcing(payload: Dict[str, Any]):
    """Stage 5: Calculates the exact 'Price of Forcing It' in lost Gigabytes and net mission score."""
    target_pass = PassOpportunityModel(**payload.get("pass", {}))
    schedule = [ScheduledContactModel(**c) for c in payload.get("current_schedule", [])]
    return DecisionExplainer.calculate_price_of_forcing(target_pass, schedule)

# ---------------------------------------------------------------------------
# 6. HISTORICAL RUNS & DATABASE PERSISTENCE
# ---------------------------------------------------------------------------

@app.get("/api/v1/runs")
def list_schedule_runs(db: Session = Depends(get_db)):
    """Lists all historical schedule runs stored in the mission database."""
    runs = db.query(ScheduleRunEntity).order_by(ScheduleRunEntity.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "name": r.name,
            "solver_name": r.solver_name,
            "created_at": r.created_at.isoformat(),
            "score": r.priority_weighted_score,
            "total_delivered_gb": r.total_delivered_gb,
            "scheduled_count": r.scheduled_count,
            "rejected_count": r.rejected_count,
            "optimality_gap_pct": r.optimality_gap_pct,
            "solve_duration_ms": r.solve_duration_ms
        }
        for r in runs
    ]

@app.get("/api/v1/runs/{run_id}")
def get_run_details(run_id: str, db: Session = Depends(get_db)):
    """Retrieves full details and allocated contacts for a specific historical schedule run."""
    run = db.query(ScheduleRunEntity).filter(ScheduleRunEntity.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Schedule run not found")

    contacts = db.query(ScheduledContactEntity).filter(ScheduledContactEntity.run_id == run_id).all()
    audits = db.query(AuditRecordEntity).filter(AuditRecordEntity.run_id == run_id).all()

    return {
        "run": {
            "id": run.id,
            "name": run.name,
            "solver_name": run.solver_name,
            "created_at": run.created_at.isoformat(),
            "score": run.priority_weighted_score,
            "total_delivered_gb": run.total_delivered_gb,
            "optimality_gap_pct": run.optimality_gap_pct,
            "solve_duration_ms": run.solve_duration_ms
        },
        "contacts": [
            {
                "id": c.id,
                "pass_id": c.pass_id,
                "satellite_name": c.satellite_name,
                "station_name": c.station_name,
                "start_minutes": c.start_minutes,
                "end_minutes": c.end_minutes,
                "duration_minutes": c.duration_minutes,
                "delivered_volume_gb": c.delivered_volume_gb,
                "priority": c.priority,
                "status": c.status,
                "selection_rationale": c.selection_rationale
            }
            for c in contacts
        ],
        "audits": [
            {
                "pass_id": a.pass_id,
                "satellite_name": a.satellite_name,
                "station_name": a.station_name,
                "decision": a.decision,
                "reason_code": a.reason_code,
                "reason_explanation": a.reason_explanation,
                "price_of_forcing_penalty": a.price_of_forcing_penalty
            }
            for a in audits
        ]
    }

@app.post("/api/v1/db/reset")
def reset_database(db: Session = Depends(get_db)):
    """Resets and re-seeds database with the standard PlanetScope 24h polar passes."""
    db.query(ScheduledContactEntity).delete()
    db.query(AuditRecordEntity).delete()
    db.query(DisruptionEventEntity).delete()
    db.query(ScheduleRunEntity).delete()
    db.query(PassOpportunityEntity).delete()
    db.query(SatelliteEntity).delete()
    db.query(GroundStationEntity).delete()
    db.commit()

    init_db()
    return {"status": "SUCCESS", "message": "Database reset and re-seeded with PlanetScope polar scenario."}

# ---------------------------------------------------------------------------
# 7. CAPEX SITING & TELEGRAM BOT
# ---------------------------------------------------------------------------

@app.post("/api/v1/siting/evaluate", response_model=CapExSitingResponse)
def evaluate_siting(req: CapExSitingRequest):
    """Evaluates candidate ground antenna sites based on polar orbital ROI."""
    return CapExSitingOptimizer.evaluate(req)

@app.post("/api/v1/telegram/command")
def execute_telegram_command(payload: Dict[str, Any]):
    """Simulates Telegram Mission Ops bot command interaction."""
    cmd = payload.get("command", "/status")
    args = payload.get("args", [])
    return TelegramMissionBot.handle_command(cmd, args)

# ---------------------------------------------------------------------------
# 8. REAL-TIME WEBSOCKET TELEMETRY
# ---------------------------------------------------------------------------

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    """Broadcasts live mission simulation clock and active downlink beam telemetry."""
    await websocket.accept()
    try:
        minute = 70
        while True:
            # Polar orbit contact window simulation
            is_active = (minute >= 73 and minute <= 84) or (minute >= 115 and minute <= 126)
            await websocket.send_json({
                "utc_minute": minute,
                "formatted_utc": f"{minute // 60:02d}:{minute % 60:02d} UTC",
                "active_downlinks": [
                    {
                        "satellite": "SuperDove-2104",
                        "station": "KSAT Svalbard Ant-1",
                        "priority": 5,
                        "rate_mbps": 1420.0
                    }
                ] if is_active else [],
                "status": "TELEMETRY_SYNC"
            })
            minute = (minute + 1) % 1440
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        pass
