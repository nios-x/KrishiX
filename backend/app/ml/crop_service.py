import os
import json
import joblib
import numpy as np
from typing import Dict, Any, List

class CropRecommendationService:
    def __init__(self, artifacts_dir: str):
        self.model_path = os.path.join(artifacts_dir, "crop_recommendation_model.pkl")
        self.metrics_path = os.path.join(artifacts_dir, "crop_recommendation_metrics.json")
        
        self.model = None
        self.metrics = {}
        self.load()

    def load(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
        if os.path.exists(self.metrics_path):
            with open(self.metrics_path) as f:
                self.metrics = json.load(f)

    def recommend(self, n: float, p: float, k: float, temperature: float, humidity: float, ph: float, rainfall: float) -> Dict[str, Any]:
        if not self.model:
            raise RuntimeError("Crop recommendation model is not loaded.")

        import pandas as pd
        input_df = pd.DataFrame([{
            "N": n, "P": p, "K": k,
            "temperature": temperature,
            "humidity": humidity,
            "ph": ph,
            "rainfall": rainfall
        }])
        probs = self.model.predict_proba(input_df)[0]
        classes = self.model.classes_

        # Sort classes by probability descending
        ranked_indices = np.argsort(probs)[::-1]
        top_recommendations = []
        for idx in ranked_indices[:5]:
            prob = float(probs[idx])
            top_recommendations.append({
                "crop": classes[idx].capitalize(),
                "crop_id": classes[idx],
                "confidence": round(prob * 100, 2),
                "probability": round(prob, 4)
            })

        best = top_recommendations[0]
        best_crop = best["crop_id"]

        # Calculate feature attribution / suitability scores based on crop profile
        profiles = self.metrics.get("crop_profiles", {})
        crop_profile = profiles.get(best_crop, {})
        
        user_vals = {
            "N": n, "P": p, "K": k,
            "temperature": temperature,
            "humidity": humidity,
            "ph": ph,
            "rainfall": rainfall
        }

        feature_scores = []
        importances = self.metrics.get("feature_importances", {})

        for feat, val in user_vals.items():
            stat = crop_profile.get(feat, {})
            mean = stat.get("mean", val)
            std = stat.get("std", 1.0)
            if std == 0:
                std = 1.0

            # Distance in standard deviations clamped to 0..100% suitability
            z = abs(val - mean) / std
            suitability = max(20.0, min(100.0, 100.0 - (z * 22.0)))
            
            feature_scores.append({
                "feature": feat,
                "display_name": {
                    "N": "Nitrogen (N)",
                    "P": "Phosphorus (P)",
                    "K": "Potassium (K)",
                    "temperature": "Temperature (°C)",
                    "humidity": "Humidity (%)",
                    "ph": "Soil pH",
                    "rainfall": "Rainfall (mm)"
                }.get(feat, feat),
                "value": val,
                "optimal_mean": mean,
                "importance": importances.get(feat, 0.1),
                "suitability_percent": round(suitability, 1),
                "status": "Optimal" if suitability >= 80 else ("Moderate" if suitability >= 50 else "Suboptimal")
            })

        return {
            "recommended_crop": best["crop"],
            "crop_id": best["crop_id"],
            "confidence": best["confidence"],
            "top_recommendations": top_recommendations,
            "feature_explanations": feature_scores,
            "model_insight": (
                f"Based on the provided soil and climate parameters, {best['crop']} is the most suitable among the 22 agricultural crop classes evaluated by the machine learning model."
            ),
            "disclaimer": (
                "Krishi360 provides AI-assisted agricultural insights based on available datasets and should not replace professional agricultural advice or field-level assessment."
            )
        }
