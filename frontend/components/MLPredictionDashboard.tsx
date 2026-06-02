"use client";
import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { useMLForecast, useAllTypePrices } from "@/hooks/useMLPredictions";
Chart.register(...registerables);

const LAND_TYPES = ["Residential","Commercial","Agricultural","Mixed-use"] as const;
const TYPE_COLORS: Record<string, string> = {
  Residential:"#2ecc71", Commercial:"#3498db",
  Agricultural:"#f39c12", "Mixed-use":"#9b59b6",
};

export default function MLPredictionDashboard({ regionId }: { regionId: number }) {
  const [activeLandType, setActiveLandType] = useState("Residential");
  const { data: forecast, loading: fLoading, error: fError } = useMLForecast(regionId, activeLandType);
  const { data: allTypes, loading: aLoading }                 = useAllTypePrices(regionId);
  const chartRef  = useRef<HTMLCanvasElement>(null);
  const chartInst = useRef<Chart | null>(null);

  useEffect(() => {
    if (!forecast || !chartRef.current) return;
    if (chartInst.current) chartInst.current.destroy();
    
    // Dynamically adjust to theme
    const isDark = typeof document !== 'undefined' && document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? "#a0aec0" : "#718096";
    const gridColor = isDark ? "#4a5568" : "#e2e8f0";

    const color  = TYPE_COLORS[activeLandType];
    chartInst.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels:   forecast.forecast.map(f => String(f.year)),
        datasets: [{
          label:           `${activeLandType} ₹/sqft`,
          data:            forecast.forecast.map(f => f.predictedPricePerSqft),
          borderColor:     color,
          backgroundColor: `${color}18`,
          borderWidth: 2.5, pointRadius: 5, pointHoverRadius: 8,
          tension: 0.4, fill: true,
          pointBackgroundColor: color,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600, easing: "easeInOutQuart" },
        plugins: {
          legend: { labels: { color: textColor, font: { size: 13, family: "'Poppins', sans-serif" } } },
          tooltip: {
            backgroundColor: "rgba(0,0,0,0.8)", titleColor: "#fff",
            bodyColor: "#fff", borderColor: color, borderWidth: 1,
            callbacks: { label: ctx => ` ₹${(ctx.parsed.y ?? 0).toLocaleString("en-IN")} per sqft` },
          },
        },
        scales: {
          x: { ticks:{color: textColor}, grid:{color: gridColor} },
          y: {
            ticks:{ color: textColor, callback: v => `₹${Number(v).toLocaleString("en-IN")}` },
            grid:{ color: gridColor },
          },
        },
      },
    });
    return () => { chartInst.current?.destroy(); };
  }, [forecast, activeLandType]);

  const params = forecast?.parameters;
  const envBadges = params ? [
    { label:"AQI",           value: params.aqi,                   unit:"",    icon:"fas fa-smog" },
    { label:"Green Cover",   value: Number(params.green_cover_percent).toFixed(1),   unit:"%",   icon:"fas fa-tree" },
    { label:"Water Quality", value: Number(params.water_quality_index).toFixed(1),   unit:"",    icon:"fas fa-tint" },
    { label:"Flood Risk",    value: Number(params.flood_risk_score).toFixed(1),      unit:"",    icon:"fas fa-water" },
    { label:"Dist. Highway", value: Number(params.dist_expressway_km).toFixed(1),    unit:" km", icon:"fas fa-road" },
    { label:"Dist. Metro",   value: Number(params.dist_metro_railway_km).toFixed(1), unit:" km", icon:"fas fa-train" },
  ] : [];

  return (
    <div className="card" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '4px solid #9b59b6' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <i className="fas fa-brain" style={{ color: '#9b59b6' }}></i> ML Price Forecast
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Ridge Regression Model · 2024–2030 
            {forecast?.city && <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>· {forecast.city}</span>}
          </p>
        </div>
        
        {/* Type toggle buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {LAND_TYPES.map(lt => (
            <button key={lt} onClick={() => setActiveLandType(lt)} style={{
              padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s', border: `1px solid ${activeLandType === lt ? 'transparent' : 'var(--border-color)'}`,
              backgroundColor: activeLandType === lt ? TYPE_COLORS[lt] : 'transparent',
              color: activeLandType === lt ? '#fff' : 'var(--text-secondary)'
            }}>
              {lt}
            </button>
          ))}
        </div>
      </div>

      {/* Current Prices Row */}
      {!aLoading && allTypes && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {LAND_TYPES.map(lt => (
            <div key={lt} onClick={() => setActiveLandType(lt)} style={{
              padding: '1rem', borderRadius: '12px', border: `1px solid ${activeLandType === lt ? TYPE_COLORS[lt] : 'var(--border-color)'}`,
              background: activeLandType === lt ? `${TYPE_COLORS[lt]}15` : 'var(--box-bg, rgba(0,0,0,0.02))', cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: activeLandType === lt ? `0 4px 12px ${TYPE_COLORS[lt]}20` : 'none'
            }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{lt}</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0.3rem 0', color: 'var(--text-color)' }}>
                ₹{allTypes.prices[lt as keyof typeof allTypes.prices]?.toLocaleString("en-IN")}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Current Avg / sqft</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart Section */}
      <div style={{ position: 'relative', height: '320px', background: 'var(--hover-bg)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-color)' }}>
        {fLoading && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--card-bg)', zIndex: 10, borderRadius: '12px' }}>
            <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Fetching ML predictions...</p>
          </div>
        )}
        {fError && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--card-bg)', zIndex: 10, borderRadius: '12px', border: '1px solid var(--danger-color)' }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', color: 'var(--danger-color)' }}></i>
            <p style={{ marginTop: '1rem', color: 'var(--text-color)', fontWeight: 600 }}>{fError}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Next.js API proxy error — ensure port 5000 is open</p>
          </div>
        )}
        {!fLoading && !fError && <canvas ref={chartRef} style={{ width: '100%', height: '100%' }}/>}
      </div>

      {/* Badges Section */}
      {envBadges.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            Current Environmental Parameters Used
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem' }}>
            {envBadges.map(b => (
              <div key={b.label} style={{ background: 'var(--hover-bg)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <i className={b.icon} style={{ fontSize: '1.2rem', color: '#9b59b6', marginBottom: '0.5rem' }}></i>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-color)' }}>{b.value}{b.unit}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, marginTop: '0.2rem' }}>{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
