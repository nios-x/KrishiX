import os
import json
import sqlite3
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

base_dir = r"C:\Users\abhis\.gemini\antigravity\scratch\krishi360"
db_path = os.path.join(base_dir, "data", "crop_production", "crop_production.db")
artifacts_dir = os.path.join(base_dir, "backend", "artifacts")
os.makedirs(artifacts_dir, exist_ok=True)

print("Reading data from SQLite database...")
conn = sqlite3.connect(db_path)
query = """
SELECT State_Name, District_Name, Crop, Season, Crop_Year, Area, Production, Yield
FROM crop_production
WHERE Area > 0 AND Production IS NOT NULL AND Yield IS NOT NULL
"""
df = pd.read_sql_query(query, conn)
conn.close()

print(f"Total valid records: {len(df)}")

# Coconuts are measured in nuts, not tonnes, which creates massive yield numbers (e.g. 10,000+ nuts/ha)
# Exclude coconut or clamp yield for robust general modeling
df_clean = df[df["Crop"] != "Coconut"].copy()

# Remove extreme outliers (top 1% yield anomalies)
q99 = df_clean["Yield"].quantile(0.99)
q01 = df_clean["Yield"].quantile(0.01)
df_clean = df_clean[(df_clean["Yield"] >= q01) & (df_clean["Yield"] <= q99)]

print(f"Cleaned dataset records: {len(df_clean)} (Yield range: {df_clean['Yield'].min():.2f} to {df_clean['Yield'].max():.2f})")

# Sample 50,000 records for fast high-accuracy training with low latency
sample_size = min(60000, len(df_clean))
df_sample = df_clean.sample(n=sample_size, random_state=42)

categorical_features = ["State_Name", "Crop", "Season"]
numerical_features = ["Crop_Year", "Area"]
target = "Yield"

X = df_sample[categorical_features + numerical_features]
y = df_sample[target]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features),
        ("num", "passthrough", numerical_features)
    ]
)

model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(n_estimators=50, max_depth=16, random_state=42, n_jobs=-1))
])

print("Fitting Yield Prediction Pipeline...")
model.fit(X_train, y_train)

print("Evaluating Yield model...")
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
rmse = root_mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Yield MAE: {mae:.3f} tonnes/ha")
print(f"Yield RMSE: {rmse:.3f} tonnes/ha")
print(f"Yield R² Score: {r2:.4f}")

# Save model pipeline
model_path = os.path.join(artifacts_dir, "yield_model.pkl")
joblib.dump(model, model_path)
print(f"Yield Model saved to: {model_path}")

# Precompute historical state/crop average yield benchmarks for comparison
benchmarks = df_clean.groupby(["State_Name", "Crop"])["Yield"].agg(["mean", "std", "count"]).reset_index()
benchmarks = benchmarks[benchmarks["count"] >= 5]
benchmark_dict = {}
for _, row in benchmarks.iterrows():
    key = f"{row['State_Name']}__{row['Crop']}".lower()
    benchmark_dict[key] = {
        "mean_yield": round(float(row["mean"]), 2),
        "std_yield": round(float(row["std"]) if pd.notnull(row["std"]) else 0.5, 2),
        "record_count": int(row["count"])
    }

metrics = {
    "model_name": "Random Forest Regressor Pipeline",
    "dataset": "Crop Production Data India (246K+ records)",
    "training_samples": len(X_train),
    "test_samples": len(X_test),
    "features": categorical_features + numerical_features,
    "target": "Yield (tonnes/hectare)",
    "metrics": {
        "mae": round(float(mae), 4),
        "rmse": round(float(rmse), 4),
        "r2_score": round(float(r2), 4)
    },
    "benchmark_count": len(benchmark_dict)
}

metrics_path = os.path.join(artifacts_dir, "yield_metrics.json")
with open(metrics_path, "w") as f:
    json.dump(metrics, f, indent=2)

benchmarks_path = os.path.join(artifacts_dir, "yield_benchmarks.json")
with open(benchmarks_path, "w") as f:
    json.dump(benchmark_dict, f, indent=2)

print(f"Saved yield metrics and {len(benchmark_dict)} regional benchmarks.")
