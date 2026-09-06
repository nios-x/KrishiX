import os
import sqlite3
import time
import pandas as pd

base = r"C:\Users\abhis\.gemini\antigravity\scratch\krishi360"
csv_path = os.path.join(base, "data", "crop_production", "crop_production.csv")
db_path = os.path.join(base, "data", "crop_production", "crop_production.db")

print("Reading crop_production.csv...")
df = pd.read_csv(csv_path)
print(f"Initial shape: {df.shape}")

# Clean strings
for col in ["State_Name", "District_Name", "Season", "Crop"]:
    if col in df.columns:
        df[col] = df[col].astype(str).str.strip()

# Clean numeric columns
df["Crop_Year"] = pd.to_numeric(df["Crop_Year"], errors="coerce").astype("Int64")
df["Area"] = pd.to_numeric(df["Area"], errors="coerce")
df["Production"] = pd.to_numeric(df["Production"], errors="coerce")

df["Yield"] = df.apply(
    lambda r: r["Production"] / r["Area"] if pd.notnull(r["Area"]) and r["Area"] > 0 and pd.notnull(r["Production"]) else None,
    axis=1
)

print(f"Total processed records: {len(df)}")

if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
df.to_sql("crop_production", conn, if_exists="replace", index=False)

cursor = conn.cursor()
cursor.execute("CREATE INDEX idx_state ON crop_production(State_Name);")
cursor.execute("CREATE INDEX idx_district ON crop_production(State_Name, District_Name);")
cursor.execute("CREATE INDEX idx_crop ON crop_production(Crop);")
cursor.execute("CREATE INDEX idx_year ON crop_production(Crop_Year);")
cursor.execute("CREATE INDEX idx_season ON crop_production(Season);")
cursor.execute("CREATE INDEX idx_composite ON crop_production(State_Name, District_Name, Crop, Crop_Year);")
conn.commit()

t0 = time.time()
cursor.execute("SELECT COUNT(*), SUM(Area), SUM(Production), AVG(Yield) FROM crop_production WHERE State_Name = 'Punjab'")
row = cursor.fetchone()
t1 = time.time()
print(f"Benchmark test for Punjab: count={row[0]}, area={row[1]:,.0f}, prod={row[2]:,.0f}, avg_yield={row[3]:.2f}")
print(f"Execution time: {(t1 - t0) * 1000:.2f} ms")

conn.close()
print("Indexed SQLite database created successfully!")
