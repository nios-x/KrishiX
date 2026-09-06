import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

base_dir = r"C:\Users\abhis\.gemini\antigravity\scratch\krishi360"
data_path = os.path.join(base_dir, "data", "crop_recommendation", "crop_recommendation.csv")
artifacts_dir = os.path.join(base_dir, "backend", "artifacts")
os.makedirs(artifacts_dir, exist_ok=True)

print("Loading Crop Recommendation Dataset...")
df = pd.read_csv(data_path)
print(f"Dataset shape: {df.shape}")
print(f"Unique crops ({df['label'].nunique()}): {sorted(df['label'].unique())}")

features = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
target = "label"

X = df[features]
y = df[target]

# Train-test split (80-20 stratified)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training samples: {len(X_train)}, Test samples: {len(X_test)}")

# Train Random Forest
print("Training Random Forest Classifier (100 estimators)...")
rf = RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)

# Evaluate on test set
y_pred = rf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred, output_dict=True)
cm = confusion_matrix(y_test, y_pred).tolist()

print(f"Test Accuracy: {accuracy * 100:.2f}%")
print(f"Macro F1-Score: {report['macro avg']['f1-score']:.4f}")

# Feature importances
importances = dict(zip(features, [round(float(v), 4) for v in rf.feature_importances_]))
print(f"Feature Importances: {importances}")

# Compute crop profile averages for feature explanation comparison
crop_profiles = {}
for crop, group in df.groupby("label"):
    crop_profiles[crop] = {
        col: {
            "mean": round(float(group[col].mean()), 2),
            "min": round(float(group[col].min()), 2),
            "max": round(float(group[col].max()), 2),
            "std": round(float(group[col].std()), 2),
        }
        for col in features
    }

# Save model and artifacts
model_path = os.path.join(artifacts_dir, "crop_recommendation_model.pkl")
joblib.dump(rf, model_path)
print(f"Model saved to: {model_path}")

metrics = {
    "model_name": "Random Forest Classifier",
    "dataset": "Crop Recommendation Dataset",
    "total_samples": len(df),
    "features": features,
    "target_classes": sorted(list(rf.classes_)),
    "num_classes": len(rf.classes_),
    "test_accuracy": round(float(accuracy), 4),
    "macro_f1": round(float(report["macro avg"]["f1-score"]), 4),
    "weighted_f1": round(float(report["weighted avg"]["f1-score"]), 4),
    "feature_importances": importances,
    "class_report": {k: v for k, v in report.items() if isinstance(v, dict)},
    "crop_profiles": crop_profiles
}

metrics_path = os.path.join(artifacts_dir, "crop_recommendation_metrics.json")
with open(metrics_path, "w") as f:
    json.dump(metrics, f, indent=2)
print(f"Metrics saved to: {metrics_path}")
