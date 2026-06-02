'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

/** Single cause item returned by the API */
export interface CauseItem {
  title: string;
  description: string;
  impactScore: number;
}

/** Grouped response from GET /api/causes/:regionId */
export interface CausesResponse {
  local: CauseItem[];
  seasonal: CauseItem[];
  global: CauseItem[];
}

export function useCauses(regionId: number | null) {
  const [causes, setCauses] = useState<CausesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!regionId) return;

    const fetchCauses = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<CausesResponse>(`/api/causes/${regionId}`);
        setCauses(data);
      } catch (err) {
        setError('Failed to fetch environmental causes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCauses();
  }, [regionId]);

  return { causes, loading, error };
}
