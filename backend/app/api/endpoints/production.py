from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Dict, Any, List, Optional

router = APIRouter(prefix="/production", tags=["Production Intelligence"])

def get_production_service():
    from app.main import production_service
    return production_service

@router.get("/states")
async def get_states(service=Depends(get_production_service)) -> List[str]:
    return service.get_states()

@router.get("/districts")
async def get_districts(state: Optional[str] = None, service=Depends(get_production_service)) -> List[str]:
    return service.get_districts(state)

@router.get("/crops")
async def get_crops(state: Optional[str] = None, district: Optional[str] = None, service=Depends(get_production_service)) -> List[str]:
    return service.get_crops(state, district)

@router.get("/seasons")
async def get_seasons(service=Depends(get_production_service)) -> List[str]:
    return service.get_seasons()

@router.get("/analytics")
async def get_analytics(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    crop: Optional[str] = Query(None),
    season: Optional[str] = Query(None),
    start_year: Optional[int] = Query(None),
    end_year: Optional[int] = Query(None),
    service=Depends(get_production_service)
) -> Dict[str, Any]:
    return service.get_analytics(
        state=state,
        district=district,
        crop=crop,
        season=season,
        start_year=start_year,
        end_year=end_year
    )

@router.get("/trends")
async def get_trends(
    state: str = Query(...),
    district: str = Query(...),
    crop: str = Query(...),
    service=Depends(get_production_service)
) -> Dict[str, Any]:
    return service.get_regional_drilldown(state, district, crop)
