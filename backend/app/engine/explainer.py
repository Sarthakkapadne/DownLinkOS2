from typing import List, Dict, Any, Optional
from ..models.schemas import ScheduledContactModel, PassOpportunityModel

class DecisionExplainer:
    """
    Stage 5: Decision Lineage & Operational Explainer.
    1. Generates Plain-English and Telemetry-Analyst decision traces for every contact.
    2. Calculates the exact "Price of Forcing It":
       The opportunity cost in lost high-priority data and net mission score if a dropped
       pass is manually forced into the schedule.
    """

    @staticmethod
    def calculate_price_of_forcing(
        target_pass: PassOpportunityModel,
        current_schedule: List[ScheduledContactModel]
    ) -> Dict[str, Any]:
        """
        Calculates the exact operational trade-off of forcing a rejected pass into the timetable.
        Identifies which scheduled passes are displaced and computes net delta.
        """
        # Find all passes currently booked on this antenna during the target pass window
        conflicting_contacts = [
            c for c in current_schedule
            if c.station_id == target_pass.station_id
            and max(c.start_minutes, target_pass.aos_minutes) < min(c.end_minutes, target_pass.los_minutes)
        ]

        # Also check if target satellite is booked elsewhere during this time
        sat_conflicts = [
            c for c in current_schedule
            if c.satellite_id == target_pass.satellite_id
            and max(c.start_minutes, target_pass.aos_minutes) < min(c.end_minutes, target_pass.los_minutes)
        ]

        all_displaced = list({c.id: c for c in conflicting_contacts + sat_conflicts}.values())

        if not all_displaced:
            return {
                "can_force_without_displacement": True,
                "displaced_contacts": [],
                "target_gain_gb": target_pass.data_volume_gb,
                "target_gain_score": round(target_pass.data_volume_gb * target_pass.priority, 1),
                "net_score_delta": round(target_pass.data_volume_gb * target_pass.priority, 1),
                "plain_english": f"Pass {target_pass.satellite_name} can be scheduled into {target_pass.station_name} without displacing any contact."
            }

        displaced_gb = sum(c.delivered_volume_gb for c in all_displaced)
        displaced_score = sum(c.delivered_volume_gb * c.priority for c in all_displaced)

        target_score = target_pass.data_volume_gb * target_pass.priority
        net_delta = round(target_score - displaced_score, 1)

        displaced_names = ", ".join(f"{c.satellite_name} (P{c.priority})" for c in all_displaced)

        plain_text = (
            f"Forcing {target_pass.satellite_name} (P{target_pass.priority}, {target_pass.data_volume_gb} GB) "
            f"into {target_pass.station_name} will displace {displaced_names} ({displaced_gb} GB). "
            f"Net constellation impact: {net_delta} pts ({'-' if net_delta < 0 else '+'}{abs(net_delta)} pts). "
            f"{'Operationally unjustified: sacrifices higher-priority imagery.' if net_delta < 0 else 'Feasible trade-off.'}"
        )

        return {
            "can_force_without_displacement": False,
            "target_pass_id": target_pass.id,
            "target_satellite": target_pass.satellite_name,
            "target_priority": target_pass.priority,
            "target_volume_gb": target_pass.data_volume_gb,
            "displaced_contacts": [
                {
                    "contact_id": c.id,
                    "satellite_name": c.satellite_name,
                    "priority": c.priority,
                    "volume_gb": c.delivered_volume_gb
                }
                for c in all_displaced
            ],
            "displaced_total_gb": round(displaced_gb, 1),
            "displaced_total_score": round(displaced_score, 1),
            "net_score_delta": net_delta,
            "plain_english": plain_text
        }
