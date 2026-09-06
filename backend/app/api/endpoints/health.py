import os
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from typing import Dict, Any, List

router = APIRouter(prefix="/health", tags=["Crop Health"])

def get_health_service():
    from app.main import health_service
    return health_service

@router.post("/analyze")
async def analyze_crop_leaf(
    file: UploadFile = File(...),
    service=Depends(get_health_service)
) -> Dict[str, Any]:
    # Validate extension
    allowed = {".jpg", ".jpeg", ".png", ".webp"}
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Invalid image format. Please upload a JPG, JPEG, or PNG image of a crop leaf."
        )

    # Read image contents with size limit (10MB)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image file size exceeds 10MB limit.")

    result = service.analyze_image(contents, filename=file.filename)
    if not result.get("success", True):
        raise HTTPException(status_code=400, detail=result.get("error", "Failed to analyze image."))

    return result

@router.get("/samples")
async def list_sample_images(service=Depends(get_health_service)) -> List[Dict[str, str]]:
    samples = [
        {"id": "potato_early_blight", "name": "Potato (Early Blight)", "file": "potato_early_blight.jpg"},
        {"id": "apple_scab", "name": "Apple (Apple Scab)", "file": "apple_scab.jpg"},
        {"id": "corn_common_rust", "name": "Corn (Common Rust)", "file": "corn_common_rust.jpg"},
        {"id": "bell_pepper_bacterial_spot", "name": "Bell Pepper (Bacterial Spot)", "file": "bell_pepper_bacterial_spot.jpg"},
        {"id": "potato_healthy", "name": "Potato (Healthy Leaf)", "file": "potato_healthy.jpg"},
        {"id": "corn_healthy", "name": "Corn (Healthy Leaf)", "file": "corn_healthy.jpg"},
        {"id": "grape_black_rot", "name": "Grape (Black Rot)", "file": "grape_black_rot.jpg"},
        {"id": "peach_healthy", "name": "Peach (Healthy Leaf)", "file": "peach_healthy.jpg"}
    ]
    return samples

@router.get("/sample/{sample_id}")
async def analyze_sample_image(sample_id: str, service=Depends(get_health_service)) -> Dict[str, Any]:
    res = service.analyze_sample(sample_id)
    if not res.get("success", True):
        raise HTTPException(status_code=404, detail=res.get("error", "Sample image not found."))
    return res
