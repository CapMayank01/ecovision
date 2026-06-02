'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Region {
  regionId: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  areaSqkm: number;
  description: string | null;
  historicalData: Array<{
    dataId: number;
    year: number;
    forestCoverSqkm: number | null;
    glacierAreaSqkm: number | null;
    temperatureCelsius: number | null;
    precipitationMm: number | null;
  }>;
}

export function useRegions() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const { data } = await api.get('/api/regions');
        setRegions(data);
      } catch (err) {
        setError('Failed to fetch regions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  return { regions, loading, error };
}

export function useRegion(id: number | null) {
  const [region, setRegion] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRegion = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/regions/${id}`);
        setRegion(data);
      } catch (err) {
        setError('Failed to fetch region');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegion();
  }, [id]);

  return { region, loading, error };
}
