import os
import sys

# Ensure UTF-8 console output for Windows cmd/powershell
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from app.ml.crop_service import CropRecommendationService
from app.ml.health_service import PlantHealthService
from app.ml.yield_service import YieldPredictionService
from app.ml.production_service import ProductionDataService
from app.services.advisor_service import KrishiMitraAdvisor

from app.api.endpoints import crop, health, production, yield_pred, advisor, report, system

# Base directory paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "backend", "artifacts")
DATA_DIR = os.path.join(BASE_DIR, "data")
PLANTVILLAGE_DIR = os.path.join(DATA_DIR, "plantvillage")
SAMPLES_DIR = os.path.join(PLANTVILLAGE_DIR, "samples")
DB_PATH = os.path.join(DATA_DIR, "crop_production", "crop_production.db")

print("Initializing Krishi360 AI Engines...")
crop_service = CropRecommendationService(artifacts_dir=ARTIFACTS_DIR)
health_service = PlantHealthService(model_dir=PLANTVILLAGE_DIR, samples_dir=SAMPLES_DIR)
yield_service = YieldPredictionService(artifacts_dir=ARTIFACTS_DIR)
production_service = ProductionDataService(db_path=DB_PATH)
advisor_service = KrishiMitraAdvisor(
    crop_service=crop_service,
    health_service=health_service,
    production_service=production_service,
    yield_service=yield_service
)
print("All Krishi360 services initialized successfully.")

app = FastAPI(
    title="Krishi360 API",
    description="AI-Driven Precision Agriculture Platform API for Indian Farming",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount sample images for frontend previews
if os.path.exists(SAMPLES_DIR):
    app.mount("/samples", StaticFiles(directory=SAMPLES_DIR), name="samples")

# Include Routers under /api
app.include_router(crop.router, prefix="/api")
app.include_router(health.router, prefix="/api")
app.include_router(production.router, prefix="/api")
app.include_router(yield_pred.router, prefix="/api")
app.include_router(advisor.router, prefix="/api")
app.include_router(report.router, prefix="/api")
app.include_router(system.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "platform": "Krishi360",
        "tagline": "Smarter Farming. Better Decisions. Sustainable Growth.",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

# Global exception handler to prevent leaking stack traces to clients
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    err_msg = str(exc).encode("ascii", "replace").decode("ascii")
    print(f"Unhandled Error: {err_msg}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Krishi360 is temporarily unable to process this request. Please verify inputs or try again."}
    )
