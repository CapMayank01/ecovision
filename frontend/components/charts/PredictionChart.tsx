'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
} from 'chart.js';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController
);

interface Dataset {
  label: string;
  data: (number | null)[];
  borderColor: string;
  backgroundColor: string;
  borderWidth?: number;
  pointRadius?: number;
  fill?: boolean;
  yAxisID?: string;
}

interface Scale {
  type?: string;
  display?: boolean;
  position?: string;
  beginAtZero?: boolean;
  max?: number;
  title?: { display: boolean; text: string };
  grid?: { drawOnChartArea?: boolean };
}

interface PredictionChartProps {
  id: string;
  type?: 'line' | 'bar';
  labels: string[];
  datasets: Dataset[];
  scales?: Record<string, Scale>;
  height?: string;
}

export default function PredictionChart({
  id,
  type = 'line',
  labels,
  datasets,
  scales,
  height = '100%',
}: PredictionChartProps) {
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy previous chart instance (prevents duplicate renders)
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type,
      data: {
        labels,
        datasets: datasets.map((ds) => ({
          ...ds,
          borderWidth: ds.borderWidth ?? 2,
          pointRadius: ds.pointRadius ?? 3,
          fill: ds.fill ?? false,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: scales as any,
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [id, type, labels, datasets, scales]);

  return (
    <div style={{ width: '100%', height, minHeight: '200px', position: 'relative' }}>
      <canvas ref={canvasRef} id={id} />
    </div>
  );
}
