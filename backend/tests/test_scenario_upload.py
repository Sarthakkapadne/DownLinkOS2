import json
from pathlib import Path
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_upload_scenario_json():
    json_path = Path("frontend/src/data/mission_scenario_input.json")
    assert json_path.exists(), "mission_scenario_input.json must exist"
    
    with open(json_path, "r", encoding="utf-8") as f:
        scenario_data = json.load(f)

    response = client.post("/api/v1/schedule/upload-scenario", json=scenario_data)
    assert response.status_code == 200
    data = response.json()
    
    assert data["status"] == "OPTIMIZATION_SUCCESS"
    assert "metrics" in data
    assert data["metrics"]["total_data_delivered_gb"] > 50.0
    assert data["metrics"]["buffer_overflow_count"] == 0
    assert len(data["timeline"]) >= 3
    assert data["fcfs_comparison"]["fcfs_buffer_overflows"] == 1
    assert data["metrics"]["data_throughput_gain_vs_fcfs_pct"] > 100.0
