'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Prediction {
  predictionId: number;
  regionId: number;
  year: number;
  forestCoverSqkm: number | null;
  glacierAreaSqkm: number | null;
  temperatureCelsius: number | null;
  precipitationMm: number | null;
  confidenceLevel: number | null;
  calculationMethod: string;
}

export function usePredictions(regionId?: number) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const params = regionId ? `?regionId=${regionId}` : '';
        const { data } = await api.get(`/api/predictions${params}`);
        setPredictions(data);
      } catch (err) {
        setError('Failed to fetch predictions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [regionId]);

  return { predictions, loading, error };
}
