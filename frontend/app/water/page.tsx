'use client';

import { useState } from 'react';
import WorldMap from '@/components/maps/WorldMap';
import PredictionChart from '@/components/charts/PredictionChart';

const waterLabels = ['2000', '2005', '2010', '2015', '2020', '2025', '2030', '2035', '2040', '2045', '2050'];

export default function WaterPage() {
  const [waterRegion, setWaterRegion] = useState('global');

  const waterData: Record<string, number[]> = {
    global: [0.4, 0.42, 0.44, 0.46, 0.48, 0.5, 0.52, 0.54, 0.56, 0.58, 0.6],
    asia: [0.6, 0.63, 0.66, 0.69, 0.72, 0.75, 0.78, 0.81, 0.84, 0.87, 0.9],
    africa: [0.7, 0.73, 0.76, 0.79, 0.82, 0.85, 0.88, 0.91, 0.94, 0.97, 1.0],
    'north-america': [0.3, 0.32, 0.34, 0.36, 0.38, 0.4, 0.42, 0.44, 0.46, 0.48, 0.5],
    'south-america': [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.38, 0.4],
    europe: [0.4, 0.42, 0.44, 0.46, 0.48, 0.5, 0.52, 0.54, 0.56, 0.58, 0.6],
  };

  return (
    <>
      <div className="section-header">
        <h1>Water Bodies Analysis</h1>
        <p>Monitor water resources and predict future availability</p>
      </div>

      <div className="flex-container">
        <div className="map-card">
          <h3>Global Water Resources Map</h3>
          <WorldMap
            id="water-map"
            center={[20, 0]}
            zoom={2}
            circles={[
              { position: [35, 105] as [number, number], radius: 500000, color: '#e74c3c', popup: '<b>Asia</b><br>Water Stress: High' },
              { position: [10, 25] as [number, number], radius: 400000, color: '#e74c3c', popup: '<b>Africa</b><br>Water Stress: Critical' },
              { position: [40, -100] as [number, number], radius: 300000, color: '#f39c12', popup: '<b>North America</b><br>Water Stress: Moderate' },
              { position: [-15, -60] as [number, number], radius: 300000, color: '#27ae60', popup: '<b>South America</b><br>Water Stress: Low' },
              { position: [50, 10] as [number, number], radius: 200000, color: '#f39c12', popup: '<b>Europe</b><br>Water Stress: Moderate' },
            ]}
          />
        </div>
        <div className="chart-card">
          <h3>Water Stress Index Trends</h3>
          <div className="chart-controls">
            <label htmlFor="water-region">Select Region: </label>
            <select id="water-region" value={waterRegion} onChange={(e) => setWaterRegion(e.target.value)}>
              <option value="global">Global</option>
              <option value="asia">Asia</option>
              <option value="africa">Africa</option>
              <option value="north-america">North America</option>
              <option value="south-america">South America</option>
              <option value="europe">Europe</option>
            </select>
          </div>
          <PredictionChart
            id={`water-chart-${waterRegion}`}
            labels={waterLabels}
            datasets={[{
              label: 'Water Stress Index',
              data: waterData[waterRegion] || waterData.global,
              borderColor: 'rgba(52, 152, 219, 1)',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
            }]}
            scales={{
              y: { beginAtZero: true, max: 1, title: { display: true, text: 'Water Stress Index (0-1)' } },
              x: { title: { display: true, text: 'Year' } },
            }}
          />
        </div>
      </div>

      {/* Water Stress by Region bar chart — from initCharts() */}
      <div className="card">
        <h3>Water Stress by Region (2020 vs 2050)</h3>
        <PredictionChart
          id="water-stress-chart"
          type="bar"
          labels={['North America', 'South America', 'Europe', 'Africa', 'Asia', 'Oceania']}
          datasets={[
            {
              label: '2020 Water Stress Index',
              data: [0.3, 0.2, 0.4, 0.7, 0.6, 0.3],
              borderColor: 'rgba(46, 204, 113, 1)',
              backgroundColor: 'rgba(46, 204, 113, 0.7)',
            },
            {
              label: '2050 Projected Water Stress Index',
              data: [0.4, 0.3, 0.5, 0.85, 0.75, 0.4],
              borderColor: 'rgba(46, 204, 113, 0.6)',
              backgroundColor: 'rgba(46, 204, 113, 0.4)',
            },
          ]}
          scales={{
            y: { beginAtZero: true, max: 1, title: { display: true, text: 'Water Stress Index (0-1)' } },
          }}
          height="300px"
        />
      </div>

      {/* Groundwater Legend */}
      <div className="card">
        <h3>Groundwater Levels</h3>
        <WorldMap
          id="groundwater-map"
          center={[20, 0]}
          zoom={2}
          circles={[
            { position: [20, 78] as [number, number], radius: 400000, color: '#d7191c', popup: '<b>India</b><br>Severe Depletion' },
            { position: [30, 50] as [number, number], radius: 300000, color: '#fdae61', popup: '<b>Middle East</b><br>Moderate Depletion' },
            { position: [40, -100] as [number, number], radius: 300000, color: '#a6d96a', popup: '<b>Central US</b><br>Stable' },
            { position: [50, 10] as [number, number], radius: 200000, color: '#1a9641', popup: '<b>Northern Europe</b><br>Rising' },
          ]}
          height="300px"
        />
        <div className="groundwater-legend" style={{ marginTop: '1rem' }}>
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#1a9641' }}></span><span>Rising</span></div>
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#a6d96a' }}></span><span>Stable</span></div>
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#fdae61' }}></span><span>Moderate Depletion</span></div>
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#d7191c' }}></span><span>Severe Depletion</span></div>
        </div>
      </div>
    </>
  );
}
