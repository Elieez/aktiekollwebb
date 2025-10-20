'use client';

import React, { useEffect, useRef } from 'react';
import type { InsiderTrade } from '@/lib/types/InsiderTrade';
import {
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  LineSeries,              // v5 series class
  createSeriesMarkers,     // v5 helper for markers
  type SeriesMarker,
  type MouseEventParams,
} from 'lightweight-charts';

interface DataPoint {
  date: string;
  close: number;
}

interface StockChartProps {
  data: DataPoint[];
  trades?: InsiderTrade[];
}

const getTradeColor = (type: string) => {
  switch (type) {
    case 'Förvärv':
      return '#22c55e';
    case 'Avyttring':
      return '#f44336';
    case 'Teckning':
      return '#3b82f6';
    case 'Tilldelning':
      return '#a855f7';
    default:
      return '#6b7280';
  }
};

function toUtcTimestamp(dateStr: string): UTCTimestamp {
  const ms = new Date(dateStr).getTime();
  return Math.floor(ms / 1000) as UTCTimestamp;
}

export default function StockChart({ data, trades = [] }: StockChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight || 300,
      layout: {
        textColor: '#111827',
      },
      rightPriceScale: { borderVisible: false },
      leftPriceScale: { visible: false },
      timeScale: { timeVisible: true, secondsVisible: false, rightOffset: 3 },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#eee', width: 1, style: 0 },
      },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
    });

    chartRef.current = chart;

    // v5: use LineSeries class and add via chart.addSeries
    const lineSeries = chart.addSeries(LineSeries, {
      color: '#22c55e',
      lineWidth: 2,
    });

    seriesRef.current = lineSeries;

    // tooltip element
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: absolute;
      display: none;
      padding: 8px;
      border-radius: 6px;
      font-size: 12px;
      background: rgba(255,255,255,0.95);
      color: #111827;
      box-shadow: 0 6px 18px rgba(0,0,0,0.08);
      pointer-events: none;
      z-index: 1000;
      white-space: nowrap;
    `;
    containerRef.current.appendChild(tooltip);
    tooltipRef.current = tooltip;

    const handleResize = () => {
      if (!containerRef.current || !chartRef.current) return;
      chartRef.current.resize(containerRef.current.clientWidth, containerRef.current.clientHeight || 300);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      if (tooltip && tooltip.parentElement) tooltip.parentElement.removeChild(tooltip);
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    const line = seriesRef.current;

    if (!chart || !line) return;

    const priceData = data.map((d) => ({
      time: toUtcTimestamp(d.date),
      value: Number(d.close),
    }));

    // set series data
    // depending on your typings, setData will accept this shape
    (line as any).setData(priceData);

    // build markers
    const markers: SeriesMarker<UTCTimestamp>[] = trades
      .map((t) => {
        const date = t.publishingDate.split('T')[0];
        const time = toUtcTimestamp(date);

        // include only if date exists in our price data (optional)
        const found = priceData.find((p) => p.time === time);
        if (!found && !data.find((d) => toUtcTimestamp(d.date) === time)) return null;

        const color = getTradeColor(t.transactionType);
        const position = ['Förvärv', 'Teckning'].includes(t.transactionType) ? 'belowBar' : 'aboveBar';
        const shape = ['Förvärv', 'Teckning'].includes(t.transactionType) ? 'arrowUp' : 'arrowDown';
        const text = t.transactionType;

        return {
          time,
          position: position as 'aboveBar' | 'belowBar' | 'inBar',
          color,
          shape: shape as 'arrowUp' | 'arrowDown' | 'circle' | 'square' | 'flag',
          text,
        } as SeriesMarker<UTCTimestamp>;
      })
      .filter(Boolean) as SeriesMarker<UTCTimestamp>[];

    // v5: use createSeriesMarkers helper
    try {
      createSeriesMarkers(line as any, markers);
    } catch (err) {
      // fallback: if your library build doesn't include createSeriesMarkers, you can ignore or implement a local fallback
      // console.warn('createSeriesMarkers failed', err);
    }

    // crosshair tooltip handler (v5)
    const tooltip = tooltipRef.current;
    const handleMove = (param: MouseEventParams) => {
      // param.point may be undefined when pointer is outside chart area
      if (!tooltip) return;
      if (!param.point) {
        tooltip.style.display = 'none';
        return;
      }

      // param.seriesData is a Map<ISeriesApi, SeriesData | undefined> in v5
      const seriesDataForLine = param.seriesData?.get(line as any) as { value?: number } | undefined;
      const price = seriesDataForLine?.value;

      if (price === undefined) {
        tooltip.style.display = 'none';
        return;
      }

      const time = param.time as UTCTimestamp;
      const marker = markers.find((m) => m.time === time);
      const date = new Date((time as number) * 1000);
      const dateLabel = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      let html = `<div><strong>${dateLabel}</strong></div>`;
      html += `<div>Price: ${price.toLocaleString()} SEK</div>`;
      if (marker) {
        html += `<div style="margin-top:4px"><small>${marker.text}</small></div>`;
      }

      tooltip.innerHTML = html;
      tooltip.style.display = 'block';

      // position inside container
      const x = param.point.x ?? 0;
      const y = param.point.y ?? 0;
      tooltip.style.left = `${x + 12}px`;
      tooltip.style.top = `${y - 28}px`;
    };

    chart.subscribeCrosshairMove(handleMove);

    return () => {
      chart.unsubscribeCrosshairMove(handleMove);
    };
  }, [data, trades]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 240,
        position: 'relative',
      }}
    />
  );
}
