import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./orbitops.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """FastAPI database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initializes database schema and seeds initial constellation and pass records if empty."""
    from .models import (
        SatelliteEntity,
        GroundStationEntity,
        PassOpportunityEntity,
        ScheduleRunEntity,
        ScheduledContactEntity,
        DisruptionEventEntity,
        AuditRecordEntity
    )
    from ..config import DEFAULT_GROUND_STATIONS, DEFAULT_SATELLITES, DEFAULT_PASS_OPPORTUNITIES

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Seed Ground Stations if empty
        if db.query(GroundStationEntity).count() == 0:
            for s in DEFAULT_GROUND_STATIONS:
                entity = GroundStationEntity(
                    id=s.id,
                    name=s.name,
                    code=s.code,
                    location=s.location,
                    lat=s.lat,
                    lon=s.lon,
                    status=s.status,
                    current_cable_deg=s.current_cable_deg,
                    dish_diameter_m=s.dish_diameter_m,
                    rain_attenuation_db=s.rain_attenuation_db,
                    elevation_mask_deg=s.elevation_mask_deg,
                    max_slew_rate_deg_sec=s.max_slew_rate_deg_sec
                )
                db.add(entity)
            db.commit()

        # 2. Seed Satellites if empty
        if db.query(SatelliteEntity).count() == 0:
            for sat in DEFAULT_SATELLITES:
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

        # 3. Seed Pass Opportunities if empty
        if db.query(PassOpportunityEntity).count() == 0:
            for p in DEFAULT_PASS_OPPORTUNITIES:
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

    finally:
        db.close()
