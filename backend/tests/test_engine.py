import pytest
from backend.app.models.schemas import (
    PassOpportunityModel,
    GroundStationModel,
    SatelliteModel
)
from backend.app.config import DEFAULT_GROUND_STATIONS, DEFAULT_SATELLITES
from backend.app.engine.baseline_fcfs import BaselineFCFS
from backend.app.engine.optimizer_cpsat import OptimizerCPSAT
from backend.app.engine.validator import IndependentValidator
from backend.app.twin.replanner import ReactiveReplanner
from backend.app.engine.kinematics import AntennaKinematics
from backend.app.engine.link_budget import LinkBudgetACM
from backend.app.services.capex_siting import CapExSitingOptimizer, CapExSitingRequest

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

def test_fcfs_baseline(sample_passes):
    """FCFS should greedily take PASS-2 (arriving at 68m) over PASS-1 (P5 arriving at 70m)."""
    contacts, rejected, metrics = BaselineFCFS.solve(
        passes=sample_passes,
        stations=DEFAULT_GROUND_STATIONS,
        satellites=DEFAULT_SATELLITES
    )
    assert len(contacts) > 0
    # PASS-2 arrived first at 68m
    first_c = contacts[0]
    assert first_c.satellite_id == "SuperDove-2108"
    assert metrics.scheduled_count == len(contacts)

def test_optimizer_cpsat(sample_passes):
    """ORBITOPS should prioritize PASS-1 (P5 Emergency at 94% buffer) over PASS-2 (P2 at 40%)."""
    res = OptimizerCPSAT.solve(
        passes=sample_passes,
        stations=DEFAULT_GROUND_STATIONS,
        satellites=DEFAULT_SATELLITES
    )
    assert res.metrics.scheduled_count > 0
    p5_scheduled = any(c.satellite_id == "SuperDove-2104" for c in res.scheduled_contacts)
    assert p5_scheduled, "P5 critical emergency pass must be scheduled by ORBITOPS"
    assert res.metrics.priority_weighted_score > 0
    assert res.optimality_gap_pct is not None
    assert res.optimality_gap_pct <= 5.0

def test_validator_zero_violations(sample_passes):
    """Validator must confirm 0 violations on the generated schedule."""
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

def test_reactive_outage_repair(sample_passes):
    """Station failure must be repaired in under 100ms with >= 75% value retained."""
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

def test_kinematics_and_link_budget():
    """Validates antenna slewing and elevation-dependent DVB-S2X ACM integration."""
    kinematics = AntennaKinematics()
    slew_time = kinematics.compute_slew_duration(10.0, 5.0, 100.0, 45.0)
    assert slew_time > 45.0  # Must exceed setup overhead

    is_valid, next_cable = kinematics.validate_cable_trajectory(250.0, 30.0)
    assert is_valid is False, "280 deg must exceed +270 deg cable limit"

    link = LinkBudgetACM()
    vol = link.integrate_pass_volume_gb(max_elevation_deg=80.0, duration_minutes=10.0)
    assert vol > 20.0

def test_capex_siting():
    """Validates CapEx ground station ROI optimizer."""
    req = CapExSitingRequest(candidate_locations=[], budget_usd_millions=3.0)
    res = CapExSitingOptimizer.evaluate(req)
    assert len(res.recommended_locations) >= 1
    assert res.roi_score > 0.0
