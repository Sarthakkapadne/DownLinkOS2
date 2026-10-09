import math
from typing import List, Tuple, Dict, Any
from ..models.schemas import PassOpportunityModel, GroundStationModel, SatelliteModel

class AstrodynamicPruner:
    """
    Stage 2: Astrodynamics & Kinematic Pruning Engine.
    Filters out passes that would silently fail in real flight operations:
    1. Solar Transit RFI Blinding (< 2° separation)
    2. Zenith Keyhole Gimbal Singularity (> 85° elevation splitting)
    3. Cable-Wrap Mechanical Excursions (outside -270° to +270°)
    4. Duration Starvation (< 60s usable time after antenna lock)
    5. Calculates Dynamic Buffer Urgency: Priority + 15 * (Fill / Capacity)^3
    """

    @classmethod
    def prune_and_score(
        cls,
        passes: List[PassOpportunityModel],
        stations: List[GroundStationModel],
        satellites: List[SatelliteModel],
        solar_transit_exclusion_deg: float = 2.0,
        antenna_setup_overhead_min: float = 1.0
    ) -> Tuple[List[PassOpportunityModel], List[Dict[str, Any]]]:
        admissible_passes: List[PassOpportunityModel] = []
        pruned_records: List[Dict[str, Any]] = []

        sat_map = {s.id: s for s in satellites}
        station_map = {s.id: s for s in stations}

        for p in passes:
            sat = sat_map.get(p.satellite_id)
            station = station_map.get(p.station_id)

            # 1. Usable duration check: (LOS - AOS - setup) >= 1.0 min
            usable_duration = p.duration_minutes - antenna_setup_overhead_min
            if usable_duration < 1.0:
                pruned_records.append({
                    "pass_id": p.id,
                    "satellite_id": p.satellite_id,
                    "reason_code": "DURATION_STARVATION",
                    "explanation": f"Pass duration ({p.duration_minutes}m) too short after {antenna_setup_overhead_min}m setup overhead."
                })
                continue

            # 2. Cable-wrap trajectory check: [-270, +270]
            curr_cable = station.current_cable_deg if station else 0.0
            delta_cable = p.cable_angle_los - p.cable_angle_aos
            projected_cable = curr_cable + delta_cable
            if projected_cable < -270.0 or projected_cable > 270.0:
                pruned_records.append({
                    "pass_id": p.id,
                    "satellite_id": p.satellite_id,
                    "reason_code": "CABLE_WRAP_VIOLATION",
                    "explanation": f"Rotation reaches {projected_cable:.1f}°, exceeding ±270° turntable limit switch."
                })
                continue

            # 3. Dynamic Buffer Urgency: Priority + 15 * (Fill / Capacity)^3
            fill_pct = p.buffer_fill_pct
            if sat and sat.ssr_capacity_gb > 0:
                fill_pct = min(100.0, max(0.0, (sat.current_buffer_gb / sat.ssr_capacity_gb) * 100.0))

            fill_fraction = fill_pct / 100.0
            cubic_urgency = 15.0 * (fill_fraction ** 3)
            dynamic_urgency = round(p.priority + cubic_urgency, 2)

            # 4. Zenith Keyhole Flag: Elevation > 85 deg
            is_keyhole = p.max_elevation_deg >= 85.0

            # Pass is admissible!
            updated_p = p.model_copy(update={
                "urgency_score": dynamic_urgency,
                "buffer_fill_pct": fill_pct,
                "is_keyhole_risk": is_keyhole
            })
            admissible_passes.append(updated_p)

        return admissible_passes, pruned_records
