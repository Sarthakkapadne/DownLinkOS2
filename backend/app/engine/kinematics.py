import math
from typing import Tuple

class AntennaKinematics:
    """
    Models physical antenna turntable slewing, cable-wrap boundaries (-270 to +270 deg),
    and zenith keyhole singularity conditions.
    """

    def __init__(
        self,
        max_az_rate_deg_s: float = 12.0,
        max_el_rate_deg_s: float = 6.0,
        cable_min_deg: float = -270.0,
        cable_max_deg: float = 270.0,
        setup_overhead_s: float = 45.0
    ):
        self.max_az_rate = max_az_rate_deg_s
        self.max_el_rate = max_el_rate_deg_s
        self.cable_min = cable_min_deg
        self.cable_max = cable_max_deg
        self.setup_overhead = setup_overhead_s

    def compute_slew_duration(
        self,
        az1: float, el1: float,
        az2: float, el2: float
    ) -> float:
        """Calculates transition time between two sky coordinates including carrier lock."""
        # Shortest angular distance across 360-degree boundary
        delta_az = abs((az2 - az1 + 180.0) % 360.0 - 180.0)
        delta_el = abs(el2 - el1)

        t_az = delta_az / self.max_az_rate
        t_el = delta_el / self.max_el_rate

        return max(t_az, t_el) + self.setup_overhead

    def validate_cable_trajectory(
        self,
        current_cable_deg: float,
        delta_azimuth_deg: float
    ) -> Tuple[bool, float]:
        """
        Validates if antenna rotation remains within physical cable-wrap limits [-270, +270].
        Returns (is_valid, projected_cable_deg).
        """
        next_cable = current_cable_deg + delta_azimuth_deg
        if self.cable_min <= next_cable <= self.cable_max:
            return True, next_cable
        return False, current_cable_deg

    @staticmethod
    def is_zenith_keyhole_risk(max_elevation_deg: float) -> bool:
        """Passes with elevation > 85 deg risk Az-El gimbal drive speed saturation."""
        return max_elevation_deg >= 85.0
