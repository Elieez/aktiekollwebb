'use client';

import { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: number[];
}

export default function PieChart({ data }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy any previous chart to prevent overlap
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'pie',
      data: {
        labels: ['Förvärv', 'Avyttring'],
        datasets: [
          {
            label: 'Insider Transactions',
            data,
            backgroundColor: ['#4CAF50', '#F44336'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data]);

  return <canvas ref={canvasRef} className="max-w-sm mx-auto" />;
}