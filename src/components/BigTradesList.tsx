import { InsiderTrade } from "@/lib/types/InsiderTrade";

interface TopTradesProps {
  trades: InsiderTrade[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const time = date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  if (date >= today) return `Idag ${time}`;
  if (date >= yesterday) return `Igår ${time}`;
  return date.toLocaleDateString('sv-SE', { month: 'short', day: '2-digit' }).replace(/\//g, ' ');
};

const rankStyle: Record<number, string> = {
  0: "text-gold",
  1: "text-silver",
  2: "text-bronze",
};

export default function BigTradesList({ trades }: TopTradesProps) {
  return (
    <div>
      <div className="mb-4 px-1">
        <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">
          Topp 10 · Största affärer
        </h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-bg2 card-shadow">
        {trades.map((trade, index) => {
          const isBuy = trade.transactionType === "Förvärv";
          return (
            <div
              key={index}
              className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors duration-100 last:border-b-0 hover:bg-bg3 cursor-pointer"
            >
              {/* Rank */}
              <span className={`w-5 shrink-0 text-center font-mono text-[12px] font-semibold ${rankStyle[index] ?? "text-faint"}`}>
                {index + 1}
              </span>

              {/* Name + insider */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-ink leading-none mb-0.5" title={trade.companyName || '-'}>
                  {trade.companyName}
                </div>
                <div className="truncate text-[12px] text-faint">{trade.insiderName}</div>
              </div>

              {/* Value + type */}
              <div className="shrink-0 text-right">
                <div className={`font-mono text-[13px] font-semibold ${isBuy ? "text-buy" : "text-sell"}`}>
                  {formatCurrency(trade.price * trade.shares)}
                </div>
                <div className="mt-0.5 flex items-center justify-end gap-1.5">
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${isBuy ? "bg-buy" : "bg-sell"}`} />
                  <span className="font-mono text-[11px] text-faint">
                    {isBuy ? "KÖP" : "SÄLJ"} · {formatDate(trade.publishingDate)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
