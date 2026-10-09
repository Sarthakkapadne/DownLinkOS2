from .models.schemas import GroundStationModel, SatelliteModel

DEFAULT_GROUND_STATIONS = [
    GroundStationModel(
        id="KSAT-Svalbard-1",
        name="KSAT Svalbard Ant-1",
        code="SVA-1",
        location="Spitsbergen, Norway (78.2°N, 15.6°E)",
        lat=78.2232,
        lon=15.6267,
        status="ACTIVE",
        current_cable_deg=12.0,
        dish_diameter_m=7.3,
        rain_attenuation_db=0.1,
        elevation_mask_deg=5.0,
        max_slew_rate_deg_sec=12.0
    ),
    GroundStationModel(
        id="KSAT-Svalbard-2",
        name="KSAT Svalbard Ant-2",
        code="SVA-2",
        location="Spitsbergen, Norway (78.2°N, 15.6°E)",
        lat=78.2250,
        lon=15.6310,
        status="ACTIVE",
        current_cable_deg=-45.0,
        dish_diameter_m=11.0,
        rain_attenuation_db=0.1,
        elevation_mask_deg=5.0,
        max_slew_rate_deg_sec=10.0
    ),
    GroundStationModel(
        id="Inuvik-1",
        name="SSC Inuvik Station Ant-1",
        code="INU-1",
        location="Northwest Territories, Canada (68.3°N, 133.5°W)",
        lat=68.3607,
        lon=-133.5312,
        status="ACTIVE",
        current_cable_deg=80.0,
        dish_diameter_m=7.3,
        rain_attenuation_db=0.2,
        elevation_mask_deg=5.0,
        max_slew_rate_deg_sec=12.0
    ),
    GroundStationModel(
        id="Troll-1",
        name="KSAT TrollSat Ant-1",
        code="TRL-1",
        location="Queen Maud Land, Antarctica (72.0°S, 2.5°E)",
        lat=-72.0114,
        lon=2.5350,
        status="ACTIVE",
        current_cable_deg=-110.0,
        dish_diameter_m=7.3,
        rain_attenuation_db=0.05,
        elevation_mask_deg=5.0,
        max_slew_rate_deg_sec=12.0
    ),
    GroundStationModel(
        id="PuntaArenas-1",
        name="SSC Punta Arenas Ant-1",
        code="PUQ-1",
        location="Patagonia, Chile (53.1°S, 70.9°W)",
        lat=-53.1368,
        lon=-70.9083,
        status="ACTIVE",
        current_cable_deg=15.0,
        dish_diameter_m=5.4,
        rain_attenuation_db=0.4,
        elevation_mask_deg=5.0,
        max_slew_rate_deg_sec=15.0
    )
]

DEFAULT_SATELLITES = [
    SatelliteModel(
        id="SuperDove-2101",
        name="SuperDove-2101 (Flock 4p)",
        constellation="PlanetScope",
        ssr_capacity_gb=256.0,
        current_buffer_gb=198.0,
        data_gen_rate_gb_per_orbit=32.0,
        priority=3
    ),
    SatelliteModel(
        id="SuperDove-2104",
        name="SuperDove-2104 (Disaster Task)",
        constellation="PlanetScope",
        ssr_capacity_gb=256.0,
        current_buffer_gb=242.0,
        data_gen_rate_gb_per_orbit=45.0,
        priority=5
    ),
    SatelliteModel(
        id="SuperDove-2108",
        name="SuperDove-2108 (Agricultural Belt)",
        constellation="PlanetScope",
        ssr_capacity_gb=256.0,
        current_buffer_gb=140.0,
        data_gen_rate_gb_per_orbit=28.0,
        priority=2
    ),
    SatelliteModel(
        id="SkySat-C14",
        name="SkySat-C14 (Sub-meter Video)",
        constellation="SkySat",
        ssr_capacity_gb=512.0,
        current_buffer_gb=430.0,
        data_gen_rate_gb_per_orbit=60.0,
        priority=4
    ),
    SatelliteModel(
        id="Pelican-01",
        name="Pelican-01 (Very High Res Agile)",
        constellation="Pelican",
        ssr_capacity_gb=1024.0,
        current_buffer_gb=710.0,
        data_gen_rate_gb_per_orbit=90.0,
        priority=4
    )
]
