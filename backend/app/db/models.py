import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class SatelliteEntity(Base):
    __tablename__ = "satellites"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    constellation = Column(String(64), default="PlanetScope")
    ssr_capacity_gb = Column(Float, default=256.0)
    current_buffer_gb = Column(Float, default=120.0)
    data_gen_rate_gb_per_orbit = Column(Float, default=30.0)
    max_sspa_power_w = Column(Float, default=25.0)
    thermal_cooldown_min = Column(Float, default=20.0)
    priority = Column(Integer, default=3)

class GroundStationEntity(Base):
    __tablename__ = "ground_stations"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    code = Column(String(32), nullable=False)
    location = Column(String(256), nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    status = Column(String(32), default="ACTIVE")  # ACTIVE, MAINTENANCE, OFFLINE
    current_cable_deg = Column(Float, default=0.0)
    dish_diameter_m = Column(Float, default=7.3)
    rain_attenuation_db = Column(Float, default=0.1)
    elevation_mask_deg = Column(Float, default=5.0)
    max_slew_rate_deg_sec = Column(Float, default=12.0)

class PassOpportunityEntity(Base):
    __tablename__ = "pass_opportunities"

    id = Column(String(64), primary_key=True, index=True)
    satellite_id = Column(String(64), ForeignKey("satellites.id"), nullable=False)
    station_id = Column(String(64), ForeignKey("ground_stations.id"), nullable=False)
    satellite_name = Column(String(128), nullable=False)
    station_name = Column(String(128), nullable=False)
    aos_minutes = Column(Integer, nullable=False)
    los_minutes = Column(Integer, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    max_elevation_deg = Column(Float, nullable=False)
    priority = Column(Integer, nullable=False)
    data_volume_gb = Column(Float, nullable=False)
    is_keyhole_risk = Column(Boolean, default=False)
    cable_angle_aos = Column(Float, default=0.0)
    cable_angle_los = Column(Float, default=0.0)
    satellite_buffer_at_aos = Column(Float, default=100.0)
    buffer_fill_pct = Column(Float, default=50.0)
    urgency_score = Column(Float, default=50.0)
    is_pruned = Column(Boolean, default=False)
    prune_reason = Column(String(256), nullable=True)

class ScheduleRunEntity(Base):
    __tablename__ = "schedule_runs"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    solver_name = Column(String(128), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    status = Column(String(32), default="COMPLETED")
    total_delivered_gb = Column(Float, default=0.0)
    priority_weighted_score = Column(Float, default=0.0)
    buffer_overflow_count = Column(Integer, default=0)
    antenna_utilization_pct = Column(Float, default=0.0)
    scheduled_count = Column(Integer, default=0)
    rejected_count = Column(Integer, default=0)
    emergency_fulfillment_pct = Column(Float, default=100.0)
    optimality_gap_pct = Column(Float, nullable=True)
    solve_duration_ms = Column(Float, default=0.0)

    contacts = relationship("ScheduledContactEntity", back_populates="run", cascade="all, delete-orphan")
    disruptions = relationship("DisruptionEventEntity", back_populates="run", cascade="all, delete-orphan")
    audits = relationship("AuditRecordEntity", back_populates="run", cascade="all, delete-orphan")

class ScheduledContactEntity(Base):
    __tablename__ = "scheduled_contacts"

    id = Column(String(64), primary_key=True, index=True)
    run_id = Column(String(64), ForeignKey("schedule_runs.id"), nullable=False)
    pass_id = Column(String(64), nullable=False)
    satellite_id = Column(String(64), nullable=False)
    satellite_name = Column(String(128), nullable=False)
    station_id = Column(String(64), nullable=False)
    station_name = Column(String(128), nullable=False)
    start_minutes = Column(Integer, nullable=False)
    end_minutes = Column(Integer, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    delivered_volume_gb = Column(Float, nullable=False)
    priority = Column(Integer, nullable=False)
    is_frozen = Column(Boolean, default=False)
    status = Column(String(32), default="SCHEDULED")
    selection_rationale = Column(Text, nullable=True)
    price_of_forcing = Column(Float, nullable=True)
    cable_angle_start = Column(Float, default=0.0)
    cable_angle_end = Column(Float, default=0.0)

    run = relationship("ScheduleRunEntity", back_populates="contacts")

class DisruptionEventEntity(Base):
    __tablename__ = "disruption_events"

    id = Column(String(64), primary_key=True, index=True)
    run_id = Column(String(64), ForeignKey("schedule_runs.id"), nullable=True)
    offline_station_id = Column(String(64), nullable=False)
    timestamp_min = Column(Integer, nullable=False)
    passes_preserved = Column(Integer, default=0)
    passes_rerouted = Column(Integer, default=0)
    passes_dropped = Column(Integer, default=0)
    churn_count = Column(Integer, default=0)
    value_retained_pct = Column(Float, default=100.0)
    replan_latency_ms = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    run = relationship("ScheduleRunEntity", back_populates="disruptions")

class AuditRecordEntity(Base):
    __tablename__ = "audit_records"

    id = Column(String(64), primary_key=True, index=True)
    run_id = Column(String(64), ForeignKey("schedule_runs.id"), nullable=True)
    pass_id = Column(String(64), nullable=False)
    satellite_name = Column(String(128), nullable=False)
    station_name = Column(String(128), nullable=False)
    decision = Column(String(32), nullable=False)  # SCHEDULED, REJECTED, REROUTED
    reason_code = Column(String(64), nullable=True)
    reason_explanation = Column(Text, nullable=True)
    price_of_forcing_penalty = Column(Float, default=0.0)
    validator_status = Column(String(64), default="PASS (0 VIOLATIONS)")

    run = relationship("ScheduleRunEntity", back_populates="audits")
