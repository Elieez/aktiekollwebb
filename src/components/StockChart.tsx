'use client';

import React, { useEffect, useRef } from 'react';
import type { InsiderTrade } from '@/lib/types/InsiderTrade';
import {
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  LineSeries,
  createSeriesMarkers,
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

  // create chart once
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight || 300,
      layout: { textColor: '#111827' },
      rightPriceScale: { borderVisible: false },
      leftPriceScale: { visible: false },
      timeScale: { timeVisible: true, secondsVisible: false, rightOffset: 3 },
      crosshair: { mode: CrosshairMode.Normal, vertLine: { color: '#eee', width: 1, style: 0 } },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
    });

    chartRef.current = chart;

    const lineSeries = chart.addSeries(LineSeries, { color: '#22c55e', lineWidth: 3 });
    seriesRef.current = lineSeries;

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

    const onResize = () => {
      if (!containerRef.current || !chartRef.current) return;
      chartRef.current.resize(containerRef.current.clientWidth, containerRef.current.clientHeight || 300);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      if (tooltip && tooltip.parentElement) tooltip.parentElement.removeChild(tooltip);
    };
  }, []);

  // update data, aggregated markers, and crosshair tooltip
  useEffect(() => {
    const chart = chartRef.current;
    const line = seriesRef.current;
    if (!chart || !line) return;

    // price data
    const priceData = data.map((d) => ({ time: toUtcTimestamp(d.date), value: Number(d.close) }));
    (line as any).setData(priceData);

    // default visible range -> 1 year from last point
    requestAnimationFrame(() => {
      const last = priceData[priceData.length - 1];
      if (last) {
        const stockDays = 251 * 24 * 60 * 60;
        try {
          chart.timeScale().setVisibleRange({ from: (last.time - stockDays) as UTCTimestamp, to: last.time as UTCTimestamp });
        } catch (err) {
          // ignore if clamped or fails
        }
      }
    });

    // group trades by day (seconds)
    const tradesByTime = new Map<number, InsiderTrade[]>();
    trades.forEach((t) => {
      const day = toUtcTimestamp(t.publishingDate.split('T')[0]) as number;
      const arr = tradesByTime.get(day) ?? [];
      arr.push(t);
      tradesByTime.set(day, arr);
    });

    // create a dedicated (invisible) trade series so markers can be placed exactly at value
    let tradeSeries: ISeriesApi<'Line'> | null = null;
    try {
      tradeSeries = chart.addSeries(LineSeries, {
        color: 'rgba(0,0,0,0)',
        lastValueVisible: false,
        priceLineVisible: false,
      }) as ISeriesApi<'Line'>;
    } catch {
      tradeSeries = null;
    }

    // build aggregated points + markers and a lookup map for tooltips
    const tradePoints: { time: UTCTimestamp; value: number }[] = [];
    const aggMarkers: SeriesMarker<UTCTimestamp>[] = [];
    const tradeLookup = new Map<number, InsiderTrade[]>();

    tradesByTime.forEach((list, time) => {
      // compute average trade price when available, fall back to day's close or last price
      const prices = list.map((x) => (typeof x.price === 'number' ? x.price : NaN)).filter(Number.isFinite);
      const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : NaN;
      const basePrice = !Number.isNaN(avgPrice)
        ? avgPrice
        : priceData.find((p) => p.time === time)?.value ?? priceData[priceData.length - 1]?.value ?? 0;

      const count = list.length;

      tradePoints.push({ time: time as UTCTimestamp, value: basePrice });

      const markerColor = getTradeColor(list[0].transactionType);
      aggMarkers.push({
        time: time as UTCTimestamp,
        position: 'inBar',
        color: markerColor,
        shape: 'circle',
      } as SeriesMarker<UTCTimestamp>);

      tradeLookup.set(time, list);
    });

    // attach data and markers to tradeSeries (or fallback to main line)
    if (tradeSeries) {
      try {
        (tradeSeries as any).setData(tradePoints);
        createSeriesMarkers(tradeSeries as any, aggMarkers);
      } catch (err) {
        // fallback to adding markers to main series if createSeriesMarkers not available
        try {
          createSeriesMarkers(line as any, aggMarkers);
        } catch (e) {
          // ignore
        }
      }
    } else {
      try {
        createSeriesMarkers(line as any, aggMarkers);
      } catch {
        // ignore
      }
    }

    // crosshair tooltip handler (single, unified)
    const handleMove = (param: MouseEventParams) => {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;
      if (!param.point) {
        tooltip.style.display = 'none';
        return;
      }

      const time = param.time as UTCTimestamp;
      const tradesAtTime = tradeLookup.get(time) ?? [];

      if (tradesAtTime.length > 0) {
        const date = new Date((time as number) * 1000);
        let html = `<div style="font-weight:600">${date.toLocaleDateString()}</div>`;
        html += `<div style="margin-top:6px"><strong>${tradesAtTime.length}</strong> trade(s)</div>`;

        const preview = tradesAtTime.slice(0, 3);
        preview.forEach((t) => {
          html += `<div style="margin-top:6px"><small>${t.transactionType} ${t.price ?? '--'} SEK </small></div>`;
        });
        if (tradesAtTime.length > 3) html += `<div style="margin-top:6px"><small>+${tradesAtTime.length - 3} more</small></div>`;

        tooltip.innerHTML = html;
        tooltip.style.display = 'block';

        const x = param.point.x ?? 0;
        const y = param.point.y ?? 0;
        tooltip.style.left = `${x + 12}px`;
        tooltip.style.top = `${y - 28}px`;
        return;
      }

      // fallback: show price for the hovered series (main line)
      const seriesDataForLine = param.seriesData?.get(line as any) as { value?: number } | undefined;
      const price = seriesDataForLine?.value;
      if (price === undefined) {
        tooltip.style.display = 'none';
        return;
      }

      const d = new Date((param.time as number) * 1000);
      tooltip.innerHTML = `<div><strong>${d.toLocaleDateString()}</strong></div><div>Price: ${price.toLocaleString()} SEK</div>`;
      tooltip.style.display = 'block';

      const x = param.point.x ?? 0;
      const y = param.point.y ?? 0;
      tooltip.style.left = `${x + 12}px`;
      tooltip.style.top = `${y - 28}px`;
    };

    chart.subscribeCrosshairMove(handleMove);
    return () => {
      chart.unsubscribeCrosshairMove(handleMove);
      // optionally remove the tradeSeries if you created it (chart.remove will handle on chart.remove())
      // if (tradeSeries) { /* no-op: chart.remove() will remove series on outer cleanup */ }
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
