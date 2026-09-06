import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.main import app

client = TestClient(app)

def test_root():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["platform"] == "Krishi360"
    print("[PASS] Root endpoint OK")

def test_crop_recommend():
    payload = {
        "n": 90, "p": 42, "k": 43,
        "temperature": 20.8, "humidity": 82.0, "ph": 6.5, "rainfall": 202.9,
        "state": "Punjab", "district": "Ludhiana"
    }
    res = client.post("/api/crop/recommend", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "recommended_crop" in data
    assert len(data["top_recommendations"]) == 5
    assert len(data["feature_explanations"]) == 7
    print(f"[PASS] Crop recommendation OK -> Top: {data['recommended_crop']} ({data['confidence']}%)")

def test_health_sample():
    res = client.get("/api/health/sample/potato_early_blight")
    assert res.status_code == 200
    data = res.json()
    assert data["confident"] is True
    assert "Potato" in data["crop"]
    print(f"[PASS] Plant health diagnosis OK -> Crop: {data['crop']}, Condition: {data['condition']} ({data['confidence']}%)")

def test_production_analytics():
    res = client.get("/api/production/analytics?state=Punjab")
    assert res.status_code == 200
    data = res.json()
    assert data["record_count"] > 0
    assert len(data["production_trend"]) > 0
    assert len(data["top_crops"]) > 0
    print(f"[PASS] Production analytics OK -> Punjab records: {data['record_count']:,}, Total Prod: {data['total_production']:,.0f} tonnes")

def test_yield_predict():
    payload = {
        "state": "Punjab",
        "district": "LUDHIANA",
        "crop": "Wheat",
        "season": "Rabi",
        "area": 5.0,
        "year": 2024
    }
    res = client.post("/api/yield/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "estimated_yield_tonnes_per_ha" in data
    assert data["estimated_production_tonnes"] > 0
    print(f"[PASS] Yield prediction OK -> Est Yield: {data['estimated_yield_tonnes_per_ha']} t/ha, Est Prod: {data['estimated_production_tonnes']} t")

def test_advisor_chat():
    payload = {
        "message": "My soil has pH 6.5 and rainfall is 900mm. What should I grow?",
        "language": "en",
        "context": {"location": {"state": "Punjab", "district": "Ludhiana"}}
    }
    res = client.post("/api/advisor", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "response" in data
    print(f"[PASS] AI Advisor OK -> Response snippet: {data['response'][:80]}...")

def test_report_pdf():
    payload = {
        "farm_info": {"state": "Punjab", "district": "Ludhiana", "area": 3.0, "current_crop": "Wheat"},
        "soil": {"n": 90, "p": 42, "k": 43, "ph": 6.5, "rainfall": 800, "temperature": 25, "humidity": 70},
        "crop_recommendation": {"recommended_crop": "Wheat", "confidence": 92.5, "model_insight": "Optimal"},
        "health": {"crop": "Wheat", "condition": "Healthy Foliage", "confidence": 98.0, "status": "Healthy Crop"},
        "yield_intelligence": {"estimated_yield_tonnes_per_ha": 4.5, "estimated_production_tonnes": 13.5, "historical_average_yield": 4.2, "trend": "+7.1% above avg"},
        "advisory": {"summary": "Optimal season conditions", "actions": ["Select certified seed", "Maintain scheduled watering"]}
    }
    res = client.post("/api/report/pdf", json=payload)
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert res.content[:4] == b"%PDF"
    print(f"[PASS] PDF Generation OK -> Valid PDF binary ({len(res.content)} bytes)")

def test_system_stats():
    res = client.get("/api/system/stats")
    assert res.status_code == 200
    data = res.json()
    assert len(data["datasets"]) == 3
    print(f"[PASS] System stats OK -> Production records verified: {data['headline_stats']['production_records']}")

if __name__ == "__main__":
    print("\n--- Running Krishi360 Backend Test Suite ---")
    test_root()
    test_crop_recommend()
    test_health_sample()
    test_production_analytics()
    test_yield_predict()
    test_advisor_chat()
    test_report_pdf()
    test_system_stats()
    print("\n--- ALL TESTS PASSED SUCCESSFULLY! ---\n")
