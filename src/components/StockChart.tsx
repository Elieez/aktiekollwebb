'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { brotliDecompress } from 'zlib';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface DataPoint {
  date: string;
  close: number;
}

export default function StockChart({ data }: { data: DataPoint[] }) {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
        {
        label: 'Close',
        data: data.map((d) => d.close),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: true,
        tension: 0.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        axis: 'x',
        callbacks: {
            title: (items: any) => items[0].label,
            label: (ctx: any) => `Price: ${ctx.formattedValue}`,
            },
        },
    },
    scales: {
      x: {
        ticks: { display: false },
        grid: { display: false },
      },
      y: {
        grid: { display: false },
      },
    },
  } as const;

  return <Line data={chartData} options={options} />;
}
