'use client';

import { useState } from 'react';
import WorldMap from '@/components/maps/WorldMap';
import PredictionChart from '@/components/charts/PredictionChart';
import SolutionModal from '@/components/solutions/SolutionModal';

// Exact data from initMaps() forest map in app.js
const forestCircles = [
  { position: [-3.4653, -62.2159] as [number, number], radius: 500000, color: '#e74c3c', popup: '<b>Amazon Basin</b><br>Annual loss: 10,000 km²' },
  { position: [0.2636, 15.2832] as [number, number], radius: 300000, color: '#f39c12', popup: '<b>Congo Basin</b><br>Annual loss: 2,000 km²' },
  { position: [0.9619, 114.5548] as [number, number], radius: 200000, color: '#e74c3c', popup: '<b>Borneo</b><br>Annual loss: 5,000 km²' },
  { position: [61.5240, 105.3188] as [number, number], radius: 400000, color: '#f39c12', popup: '<b>Siberian Taiga</b><br>Annual loss: 4,000 km²' },
  { position: [56.1304, -106.3468] as [number, number], radius: 350000, color: '#27ae60', popup: '<b>Canadian Boreal</b><br>Annual loss: 1,500 km²' },
];

// Exact chart data from initCharts() forest chart in app.js
const forestChartLabels = ['2000', '2005', '2010', '2015', '2020', '2025', '2030', '2035', '2040', '2045', '2050'];

