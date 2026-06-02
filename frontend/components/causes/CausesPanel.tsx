'use client';

import { useCauses, CauseItem } from '@/hooks/useCauses';

interface CausesPanelProps {
  regionId: number;
}

/** Colour + icon config per factor type */
const FACTOR_META: Record<string, { label: string; icon: string; color: string; bgLight: string }> = {
  local:    { label: 'Local',    icon: 'fas fa-map-marker-alt', color: '#e74c3c', bgLight: 'rgba(231, 76, 60, 0.10)' },
  seasonal: { label: 'Seasonal', icon: 'fas fa-cloud-sun',      color: '#f39c12', bgLight: 'rgba(243, 156, 18, 0.10)' },
  global:   { label: 'Global',   icon: 'fas fa-globe',          color: '#3498db', bgLight: 'rgba(52, 152, 219, 0.10)' },
};

function ImpactBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="causes-impact-bar-track">
      <div
        className="causes-impact-bar-fill"
        style={{ width: `${Math.min(score, 100)}%`, background: color }}
      />
      <span className="causes-impact-bar-label" style={{ color }}>{score}%</span>
    </div>
  );
}

function CauseCard({ item, color }: { item: CauseItem; color: string }) {
  return (
    <div className="causes-card">
      <div className="causes-card-header">
        <h4 className="causes-card-title">{item.title}</h4>
        <ImpactBar score={item.impactScore} color={color} />
      </div>
      <p className="causes-card-desc">{item.description}</p>
    </div>
  );
}

/** Visual contribution bar across all three categories */
function ContributionBar({ local, seasonal, global }: { local: number; seasonal: number; global: number }) {
  const total = local + seasonal + global;
  if (total === 0) return null;

  const pLocal    = Math.round((local / total) * 100);
  const pSeasonal = Math.round((seasonal / total) * 100);
  const pGlobal   = 100 - pLocal - pSeasonal; // avoids rounding overflow

  return (
    <div className="causes-contribution">
      <h4 className="causes-contribution-title">Impact Contribution Breakdown</h4>
      <div className="causes-contribution-bar">
        {pLocal > 0 && (
          <div className="causes-contribution-segment" style={{ width: `${pLocal}%`, background: FACTOR_META.local.color }} title={`Local: ${pLocal}%`}>
            {pLocal >= 10 && <span>{pLocal}%</span>}
          </div>
        )}
        {pSeasonal > 0 && (
          <div className="causes-contribution-segment" style={{ width: `${pSeasonal}%`, background: FACTOR_META.seasonal.color }} title={`Seasonal: ${pSeasonal}%`}>
            {pSeasonal >= 10 && <span>{pSeasonal}%</span>}
          </div>
        )}
        {pGlobal > 0 && (
          <div className="causes-contribution-segment" style={{ width: `${pGlobal}%`, background: FACTOR_META.global.color }} title={`Global: ${pGlobal}%`}>
            {pGlobal >= 10 && <span>{pGlobal}%</span>}
          </div>
        )}
      </div>
      <div className="causes-contribution-legend">
        {[
          { key: 'local', pct: pLocal },
          { key: 'seasonal', pct: pSeasonal },
          { key: 'global', pct: pGlobal },
        ].map(({ key, pct }) => (
          <div key={key} className="causes-legend-item">
            <span className="causes-legend-dot" style={{ background: FACTOR_META[key].color }} />
            <span>{FACTOR_META[key].label}: {pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CausesPanel({ regionId }: CausesPanelProps) {
  const { causes, loading, error } = useCauses(regionId);

  if (loading) {
    return (
      <div className="card causes-panel">
        <h3><i className="fas fa-search-plus" /> Environmental Cause Analysis</h3>
        <div className="causes-loading">
          <div className="causes-spinner" />
          <p>Loading cause factors…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card causes-panel">
        <h3><i className="fas fa-search-plus" /> Environmental Cause Analysis</h3>
        <p className="causes-error">{error}</p>
      </div>
    );
  }

  if (!causes) return null;

  // Compute average impact per category for the contribution bar
  const avg = (items: CauseItem[]) =>
    items.length > 0 ? items.reduce((s, i) => s + i.impactScore, 0) / items.length : 0;

  const avgLocal    = avg(causes.local);
  const avgSeasonal = avg(causes.seasonal);
  const avgGlobal   = avg(causes.global);

  return (
    <div className="card causes-panel" id="causes-panel">
      <h3><i className="fas fa-search-plus" /> Environmental Cause Analysis</h3>
      <p className="causes-subtitle">Understanding <strong>why</strong> environmental changes are happening</p>

      <ContributionBar local={avgLocal} seasonal={avgSeasonal} global={avgGlobal} />

      <div className="causes-sections">
        {(['local', 'seasonal', 'global'] as const).map((factorType) => {
          const meta  = FACTOR_META[factorType];
          const items = causes[factorType];
          if (items.length === 0) return null;

          return (
            <div key={factorType} className="causes-section">
              <div className="causes-section-header" style={{ borderLeftColor: meta.color }}>
                <i className={meta.icon} style={{ color: meta.color }} />
                <h4>{meta.label} Factors</h4>
                <span className="causes-section-count" style={{ background: meta.bgLight, color: meta.color }}>
                  {items.length}
                </span>
              </div>
              <div className="causes-cards-list">
                {items.map((item) => (
                  <CauseCard key={item.title} item={item} color={meta.color} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
