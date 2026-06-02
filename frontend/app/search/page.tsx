'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import WorldMap from '@/components/maps/WorldMap';
import PredictionChart from '@/components/charts/PredictionChart';

/** India-first locations: major cities, national overview, and the Himalayas */
const locations = [
  { name: 'Delhi NCR', type: 'City', coordinates: [28.6139, 77.209] as [number, number] },
  { name: 'Mumbai', type: 'City', coordinates: [19.076, 72.8777] as [number, number] },
  { name: 'Bengaluru', type: 'City', coordinates: [12.9716, 77.5946] as [number, number] },
  { name: 'Kolkata', type: 'City', coordinates: [22.5726, 88.3639] as [number, number] },
  { name: 'Chennai', type: 'City', coordinates: [13.0827, 80.2707] as [number, number] },
  { name: 'Hyderabad', type: 'City', coordinates: [17.385, 78.4867] as [number, number] },
  { name: 'Pune', type: 'City', coordinates: [18.5204, 73.8567] as [number, number] },
  { name: 'Ahmedabad', type: 'City', coordinates: [23.0225, 72.5714] as [number, number] },
  { name: 'Jaipur', type: 'City', coordinates: [26.9124, 75.7873] as [number, number] },
  { name: 'Kochi', type: 'City', coordinates: [9.9312, 76.2673] as [number, number] },
  { name: 'India', type: 'Country', coordinates: [20.5937, 78.9629] as [number, number] },
  { name: 'Himalayas', type: 'Mountain Range', coordinates: [28.5983, 83.9311] as [number, number] },
];

const environmentalData: Record<string, Record<string, string>> = {
  'Delhi NCR': {
    forest: 'Sparse urban green (~13% NCR green cover)',
    water: 'Yamuna basin; stressed summer flows',
    temperature: '25°C annual mean (hot summers, cool winters)',
    groundwater: 'Critical: declining in many blocks (CGWB)',
    topography: 'Indo-Gangetic plain; winter inversion traps smog',
    pollution: 'Very high PM2.5 in winter (NCAP non-attainment city)',
  },
  Mumbai: {
    forest: 'Sanjay Gandhi National Park + coastal mangroves',
    water: 'Arabian Sea coast; Mithi & urban flooding risk',
    temperature: '27°C annual mean (humid tropical)',
    groundwater: 'Coastal salinity intrusion in pockets',
    topography: 'Coastal plain with Western Ghats fringe',
    pollution: 'Moderate–high (traffic, construction dust, sea salt aerosols)',
  },
  Bengaluru: {
    forest: 'Garden city; loss of peri-urban tree cover',
    water: 'Lakes & Cauvery basin; urban stress',
    temperature: '24°C annual mean (mild plateau climate)',
    groundwater: 'Over-extraction in many wards',
    topography: 'Deccan plateau (~900 m)',
    pollution: 'Growing PM2.5 & dust from construction',
  },
  Kolkata: {
    forest: 'Limited urban green; Sunderbans delta nearby',
    water: 'Hooghly & Gangetic delta; cyclone & surge exposure',
    temperature: '26.5°C annual mean',
    groundwater: 'High water table; arsenic risk in rural WB',
    topography: 'Deltaic flatlands',
    pollution: 'Moderate–high (vehicles, brick kilns, winter haze)',
  },
  Chennai: {
    forest: 'Coastal vegetation; limited canopy in core city',
    water: 'Bay of Bengal; monsoon & reservoir dependent',
    temperature: '28.5°C annual mean',
    groundwater: 'Saline intrusion along coast',
    topography: 'Coastal plain',
    pollution: 'Moderate (vehicles, industry; sea breeze varies AQI)',
  },
  Hyderabad: {
    forest: 'Rocky terrain patches; green cover expanding in suburbs',
    water: 'Krishna–Godavari linked projects; lakes stressed',
    temperature: '26°C annual mean',
    groundwater: 'Declining in peri-urban belts',
    topography: 'Deccan plateau (granite hills)',
    pollution: 'Moderate–high (traffic growth, dust)',
  },
  Pune: {
    forest: 'Western Ghats fringe; monsoon catchment sensitive',
    water: 'Mutha & Khadakwasla basin',
    temperature: '24.5°C annual mean',
    groundwater: 'Stress in fringe villages',
    topography: 'Leeward side of Ghats',
    pollution: 'Moderate (vehicles, construction)',
  },
  Ahmedabad: {
    forest: 'Arid-region plantations; thorn scrub',
    water: 'Sabarmati; groundwater salinity westward',
    temperature: '27°C annual mean (hot dry summers)',
    groundwater: 'Overdraft in industrial belts',
    topography: 'Gujarat plains',
    pollution: 'Moderate–high (dust, industry, winter inversion)',
  },
  Jaipur: {
    forest: 'Arid scrub & Aravalli foothills',
    water: 'Seasonal; Bisalpur & groundwater',
    temperature: '25°C annual mean',
    groundwater: 'Declining in urban fringe',
    topography: 'Desert fringe / Aravalli hills',
    pollution: 'Moderate (dust storms, vehicles)',
  },
  Kochi: {
    forest: 'Coastal & backwater vegetation',
    water: 'Arabian Sea; backwaters & monsoon surplus',
    temperature: '27°C annual mean',
    groundwater: 'Generally better than inland metros',
    topography: 'Coastal Kerala',
    pollution: 'Lower than northern metros; traffic & humidity',
  },
  India: {
    forest: '~24% of land area (FSI estimates; regional variation)',
    water: '~4% surface water; monsoon-dependent',
    temperature: '~25°C national mean (diverse by region)',
    groundwater: 'Largest user globally; many blocks stressed',
    topography: 'Himalaya, Indo-Gangetic plain, Deccan, coasts, NE hills',
    pollution: 'NCAP cities; mixed AQI — IGP often highest PM2.5',
  },
  Himalayas: {
    forest: 'Alpine & temperate forests; elevation zonation',
    water: 'Glacier & snow-fed rivers (Ganga, Indus, Brahmaputra headwaters)',
    temperature: 'Strong vertical gradient; warming trends documented',
    groundwater: 'Valley aquifers; springs',
    topography: 'Young fold mountains; landslide & GLOF risk',
    pollution: 'Generally lower valley air; transboundary haze episodes',
  },
};

