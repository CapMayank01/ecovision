'use client';

import StatCard from '@/components/ui/StatCard';
import WorldMap from '@/components/maps/WorldMap';

// Exact marker data from initMaps() world-map in app.js
const worldMarkers = [
  { position: [-3.4653, -62.2159] as [number, number], popup: '<b>Amazon Basin</b><br>5.5M km² forest area<br>Status: Critical' },
  { position: [0.2636, 15.2832] as [number, number], popup: '<b>Congo Basin</b><br>2.0M km² forest area<br>Status: Warning' },
  { position: [0.9619, 114.5548] as [number, number], popup: '<b>Borneo</b><br>290K km² forest area<br>Status: Critical' },
  { position: [28.5983, 83.9311] as [number, number], popup: '<b>Himalayas</b><br>Glacier retreat: 15m/year<br>Status: Warning' },
  { position: [46.4983, 9.8382] as [number, number], popup: '<b>Alps</b><br>Glacier retreat: 25m/year<br>Status: Warning' },
  { position: [-32.6536, -70.0114] as [number, number], popup: '<b>Andes</b><br>Glacier retreat: 20m/year<br>Status: Critical' },
];

export default function DashboardPage() {
  return (
    <>
      <div className="section-header">
        <h1>Environmental Dashboard</h1>
        <p>Monitor global environmental changes and predictions</p>
      </div>

      {/* Stats — exact data from index.html lines 63-92 */}
      <div className="stats-container">
        <StatCard icon="fas fa-tree" title="Forest Cover" value="4.06B ha" />
        <StatCard icon="fas fa-snowflake" title="Glacier Area" value="170K km²" />
        <StatCard icon="fas fa-thermometer-half" title="Avg Temperature" value="14.9°C" />
        <StatCard icon="fas fa-tint" title="Water Bodies" value="1.42M km²" />
      </div>

      {/* World Overview — exact from index.html lines 94-121 */}
      <div className="card world-overview">
        <h3>World Environmental Overview</h3>
        <div className="world-map">
          <WorldMap
            id="world-map"
            center={[20, 0]}
            zoom={2}
            markers={worldMarkers}
          />
        </div>
        <div className="world-stats">
          <div className="world-stat">
            <h4>Forest Coverage</h4>
            <p>31% of land <span className="trend negative">↓ 0.8%</span></p>
          </div>
          <div className="world-stat">
            <h4>Glacier Mass</h4>
            <p>170K km² <span className="trend negative">↓ 2.1%</span></p>
          </div>
          <div className="world-stat">
            <h4>Temperature</h4>
            <p>14.9°C <span className="trend negative">↑ 0.2°C</span></p>
          </div>
          <div className="world-stat">
            <h4>Water Stress</h4>
            <p>40% global <span className="trend negative">↑ 5%</span></p>
          </div>
        </div>
      </div>
    </>
  );
}
