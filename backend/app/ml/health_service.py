import os
import io
import json
import torch
from PIL import Image
import torchvision.transforms as transforms
from transformers import MobileNetV2ForImageClassification
from typing import Dict, Any, Optional

from app.ml.disease_metadata import get_disease_info

class PlantHealthService:
    def __init__(self, model_dir: str, samples_dir: str, confidence_threshold: float = 0.45):
        self.model_dir = model_dir
        self.samples_dir = samples_dir
        self.confidence_threshold = confidence_threshold
        self.model = None
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        self.load()

    def load(self):
        if os.path.exists(self.model_dir):
            try:
                self.model = MobileNetV2ForImageClassification.from_pretrained(self.model_dir)
                self.model.eval()
                print("PlantHealthService: MobileNetV2 loaded successfully.")
            except Exception as e:
                print(f"PlantHealthService load warning: {e}")

    def analyze_image(self, image_bytes: bytes, filename: Optional[str] = None) -> Dict[str, Any]:
        if not self.model:
            raise RuntimeError("Plant health model is not initialized.")

        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception as e:
            return {
                "success": False,
                "error": "Invalid image format. Please upload a valid JPG, JPEG, or PNG image."
            }

        # Validate minimum dimensions
        if image.width < 50 or image.height < 50:
            return {
                "success": False,
                "error": "Image resolution is too low. Please upload a clearer leaf photo."
            }

        tensor = self.transform(image).unsqueeze(0)

        with torch.no_grad():
            outputs = self.model(tensor)
            logits = outputs.logits
            probs = torch.nn.functional.softmax(logits, dim=1)[0]
            top_probs, top_indices = torch.topk(probs, 4)

        top_prob = float(top_probs[0].item())
        top_idx = top_indices[0].item()
        raw_label = self.model.config.id2label.get(top_idx) or self.model.config.id2label.get(str(top_idx))

        # Check confidence threshold for Responsible AI
        if top_prob < self.confidence_threshold:
            return {
                "success": True,
                "confident": False,
                "confidence": round(top_prob * 100, 2),
                "threshold": round(self.confidence_threshold * 100, 2),
                "status": "Low Confidence",
                "message": "Unable to confidently identify the condition.",
                "guidance": "Please upload a clearer image with good natural lighting, with the leaf centered and clearly in focus.",
                "disclaimer": "Krishi360 provides AI-assisted agricultural insights based on available datasets and should not replace professional agricultural advice or field-level assessment."
            }

        disease_info = get_disease_info(raw_label)

        # Build top alternative predictions
        top_candidates = []
        for i in range(len(top_indices)):
            idx = top_indices[i].item()
            prob = float(top_probs[i].item())
            lbl = self.model.config.id2label.get(idx) or self.model.config.id2label.get(str(idx))
            meta = get_disease_info(lbl)
            top_candidates.append({
                "label": lbl,
                "crop": meta.get("crop", "Crop"),
                "condition": meta.get("condition", lbl),
                "confidence": round(prob * 100, 2)
            })

        status_label = "Healthy Crop" if disease_info.get("is_healthy", False) else "Potential Disease Detected"

        return {
            "success": True,
            "confident": True,
            "crop": disease_info.get("crop", "Crop"),
            "condition": disease_info.get("condition", raw_label),
            "confidence": round(top_prob * 100, 2),
            "status": status_label,
            "pathogen": disease_info.get("pathogen", "N/A"),
            "is_healthy": disease_info.get("is_healthy", False),
            "symptoms": disease_info.get("symptoms", []),
            "next_steps": disease_info.get("next_steps", []),
            "alternative_candidates": top_candidates,
            "disclaimer": (
                "Krishi360 provides AI-assisted agricultural insights based on available datasets and should not replace professional agricultural advice or field-level assessment. "
                "Consult a local agricultural expert or Krishi Vigyan Kendra (KVK) for crop-specific treatment recommendations."
            )
        }

    def analyze_sample(self, sample_name: str) -> Dict[str, Any]:
        """Analyze one of the bundled demo sample images."""
        filename = f"{sample_name}.jpg" if not sample_name.endswith(".jpg") else sample_name
        path = os.path.join(self.samples_dir, filename)
        if not os.path.exists(path):
            return {"success": False, "error": f"Sample image '{filename}' not found."}

        with open(path, "rb") as f:
            data = f.read()
        res = self.analyze_image(data, filename=filename)
        res["sample_filename"] = filename
        return res
