import { TradeStats } from "@/lib/types/TradeStats";

interface HeroProps{
  stats: TradeStats;
}


export default function Hero({ stats }: HeroProps) {
  function formatValue(value: number): string {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} Mdr`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} Mkr`;
    return new Intl.NumberFormat("sv-SE").format(value);
  }

  const statItems = [
    { val: stats.totalTransactions.toLocaleString("sv-SE"), label: "Transaktioner i år" },
    { val: formatValue(stats.totalValue) + " kr",           label: "Handelsvärde i år" },
    { val: "218",    label: "Aktiva bolag" },
  ];
    return (
    <div className="mx-auto flex max-w-380 animate-fadeUp flex-col gap-6 border-b border-border px-4 pt-10 pb-8 sm:px-8 sm:pt-14 sm:pb-10 lg:flex-row lg:items-end lg:justify-between">
      {/* Copy */}
      <div>
        <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
          Offentlig insynsdata · Finansinspektionen
        </p>
        <h1 className="mb-3 font-display text-[clamp(24px,4vw,44px)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
          Se vad bolagsledare<br />
          <em className="not-italic text-accent">köper och säljer</em> i sina egna bolag
        </h1>
        <p className="max-w-xl text-sm leading-7 text-muted">
          Enligt lag måste chefer, styrelseledamöter och andra insynspersoner rapportera
          alla aktieaffärer i det egna bolaget till Finansinspektionen.
          AktieKoll samlar och visar dessa transaktioner i realtid — helt gratis.
        </p>
      </div>

      {/* Stats */}
      <div className="flex shrink-0 gap-6 sm:gap-8 lg:justify-end">
        {statItems.map((s) => (
          <div key={s.label} className="lg:text-right">
            <span className="block font-display text-xl font-semibold text-ink sm:text-2xl">
              {s.val}
            </span>
            <span className="text-[11px] uppercase tracking-widest text-[#666] sm:text-[12px]">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}