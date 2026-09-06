from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class CropRecommendRequest(BaseModel):
    n: float = Field(90.0, ge=0, le=500, description="Nitrogen content in soil (kg/ha)")
    p: float = Field(42.0, ge=0, le=500, description="Phosphorus content in soil (kg/ha)")
    k: float = Field(43.0, ge=0, le=500, description="Potassium content in soil (kg/ha)")
    temperature: float = Field(25.0, ge=0, le=100, description="Temperature in Celsius")
    humidity: float = Field(75.0, ge=0, le=100, description="Relative humidity in percentage")
    ph: float = Field(6.5, ge=0.0, le=14.0, description="Soil pH value (0-14)")
    rainfall: float = Field(200.0, ge=0, le=5000, description="Rainfall in mm")
    state: Optional[str] = "Punjab"
    district: Optional[str] = "Ludhiana"
    farm_area: Optional[float] = 2.5

class YieldPredictRequest(BaseModel):
    state: str = Field("Punjab", description="Indian State name")
    district: str = Field("LUDHIANA", description="District name")
    crop: str = Field("Wheat", description="Crop name")
    season: str = Field("Kharif", description="Agricultural season (Kharif, Rabi, etc.)")
    area: float = Field(2.5, gt=0, le=500000, description="Cultivated area in hectares")
    year: Optional[int] = Field(2024, ge=1990, le=2030, description="Crop Year")

class AdvisorChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    language: Optional[str] = Field("en", description="Language: en, hi, hinglish")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict)

class FarmReportRequest(BaseModel):
    farm_info: Dict[str, Any] = Field(default_factory=dict)
    soil: Dict[str, Any] = Field(default_factory=dict)
    crop_recommendation: Dict[str, Any] = Field(default_factory=dict)
    health: Optional[Dict[str, Any]] = None
    yield_intelligence: Optional[Dict[str, Any]] = None
    advisory: Optional[Dict[str, Any]] = None