const riskData: Record<string, Record<string, number>> = {
  'Delhi NCR': { deforestation: 45, flood: 55, drought: 70, pollution: 92 },
  Mumbai: { deforestation: 40, flood: 85, drought: 35, pollution: 72 },
  Bengaluru: { deforestation: 55, flood: 45, drought: 65, pollution: 68 },
  Kolkata: { deforestation: 50, flood: 88, drought: 40, pollution: 70 },
  Chennai: { deforestation: 42, flood: 70, drought: 75, pollution: 62 },
  Hyderabad: { deforestation: 48, flood: 55, drought: 72, pollution: 70 },
  Pune: { deforestation: 52, flood: 48, drought: 68, pollution: 65 },
  Ahmedabad: { deforestation: 48, flood: 42, drought: 82, pollution: 75 },
  Jaipur: { deforestation: 58, flood: 35, drought: 88, pollution: 68 },
  Kochi: { deforestation: 38, flood: 78, drought: 30, pollution: 48 },
  India: { deforestation: 65, flood: 75, drought: 80, pollution: 85 },
  Himalayas: { deforestation: 50, flood: 60, drought: 40, pollution: 35 },
};

// From getRiskLabel() in app.js
function getRiskLabel(pct: number): string {
  if (pct < 30) return 'Low';
  if (pct < 60) return 'Medium';
  if (pct < 80) return 'High';
  return 'Critical';
}

