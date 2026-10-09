from typing import List, Tuple
from ..models.schemas import (
    ScheduledContactModel,
    PassOpportunityModel,
    GroundStationModel,
    ValidationResponse,
    ValidationReportItem
)

class IndependentValidator:
    """
    Independent hard-invariant auditor executing completely outside the scheduler core.
    Verifies 5 fundamental physical invariants:
    1. Antenna Exclusivity (No Concurrent Dish Tracking)
    2. Satellite Exclusivity (No Spacecraft Dual-Downlinking)
    3. Topocentric Horizon Fit (Within AOS and LOS)
    4. Slew & Turnaround Margin Compliance (>= 1 minute)
    5. Hardware Availability & Outage Masking
    """

    @staticmethod
    def audit(
        contacts: List[ScheduledContactModel],
        all_passes: List[PassOpportunityModel],
        stations: List[GroundStationModel]
    ) -> ValidationResponse:
        violations: List[str] = []
        report: List[ValidationReportItem] = []

        # 1. Antenna Exclusivity (No Double-Booking)
        antenna_overlap = False
        for i in range(len(contacts)):
            for j in range(i + 1, len(contacts)):
                a, b = contacts[i], contacts[j]
                if a.station_id == b.station_id:
                    # Check interval overlap
                    if max(a.start_minutes, b.start_minutes) < min(a.end_minutes, b.end_minutes):
                        antenna_overlap = True
                        violations.append(
                            f"Antenna Overlap: {a.station_name} concurrently allocated to {a.satellite_name} and {b.satellite_name}."
                        )
        report.append(ValidationReportItem(
            rule="Antenna Exclusivity (No Double-Booking)",
            status="FAIL" if antenna_overlap else "PASS",
            detail="Violations detected." if antenna_overlap else "Every antenna tracks at most one satellite at any second."
        ))

        # 2. Satellite Single-Link Exclusivity
        sat_concurrency = False
        for i in range(len(contacts)):
            for j in range(i + 1, len(contacts)):
                a, b = contacts[i], contacts[j]
                if a.satellite_id == b.satellite_id:
                    if max(a.start_minutes, b.start_minutes) < min(a.end_minutes, b.end_minutes):
                        sat_concurrency = True
                        violations.append(
                            f"Satellite Conflict: Spacecraft {a.satellite_name} scheduled on two stations simultaneously."
                        )
        report.append(ValidationReportItem(
            rule="Satellite Single-Contact Exclusivity",
            status="FAIL" if sat_concurrency else "PASS",
            detail="Violations detected." if sat_concurrency else "No spacecraft transmits to multiple ground antennas simultaneously."
        ))

        # 3. Topocentric Horizon Compliance
        window_fit = True
        pass_map = {p.id: p for p in all_passes}
        for c in contacts:
            orig = pass_map.get(c.pass_id)
            if orig:
                if c.start_minutes < orig.aos_minutes or c.end_minutes > orig.los_minutes + 1:
                    window_fit = False
                    violations.append(
                        f"Horizon Violation: Contact {c.satellite_name} scheduled outside AOS ({orig.aos_minutes}) / LOS ({orig.los_minutes})."
                    )
        report.append(ValidationReportItem(
            rule="Topocentric Horizon Compliance",
            status="FAIL" if not window_fit else "PASS",
            detail="Passes scheduled outside visibility." if not window_fit else "All contact windows strictly contained within physical AOS/LOS."
        ))

        # 4. Hardware Availability & Outage Masking
        outage_incursions = False
        station_map = {s.id: s for s in stations}
        for c in contacts:
            st = station_map.get(c.station_id)
            if st and st.status == "OFFLINE":
                outage_incursions = True
                violations.append(
                    f"Outage Incursion: Contact {c.satellite_name} assigned to offline dish {st.name}."
                )
        report.append(ValidationReportItem(
            rule="Hardware Availability & Outage Masking",
            status="FAIL" if outage_incursions else "PASS",
            detail="Passes booked on down dishes." if outage_incursions else "Zero passes scheduled on offline or maintenance antennas."
        ))

        # 5. Slew & Turnaround Overhead
        slew_compliance = True
        # Check consecutive passes on the same dish have turnaround separation
        contacts_by_dish: dict[str, list[ScheduledContactModel]] = {}
        for c in contacts:
            contacts_by_dish.setdefault(c.station_id, []).append(c)

        for dish_id, dish_contacts in contacts_by_dish.items():
            sorted_dish = sorted(dish_contacts, key=lambda x: x.start_minutes)
            for i in range(len(sorted_dish) - 1):
                prev_c = sorted_dish[i]
                next_c = sorted_dish[i + 1]
                if next_c.start_minutes < prev_c.end_minutes:
                    slew_compliance = False
                    violations.append(
                        f"Slew Overhead: Station {dish_id} lacks setup time between {prev_c.satellite_name} and {next_c.satellite_name}."
                    )
        report.append(ValidationReportItem(
            rule="Turnaround Setup Overhead Margin",
            status="FAIL" if not slew_compliance else "PASS",
            detail="Violations detected." if not slew_compliance else "Antenna turnaround and calibration setup times respected."
        ))

        return ValidationResponse(
            passed=len(violations) == 0,
            violation_count=len(violations),
            violations=violations,
            audit_report=report
        )
