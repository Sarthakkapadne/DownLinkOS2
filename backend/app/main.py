import asyncio
from typing import List, Dict, Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models.schemas import (
    OptimizationRequest,
    OptimizationResponse,
    DisruptionRequest,
    DisruptionResponse,
    ValidationResponse,
    CapExSitingRequest,
    CapExSitingResponse,
    GroundStationModel,
    SatelliteModel
)
from .config import DEFAULT_GROUND_STATIONS, DEFAULT_SATELLITES
from .engine.optimizer_cpsat import OptimizerCPSAT
from .engine.baseline_fcfs import BaselineFCFS
from .engine.validator import IndependentValidator
from .twin.replanner import ReactiveReplanner
from .services.capex_siting import CapExSitingOptimizer
from .services.telegram_bot import TelegramMissionBot

app = FastAPI(
    title="ORBITOPS: Autonomous Ground Station Scheduling Engine",
    description="Mathematical optimization API for Planet Labs SPACE-04 Multi-Satellite Downlinks.",
    version="1.0.0"
)

# CORS configuration for local React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "system": "ORBITOPS",
        "challenge": "Planet Labs SPACE-04",
        "status": "OPERATIONAL",
        "solver": "Google OR-Tools CP-SAT Discrete Interval Engine",
        "docs": "/docs"
    }

@app.get("/api/v1/stations", response_model=List[GroundStationModel])
def get_stations():
    return DEFAULT_GROUND_STATIONS

@app.get("/api/v1/satellites", response_model=List[SatelliteModel])
def get_satellites():
    return DEFAULT_SATELLITES

@app.post("/api/v1/schedule/optimize", response_model=OptimizationResponse)
def optimize_schedule(req: OptimizationRequest):
    """Solves the ground station scheduling problem using Google OR-Tools CP-SAT."""
    return OptimizerCPSAT.solve(
        passes=req.passes,
        stations=req.stations,
        satellites=req.satellites,
        offline_station_id=req.offline_station_id,
        max_solve_time_s=req.max_solve_time_seconds
    )

@app.post("/api/v1/schedule/fcfs")
def run_fcfs_baseline(req: OptimizationRequest):
    """Runs the naive First-Come-First-Served (FCFS) baseline scheduler."""
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

@app.post("/api/v1/schedule/disrupt", response_model=DisruptionResponse)
def handle_disruption(req: DisruptionRequest):
    """Executes sub-second reactive repair locking completed contacts upon station failure."""
    return ReactiveReplanner.repair_outage(
        offline_station_id=req.offline_station_id,
        current_mission_min=req.current_mission_time_min,
        original_schedule=req.original_schedule,
        all_passes=req.passes,
        stations=req.stations,
        satellites=req.satellites
    )

@app.post("/api/v1/schedule/validate", response_model=ValidationResponse)
def validate_schedule(req: Dict[str, Any]):
    """Independent auditor validating 5 hard invariants with zero tolerance."""
    from .models.schemas import ScheduledContactModel, PassOpportunityModel, GroundStationModel

    contacts = [ScheduledContactModel(**c) for c in req.get("contacts", [])]
    passes = [PassOpportunityModel(**p) for p in req.get("passes", [])]
    stations = [GroundStationModel(**s) for s in req.get("stations", [])]

    return IndependentValidator.audit(
        contacts=contacts,
        all_passes=passes,
        stations=stations
    )

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

# WebSocket for live mission telemetry
@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        minute = 0
        while True:
            await websocket.send_json({
                "utc_minute": minute,
                "status": "TELEMETRY_SYNC",
                "active_downlinks": 2 if (minute % 90 < 15) else 0
            })
            minute = (minute + 1) % 1440
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        pass
