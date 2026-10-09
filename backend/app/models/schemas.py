from typing import Literal, Optional, List, Dict, Any
from pydantic import BaseModel, Field

PriorityTier = Literal[1, 2, 3, 4, 5]
ConstellationType = Literal["PlanetScope", "SkySat", "Pelican"]
StationStatus = Literal["ACTIVE", "MAINTENANCE", "OFFLINE"]
ContactStatus = Literal["SCHEDULED", "ACTIVE", "COMPLETED", "PREEMPTED", "REROUTED"]

class SatelliteModel(BaseModel):
    id: str
    name: str
    constellation: ConstellationType = "PlanetScope"
    ssr_capacity_gb: float = 256.0
    current_buffer_gb: float = 120.0
    data_gen_rate_gb_per_orbit: float = 30.0
    max_sspa_power_w: float = 25.0
    thermal_cooldown_min: float = 20.0
    priority: PriorityTier = 3

class GroundStationModel(BaseModel):
    id: str
    name: str
    code: str
    location: str
    lat: float
    lon: float
    status: StationStatus = "ACTIVE"
    current_cable_deg: float = 0.0
    dish_diameter_m: float = 7.3
    rain_attenuation_db: float = 0.1
    elevation_mask_deg: float = 5.0
    max_slew_rate_deg_sec: float = 12.0

class PassOpportunityModel(BaseModel):
    id: str
    satellite_id: str
    satellite_name: str
    station_id: str
    station_name: str
    aos_minutes: int  # Minutes from 00:00 UTC (0-1440)
    los_minutes: int
    duration_minutes: int
    max_elevation_deg: float
    priority: PriorityTier
    data_volume_gb: float
    is_keyhole_risk: bool = False
    cable_angle_aos: float = 0.0
    cable_angle_los: float = 0.0
    satellite_buffer_at_aos: float = 100.0
    buffer_fill_pct: float = 50.0

class ScheduledContactModel(BaseModel):
    id: str
    pass_id: str
    satellite_id: str
    satellite_name: str
    station_id: str
    station_name: str
    start_minutes: int
    end_minutes: int
    duration_minutes: int
    delivered_volume_gb: float
    priority: PriorityTier
    is_frozen: bool = False
    status: ContactStatus = "SCHEDULED"
    rejection_reason: Optional[str] = None
    selection_rationale: Optional[str] = None
    price_of_forcing: Optional[float] = None
    cable_angle_start: float = 0.0
    cable_angle_end: float = 0.0

class RejectedPassModel(BaseModel):
    pass_id: str
    satellite_id: str
    satellite_name: str
    station_id: str
    station_name: str
    aos_minutes: int
    los_minutes: int
    priority: PriorityTier
    reason_code: str
    reason_explanation: str
    competing_satellite_name: Optional[str] = None
    price_of_forcing_penalty: float

class ScheduleMetricsModel(BaseModel):
    total_delivered_gb: float
    priority_weighted_score: float
    buffer_overflow_count: int
    antenna_utilization_pct: float
    scheduled_count: int
    rejected_count: int
    emergency_fulfillment_pct: float
    average_latency_minutes: float
    optimality_gap_pct: Optional[float] = None
    validator_violations: int = 0
    solver_status: str

class OptimizationRequest(BaseModel):
    passes: List[PassOpportunityModel]
    stations: List[GroundStationModel]
    satellites: List[SatelliteModel]
    offline_station_id: Optional[str] = None
    max_solve_time_seconds: float = 5.0

class OptimizationResponse(BaseModel):
    solver_name: str
    status: str
    objective_value: float
    best_bound: Optional[float] = None
    optimality_gap_pct: Optional[float] = None
    metrics: ScheduleMetricsModel
    scheduled_contacts: List[ScheduledContactModel]
    rejected_passes: List[RejectedPassModel]
    solve_duration_ms: float

class DisruptionRequest(BaseModel):
    offline_station_id: str
    current_mission_time_min: int = 60
    original_schedule: List[ScheduledContactModel]
    passes: List[PassOpportunityModel]
    stations: List[GroundStationModel]
    satellites: List[SatelliteModel]

class DisruptionResponse(BaseModel):
    disrupted_station_id: str
    passes_preserved: int
    passes_rerouted: int
    passes_dropped: int
    churn_count: int
    value_retained_pct: float
    replan_latency_ms: float
    updated_schedule: List[ScheduledContactModel]

class ValidationReportItem(BaseModel):
    rule: str
    status: Literal["PASS", "FAIL"]
    detail: str

class ValidationResponse(BaseModel):
    passed: bool
    violation_count: int
    violations: List[str]
    audit_report: List[ValidationReportItem]

class CapExSitingRequest(BaseModel):
    candidate_locations: List[Dict[str, Any]]
    target_constellation_size: int = 60
    budget_usd_millions: float = 5.0

class CapExSitingResponse(BaseModel):
    recommended_locations: List[Dict[str, Any]]
    expected_throughput_gain_pct: float
    roi_score: float
