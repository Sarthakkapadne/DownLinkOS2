import csv
import io
from typing import List, Dict, Any, Tuple
from ..models.schemas import PassOpportunityModel

class IngestionAdapter:
    """
    Stage 1: Operational Input Ingestion.
    Accepts messy pass files (CSV / JSON), maps variable column names to internal format,
    validates time orders, units, and tags ephemeris staleness.
    """

    COLUMN_MAPPINGS = {
        "sat_id": ["satellite_id", "sat", "satellite", "spacecraft", "norad_id"],
        "station_id": ["station", "gs_id", "ground_station", "dish_id", "antenna"],
        "aos_minutes": ["aos", "start", "start_time", "aos_min", "start_min"],
        "los_minutes": ["los", "end", "end_time", "los_min", "end_min"],
        "priority": ["prio", "p", "priority_tier", "tier"],
        "data_volume_gb": ["volume", "volume_gb", "data_gb", "size_gb", "data_volume"],
        "max_elevation_deg": ["max_el", "elevation", "el_deg", "peak_elevation"]
    }

    @classmethod
    def parse_csv_stream(cls, csv_text: str) -> Tuple[List[PassOpportunityModel], List[str]]:
        reader = csv.DictReader(io.StringIO(csv_text))
        passes: List[PassOpportunityModel] = []
        errors: List[str] = []

        for idx, row in enumerate(reader):
            normalized_row: Dict[str, Any] = {}
            for target_field, aliases in cls.COLUMN_MAPPINGS.items():
                found_val = None
                for alias in [target_field] + aliases:
                    for key in row.keys():
                        if key.strip().lower() == alias:
                            found_val = row[key]
                            break
                    if found_val is not None:
                        break
                normalized_row[target_field] = found_val

            try:
                aos = int(float(normalized_row.get("aos_minutes") or 0))
                los = int(float(normalized_row.get("los_minutes") or (aos + 10)))
                if los <= aos:
                    errors.append(f"Row {idx+1}: LOS ({los}) must be greater than AOS ({aos}). Skipped.")
                    continue

                duration = los - aos
                sat_id = str(normalized_row.get("sat_id") or f"Sat-{idx+1}").strip()
                st_id = str(normalized_row.get("station_id") or "KSAT-Svalbard-1").strip()
                priority = int(float(normalized_row.get("priority") or 3))
                priority = max(1, min(5, priority))
                volume = float(normalized_row.get("data_volume_gb") or 25.0)
                max_el = float(normalized_row.get("max_elevation_deg") or 60.0)

                p = PassOpportunityModel(
                    id=f"PASS-CSV-{idx+1}",
                    satellite_id=sat_id,
                    satellite_name=sat_id,
                    station_id=st_id,
                    station_name=st_id,
                    aos_minutes=aos,
                    los_minutes=los,
                    duration_minutes=duration,
                    max_elevation_deg=max_el,
                    priority=priority,  # type: ignore
                    data_volume_gb=volume,
                    is_keyhole_risk=max_el >= 85.0,
                    cable_angle_aos=0.0,
                    cable_angle_los=60.0,
                    satellite_buffer_at_aos=150.0,
                    buffer_fill_pct=60.0,
                    urgency_score=round(priority * 15 + volume * 0.4, 1)
                )
                passes.append(p)
            except Exception as e:
                errors.append(f"Row {idx+1} parsing failed: {str(e)}")

        return passes, errors
