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
import type { TooltipItem } from 'chart.js';
import type { InsiderTrade } from '@/lib/types/InsiderTrade';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface DataPoint {
  date: string;
  close: number;
}

interface StockChartProps {
  data: DataPoint[];
  trades?: InsiderTrade[];
}

export default function StockChart({ data, trades = [] }: StockChartProps) {
const labels = data.map((d) => d.date);
  const getTradeColor = (type: string) => {
  switch (type) {
    case 'Förvärv':
      return 'rgb(34, 197, 94)';
    case 'Avyttring':
      return 'rgb(244, 67, 54)';
    case 'Teckning':
      return 'rgb(59, 130, 246)';
    case 'Tilldelning':
      return 'rgb(168, 85, 247)';
    default:
      return 'rgb(107, 114, 128)';
  }
};

const tradePrices = Array(labels.length).fill(null);
const tradeColors = Array(labels.length).fill('rgba(0,0,0,0)');
const tradeTypes = Array(labels.length).fill('');

trades.forEach((t) => {
  const date = t.publishingDate.split('T')[0];
  const idx = labels.indexOf(date);
  if (idx !== -1) {
    tradePrices[idx] = t.price;
    tradeColors[idx] = getTradeColor(t.transactionType);
    tradeTypes[idx] = t.transactionType;
  }
});

  const chartData = {
    labels,
    datasets: [
        {
        label: 'Close',
        data: data.map((d) => d.close),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
        },
        {
          label: 'Insider Trades',
          data: tradePrices,
          showLine: false,
          borderColor: tradeColors,
          backgroundColor: tradeColors,
          pointRadius: 7,
          pointHoverRadius: 7,
        }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
            title: (items: TooltipItem<'line'>[]) => items[0].label,
            label: (ctx: TooltipItem<'line'>) => {
              if (ctx.datasetIndex === 1) {
                const type = tradeTypes[ctx.dataIndex];
                return `${type}: ${ctx.formattedValue} SEK`;
              }
              return `Price: ${ctx.formattedValue}`;
            },
            },
        },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 12,
          maxRotation: 45,
          minRotation: 30,
          callback: (_value: number | string, index: number) => {
            const date = new Date(labels[index]);
            return date.toLocaleDateString('default', {
              month: 'short',
              day: 'numeric',
            });
          },
        },
        grid: { display: false },
      },
      y: {
        grid: { display: false },
      },
    },
  } as const;

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}