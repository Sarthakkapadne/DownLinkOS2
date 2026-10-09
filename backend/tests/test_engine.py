import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.db.database import get_db, SessionLocal
from backend.app.db.models import SatelliteEntity, GroundStationEntity, PassOpportunityEntity
from backend.app.models.schemas import PassOpportunityModel
from backend.app.config import DEFAULT_GROUND_STATIONS, DEFAULT_SATELLITES, DEFAULT_PASS_OPPORTUNITIES
from backend.app.engine.baseline_fcfs import BaselineFCFS
from backend.app.engine.priority_greedy import PriorityGreedyScheduler
from backend.app.engine.optimizer_cpsat import OptimizerCPSAT
from backend.app.engine.validator import IndependentValidator
from backend.app.engine.pruner import AstrodynamicPruner
from backend.app.engine.explainer import DecisionExplainer
from backend.app.twin.replanner import ReactiveReplanner
from backend.app.engine.kinematics import AntennaKinematics
from backend.app.engine.link_budget import LinkBudgetACM
from backend.app.services.capex_siting import CapExSitingOptimizer, CapExSitingRequest

client = TestClient(app)

@pytest.fixture
def sample_passes():
    return [
        PassOpportunityModel(
            id="PASS-1",
            satellite_id="SuperDove-2104",
            satellite_name="SuperDove-2104",
            station_id="KSAT-Svalbard-1",
            station_name="KSAT Svalbard Ant-1",
            aos_minutes=70,
            los_minutes=82,
            duration_minutes=12,
            max_elevation_deg=82.0,
            priority=5,
            data_volume_gb=38.0,
            cable_angle_aos=15.0,
            cable_angle_los=75.0,
            buffer_fill_pct=94.0
        ),
        PassOpportunityModel(
            id="PASS-2",
            satellite_id="SuperDove-2108",
            satellite_name="SuperDove-2108",
            station_id="KSAT-Svalbard-1",
            station_name="KSAT Svalbard Ant-1",
            aos_minutes=68,
            los_minutes=79,
            duration_minutes=11,
            max_elevation_deg=45.0,
            priority=2,
            data_volume_gb=18.0,
            cable_angle_aos=10.0,
            cable_angle_los=65.0,
            buffer_fill_pct=40.0
        ),
        PassOpportunityModel(
            id="PASS-3",
            satellite_id="SkySat-C14",
            satellite_name="SkySat-C14",
            station_id="Inuvik-1",
            station_name="SSC Inuvik Station Ant-1",
            aos_minutes=115,
            los_minutes=127,
            duration_minutes=12,
            max_elevation_deg=78.0,
            priority=4,
            data_volume_gb=62.0,
            cable_angle_aos=70.0,
            cable_angle_los=150.0,
            buffer_fill_pct=85.0
        )
    ]

# ---------------------------------------------------------------------------
# Database Tests
# ---------------------------------------------------------------------------

def test_database_seeding():
    """Verify that SQLite database initialized and seeded default constellation and passes."""
    db = SessionLocal()
    try:
        sats = db.query(SatelliteEntity).all()
        stations = db.query(GroundStationEntity).all()
        passes = db.query(PassOpportunityEntity).all()
        assert len(sats) >= 5, "Database must have seeded satellites"
        assert len(stations) >= 5, "Database must have seeded ground stations"
        assert len(passes) >= 5, "Database must have seeded pass opportunities"
    finally:
        db.close()

# ---------------------------------------------------------------------------
# Scheduler & Algorithm Tests
# ---------------------------------------------------------------------------

def test_fcfs_baseline(sample_passes):
    """FCFS should greedily assign PASS-2 (arriving at 68m) over PASS-1 (P5 arriving at 70m)."""
    contacts, rejected, metrics = BaselineFCFS.solve(
        passes=sample_passes,
        stations=DEFAULT_GROUND_STATIONS,
        satellites=DEFAULT_SATELLITES
    )
    assert len(contacts) > 0
    assert contacts[0].satellite_id == "SuperDove-2108"
    assert metrics.scheduled_count == len(contacts)

def test_priority_greedy(sample_passes):
    """Priority-Greedy should assign PASS-1 (P5) first before PASS-2 (P2)."""
    contacts, rejected, metrics = PriorityGreedyScheduler.solve(
        passes=sample_passes,
        stations=DEFAULT_GROUND_STATIONS,
        satellites=DEFAULT_SATELLITES
    )
    assert len(contacts) > 0
    assert contacts[0].priority >= 4

def test_optimizer_cpsat(sample_passes):
    """ORBITOPS CP-SAT should prioritize PASS-1 (P5 at 94% buffer) with provable dual bound."""
    res = OptimizerCPSAT.solve(
        passes=sample_passes,
        stations=DEFAULT_GROUND_STATIONS,
        satellites=DEFAULT_SATELLITES
    )
    assert res.metrics.scheduled_count > 0
    p5_sched = any(c.satellite_id == "SuperDove-2104" for c in res.scheduled_contacts)
    assert p5_sched is True
    assert res.optimality_gap_pct is not None
    assert res.optimality_gap_pct <= 5.0

