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

const getTransactionTypeColor = (type: string) => {
  switch (type) {
    case 'Förvärv':
      return 'text-green-600 bg-green-50';
    case 'Avyttring':
      return 'text-red-600 bg-red-50';
    case 'Teckning':
      return 'text-blue-600 bg-blue-50';
    case 'Tilldelning':
      return 'text-purple-600 bg-purple-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
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
        <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">
          Topp 10 - Största affärer</h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#111316]">
          {trades.map((trade, index) => (
            <div
              key={index}
              className="flex cursor-pointer items-center gap-2.5 border-b border-white/[0.07] px-4 py-2.75 transition-colors 
              last:border-b-0 hover:bg-[#181b1f]">
              
              <span
                className={`w-4.5 shrink-0 text-center font-mono text-[11px] ${
                  rankStyle[index] ?? "text-[#555]" 
                }`}
              >
                {index + 1}
              </span>
              
              <div className="min-w-0 flex-1">
                <div className="turncate text-[13px] font-medium text-[#f0ede8]">{trade.companyName}</div>
                <div className="turncate text-[11px] text-{#555]">{trade.insiderName}</div>
              </div>
                
              <div className="shrink-0 text-right">
                <div
                  className={`font-mono text-[13px] ${
                    trade.transactionType === "Förvärv" ? "text-[#4deba8]" : "text-[#f06b4d]"
                  }`}
                >
                  {formatCurrency(trade.price * trade.shares)}
                </div>
                <div className="mt-px font-mono text-[10px] text-[#555]">
                  {trade.transactionType === "Förvärv" ? "KÖP" : "SÄLJ"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}
