import { TradeStats } from "@/lib/types/TradeStats";
import { InsiderTrade } from "@/lib/types/InsiderTrade";
import HeroCTA from "@/components/HeroCTA";

interface HeroProps {
  stats: TradeStats;
  trades: InsiderTrade[];
}

function formatStatValue(v: number): string {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} Mdr kr`;
  if (v >= 1_000_000)     return `${(v / 1_000_000).toFixed(1)} Mkr`;
  return `${new Intl.NumberFormat("sv-SE").format(v)} kr`;
}

export default function Hero({ stats, trades }: HeroProps) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayTrades = trades.filter(t => t.publishingDate?.startsWith(todayStr));
  const todayCount  = todayTrades.length;
  const todayValue  = todayTrades.reduce((s, t) => s + t.shares * t.price, 0);

  const todayLabel = todayValue >= 1_000_000
    ? `+${(todayValue / 1_000_000).toFixed(1)} Mkr idag`
    : todayValue > 0
      ? `+${Math.round(todayValue / 1_000)} tkr idag`
      : null;

  const dateLabel = new Date().toLocaleDateString("sv-SE", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="border-b border-border bg-bg">
      <div className="mx-auto max-w-380 px-4 py-10 sm:px-8 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:items-stretch">

          {/* ── Left column ────────────────────────────────────── */}
          <div className="flex flex-col gap-7 fade-up">

            {/* Eyebrow badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-bg2 px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-buy opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-buy" />
              </span>
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                Uppdaterat idag · {dateLabel}
              </span>
            </div>

            {/* Heading */}
            <div>
              <h1
                className="font-display font-bold leading-[1.03] tracking-[-0.025em] text-ink"
                style={{ fontSize: "clamp(34px, 4.5vw, 58px)", textWrap: "balance" } as React.CSSProperties}
              >
                Spåra{" "}
                <em className="not-italic text-accent">insiderhandel</em>
                <br />
                på Stockholmsbörsen.
              </h1>
              <p
                className="mt-4 text-[16px] leading-relaxed text-muted"
                style={{ maxWidth: "500px", textWrap: "pretty" } as React.CSSProperties}
              >
                Köp och försäljningar av styrelsemedlemmar och ledning på
                Stockholmsbörsen – direkt från Finansinspektionen, uppdaterat varje dag.
              </p>
            </div>

            {/* Auth-aware CTAs + meta */}
            <HeroCTA />
          </div>

          {/* ── Right column – stats card ───────────────────────── */}
          <div className="flex flex-col lg:justify-end">
          <div
            className="relative overflow-hidden rounded-xl border border-border fade-up-delay"
            style={{ background: "linear-gradient(160deg, var(--color-bg2), var(--color-bg))" }}
          >
            {/* Accent glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(circle at 85% 0%, var(--color-accent-dim), transparent 60%)" }}
            />

            {/* Card header */}
            <div className="relative flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="font-display text-[11px] font-semibold uppercase tracking-widest text-faint">
                Marknaden just nu
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-buy">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-buy opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-buy" />
                </span>
                LIVE
              </span>
            </div>

            {/* Stats — 3 columns */}
            <div className="relative grid grid-cols-3 divide-x divide-border">
              <div className="px-4 py-3">
                <p className="font-display text-[11px] uppercase tracking-wider text-muted">Transaktioner</p>
                <p className="whitespace-nowrap font-display text-base font-semibold text-ink">
                  {stats.totalTransactions.toLocaleString("sv-SE")}
                </p>
                {todayCount > 0
                  ? <p className="mt-0.5 font-mono text-[11px] text-buy">+{todayCount} idag</p>
                  : <p className="mt-0.5 text-[11px] text-muted">i år</p>
                }
              </div>
              <div className="px-4 py-3">
                <p className="font-display text-[11px] uppercase tracking-wider text-muted">Handelsvärde</p>
                <p className="whitespace-nowrap font-display text-base font-semibold text-ink">
                  {formatStatValue(stats.totalValue)}
                </p>
                {todayLabel
                  ? <p className="mt-0.5 font-mono text-[11px] text-buy">{todayLabel}</p>
                  : <p className="mt-0.5 text-[11px] text-muted">i år</p>
                }
              </div>
              <div className="px-4 py-3">
                <p className="font-display text-[11px] uppercase tracking-wider text-muted">Aktiva bolag</p>
                <p className="whitespace-nowrap font-display text-base font-semibold text-ink">
                  {stats.uniqueCompanies.toLocaleString("sv-SE")}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">av ~1 000</p>
              </div>
            </div>

          </div>
          </div>

        </div>
      </div>
    </div>
  );
}