def test_validator_zero_violations(sample_passes):
    """Safety referee must confirm 0 violations on the optimal schedule."""
    opt_res = OptimizerCPSAT.solve(
        passes=sample_passes,
        stations=DEFAULT_GROUND_STATIONS,
        satellites=DEFAULT_SATELLITES
    )
    val_res = IndependentValidator.audit(
        contacts=opt_res.scheduled_contacts,
        all_passes=sample_passes,
        stations=DEFAULT_GROUND_STATIONS
    )
    assert val_res.passed is True
    assert val_res.violation_count == 0

def test_astrodynamic_pruner(sample_passes):
    """Stage 2 Pruner: Short pass (< 1 min usable) should be pruned."""
    short_pass = PassOpportunityModel(
        id="PASS-SHORT",
        satellite_id="SuperDove-2101",
        satellite_name="SuperDove-2101",
        station_id="KSAT-Svalbard-1",
        station_name="KSAT Svalbard Ant-1",
        aos_minutes=10,
        los_minutes=11,  # 1 min total - 1 min setup = 0 min usable
        duration_minutes=1,
        max_elevation_deg=20.0,
        priority=1,
        data_volume_gb=1.0,
        cable_angle_aos=0.0,
        cable_angle_los=10.0,
        buffer_fill_pct=20.0
    )
    admissible, pruned = AstrodynamicPruner.prune_and_score(
        passes=[short_pass] + sample_passes,
        stations=DEFAULT_GROUND_STATIONS,
        satellites=DEFAULT_SATELLITES
    )
    assert len(pruned) >= 1
    assert any(p["pass_id"] == "PASS-SHORT" for p in pruned)

def test_explainer_price_of_forcing(sample_passes):
    """Stage 5 Explainer: Calculates price of forcing PASS-2 into conflicting schedule."""
    opt_res = OptimizerCPSAT.solve(
        passes=sample_passes,
        stations=DEFAULT_GROUND_STATIONS,
        satellites=DEFAULT_SATELLITES
    )
    target_pass = sample_passes[1]  # PASS-2
    forcing_calc = DecisionExplainer.calculate_price_of_forcing(
        target_pass=target_pass,
        current_schedule=opt_res.scheduled_contacts
    )
    assert "plain_english" in forcing_calc
    assert "net_score_delta" in forcing_calc

def test_reactive_outage_repair(sample_passes):
    """Disruption repair must complete in under 100ms with >= 50% value retained."""
    opt_res = OptimizerCPSAT.solve(
        passes=sample_passes,
        stations=DEFAULT_GROUND_STATIONS,
        satellites=DEFAULT_SATELLITES
    )
    disruption = ReactiveReplanner.repair_outage(
        offline_station_id="KSAT-Svalbard-1",
        current_mission_min=60,
        original_schedule=opt_res.scheduled_contacts,
        all_passes=sample_passes,
        stations=DEFAULT_GROUND_STATIONS,
        satellites=DEFAULT_SATELLITES
    )
    assert disruption.replan_latency_ms < 100.0
    assert disruption.passes_preserved >= 1
    assert disruption.value_retained_pct >= 50.0

# ---------------------------------------------------------------------------
# API Route Endpoint Tests (FastAPI TestClient)
# ---------------------------------------------------------------------------

def test_api_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["system"] == "ORBITOPS (DownlinkOS)"

    health = client.get("/api/v1/health")
    assert health.status_code == 200
    assert health.json()["status"] == "HEALTHY"
    assert health.json()["database_connected"] is True

def test_api_stations_and_satellites():
    stations_res = client.get("/api/v1/stations")
    assert stations_res.status_code == 200
    assert len(stations_res.json()) >= 5

    sats_res = client.get("/api/v1/satellites")
    assert sats_res.status_code == 200
    assert len(sats_res.json()) >= 5

def test_api_optimize_and_persist():
    payload = {
        "passes": [p.model_dump() for p in DEFAULT_PASS_OPPORTUNITIES],
        "stations": [s.model_dump() for s in DEFAULT_GROUND_STATIONS],
        "satellites": [sat.model_dump() for sat in DEFAULT_SATELLITES],
        "max_solve_time_seconds": 3.0
    }
    res = client.post("/api/v1/schedule/optimize", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "scheduled_contacts" in data
    assert data["metrics"]["scheduled_count"] > 0

    # Verify that run was saved in database
    runs_res = client.get("/api/v1/runs")
    assert runs_res.status_code == 200
    assert len(runs_res.json()) >= 1

    latest_run_id = runs_res.json()[0]["id"]
    detail_res = client.get(f"/api/v1/runs/{latest_run_id}")
    assert detail_res.status_code == 200
    assert "contacts" in detail_res.json()

def test_api_benchmark_three_way():
    payload = {
        "passes": [p.model_dump() for p in DEFAULT_PASS_OPPORTUNITIES],
        "stations": [s.model_dump() for s in DEFAULT_GROUND_STATIONS],
        "satellites": [sat.model_dump() for sat in DEFAULT_SATELLITES]
    }
    res = client.post("/api/v1/schedule/benchmark", json=payload)
    assert res.status_code == 200
    bench = res.json()["benchmark_summary"]
    assert "fcfs_score" in bench
    assert "greedy_score" in bench
    assert "orbitops_cpsat_score" in bench

def test_api_telegram_command():
    res = client.post("/api/v1/telegram/command", json={"command": "/status"})
    assert res.status_code == 200
    assert "ORBITOPS Fleet Status" in res.json()["message"]
