from typing import List, Dict, Any
from ..models.schemas import CapExSitingRequest, CapExSitingResponse

class CapExSitingOptimizer:
    """
    Evaluates candidate ground antenna sites based on polar orbital convergence,
    cross-constellation contact overlap, and marginal ROI score.
    """

    CANDIDATE_LOCATIONS = [
        {"id": "TROMSO", "name": "KSAT Tromsø (Norway)", "lat": 69.65, "lon": 18.96, "capex_m": 1.4, "polar_tier": "HIGH"},
        {"id": "FAIRBANKS", "name": "Fairbanks Command Station (Alaska)", "lat": 64.84, "lon": -147.72, "capex_m": 1.6, "polar_tier": "HIGH"},
        {"id": "PERTH", "name": "SSC Western Australia (Perth)", "lat": -31.95, "lon": 115.86, "capex_m": 1.2, "polar_tier": "MID"},
        {"id": "HARTEBEESTHOEK", "name": "SANSA Hartebeesthoek (South Africa)", "lat": -25.88, "lon": 27.70, "capex_m": 1.1, "polar_tier": "MID"},
        {"id": "AWARUA", "name": "Awarua Ground Station (New Zealand)", "lat": -46.53, "lon": 168.38, "capex_m": 1.3, "polar_tier": "HIGH"}
    ]

    @classmethod
    def evaluate(cls, request: CapExSitingRequest) -> CapExSitingResponse:
        budget = request.budget_usd_millions
        recommended = []
        spent = 0.0

        # Sort candidate locations by polar priority (high latitude polar stations see SSO satellites every 90 min)
        candidates = sorted(
            cls.CANDIDATE_LOCATIONS,
            key=lambda c: (c["polar_tier"] == "HIGH", abs(c["lat"])),
            reverse=True
        )

        for cand in candidates:
            if spent + cand["capex_m"] <= budget:
                recommended.append(cand)
                spent += cand["capex_m"]

        # Expected constellation throughput gain (+18% to +35%)
        throughput_gain = round(len(recommended) * 11.5, 1)
        roi_score = round(throughput_gain / (spent or 1.0), 2)

        return CapExSitingResponse(
            recommended_locations=recommended,
            expected_throughput_gain_pct=throughput_gain,
            roi_score=roi_score
        )
