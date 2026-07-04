import { useState, useEffect } from "react";
import api from "../lib/api";

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

export function useMLForecast(regionId: number, landType = "Residential") {
  const [data,    setData]    = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  useEffect(() => {
    if (!regionId) return;
    setLoading(true); setError(null);
    api.get(`/api/ml/${regionId}/forecast?landType=${landType}`)
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
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
    api.get(`/api/ml/${regionId}/all-types`)
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, [regionId]);
  return { data, loading, error };
}
