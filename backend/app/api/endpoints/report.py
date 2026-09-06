from fastapi import APIRouter, HTTPException, Response
from app.schemas.agriculture import FarmReportRequest
from app.services.report_service import FarmReportGenerator
from typing import Dict, Any

router = APIRouter(prefix="/report", tags=["Farm Report"])

generator = FarmReportGenerator()

@router.post("")
async def create_farm_report(req: FarmReportRequest) -> Dict[str, Any]:
    # Returns structured combined assessment
    farm_info = req.farm_info
    crop_rec = req.crop_recommendation
    health = req.health or {}
    yield_data = req.yield_intelligence or {}

    # Calculate overall risk score
    risk_factors = []
    if health and "Disease" in str(health.get("status", "")):
        risk_factors.append("Active foliar disease detected on farm")
    
    diff_pct = yield_data.get("difference_from_average_percent", 0)
    if diff_pct < -5:
        risk_factors.append("Historical yield below regional baseline")

    conf = crop_rec.get("confidence", 90)
    if conf < 65:
        risk_factors.append("Borderline soil suitability match")

    risk_level = "High" if len(risk_factors) >= 2 else ("Moderate" if len(risk_factors) == 1 else "Low")

    return {
        "status": "success",
        "risk_level": risk_level,
        "risk_factors": risk_factors,
        "farm_summary": {
            "state": farm_info.get("state"),
            "district": farm_info.get("district"),
            "area": farm_info.get("area"),
            "recommended_crop": crop_rec.get("recommended_crop"),
            "recommendation_confidence": crop_rec.get("confidence"),
            "plant_condition": health.get("condition", "Not scanned"),
            "estimated_yield": yield_data.get("estimated_yield_tonnes_per_ha", "N/A"),
            "production_trend": yield_data.get("trend", "N/A")
        },
        "pdf_download_url": "/api/report/pdf"
    }

@router.post("/pdf")
async def generate_farm_report_pdf(req: FarmReportRequest):
    try:
        pdf_bytes = generator.generate_pdf(req.model_dump())
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=Krishi360_Farm_Intelligence_Report.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to compile PDF report.")
