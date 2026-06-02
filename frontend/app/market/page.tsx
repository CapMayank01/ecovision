'use client';

import { useState, useMemo } from 'react';
import PredictionChart from '@/components/charts/PredictionChart';
import { useCityComparison, useCityAnalysis } from '@/hooks/useLandMarket';
import MLPredictionDashboard from '@/components/MLPredictionDashboard';

const formatPrice = (p: number | null) => (p != null ? `₹${p.toLocaleString('en-IN')}` : '—');
const formatPct = (v: number | null) => (v != null ? `${v.toFixed(1)}%` : '—');
const formatScore = (v: number | null) => (v != null ? v.toFixed(1) : '—');

export default function MarketPage() {
  const { cities, loading, error } = useCityComparison();
  const [selectedCity, setSelectedCity] = useState<number | null>(null);

  const city = useMemo(() => {
    if (cities.length && selectedCity === null) setSelectedCity(cities[0].regionId);
    return cities.find((c) => c.regionId === selectedCity) ?? cities[0] ?? null;
  }, [cities, selectedCity]);

  const { analysis } = useCityAnalysis(selectedCity);

  const chartLabels = useMemo(() => {
    if (!city) return [];
    const hist = city.historicalPrices.map((h) => String(h.year));
    const pred = city.predictions.map((p) => String(p.year));
    return [...hist, ...pred];
  }, [city]);

  const priceDatasets = useMemo(() => {
    if (!city) return [];
    const histPrices = city.historicalPrices.map((h) => h.price);
    const predPrices = city.predictions.map((p) => p.price);
    const envScores = city.predictions.map((p) => p.envScore);
    return [
      {
        label: 'Historical Price (₹/sq ft)',
        data: [...histPrices, ...Array(predPrices.length).fill(null)],
        borderColor: 'rgba(46, 204, 113, 1)',
        backgroundColor: 'rgba(46, 204, 113, 0.15)',
        fill: true,
      },
      {
        label: 'Predicted Price (₹/sq ft)',
        data: [...Array(histPrices.length).fill(null), ...predPrices],
        borderColor: 'rgba(155, 89, 182, 1)',
        backgroundColor: 'rgba(155, 89, 182, 0.15)',
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Environmental Score (0–100)',
        data: [...Array(histPrices.length).fill(null), ...envScores],
        borderColor: 'rgba(241, 196, 15, 1)',
        backgroundColor: 'rgba(241, 196, 15, 0.08)',
        borderWidth: 2,
        yAxisID: 'y1',
      },
    ];
  }, [city]);

  if (loading) {
    return (
      <div className="section-header">
        <h1>Land Market Value Prediction</h1>
        <p>Loading market data…</p>
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="section-header">
        <h1>Land Market Value Prediction</h1>
        <p style={{ color: 'var(--danger)' }}>{error || 'No data available'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="section-header">
        <h1>Land Market Value Prediction</h1>
        <p>How environmental factors shape land prices across the Meerut–NCR belt</p>
      </div>

      {/* ── City selector + summary stats ── */}
      <div className="stats-container">
        <div className="stat-card" style={{ flex: '1.5' }}>
          <div className="stat-icon"><i className="fas fa-city"></i></div>
          <div className="stat-info">
            <h3>Select City</h3>
            <select
              id="market-city-select"
              value={selectedCity ?? ''}
              onChange={(e) => setSelectedCity(Number(e.target.value))}
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
              {cities.map((c) => (
                <option key={c.regionId} value={c.regionId}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-rupee-sign"></i></div>
          <div className="stat-info">
            <h3>Current Price</h3>
            <p className="stat-number">{formatPrice(city.currentPrice)}/sq ft</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-chart-line"></i></div>
          <div className="stat-info">
            <h3>2035 Predicted</h3>
            <p className="stat-number">{formatPrice(city.predictedPrice2035)}/sq ft</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-leaf"></i></div>
          <div className="stat-info">
            <h3>Env. Score</h3>
            <p className="stat-number">{formatScore(city.environmentalScore)}<small>/100</small></p>
          </div>
        </div>
      </div>

      {/* ── Price Trend Chart ── */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3><i className="fas fa-chart-area" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>Price Trend &amp; Environmental Score — {city.name}</h3>
        <PredictionChart
          id={`market-chart-${city.regionId}`}
          labels={chartLabels}
          datasets={priceDatasets}
          height="350px"
          scales={{
            y: { beginAtZero: false, title: { display: true, text: '₹ per sq ft' } },
            y1: { type: 'linear', display: true, position: 'right', beginAtZero: false, max: 100, title: { display: true, text: 'Env. Score' }, grid: { drawOnChartArea: false } },
            x: { title: { display: true, text: 'Year' } },
          }}
        />
      </div>

      {/* ── Environmental Factors Panel ── */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3><i className="fas fa-binoculars" style={{ marginRight: '0.5rem', color: 'var(--warning)' }}></i>Environmental Factors — {city.name}</h3>
        <div className="sources-grid" style={{ marginTop: '1rem' }}>
          {[
            { icon: 'fas fa-smog', title: 'Air Quality (AQI)', value: city.aqi != null ? city.aqi.toFixed(0) : '—', desc: 'Lower is better. Stubble burning & industrial emissions spike AQI in winters across the NCR belt.', color: (city.aqi ?? 0) > 200 ? '#e74c3c' : (city.aqi ?? 0) > 100 ? '#f39c12' : '#2ecc71' },
            { icon: 'fas fa-tree', title: 'Green Cover', value: `${formatScore(city.greenCoverPercent)}%`, desc: 'Percentage of region with vegetation. Rapid urbanization reduces green cover, increasing heat island effect.', color: (city.greenCoverPercent ?? 0) > 20 ? '#2ecc71' : (city.greenCoverPercent ?? 0) > 10 ? '#f39c12' : '#e74c3c' },
            { icon: 'fas fa-tint', title: 'Water Quality', value: `${formatScore(city.waterQualityIndex)}/100`, desc: 'Higher is better. Hindon river pollution and industrial effluents drag down scores in western UP.', color: (city.waterQualityIndex ?? 0) > 60 ? '#2ecc71' : (city.waterQualityIndex ?? 0) > 40 ? '#f39c12' : '#e74c3c' },
            { icon: 'fas fa-water', title: 'Flood Risk', value: `${formatScore(city.floodRiskScore)}/100`, desc: 'Higher = more risk. Ganga floodplain cities face monsoon-driven flooding; urbanization worsens drainage.', color: (city.floodRiskScore ?? 0) > 50 ? '#e74c3c' : (city.floodRiskScore ?? 0) > 30 ? '#f39c12' : '#2ecc71' },
          ].map((f) => (
            <div className="source-card" key={f.title}>
              <div className="source-icon" style={{ color: f.color }}><i className={f.icon}></i></div>
              <h4>{f.title}</h4>
              <p style={{ fontSize: '1.6rem', fontWeight: 700, color: f.color, margin: '0.3rem 0' }}>{f.value}</p>
              <p style={{ fontSize: '0.82rem', opacity: 0.8 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why Prices Are Changing — NEW ── */}
      {analysis && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3>
            <i className="fas fa-search-dollar" style={{ marginRight: '0.5rem', color: '#9b59b6' }}></i>
            Why Prices Are Changing — {analysis.region.name}
          </h3>
          <p style={{ fontSize: '0.88rem', opacity: 0.7, marginBottom: '1rem' }}>{analysis.region.description}</p>

          {/* Summary verdict */}
          <div className="analysis-verdict" style={{
            display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap',
          }}>
            <div className="analysis-verdict-card" style={{
              flex: 1, minWidth: '200px', padding: '1rem 1.2rem', borderRadius: '12px',
              background: analysis.summary.netDirection === 'up'
                ? 'linear-gradient(135deg, rgba(46,204,113,0.12), rgba(46,204,113,0.03))'
                : 'linear-gradient(135deg, rgba(231,76,60,0.12), rgba(231,76,60,0.03))',
              border: `1px solid ${analysis.summary.netDirection === 'up' ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
            }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.3rem' }}>Net Price Direction</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: analysis.summary.netDirection === 'up' ? '#2ecc71' : '#e74c3c' }}>
                {analysis.summary.netDirection === 'up' ? '📈 Prices Rising' : '📉 Prices Falling'}
              </div>
              <div style={{ fontSize: '0.82rem', marginTop: '0.3rem', opacity: 0.8 }}>
                {analysis.summary.priceUpFactors} factors pushing up · {analysis.summary.priceDownFactors} pushing down
              </div>
            </div>
            <div style={{
              flex: 1, minWidth: '200px', padding: '1rem 1.2rem', borderRadius: '12px',
              background: 'var(--card-bg)', border: '1px solid var(--border-color)',
            }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.3rem' }}>Price Forecast</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                {formatPrice(analysis.summary.currentPrice)} → {formatPrice(analysis.summary.predictedPrice)}
              </div>
              <div style={{ fontSize: '0.82rem', marginTop: '0.3rem', opacity: 0.8 }}>
                Env. Score: {formatScore(analysis.summary.environmentalScore)}/100
              </div>
            </div>
          </div>

          {/* Factor cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {analysis.factors.map((f) => (
              <div key={f.id} className="analysis-factor-card" style={{
                padding: '1rem 1.2rem', borderRadius: '10px',
                background: 'var(--card-bg)', border: '1px solid var(--border-color)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                  background: f.priceDirection === 'up' ? '#2ecc71' : f.priceDirection === 'down' ? '#e74c3c' : '#f39c12',
                }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, paddingLeft: '0.5rem' }}>{f.title}</h4>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px',
                    whiteSpace: 'nowrap', flexShrink: 0,
                    background: f.priceDirection === 'up' ? 'rgba(46,204,113,0.15)' : f.priceDirection === 'down' ? 'rgba(231,76,60,0.15)' : 'rgba(241,196,15,0.15)',
                    color: f.priceDirection === 'up' ? '#2ecc71' : f.priceDirection === 'down' ? '#e74c3c' : '#f39c12',
                  }}>
                    {f.priceDirection === 'up' ? '↑ Price Up' : f.priceDirection === 'down' ? '↓ Price Down' : '→ Neutral'}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', opacity: 0.8, margin: '0 0 0.5rem 0.5rem', lineHeight: 1.5 }}>{f.description}</p>
                <div style={{ display: 'flex', gap: '0.8rem', paddingLeft: '0.5rem', fontSize: '0.78rem', opacity: 0.6 }}>
                  <span><i className="fas fa-tag" style={{ marginRight: '0.3rem' }}></i>{f.factorType}</span>
                  <span><i className="fas fa-bolt" style={{ marginRight: '0.3rem' }}></i>Impact: {f.impactScore}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── City Comparison Table ── */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3><i className="fas fa-balance-scale" style={{ marginRight: '0.5rem', color: 'var(--accent-color, #9b59b6)' }}></i>City Comparison — Meerut Region</h3>
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={thStyle}>City</th>
                <th style={thStyle}>Price (₹/sqft)</th>
                <th style={thStyle}>2035 Pred.</th>
                <th style={thStyle}>AQI</th>
                <th style={thStyle}>Green %</th>
                <th style={thStyle}>Water Idx</th>
                <th style={thStyle}>Flood Risk</th>
                <th style={thStyle}>Env. Score</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((c) => (
                <tr
                  key={c.regionId}
                  onClick={() => setSelectedCity(c.regionId)}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    background: c.regionId === selectedCity ? 'var(--hover-color, rgba(46,204,113,0.08))' : 'transparent',
                    transition: 'background 0.2s',
                  }}
                >
                  <td style={tdStyle}><strong>{c.name}</strong></td>
                  <td style={tdStyle}>{formatPrice(c.currentPrice)}</td>
                  <td style={tdStyle}>{formatPrice(c.predictedPrice2035)}</td>
                  <td style={{ ...tdStyle, color: (c.aqi ?? 0) > 200 ? '#e74c3c' : '#f39c12' }}>{c.aqi?.toFixed(0) ?? '—'}</td>
                  <td style={tdStyle}>{formatPct(c.greenCoverPercent)}</td>
                  <td style={tdStyle}>{formatScore(c.waterQualityIndex)}</td>
                  <td style={{ ...tdStyle, color: (c.floodRiskScore ?? 0) > 50 ? '#e74c3c' : '#2ecc71' }}>{formatScore(c.floodRiskScore)}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{formatScore(c.environmentalScore)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ML Price Forecast Dashboard ── */}
      {selectedCity && (
        <div style={{ marginTop: '1.5rem' }}>
          <MLPredictionDashboard regionId={selectedCity} />
        </div>
      )}
    </>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '0.6rem 0.8rem', fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: '0.6rem 0.8rem' };
