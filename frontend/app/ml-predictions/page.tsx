'use client';

import { useState, useEffect } from 'react';
import MLPredictionDashboard from '@/components/MLPredictionDashboard';
import { useCityComparison } from '@/hooks/useLandMarket';

export default function MLPredictionsPage() {
  const { cities, loading, error } = useCityComparison();
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

  useEffect(() => {
    if (cities.length && selectedRegion === null) {
      setSelectedRegion(cities[0].regionId);
    }
  }, [cities, selectedRegion]);

  if (loading) {
    return (
      <div className="section-header">
        <h1>ML Price Predictions</h1>
        <p>Loading predictions...</p>
      </div>
    );
  }

  if (error || !cities.length) {
    return (
      <div className="section-header">
        <h1>ML Price Predictions</h1>
        <p style={{ color: 'var(--danger-color, #e74c3c)' }}>{error || 'No regions available'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="section-header">
        <h1>ML Price Predictions</h1>
        <p>AI-powered land price forecasts using Ridge Regression across environmental parameters</p>
      </div>

      {/* Region Selector */}
      <div className="stats-container">
        <div className="stat-card" style={{ flex: '1.5' }}>
          <div className="stat-icon"><i className="fas fa-map-marker-alt"></i></div>
          <div className="stat-info">
            <h3>Select Region</h3>
            <select
              id="ml-region-select"
              value={selectedRegion ?? ''}
              onChange={(e) => setSelectedRegion(Number(e.target.value))}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--card-bg)',
                color: 'var(--text-color)',
                fontSize: '0.95rem',
                width: '100%',
              }}
            >
              {cities.map((r) => (
                <option key={r.regionId} value={r.regionId}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-brain" style={{ color: '#9b59b6' }}></i></div>
          <div className="stat-info">
            <h3>Model</h3>
            <p className="stat-number" style={{ fontSize: '1rem' }}>Ridge Regression</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-calendar-alt" style={{ color: '#3498db' }}></i></div>
          <div className="stat-info">
            <h3>Forecast Range</h3>
            <p className="stat-number" style={{ fontSize: '1rem' }}>2024 – 2030</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-leaf" style={{ color: '#2ecc71' }}></i></div>
          <div className="stat-info">
            <h3>Parameters</h3>
            <p className="stat-number" style={{ fontSize: '1rem' }}>7 Environmental</p>
          </div>
        </div>
      </div>

      {/* ML Dashboard */}
      {selectedRegion && <MLPredictionDashboard regionId={selectedRegion} />}
    </>
  );
}
