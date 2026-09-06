from fastapi import APIRouter, HTTPException, Depends
from app.schemas.agriculture import CropRecommendRequest
from typing import Dict, Any

router = APIRouter(prefix="/crop", tags=["Crop Recommendation"])

def get_crop_service():
    from app.main import crop_service
    return crop_service

@router.post("/recommend")
async def recommend_crop(req: CropRecommendRequest, service=Depends(get_crop_service)) -> Dict[str, Any]:
    try:
        res = service.recommend(
            n=req.n,
            p=req.p,
            k=req.k,
            temperature=req.temperature,
            humidity=req.humidity,
            ph=req.ph,
            rainfall=req.rainfall
        )
        res["input_params"] = req.model_dump()
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to process crop recommendation.")

@router.get("/metrics")
async def get_crop_metrics(service=Depends(get_crop_service)) -> Dict[str, Any]:
    return service.metrics
