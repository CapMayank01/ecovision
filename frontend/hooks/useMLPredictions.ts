import { useState, useEffect } from "react";

export interface ForecastPoint {
  year:                  number;
  predictedPricePerSqft: number;
}
export interface AllTypePrices {
  Residential: number; Commercial: number;
  Agricultural: number; "Mixed-use": number;
}
export interface ForecastData {
  city: string; land_type: string;
  parameters: Record<string, number>;
  forecast: ForecastPoint[];
}

const BASE = "/api/ml";

export function useMLForecast(regionId: number, landType = "Residential") {
  const [data,    setData]    = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  useEffect(() => {
    if (!regionId) return;
    setLoading(true); setError(null);
    fetch(`${BASE}/${regionId}/forecast?landType=${landType}`)
      .then(r => { if (!r.ok) throw new Error("Forecast fetch failed"); return r.json(); })
      .then(setData).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [regionId, landType]);
  return { data, loading, error };
}

export function useAllTypePrices(regionId: number) {
  const [data,    setData]    = useState<{ city: string; prices: AllTypePrices } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  useEffect(() => {
    if (!regionId) return;
    setLoading(true);
    fetch(`${BASE}/${regionId}/all-types`)
      .then(r => { if (!r.ok) throw new Error("All-types fetch failed"); return r.json(); })
      .then(setData).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [regionId]);
  return { data, loading, error };
}
