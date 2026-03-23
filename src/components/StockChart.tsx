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
  type LineData,
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
      return '#4deba8';
    case 'Avyttring':
      return '#f06b4d';
    case 'Teckning':
      return '#4d94eb';
    case 'Tilldelning':
      return '#a84deb';
    default:
      return '#8a8a8a';
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
      layout: { 
        background: { color: 'transparent' },
        textColor: '#8a8a8a',
        fontFamily: "'DM Mono', monospace",
        fontSize: 11, 
      },
      rightPriceScale: { 
        borderVisible: false,
        textColor: '#555555' 
      },
      leftPriceScale: { visible: false },
      timeScale: { 
        borderVisible: false,
        timeVisible: true, 
        secondsVisible: false, 
        rightOffset: 3,
        fixLeftEdge: false,
        fixRightEdge: false,
      },
      crosshair: {
         mode:
          CrosshairMode.Normal,
          vertLine: { color: 'rgba(255,255,255,0.12)', width: 1, style: 0 },
          horzLine: { color: 'rgba(255,255,255,0.12)', width: 1, style: 0 },
        },
      grid: { 
        vertLines: { visible: false }, 
        horzLines: { color: 'rgba(255,255,255,0.04)' },
      }
    });
    chartRef.current = chart;

    const lineSeries = chart.addSeries(LineSeries, { 
      color: '#c8f04d', 
      lineWidth: 2 });
    seriesRef.current = lineSeries;

    // simple tooltip element (used by crosshair handler)
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: absolute;
      display: none;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-family: 'DM Mono', monospace;
      background: #181b1f;
      color: #f0ede8;
      pointer-events: none;
      z-index: 1000;
      white-space: nowrap;
      line-height:1.6;
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

  // update data & markers
  useEffect(() => {
    const chart = chartRef.current;
    const line = seriesRef.current;
    const tooltip = tooltipRef.current;
    if (!chart || !line || !tooltip) return;

    // price data (daily)
    const uniqueDates = new Map<string, number>();

    data.forEach((d) => {
      if (d.date && d.close) {
        uniqueDates.set(d.date, Number(d.close));
      }
    });

    const priceData: LineData[] = Array.from(uniqueDates.entries())
      .map(([dateStr, close]) => ({
        time: toUtcTimestamp(dateStr),
        value: close,
      }))
      .sort((a, b) => (a.time as number) - (b.time as number));

    line.setData(priceData);

    // default visible range: 1 year
    requestAnimationFrame(() => {
      const last = priceData[priceData.length - 1];
      if (last) {
        const stockDays = 240 * 24 * 60 * 60;
        try {
          chart.timeScale().setVisibleRange({ from: ((last.time as number) - stockDays) as UTCTimestamp, to: last.time as UTCTimestamp });
        } catch {
          // ignore
        }
      }
    });

    // Group trades per day (seconds)
    const tradesByTime = new Map<number, InsiderTrade[]>();
    trades.forEach((t) => {
      const day = toUtcTimestamp(t.publishingDate.split('T')[0]) as number;
      const arr = tradesByTime.get(day) ?? [];
      arr.push(t);
      tradesByTime.set(day, arr);
    });

    // Build simple markers: one per day; circle shape; no text
    const markers: SeriesMarker<UTCTimestamp>[] = [];
    const tradeLookup = new Map<number, InsiderTrade[]>();

    tradesByTime.forEach((list, time) => {
      // marker uses the same series (no text)
      markers.push({
        time: time as UTCTimestamp,
        position: 'inBar',
        color: getTradeColor(list[0].transactionType),
        shape: 'circle',
        text: '',
      } as SeriesMarker<UTCTimestamp>);

      tradeLookup.set(time, list);
    });

    // attach markers to the main line series using createSeriesMarkers (v5)
    try {
      createSeriesMarkers(line, markers);
    } catch {
      type S = ISeriesApi<'Line'> & { setMarkers?: (m: SeriesMarker<UTCTimestamp>[]) => void };
      (line as S).setMarkers?.(markers);
    }

    const makeRow = (text: string, color: string, extraStyle?: string) => {
      const div = document.createElement('div');
      div.style.cssText = `color:${color};${extraStyle ?? ''}`;
      div.textContent = text;
      return div;
    }

    // crosshair tooltip: show aggregated trades for hovered time (first 3 + +N)
    const handleMove = (param: MouseEventParams) => {
      if (!tooltip) return;
      if (!param.point) {
        tooltip.style.display = 'none';
        return;
      }

      const time = param.time as UTCTimestamp;
      const tradesAtTime = tradeLookup.get(time) ?? [];

      if (tradesAtTime.length > 0) {
        const date = new Date((time as number) * 1000);
        tooltip.replaceChildren(
          makeRow(date.toLocaleDateString('sv-SE'), '#f0ede8', 'font-weight:600;margin-bottom:4px'),
          makeRow(`${tradesAtTime.length} transaktion(er)`, '#8a8a8a'),
          ...tradesAtTime.slice(0, 3).map((t) =>
            makeRow(
              `${t.transactionType} ${t.price ?? '--'} SEK`,
              getTradeColor(t.transactionType),
              'margin-top:4px',
            )
          ),
          ...(tradesAtTime.length > 3
            ? [makeRow(`+${tradesAtTime.length - 3} till`, '#555', 'margin-top:4px')]
            : []),
        );
        tooltip.style.display = 'block';
        const x = param.point.x ?? 0;
        const y = param.point.y ?? 0;
        tooltip.style.left = `${x + 14}px`;
        tooltip.style.top = `${y - 28}px`;
        return;
      }

      // fallback: show price of line series under cursor
      const seriesDataForLine = param.seriesData?.get(line) as { value?: number } | undefined;
      const price = seriesDataForLine?.value;
      if (price === undefined) {
        tooltip.style.display = 'none';
        return;
      }

      const d = new Date((param.time as number) * 1000);
      tooltip.replaceChildren(
        makeRow(d.toLocaleDateString('sv-SE'), '#8a8a8a', 'margin-bottom:2px'),
        makeRow(`${price.toLocaleString('sv-SE')} • SEK`, '#f0ede8'),
      );
      tooltip.style.display = 'block';
      const x = param.point.x ?? 0;
      const y = param.point.y ?? 0;
      tooltip.style.left = `${x + 14}px`;
      tooltip.style.top = `${y - 28}px`;
    };

    const unsub: unknown = chart.subscribeCrosshairMove(handleMove);
    let cleanupUnsub: (() => void) | undefined;
    if (typeof unsub === 'function') cleanupUnsub = unsub as () => void;
    else if (unsub && typeof (unsub as { unsubscribe: unknown }).unsubscribe === 'function') {
      cleanupUnsub = () => ((unsub as { unsubscribe: () => void }).unsubscribe());
    }

    return () => {
      try {
        cleanupUnsub?.();
      } catch {}
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
