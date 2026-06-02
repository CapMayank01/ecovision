'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface MarketDataPoint {
  year: number;
  avgPricePerSqft: number;
  aqi: number | null;
  greenCoverPercent: number | null;
  waterQualityIndex: number | null;
  floodRiskScore: number | null;
  industrialProximity: number | null;
}

interface PredictionPoint {
  year: number;
  predictedPricePerSqft: number;
  environmentalScore: number;
  priceChangePercent: number | null;
  confidenceLevel: number | null;
}

interface CityComparison {
  regionId: number;
  name: string;
  latitude: number;
  longitude: number;
  currentPrice: number | null;
  currentYear: number | null;
  aqi: number | null;
  greenCoverPercent: number | null;
  waterQualityIndex: number | null;
  floodRiskScore: number | null;
  predictedPrice2035: number | null;
  environmentalScore: number | null;
  historicalPrices: { year: number; price: number }[];
  predictions: { year: number; price: number; envScore: number }[];
}

export function useLandMarketData(regionId: number | null) {
  const [marketData, setMarketData] = useState<MarketDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!regionId) return;
    setLoading(true);
    api.get(`/api/land-market/${regionId}`)
      .then(({ data }) => setMarketData(data.marketData))
      .catch(() => setError('Failed to fetch land market data'))
      .finally(() => setLoading(false));
  }, [regionId]);

  return { marketData, loading, error };
}

export function useLandPredictions(regionId: number | null) {
  const [predictions, setPredictions] = useState<PredictionPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!regionId) return;
    setLoading(true);
    api.get(`/api/land-market/${regionId}/predictions`)
      .then(({ data }) => setPredictions(data))
      .catch(() => setError('Failed to fetch predictions'))
      .finally(() => setLoading(false));
  }, [regionId]);

  return { predictions, loading, error };
}

export function useCityComparison() {
  const [cities, setCities] = useState<CityComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/api/land-market/compare')
      .then(({ data }) => setCities(data))
      .catch(() => setError('Failed to fetch comparison data'))
      .finally(() => setLoading(false));
  }, []);

  return { cities, loading, error };
}

interface AnalysisFactor {
  id: number;
  title: string;
  description: string;
  factorType: string;
  impactScore: number;
  priceDirection: 'up' | 'down' | 'neutral';
}

interface AnalysisSummary {
  totalFactors: number;
  priceUpFactors: number;
  priceDownFactors: number;
  avgUpImpact: number;
  avgDownImpact: number;
  netDirection: 'up' | 'down';
  currentPrice: number | null;
  predictedPrice: number | null;
  environmentalScore: number | null;
}

interface CityAnalysis {
  region: { regionId: number; name: string; description: string };
  factors: AnalysisFactor[];
  summary: AnalysisSummary;
}

export function useCityAnalysis(regionId: number | null) {
  const [analysis, setAnalysis] = useState<CityAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!regionId) return;
    setLoading(true);
    setError(null);
    api.get(`/api/land-market/${regionId}/analysis`)
      .then(({ data }) => setAnalysis(data))
      .catch(() => setError('Failed to fetch analysis'))
      .finally(() => setLoading(false));
  }, [regionId]);

  return { analysis, loading, error };
}
