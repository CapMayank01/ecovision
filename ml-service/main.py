from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import joblib, pandas as pd, numpy as np

app = FastAPI(title="EcoVision ML Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:3000"],
    allow_methods=["*"], allow_headers=["*"],
)

model_log       = joblib.load("ecovision_ridge_model.pkl")
scaler          = joblib.load("ecovision_scaler.pkl")
df_ref          = pd.read_csv("ecovision_ml_2000rows.csv")
df_encoded      = pd.get_dummies(df_ref, columns=["city","land_type"], drop_first=True)
trained_columns = df_encoded.drop(columns=["avg_price_per_sqft"]).columns.tolist()
city_profiles   = df_ref.groupby("city").agg({
    "aqi":"mean","green_cover_percent":"mean","water_quality_index":"mean",
    "flood_risk_score":"mean","dist_expressway_km":"mean",
    "dist_metro_railway_km":"mean","near_industrial_zone":"mean"
}).round(2)

class PredictRequest(BaseModel):
    city:                  str
    land_type:             Optional[str]   = "Residential"
    year:                  Optional[int]   = 2025
    aqi:                   Optional[float] = None
    green_cover_percent:   Optional[float] = None
    water_quality_index:   Optional[float] = None
    flood_risk_score:      Optional[float] = None
    dist_expressway_km:    Optional[float] = None
    dist_metro_railway_km: Optional[float] = None
    near_industrial_zone:  Optional[int]   = None

def fill_profile(data: PredictRequest) -> dict:
    if data.city not in city_profiles.index:
        raise HTTPException(400, f"City '{data.city}' not found. Available: {city_profiles.index.tolist()}")
    p = city_profiles.loc[data.city]
    return {
        "city": data.city, "year": data.year, "land_type": data.land_type,
        "aqi":                   data.aqi                   or p["aqi"],
        "green_cover_percent":   data.green_cover_percent   or p["green_cover_percent"],
        "water_quality_index":   data.water_quality_index   or p["water_quality_index"],
        "flood_risk_score":      data.flood_risk_score      or p["flood_risk_score"],
        "dist_expressway_km":    data.dist_expressway_km    or p["dist_expressway_km"],
        "dist_metro_railway_km": data.dist_metro_railway_km or p["dist_metro_railway_km"],
        "near_industrial_zone":  data.near_industrial_zone
                                 if data.near_industrial_zone is not None
                                 else round(p["near_industrial_zone"]),
    }

def run_prediction(filled: dict) -> float:
    df_in  = pd.DataFrame([filled])
    enc    = pd.get_dummies(df_in, columns=["city","land_type"], drop_first=False)
    for col in trained_columns:
        if col not in enc.columns: enc[col] = 0
    enc    = enc[trained_columns]
    scaled = scaler.transform(enc)
    return round(float(np.expm1(model_log.predict(scaled))[0]), 2)

@app.post("/predict")
def predict_price(data: PredictRequest):
    filled = fill_profile(data)
    return {
        "city": filled["city"], "land_type": filled["land_type"],
        "year": filled["year"], "predictedPricePerSqft": run_prediction(filled),
        "parameters": {k:v for k,v in filled.items() if k not in ["city","land_type","year"]},
    }

@app.post("/predict/forecast")
def predict_forecast(data: PredictRequest):
    filled = fill_profile(data)
    return {
        "city": filled["city"], "land_type": filled["land_type"],
        "parameters": {k:v for k,v in filled.items() if k not in ["city","land_type","year"]},
        "forecast": [
            {"year": y, "predictedPricePerSqft": run_prediction({**filled, "year": y})}
            for y in range(2024, 2031)
        ],
    }

@app.post("/predict/all-types")
def predict_all_types(data: PredictRequest):
    return {
        "city": data.city, "year": data.year,
        "prices": {
            lt: run_prediction(fill_profile(PredictRequest(city=data.city, land_type=lt, year=data.year)))
            for lt in ["Residential","Commercial","Agricultural","Mixed-use"]
        },
    }

@app.get("/health")
def health():
    return {"status": "ok", "cities": city_profiles.index.tolist()}