export default function ForestsPage() {
  const [forestRegion, setForestRegion] = useState('global');
  const [modalSolution, setModalSolution] = useState<string | null>(null);

  // Exact region data from updateForestChart() in app.js
  const forestData: Record<string, { historical: number[]; projected: number[] }> = {
    global: { historical: [40.8, 40.2, 39.6, 39.1, 38.6], projected: [38.6, 38.1, 37.6, 37.1, 36.6, 36.1, 35.6] },
    amazon: { historical: [5.5, 5.3, 5.1, 4.9, 4.7], projected: [4.7, 4.5, 4.3, 4.1, 3.9, 3.7, 3.5] },
    congo: { historical: [2.2, 2.15, 2.1, 2.05, 2.0], projected: [2.0, 1.95, 1.9, 1.85, 1.8, 1.75, 1.7] },
    borneo: { historical: [0.75, 0.7, 0.65, 0.6, 0.55], projected: [0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25] },
    siberia: { historical: [8.1, 8.0, 7.9, 7.8, 7.7], projected: [7.7, 7.6, 7.5, 7.4, 7.3, 7.2, 7.1] },
    'north-america': { historical: [7.5, 7.45, 7.4, 7.35, 7.3], projected: [7.3, 7.25, 7.2, 7.15, 7.1, 7.05, 7.0] },
  };

  const currentData = forestData[forestRegion] || forestData.global;

  return (
    <>
      <div className="section-header">
        <h1>Deforestation Analysis</h1>
        <p>Track global forest cover changes and predict future trends</p>
      </div>

      <div className="flex-container">
        <div className="map-card">
          <h3>Global Deforestation Map</h3>
          <WorldMap id="forest-map" center={[20, 0]} zoom={2} circles={forestCircles} />
        </div>
        <div className="chart-card">
          <h3>Forest Cover Trends</h3>
          <div className="chart-controls">
            <label htmlFor="forest-region">Select Region: </label>
            <select id="forest-region" value={forestRegion} onChange={(e) => setForestRegion(e.target.value)}>
              <option value="global">Global</option>
              <option value="amazon">Amazon Basin</option>
              <option value="congo">Congo Basin</option>
              <option value="borneo">Borneo</option>
              <option value="siberia">Siberian Taiga</option>
              <option value="north-america">North America</option>
            </select>
          </div>
          <PredictionChart
            id={`forest-chart-${forestRegion}`}
            labels={forestChartLabels}
            datasets={[
              {
                label: 'Historical (M km²)',
                data: [...currentData.historical, null, null, null, null, null, null],
                borderColor: 'rgba(39, 174, 96, 1)',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
              },
              {
                label: 'Projected (M km²)',
                data: [null, null, null, null, ...currentData.projected],
                borderColor: 'rgba(231, 76, 60, 1)',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
              },
            ]}
            scales={{
              y: { beginAtZero: false, title: { display: true, text: 'Forest Cover (M km²)' } },
              x: { title: { display: true, text: 'Year' } },
            }}
          />
        </div>
      </div>

      {/* India's Forest Status — exact from index.html lines 508-636 */}
      <div className="card">
        <h3>India&apos;s Forest Status</h3>
        <div className="india-forest-grid">
          <div className="forest-stat-card">
            <div className="stat-icon"><i className="fas fa-tree"></i></div>
            <div className="stat-content">
              <h4>Total Forest Cover</h4>
              <p className="stat-number">7,13,789 km²</p>
              <p className="stat-desc">21.71% of geographical area</p>
            </div>
          </div>
          <div className="forest-stat-card">
            <div className="stat-icon"><i className="fas fa-mountain"></i></div>
            <div className="stat-content">
              <h4>Dense Forest</h4>
              <p className="stat-number">98,158 km²</p>
              <p className="stat-desc">Very Dense Forest cover</p>
            </div>
          </div>
          <div className="forest-stat-card">
            <div className="stat-icon"><i className="fas fa-leaf"></i></div>
            <div className="stat-content">
              <h4>Open Forest</h4>
              <p className="stat-number">3,04,499 km²</p>
              <p className="stat-desc">Open Forest cover</p>
            </div>
          </div>
        </div>
        <div className="india-satellite-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7771847.81365987!2d76.46726912062921!3d20.613342744448498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e1!3m2!1sen!2sin!4v1697025131697!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            allowFullScreen
            loading="lazy"
            title="India Satellite View"
          ></iframe>
        </div>
      </div>

      {/* Deforestation Hotspots — exact from index.html lines 639-715 */}
      <div className="hotspots-grid">
        {[
          {
            title: 'Amazon Basin',
            stats: [
              ['Annual Loss', '10,000 km²'],
              ['Rate of Change', '-1.8% per year'],
              ['Risk Level', 'critical'],
            ],
            region: 'amazon',
          },
          {
            title: 'Congo Basin',
            stats: [
              ['Annual Loss', '2,000 km²'],
              ['Rate of Change', '-0.9% per year'],
              ['Risk Level', 'high'],
            ],
            region: 'congo',
          },
          {
            title: 'Borneo',
            stats: [
              ['Annual Loss', '5,000 km²'],
              ['Rate of Change', '-2.5% per year'],
              ['Risk Level', 'critical'],
            ],
            region: 'borneo',
          },
          {
            title: 'Siberian Taiga',
            stats: [
              ['Annual Loss', '4,000 km²'],
              ['Rate of Change', '-0.5% per year'],
              ['Risk Level', 'medium'],
            ],
            region: 'siberia',
          },
        ].map((hotspot) => (
          <div className="hotspot-card" key={hotspot.region}>
            <h4>{hotspot.title}</h4>
            <div className="hotspot-stats">
              {hotspot.stats.map(([label, value]) => (
                <div className="hotspot-stat" key={label}>
                  <span>{label}</span>
                  {label === 'Risk Level' ? (
                    <span className={`risk ${value}`}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  ) : (
                    <span>{value}</span>
                  )}
                </div>
              ))}
            </div>
            <button className="view-details-btn" onClick={() => setModalSolution(hotspot.region)}>
              View Details
            </button>
          </div>
        ))}
      </div>

      <SolutionModal
        isOpen={!!modalSolution}
        solutionKey={modalSolution}
        onClose={() => setModalSolution(null)}
      />
    </>
  );
}
