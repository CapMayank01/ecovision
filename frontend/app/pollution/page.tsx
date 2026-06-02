'use client';

import { useState } from 'react';
import WorldMap from '@/components/maps/WorldMap';
import PredictionChart from '@/components/charts/PredictionChart';
import CausesPanel from '@/components/causes/CausesPanel';

const pollutionLabels = ['2000', '2005', '2010', '2015', '2020', '2025', '2030', '2035', '2040', '2045', '2050'];

export default function PollutionPage() {
  const [pollutionRegion, setPollutionRegion] = useState('global');

  const pollutionData: Record<string, number[]> = {
    global: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    asia: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50],
    africa: [25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45],
    'north-america': [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    'south-america': [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    europe: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
  };

  return (
    <>
      <div className="section-header">
        <h1>Pollution Analysis</h1>
        <p>Track air, water, and soil pollution levels globally</p>
      </div>

      <div className="flex-container">
        <div className="map-card">
          <h3>Global Pollution Levels</h3>
          <WorldMap
            id="pollution-map"
            center={[20, 0]}
            zoom={2}
            circles={[
              { position: [30, 80] as [number, number], radius: 500000, color: '#e74c3c', popup: '<b>South Asia</b><br>AQI: 150+' },
              { position: [35, 115] as [number, number], radius: 400000, color: '#e74c3c', popup: '<b>East Asia</b><br>AQI: 120+' },
              { position: [5, 25] as [number, number], radius: 300000, color: '#f39c12', popup: '<b>Central Africa</b><br>AQI: 80+' },
              { position: [50, 10] as [number, number], radius: 200000, color: '#27ae60', popup: '<b>Europe</b><br>AQI: 40' },
              { position: [40, -100] as [number, number], radius: 200000, color: '#f39c12', popup: '<b>North America</b><br>AQI: 55' },
            ]}
          />
        </div>
        <div className="chart-card">
          <h3>Pollution Trends</h3>
          <div className="chart-controls">
            <label htmlFor="pollution-region">Select Region: </label>
            <select id="pollution-region" value={pollutionRegion} onChange={(e) => setPollutionRegion(e.target.value)}>
              <option value="global">Global</option>
              <option value="asia">Asia</option>
              <option value="africa">Africa</option>
              <option value="north-america">North America</option>
              <option value="south-america">South America</option>
              <option value="europe">Europe</option>
            </select>
          </div>
          <PredictionChart
            id={`pollution-chart-${pollutionRegion}`}
            labels={pollutionLabels}
            datasets={[{
              label: 'Global Average PM2.5 (μg/m³)',
              data: pollutionData[pollutionRegion] || pollutionData.global,
              borderColor: 'rgba(231, 76, 60, 1)',
              backgroundColor: 'rgba(231, 76, 60, 0.1)',
            }]}
            scales={{
              y: { beginAtZero: false, title: { display: true, text: 'PM2.5 Concentration (μg/m³)' } },
              x: { title: { display: true, text: 'Year' } },
            }}
          />
        </div>
      </div>

      {/* Pollution Sources — exact from index.html lines 902-942 */}
      <div className="card">
        <h3>Major Pollution Sources</h3>
        <div className="sources-grid">
          {[
            { icon: 'fas fa-industry', title: 'Industrial Emissions', desc: 'Factories and industrial processes release pollutants into the air, water, and soil.', pct: '23%' },
            { icon: 'fas fa-car', title: 'Transportation', desc: 'Vehicles emit greenhouse gases and particulate matter that contribute to air pollution.', pct: '29%' },
            { icon: 'fas fa-bolt', title: 'Energy Production', desc: 'Power plants, especially those using fossil fuels, release significant pollutants.', pct: '32%' },
            { icon: 'fas fa-seedling', title: 'Agriculture', desc: 'Pesticides, fertilizers, and livestock waste contribute to water and soil pollution.', pct: '16%' },
          ].map((source) => (
            <div className="source-card" key={source.title}>
              <div className="source-icon"><i className={source.icon}></i></div>
              <h4>{source.title}</h4>
              <p>{source.desc}</p>
              <div className="source-stat">
                <span>Global Contribution:</span>
                <span>{source.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cause Layer — explanation of WHY pollution happens (India / Himalayas region) */}
      <CausesPanel regionId={4} />
    </>
  );
}
