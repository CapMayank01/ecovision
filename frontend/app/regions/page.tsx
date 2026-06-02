'use client';

import Link from 'next/link';
import { useRegions } from '@/hooks/useRegions';

export default function RegionsPage() {
  const { regions, loading, error } = useRegions();

  return (
    <>
      <div className="section-header">
        <h1>Environmental Regions</h1>
        <p>Explore environmental profiles, forest cover, and land statistics across tracked locations.</p>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="typing-indicator" style={{ background: 'transparent' }}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>Loading cloud database regions...</p>
        </div>
      )}

      {error && (
        <div className="card" style={{ borderLeft: '4px solid var(--danger-color)' }}>
          <h3>Connection Error</h3>
          <p style={{ color: 'var(--danger-color)' }}>{error}. Please check if the Render API and database are online.</p>
        </div>
      )}

      {!loading && !error && regions.length === 0 && (
        <div className="card">
          <h3>No Regions Found</h3>
          <p>The database has successfully connected, but no regions were found in the table. Try seeding the database.</p>
        </div>
      )}

      {!loading && !error && regions.length > 0 && (
        <div className="hotspots-grid">
          {regions.map((region) => (
            <div key={region.regionId} className="hotspot-card">
              <h4>{region.name}</h4>
              <div className="hotspot-stats">
                <div className="hotspot-stat">
                  <span>Type</span>
                  <span className={`risk ${region.type.toLowerCase() === 'urban' ? 'high' : 'low'}`} style={{ textTransform: 'capitalize' }}>
                    {region.type}
                  </span>
                </div>
                <div className="hotspot-stat">
                  <span>Area</span>
                  <span>{region.areaSqkm.toLocaleString()} km²</span>
                </div>
                <div className="hotspot-stat">
                  <span>Location</span>
                  <span style={{ fontSize: '0.85rem' }}>
                    {region.latitude.toFixed(4)}° N, {region.longitude.toFixed(4)}° E
                  </span>
                </div>
                {region.description && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <p>{region.description}</p>
                  </div>
                )}
              </div>
              <Link href={`/search?q=${encodeURIComponent(region.name)}`} style={{ width: '100%', textDecoration: 'none' }}>
                <button className="view-details-btn" type="button">
                  View Snapshots &amp; Predictions <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
