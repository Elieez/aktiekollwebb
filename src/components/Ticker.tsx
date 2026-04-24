import { InsiderTrade } from "@/lib/types/InsiderTrade";

interface TickerProps {
  trades: InsiderTrade[];
}

function fmtAmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} Mkr`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)} tkr`;
  return new Intl.NumberFormat("sv-SE").format(Math.round(n));
}

function tagClasses(type: string): string {
  switch (type) {
    case "Förvärv":
    case "Teckning":
    case "Tilldelning":
      return "bg-buy-dim text-buy";
    case "Avyttring":
      return "bg-sell-dim text-sell";
    default:
      return "bg-accent-dim text-accent";
  }
}

function tagLabel(type: string): string {
  switch (type) {
    case "Förvärv":
    case "Teckning":   return "KÖP";
    case "Tilldelning": return "TIL";
    case "Avyttring":  return "SÄLJ";
    default:           return type.slice(0, 3).toUpperCase();
  }
}

function isBuy(type: string): boolean {
  return type !== "Avyttring";
}

export default function Ticker({ trades }: TickerProps) {
  const items = trades.slice(0, 12);
  const doubled = [...items, ...items];

  return (
    <div className="ticker relative h-10 overflow-hidden border-t border-b border-border bg-bg2">

      {/* Clipped scrolling area — starts after the label */}
      <div className="absolute inset-y-0 left-32 right-0 overflow-hidden">
        <div className="ticker-track flex h-full min-w-max items-center gap-8">
          {doubled.map((t, i) => {
            const buy = isBuy(t.transactionType);
            const amt = t.shares * t.price;
            return (
              <span
                key={i}
                className="inline-flex items-center gap-2 whitespace-nowrap text-[12px]"
              >
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${tagClasses(t.transactionType)}`}
                >
                  {tagLabel(t.transactionType)}
                </span>
                <span className="font-medium text-ink">{t.companyName}</span>
                <span className="text-faint">{t.insiderName}</span>
                <span className={`font-mono ${buy ? "text-buy" : "text-sell"}`}>
                  {buy ? "▲" : "▼"} {fmtAmt(amt)}
                </span>
                <span className="text-faint" aria-hidden>·</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Gradient fade from label into track */}
      <div
        className="pointer-events-none absolute inset-y-0 z-[5] w-12"
        style={{ left: "128px", background: "linear-gradient(to right, var(--color-bg2), transparent)" }}
      />

      {/* Left label — sits on top with solid background */}
      <div className="absolute inset-y-0 left-0 z-10 flex w-32 items-center gap-2 bg-bg2 pl-4 pr-2">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-buy opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-buy" />
        </span>
        <span className="whitespace-nowrap font-display text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          Live flöde
        </span>
      </div>

    </div>
  );
}
