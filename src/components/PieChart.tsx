interface PieChartProps {
  data: number[];
  title?: string;
}

export default function PieChart({ data, title = 'Transaktioner 12 mån' }: PieChartProps) {
  const [buy, sell] = data;
  const total = buy + sell;

  if (total === 0) {
    return null;
  }

  const buyPct = Math.round((buy / total) * 100);
  const sellPct = Math.round((sell / total) * 100);
  const buyDeg = (buy / total) * 360;

  const conicStyle = {
    background: `conic-gradient(var(--color-buy) 0deg ${buyDeg}deg, var(--color-sell) ${buyDeg}deg 360deg)`,
  } as React.CSSProperties;

  return (
        <div className="flex flex-col items-center gap-4 px-4 py-5">
 
      {/* Title */}
      <p className="font-display text-[11px] font-semibold tracking-[0.08em] uppercase text-muted">
        {title}
      </p>
 
      {/* Donut */}
      <div className="relative w-46 h-46">
        {/* Outer ring */}
        <div className="w-full h-full rounded-full" style={conicStyle} />
        {/* Inner hole — matches card bg */}
        <div className="absolute inset-4.5 rounded-full bg-bg2 flex flex-col items-center justify-center">
          <span className="font-display text-lg font-semibold text-ink leading-none">
            {total}
          </span>
          <span className="font-mono text-[9px] text-faint uppercase tracking-widest mt-0.5">
            totalt
          </span>
        </div>
      </div>
 
      {/* Legend */}
      <div className="w-full flex flex-col gap-2">
 
        {/* Buy row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-buy shrink-0" />
            <span className="text-[12px] text-muted">Förvärv</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] text-ink">{buy}</span>
            <span className="font-mono text-[11px] text-faint w-9 text-right">{buyPct}%</span>
          </div>
        </div>
 
        {/* Divider */}
        <div className="h-px bg-border" />
 
        {/* Sell row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sell shrink-0" />
            <span className="text-[12px] text-muted">Avyttring</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] text-ink">{sell}</span>
            <span className="font-mono text-[11px] text-faint w-9 text-right">{sellPct}%</span>
          </div>
        </div>
 
      </div>
    </div>
  );
}
