'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import type { SeriesPoint } from '@/lib/types/ShortPosition';
import {
  createChart,
  CrosshairMode,
  LineSeries,
  LineType,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  type UTCTimestamp,
} from 'lightweight-charts';

interface ShortChartProps {
  totalSeries: SeriesPoint[];
  significantSeries: SeriesPoint[];
}

const palette = (isLight: boolean) => ({
  accent: isLight ? '#16a34a' : '#c8f04d',
  muted: isLight ? '#6b6560' : '#8a8a8a',
  scaleText: isLight ? '#6b6560' : '#555555',
  cross: isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.12)',
  grid: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)',
});

function toLineData(points: SeriesPoint[]): LineData[] {
  const byTime = new Map<number, number>();
  for (const p of points) {
    const ms = new Date(p.date).getTime();
    if (Number.isNaN(ms) || typeof p.value !== 'number') continue;
    byTime.set(Math.floor(ms / 1000), p.value);
  }
  return Array.from(byTime.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([t, v]) => ({ time: t as UTCTimestamp, value: v }));
}

const pctFormat = (v: number) =>
  `${v.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

export default function ShortChart({ totalSeries, significantSeries }: ShortChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const totalRef = useRef<ISeriesApi<'Line'> | null>(null);
  const sigRef = useRef<ISeriesApi<'Line'> | null>(null);
  const { theme } = useTheme();

  const total = toLineData(totalSeries);
  const sig = toLineData(significantSeries);
  const showTotal = total.length >= 2;
  const showSig = sig.length >= 2;
  const colors = palette(theme === 'light');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const c = palette(document.documentElement.classList.contains('light'));

    const chart = createChart(el, {
      width: el.clientWidth,
      height: el.clientHeight || 256,
      layout: {
        background: { color: 'transparent' },
        textColor: c.muted,
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
      },
      rightPriceScale: { borderVisible: false, textColor: c.scaleText },
      leftPriceScale: { visible: false },
      timeScale: { borderVisible: false, rightOffset: 2 },
      localization: { priceFormatter: pctFormat },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: c.cross, width: 1, style: 0 },
        horzLine: { color: c.cross, width: 1, style: 0 },
      },
      grid: { vertLines: { visible: false }, horzLines: { color: c.grid } },
    });
    chartRef.current = chart;

    totalRef.current = chart.addSeries(LineSeries, {
      color: c.accent,
      lineWidth: 2,
      lineType: LineType.WithSteps,
      priceLineVisible: false,
    });
    sigRef.current = chart.addSeries(LineSeries, {
      color: c.muted,
      lineWidth: 2,
      lineType: LineType.WithSteps,
      priceLineVisible: false,
    });

    const onResize = () => {
      if (!containerRef.current || !chartRef.current) return;
      chartRef.current.resize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight || 256,
      );
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chart.remove();
      chartRef.current = null;
      totalRef.current = null;
      sigRef.current = null;
    };
  }, []);

  // data
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    totalRef.current?.setData(showTotal ? total : []);
    sigRef.current?.setData(showSig ? sig : []);
    chart.timeScale().fitContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSeries, significantSeries]);

  // theme
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const c = palette(theme === 'light');
    chart.applyOptions({
      layout: { textColor: c.muted },
      rightPriceScale: { textColor: c.scaleText },
      crosshair: { vertLine: { color: c.cross }, horzLine: { color: c.cross } },
      grid: { horzLines: { color: c.grid } },
    });
    totalRef.current?.applyOptions({ color: c.accent });
    sigRef.current?.applyOptions({ color: c.muted });
  }, [theme]);

  return (
    <div>
      {(showTotal || showSig) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2 font-mono text-[12px] text-muted">
          {showTotal && (
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5" style={{ background: colors.accent }} />
              Total blankning
            </span>
          )}
          {showSig && (
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5" style={{ background: colors.muted }} />
              Namngivna innehavare ≥ 0,5 %
            </span>
          )}
        </div>
      )}
      <div ref={containerRef} className="w-full h-64 sm:h-72" />
    </div>
  );
}
