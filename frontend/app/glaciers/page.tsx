'use client';

import { useState } from 'react';
import WorldMap from '@/components/maps/WorldMap';
import PredictionChart from '@/components/charts/PredictionChart';

const glacierMarkers = [
  { position: [28.5983, 83.9311] as [number, number], popup: '<b>Himalayas</b><br>Retreat: 15m/year' },
  { position: [46.4983, 9.8382] as [number, number], popup: '<b>Alps</b><br>Retreat: 25m/year' },
  { position: [-32.6536, -70.0114] as [number, number], popup: '<b>Andes</b><br>Retreat: 20m/year' },
  { position: [63.0, -150.0] as [number, number], popup: '<b>Alaska</b><br>Retreat: 30m/year' },
  { position: [72.0, -40.0] as [number, number], popup: '<b>Greenland</b><br>Retreat: 10m/year' },
];

const chartLabels = ['2000', '2005', '2010', '2015', '2020', '2025', '2030', '2035', '2040', '2045', '2050'];

export default function GlaciersPage() {
  const [glacierRegion, setGlacierRegion] = useState('global');

  const glacierData: Record<string, { historical: number[]; projected: number[] }> = {
    global: { historical: [170, 167, 164, 161, 158], projected: [158, 155, 152, 149, 146, 143, 140] },
    himalayas: { historical: [30, 29, 27.5, 26, 24.5], projected: [24.5, 23, 21.5, 20, 18.5, 17, 15.5] },
    alps: { historical: [3, 2.9, 2.75, 2.6, 2.45], projected: [2.45, 2.3, 2.15, 2, 1.85, 1.7, 1.55] },
    andes: { historical: [25, 24, 23, 22, 21], projected: [21, 20, 19, 18, 17, 16, 15] },
    alaska: { historical: [26, 25, 24, 23, 22], projected: [22, 21, 20, 19, 18, 17, 16] },
    greenland: { historical: [75, 74, 73, 72, 71], projected: [71, 70, 69, 68, 67, 66, 65] },
  };

  const currentData = glacierData[glacierRegion] || glacierData.global;

  return (
    <>
      <div className="section-header">
        <h1>Glacier Monitoring</h1>
        <p>Track glacier retreat and predict future changes</p>
      </div>

      <div className="flex-container">
        <div className="map-card">
          <h3>Global Glacier Map</h3>
          <WorldMap id="glacier-map" center={[30, 0]} zoom={2} markers={glacierMarkers} />
        </div>
        <div className="chart-card">
          <h3>Glacier Area Trends</h3>
          <div className="chart-controls">
            <label htmlFor="glacier-region">Select Region: </label>
            <select id="glacier-region" value={glacierRegion} onChange={(e) => setGlacierRegion(e.target.value)}>
              <option value="global">Global</option>
              <option value="himalayas">Himalayas</option>
              <option value="alps">Alps</option>
              <option value="andes">Andes</option>
              <option value="alaska">Alaska</option>
              <option value="greenland">Greenland</option>
            </select>
          </div>
          <PredictionChart
            id={`glacier-chart-${glacierRegion}`}
            labels={chartLabels}
            datasets={[
              {
                label: 'Historical (K km²)',
                data: [...currentData.historical, null, null, null, null, null, null],
                borderColor: 'rgba(52, 152, 219, 1)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
              },
              {
                label: 'Projected (K km²)',
                data: [null, null, null, null, ...currentData.projected],
                borderColor: 'rgba(231, 76, 60, 1)',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
              },
            ]}
            scales={{
              y: { beginAtZero: false, title: { display: true, text: 'Glacier Area (K km²)' } },
              x: { title: { display: true, text: 'Year' } },
            }}
          />
        </div>
      </div>

      {/* Impacts grid — from index.html lines 753-777 */}
      <div className="impacts-grid" style={{ marginTop: '2rem' }}>
        {[
          { icon: 'fas fa-water', title: 'Sea Level Rise', desc: 'Melting glaciers contribute to rising sea levels, threatening coastal communities.' },
          { icon: 'fas fa-tint', title: 'Water Supply', desc: 'Glaciers are critical freshwater sources for billions of people worldwide.' },
          { icon: 'fas fa-paw', title: 'Ecosystem Impact', desc: 'Glacier retreat disrupts ecosystems and habitats for wildlife.' },
          { icon: 'fas fa-cloud-rain', title: 'Weather Patterns', desc: 'Changes in glacier mass affect precipitation and weather patterns.' },
        ].map((impact) => (
          <div className="impact-card" key={impact.title}>
            <div className="impact-icon"><i className={impact.icon}></i></div>
            <h4>{impact.title}</h4>
            <p>{impact.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}