function getRiskColor(pct: number): string {
  if (pct < 30) return 'var(--success-color)';
  if (pct < 60) return 'var(--warning-color)';
  if (pct < 80) return 'var(--danger-color)';
  return '#c0392b';
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<typeof locations>([]);
  const [selectedLocation, setSelectedLocation] = useState<(typeof locations)[0] | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Debounce timer (fixes bug #2 from original)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSearchInput = useCallback((value: string) => {
    setSearchTerm(value);

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      if (value.length >= 2) {
        const matches = locations.filter((l) =>
          l.name.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
        setSuggestions(matches);
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms debounce

    setDebounceTimer(timer);
  }, [debounceTimer]);

  const selectLocation = (loc: (typeof locations)[0]) => {
    setSelectedLocation(loc);
    setSearchTerm(loc.name);
    setSuggestions([]);
    setActiveTab('overview');
  };

  const handleSearchClick = () => {
    if (searchTerm.length >= 2) {
      const match = locations.find((l) => l.name.toLowerCase() === searchTerm.toLowerCase())
        || locations.find((l) => l.name.toLowerCase().includes(searchTerm.toLowerCase()));
      if (match) selectLocation(match);
    }
  };

  // Auto-search from URL param
  useEffect(() => {
    if (initialQuery) {
      handleSearchInput(initialQuery);
      const match = locations.find((l) => l.name.toLowerCase().includes(initialQuery.toLowerCase()));
      if (match) selectLocation(match);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const envData = selectedLocation ? (environmentalData[selectedLocation.name] || {}) : {};
  const risks = selectedLocation ? (riskData[selectedLocation.name] || { deforestation: 50, flood: 50, drought: 50, pollution: 50 }) : null;

  return (
    <>
      <div className="section-header">
        <h1>Search India — cities &amp; regions</h1>
        <p>
          Explore environmental snapshots for <strong>Delhi NCR</strong>, <strong>Mumbai</strong>, <strong>Bengaluru</strong>, and other major Indian cities,
          plus a national <strong>India</strong> overview and the <strong>Himalayas</strong>. Data are illustrative for learning — verify live AQI with CPCB / state boards.
        </p>
      </div>

      {/* Quick picks — India metros */}
      <div style={{ maxWidth: 600, margin: '0 auto 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
        {['Delhi NCR', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad'].map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              const loc = locations.find((l) => l.name === name);
              if (loc) selectLocation(loc);
            }}
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.85rem',
              borderRadius: 20,
              border: '1px solid var(--border-color)',
              background: 'var(--card-bg)',
              color: 'var(--text-color)',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
            }}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Search Box */}
      <div style={{ maxWidth: 600, margin: '0 auto 2rem', position: 'relative' }}>
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            placeholder="Try Delhi NCR, Mumbai, India, Himalayas..."
            value={searchTerm}
            onChange={(e) => handleSearchInput(e.target.value)}
            style={{
              flex: 1, padding: '1rem', border: '2px solid var(--border-color)',
              borderRadius: '8px 0 0 8px', outline: 'none', fontSize: '1rem',
              fontFamily: 'var(--font-family)', background: 'var(--card-bg)', color: 'var(--text-color)',
            }}
          />
          <button
            onClick={handleSearchClick}
            style={{
              padding: '0 1.5rem', background: 'var(--primary-color)', color: 'white',
              border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer',
              fontFamily: 'var(--font-family)',
            }}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>

        {suggestions.length > 0 && (
          <div style={{
            background: 'var(--card-bg)', borderRadius: '8px', boxShadow: 'var(--box-shadow)',
            marginTop: '0.5rem', overflow: 'hidden', position: 'absolute', width: '100%', zIndex: 10,
          }}>
            {suggestions.map((loc) => (
              <div
                key={loc.name}
                onClick={() => selectLocation(loc)}
                style={{
                  padding: '0.8rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)',
                  color: 'var(--text-color)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover-bg)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {loc.name} ({loc.type})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Location Results */}
      {selectedLocation && (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-color)', marginBottom: '0.5rem' }}>
              {selectedLocation.name}
            </h2>
            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>Type: {selectedLocation.type}</span>
              <span>Coordinates: {selectedLocation.coordinates[0].toFixed(2)}, {selectedLocation.coordinates[1].toFixed(2)}</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', overflowX: 'auto' }}>
            {['overview', 'satellite', 'historical', 'predictions', 'data'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.8rem 1.5rem', background: 'none', border: 'none',
                  borderBottom: activeTab === tab ? '3px solid var(--primary-color)' : '3px solid transparent',
                  color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-family)', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="card">
                <h3>Location Map</h3>
                <div style={{ height: 400 }}>
                  <WorldMap
                    id={`location-map-${selectedLocation.name}`}
                    center={selectedLocation.coordinates}
                    zoom={
                      selectedLocation.type === 'City'
                        ? 11
                        : selectedLocation.type === 'Country'
                          ? 5
                          : 7
                    }
                    markers={[{
                      position: selectedLocation.coordinates,
                      popup: `<b>${selectedLocation.name}</b><br>${selectedLocation.type}`,
                    }]}
                  />
                </div>
              </div>

              <div className="card">
                <h3>Environmental Statistics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  {[
                    { icon: 'fas fa-tree', label: 'Forest Cover', value: envData.forest },
                    { icon: 'fas fa-water', label: 'Water Bodies', value: envData.water },
                    { icon: 'fas fa-thermometer-half', label: 'Temperature', value: envData.temperature },
                    { icon: 'fas fa-arrow-down', label: 'Groundwater', value: envData.groundwater },
                    { icon: 'fas fa-mountain', label: 'Topography', value: envData.topography },
                    { icon: 'fas fa-smog', label: 'Pollution', value: envData.pollution },
                  ].map((stat) => (
                    <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <i className={stat.icon} style={{
                        fontSize: '1.5rem', color: 'var(--primary-color)',
                        background: 'rgba(44, 120, 115, 0.1)',
                        width: 50, height: 50, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}></i>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{stat.label}</h4>
                        <p style={{ fontWeight: 500, color: 'var(--text-color)' }}>{stat.value || 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {risks && (
                <div className="card">
                  <h3>Risk Indicators</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {Object.entries(risks).map(([key, val]) => (
                      <div key={key}>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                          {key} Risk
                        </h4>
                        <div style={{ height: 8, background: 'var(--border-color)', borderRadius: 4, overflow: 'hidden', marginBottom: '0.5rem' }}>
                          <div style={{ height: '100%', width: `${val}%`, background: getRiskColor(val), borderRadius: 4 }}></div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{getRiskLabel(val)} ({val}%)</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Satellite Tab */}
          {activeTab === 'satellite' && (
            <div className="card">
              <h3>Satellite View</h3>
              <div style={{ height: 500 }}>
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 'none', borderRadius: 8 }}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedLocation.name + ', India')}&t=k&z=${selectedLocation.type === 'City' ? 12 : selectedLocation.type === 'Country' ? 5 : 7}&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                  title={`Satellite view of ${selectedLocation.name}`}
                ></iframe>
              </div>
            </div>
          )}

          {/* Historical Tab */}
          {activeTab === 'historical' && (
            <div className="card">
              <h3>Historical Environmental Data</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <PredictionChart
                  id={`forest-history-${selectedLocation.name}`}
                  labels={['2000', '2005', '2010', '2015', '2020']}
                  datasets={[{
                    label: 'Forest Cover (%)',
                    data: [33, 32, 31, 30, 29],
                    borderColor: 'rgba(39, 174, 96, 1)',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                  }]}
                  scales={{ y: { title: { display: true, text: 'Forest Cover (%)' } } }}
                  height="250px"
                />
                <PredictionChart
                  id={`temp-history-${selectedLocation.name}`}
                  labels={['2000', '2005', '2010', '2015', '2020']}
                  datasets={[{
                    label: 'Temperature (°C)',
                    data: [14.1, 14.3, 14.5, 14.7, 14.9],
                    borderColor: 'rgba(231, 76, 60, 1)',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                  }]}
                  scales={{ y: { title: { display: true, text: 'Temperature (°C)' } } }}
                  height="250px"
                />
              </div>
            </div>
          )}

          {/* Predictions Tab */}
          {activeTab === 'predictions' && (
            <div className="card">
              <h3>Environmental Predictions (2020-2050)</h3>
              <PredictionChart
                id={`prediction-${selectedLocation.name}`}
                labels={['2020', '2025', '2030', '2035', '2040', '2045', '2050']}
                datasets={[
                  { label: 'Forest Cover (%)', data: [28, 27, 26, 25, 24, 23, 22], borderColor: 'rgba(39, 174, 96, 1)', backgroundColor: 'rgba(39, 174, 96, 0.1)', yAxisID: 'y' },
                  { label: 'Water Bodies (%)', data: [12, 11.8, 11.6, 11.4, 11.2, 11, 10.8], borderColor: 'rgba(52, 152, 219, 1)', backgroundColor: 'rgba(52, 152, 219, 0.1)', yAxisID: 'y1' },
                  { label: 'Temperature (°C)', data: [14.9, 15.1, 15.3, 15.5, 15.7, 15.9, 16.1], borderColor: 'rgba(231, 76, 60, 1)', backgroundColor: 'rgba(231, 76, 60, 0.1)', yAxisID: 'y1' },
                ]}
                scales={{
                  y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Forest Cover (%)' } },
                  y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Water / Temp' } },
                  x: { title: { display: true, text: 'Year' } },
                }}
                height="400px"
              />
            </div>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <div className="card">
              <h3>Environmental Data Summary</h3>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Environmental Indicator</th>
                      <th>2020</th>
                      <th>2050 (Projected)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Forest Cover (%)', '28', '22'],
                      ['Water Bodies (%)', '12', '10.8'],
                      ['Temperature (°C)', '14.9', '16.1'],
                      ['Air Quality Index', '50', '60'],
                    ].map(([indicator, v2020, v2050]) => (
                      <tr key={indicator}>
                        <td>{indicator}</td>
                        <td>{v2020}</td>
                        <td>{v2050}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageInner />
    </Suspense>
  );
}
