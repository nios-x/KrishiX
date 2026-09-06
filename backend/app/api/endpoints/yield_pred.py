from fastapi import APIRouter, HTTPException, Depends
from app.schemas.agriculture import YieldPredictRequest
from typing import Dict, Any

router = APIRouter(prefix="/yield", tags=["Yield Prediction"])

def get_yield_service():
    from app.main import yield_service
    return yield_service

@router.post("/predict")
async def predict_crop_yield(req: YieldPredictRequest, service=Depends(get_yield_service)) -> Dict[str, Any]:
    try:
        return service.predict(
            state=req.state,
            district=req.district,
            crop=req.crop,
            season=req.season,
            area=req.area,
            year=req.year or 2024
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to calculate yield estimate.")

@router.get("/metrics")
async def get_yield_metrics(service=Depends(get_yield_service)) -> Dict[str, Any]:
    return service.metrics
