import os
import sqlite3
from typing import Dict, Any, List, Optional

class ProductionDataService:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def get_states(self) -> List[str]:
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT State_Name FROM crop_production WHERE State_Name IS NOT NULL ORDER BY State_Name ASC")
        rows = [r[0] for r in cursor.fetchall() if r[0]]
        conn.close()
        return rows

    def get_districts(self, state: Optional[str] = None) -> List[str]:
        conn = self._get_connection()
        cursor = conn.cursor()
        if state:
            cursor.execute(
                "SELECT DISTINCT District_Name FROM crop_production WHERE State_Name = ? ORDER BY District_Name ASC",
                (state.strip(),)
            )
        else:
            cursor.execute("SELECT DISTINCT District_Name FROM crop_production ORDER BY District_Name ASC")
        rows = [r[0] for r in cursor.fetchall() if r[0]]
        conn.close()
        return rows

    def get_crops(self, state: Optional[str] = None, district: Optional[str] = None) -> List[str]:
        conn = self._get_connection()
        cursor = conn.cursor()
        conditions = []
        params = []
        if state:
            conditions.append("State_Name = ?")
            params.append(state.strip())
        if district:
            conditions.append("District_Name = ?")
            params.append(district.strip())

        where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
        query = f"SELECT DISTINCT Crop FROM crop_production {where} ORDER BY Crop ASC"
        cursor.execute(query, params)
        rows = [r[0] for r in cursor.fetchall() if r[0]]
        conn.close()
        return rows

    def get_seasons(self) -> List[str]:
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT Season FROM crop_production WHERE Season IS NOT NULL ORDER BY Season ASC")
        rows = [r[0] for r in cursor.fetchall() if r[0]]
        conn.close()
        return rows

    def get_analytics(
        self,
        state: Optional[str] = None,
        district: Optional[str] = None,
        crop: Optional[str] = None,
        season: Optional[str] = None,
        start_year: Optional[int] = None,
        end_year: Optional[int] = None
    ) -> Dict[str, Any]:
        conn = self._get_connection()
        cursor = conn.cursor()

        conditions = ["Area > 0", "Production IS NOT NULL"]
        params = []

        if state and state != "All":
            conditions.append("State_Name = ?")
            params.append(state.strip())
        if district and district != "All":
            conditions.append("District_Name = ?")
            params.append(district.strip())
        if crop and crop != "All":
            conditions.append("Crop = ?")
            params.append(crop.strip())
        if season and season != "All":
            conditions.append("Season = ?")
            params.append(season.strip())
        if start_year:
            conditions.append("Crop_Year >= ?")
            params.append(int(start_year))
        if end_year:
            conditions.append("Crop_Year <= ?")
            params.append(int(end_year))

        where_clause = f"WHERE {' AND '.join(conditions)}"

        # 1. KPI Aggregates
        kpi_query = f"""
        SELECT 
            COUNT(*) as record_count,
            COALESCE(SUM(Area), 0) as total_area,
            COALESCE(SUM(Production), 0) as total_production
        FROM crop_production
        {where_clause}
        """
        cursor.execute(kpi_query, params)
        kpi_row = cursor.fetchone()
        
        rec_count = kpi_row["record_count"]
        tot_area = round(float(kpi_row["total_area"]), 2)
        tot_prod = round(float(kpi_row["total_production"]), 2)
        avg_yield = round(tot_prod / tot_area, 2) if tot_area > 0 else 0.0

        if rec_count == 0:
            conn.close()
            return {
                "record_count": 0,
                "total_area": 0,
                "total_production": 0,
                "calculated_yield": 0,
                "production_trend": [],
                "area_vs_production": [],
                "yield_trend": [],
                "top_crops": [],
                "season_distribution": [],
                "empty": True
            }

        # 2. Chart 1 & Chart 3: Production and Yield Trend by Year
        trend_query = f"""
        SELECT 
            Crop_Year as year,
            SUM(Production) as production,
            SUM(Area) as area
        FROM crop_production
        {where_clause}
        GROUP BY Crop_Year
        ORDER BY Crop_Year ASC
        """
        cursor.execute(trend_query, params)
        trend_rows = cursor.fetchall()

        production_trend = []
        yield_trend = []
        for r in trend_rows:
            yr = int(r["year"])
            prod = round(float(r["production"]), 2)
            area = round(float(r["area"]), 2)
            yd = round(prod / area, 2) if area > 0 else 0.0
            production_trend.append({"year": yr, "production": prod, "area": area})
            yield_trend.append({"year": yr, "yield": yd})

        # 3. Chart 2: Area vs Production Scatter (downsampled if large to keep frontend super responsive)
        scatter_query = f"""
        SELECT Area as area, Production as production, Crop_Year as year, Crop as crop
        FROM crop_production
        {where_clause}
        LIMIT 250
        """
        cursor.execute(scatter_query, params)
        scatter_rows = cursor.fetchall()
        area_vs_production = [
            {
                "area": round(float(r["area"]), 1),
                "production": round(float(r["production"]), 1),
                "year": r["year"],
                "crop": r["crop"]
            }
            for r in scatter_rows
        ]

        # 4. Chart 4: Top Crops by Production
        top_crops_query = f"""
        SELECT 
            Crop as crop,
            SUM(Production) as production,
            SUM(Area) as area
        FROM crop_production
        {where_clause}
        GROUP BY Crop
        ORDER BY production DESC
        LIMIT 10
        """
        cursor.execute(top_crops_query, params)
        top_crops_rows = cursor.fetchall()
        top_crops = [
            {
                "crop": r["crop"],
                "production": round(float(r["production"]), 2),
                "area": round(float(r["area"]), 2),
                "yield": round(float(r["production"]) / float(r["area"]), 2) if float(r["area"]) > 0 else 0.0
            }
            for r in top_crops_rows
        ]

        # 5. Chart 5: Season Distribution
        season_query = f"""
        SELECT 
            Season as season,
            SUM(Production) as production,
            COUNT(*) as records
        FROM crop_production
        {where_clause}
        GROUP BY Season
        ORDER BY production DESC
        """
        cursor.execute(season_query, params)
        season_rows = cursor.fetchall()
        season_distribution = [
            {
                "season": r["season"],
                "production": round(float(r["production"]), 2),
                "records": r["records"]
            }
            for r in season_rows
        ]

        conn.close()

        return {
            "record_count": rec_count,
            "total_area": tot_area,
            "total_production": tot_prod,
            "calculated_yield": avg_yield,
            "production_trend": production_trend,
            "area_vs_production": area_vs_production,
            "yield_trend": yield_trend,
            "top_crops": top_crops,
            "season_distribution": season_distribution,
            "empty": False
        }

    def get_regional_drilldown(self, state: str, district: str, crop: str) -> Dict[str, Any]:
        conn = self._get_connection()
        cursor = conn.cursor()
        query = """
        SELECT 
            Crop_Year as year,
            Season as season,
            Area as area,
            Production as production,
            Yield as yield
        FROM crop_production
        WHERE State_Name = ? AND District_Name = ? AND Crop = ? AND Area > 0 AND Production IS NOT NULL
        ORDER BY Crop_Year ASC, Season ASC
        """
        cursor.execute(query, (state.strip(), district.strip(), crop.strip()))
        rows = cursor.fetchall()
        conn.close()

        data = []
        for r in rows:
            data.append({
                "year": r["year"],
                "season": r["season"],
                "area": round(float(r["area"]), 1),
                "production": round(float(r["production"]), 1),
                "yield": round(float(r["yield"]), 2) if r["yield"] is not None else 0.0
            })

        return {
            "state": state,
            "district": district,
            "crop": crop,
            "records": data,
            "total_records": len(data)
        }
