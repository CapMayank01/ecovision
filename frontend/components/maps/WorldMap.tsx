'use client';

import { useEffect, useRef } from 'react';

interface WorldMapProps {
  id: string;
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popup: string;
    color?: string;
  }>;
  circles?: Array<{
    position: [number, number];
    radius: number;
    color: string;
    popup?: string;
  }>;
  height?: string;
}

export default function WorldMap({
  id,
  center = [20, 0],
  zoom = 2,
  markers = [],
  circles = [],
  height = '100%',
}: WorldMapProps) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // Cleanup previous map instance (fixes memory leak bug from original)
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      if (!containerRef.current) return;

      const map = L.map(containerRef.current).setView(center, zoom);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Add markers
      markers.forEach((m) => {
        const marker = L.marker(m.position).addTo(map);
        if (m.popup) marker.bindPopup(m.popup);
      });

      // Add circles
      circles.forEach((c) => {
        const circle = L.circle(c.position, {
          radius: c.radius,
          color: c.color,
          fillColor: c.color,
          fillOpacity: 0.3,
        }).addTo(map);
        if (c.popup) circle.bindPopup(c.popup);
      });

      // Fix map rendering in hidden containers
      setTimeout(() => map.invalidateSize(), 100);
    };

    initMap();

    // Cleanup on unmount — fixes map memory leak from original
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [id, center, zoom, markers, circles]);

  return (
    <div
      ref={containerRef}
      id={id}
      style={{ width: '100%', height, minHeight: '300px', borderRadius: '8px' }}
    />
  );
}
