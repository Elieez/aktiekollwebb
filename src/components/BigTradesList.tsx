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

  const time = date.toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  });
  if (date >= today && date < new Date(today.getTime() + 86400000)) {
    return `Idag ${time}`;
  }

  if (date >= yesterday && date < today) {
    return `Igår ${time}`;
  }

  const dayMonth = date
    .toLocaleDateString('sv-SE', { month: 'short', day: '2-digit' })
    .replace(/\//g, ' ');

  return `${dayMonth} ${time}`;
};

const rankStyle: Record<number, string> = {
  0: "text-[#f0c94d]",   // gold
  1: "text-[#9ba3b0]",   // silver
  2: "text-[#a07050]",   // bronze
};

export default function BigTradesList({ trades }: TopTradesProps) {
  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">
          Topp 10 - Största affärer</h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-bg2">
          {trades.map((trade, index) => (
            <div
              key={index}
              className="flex cursor-pointer items-center gap-2.5 border-b border-white/[0.07] px-4 py-2.75 transition-colors 
              last:border-b-0 hover:bg-bg3">
              
              <span
                className={`w-4.5 shrink-0 text-center font-mono text-[12px] ${
                  rankStyle[index] ?? "text-[#666]" 
                }`}
              >
                {index + 1}
              </span>
              
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-ink">{trade.companyName}</div>
                <div className="truncate text-[13px] text-[#666]">{trade.insiderName}</div>
              </div>
                
              <div className="shrink-0 text-right">
                <div
                  className={`font-mono text-[13px] ${
                    trade.transactionType === "Förvärv" ? "text-buy" : "text-sell"
                  }`}
                >
                  {formatCurrency(trade.price * trade.shares)}
                </div>
                <div className="mt-px font-mono text-[12px] text-[#666]">
                  {trade.transactionType === "Förvärv" ? "KÖP" : "SÄLJ"} · {formatDate(trade.publishingDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}
