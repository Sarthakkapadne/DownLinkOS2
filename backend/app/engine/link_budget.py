import math
from typing import List

class LinkBudgetACM:
    """
    Computes dynamic downlinked data volume using elevation-dependent DVB-S2X ACM curves
    and ITU-R atmospheric rain attenuation factors.
    """

    def __init__(
        self,
        r_max_mbps: float = 1600.0,
        r_min_mbps: float = 200.0,
        alpha: float = 0.65
    ):
        self.r_max = r_max_mbps
        self.r_min = r_min_mbps
        self.alpha = alpha

    def get_instantaneous_bitrate_mbps(self, elevation_deg: float) -> float:
        """Returns physical bitrate based on elevation slant angle."""
        if elevation_deg < 5.0:
            return 0.0
        el_rad = math.radians(elevation_deg)
        # Satellite link ACM scaling curve: R_min + (R_max - R_min) * (sin(El))^alpha
        rate = self.r_min + (self.r_max - self.r_min) * (math.sin(el_rad) ** self.alpha)
        return min(rate, self.r_max)

    def integrate_pass_volume_gb(
        self,
        max_elevation_deg: float,
        duration_minutes: float,
        rain_attenuation_db: float = 0.0
    ) -> float:
        """
        Integrates total Gigabytes delivered across a pass using sinusoidal elevation arc model.
        """
        # Linear decibel to transmission efficiency factor
        attenuation_factor = 10.0 ** (-rain_attenuation_db / 10.0)

        # Model elevation profile as half-sine wave from 5 deg to max_el and back to 5 deg
        num_steps = 10
        step_minutes = duration_minutes / num_steps
        total_megabits = 0.0

        for i in range(num_steps):
            frac = (i + 0.5) / num_steps
            # Elevation arc
            el = 5.0 + (max_elevation_deg - 5.0) * math.sin(frac * math.pi)
            bitrate = self.get_instantaneous_bitrate_mbps(el) * attenuation_factor
            total_megabits += bitrate * (step_minutes * 60.0)

        # 8000 Megabits per Gigabyte (1 GB = 8 Gb)
        return round(total_megabits / 8000.0, 1)
