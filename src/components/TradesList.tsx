"use client";

import { useState, useTransition } from "react";
import { InsiderTrade } from "@/lib/types/InsiderTrade";
import { 
  getInsiderTrades,
  getInsiderTradesByCompanyName,
} from "@/lib/api/insider-trades";

interface TradesListProps {
  trades: InsiderTrade[];
  enablePagination?: boolean;
  companyName?: string;
}

const getTransactionTypeColor = (type: string) => {
  switch (type) {
    case 'Förvärv':
      return { badge: 'bg-[rgba(77,235,168,0.1)] text-[#4deba8]', dot: 'bg-green-600' };
    case 'Avyttring':
      return { badge: 'bg-[rgba(240,107,77,0.1)] text-[#f06b4d]', dot: 'bg-red-600' };
    case 'Teckning':
      return { badge: 'bg-[rgba(10,100,188,0.1)] text-[#0a64bc]', dot: 'bg-blue-600' };
    case 'Tilldelning':
      return { badge: 'bg-[rgba(255,238,140,0.1)] text-[#ffee8c]', dot: 'bg-yellow-600' };
    default:
      return { badge: 'bg-[rgba(128,128,128,0.1)] text-[#808080]', dot: 'bg-gray-600' };
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('sv-SE').format(num);
};

const mapPosition = (position: string) => {
  if (
    position ===
    'Annan medlem i bolagets administrations-, lednings- eller kontrollorgan'
  ) {
    return 'Övrig medlem i ledning';
  }
  return position;
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
 
export default function TradesList({ trades, enablePagination = false, companyName }: TradesListProps) {
  const pageSize = companyName ? 10 : 15;
  const [items, setItems] = useState(trades);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [hasMore, setHasMore] = useState(trades.length >= pageSize);
  
  const loadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1;

      let more: InsiderTrade[] = [];

      if (companyName) {
        const skip = (nextPage - 1) * pageSize;
        more = await getInsiderTradesByCompanyName(companyName, skip, pageSize);
      } else {
        more = await getInsiderTrades(nextPage, pageSize);
      }
      
      setItems(prev => [...prev, ...more]);
      setPage(nextPage);

      if (more.length < pageSize) {
        setHasMore(false);
      }
    });
  };

  return (
    <div>
      {/* Section header */}
      <div className="mb-4 px-1">
        <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">
          Senaste insideraffärer
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#111316] mt-2">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/[0.07] bg-[#181b1f]">
            {["Bolag", "Insider", "Roll", "Typ", "Värde", "Datum"].map((h, i) => (
              <th
                key={h}
                className={`px-4 py-2.5 font-display text-[10px] font-semibold uppercase tracking-widest text-[#555]
                  ${
                    i >= 4 ? "text-right" : "text-left"
                }`}
                >
                  {h}
                </th>
            ))}
            </tr>
          </thead>
          <tbody>
            {items.map((t, idx) => {
              return (
                <tr 
                  key={idx}
                  className="cursor-pointer border-b border-white/[0.07] transition-colors last:border-b-0 hover:bg-[#181b1f]">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-[#f0ede8]">{t.companyName}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-[13px] text-[#8a8a8a]">{t.insiderName}</td>

                  <td className="px-4 py-3 text-[12px] text-[#555]">{t.position}</td>

                  <td className="px-4 py-3">
              <span
                className={`inline-flex items-center gap-1 rounded-[5px] px-2 py-0.75 font-mono text-[11px] font-medium ${getTransactionTypeColor(
                  t.transactionType).badge}`}
              >
                <span className={`inline-block h-1.25 w-1.25 rounded-full ${getTransactionTypeColor(t.transactionType).dot}`}/>
                {t.transactionType}
              </span>
            </td>

                  <td className="px-4 py-3 text-right font-mono text-[13px] text-[#f0ede8]">
                    {formatCurrency(t.shares * t.price)}
                  </td>

                  <td className="px-4 py-3 text-right font-mono text-[11px] whitespace-nowrap text-[#555]">
                    {formatDate(t.publishingDate)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        
      </div>
      {enablePagination && hasMore && (
        <div className="p-6 text-center">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="
              w-full
              rounded-xl
              border border-white/8
              bg-[#111316]
              px-4 py-2.5
              font-display text-[12px] font-medium uppercase tracking-[0.06em]
              text-[#8a8a8a]
              transition-all duration-200

              hover:bg-[#181b1f]
              hover:text-[#f0ede8]
              hover:border-white/12
              cursor-pointer

              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            {isPending ? "Laddar..." : "Visa mer"}
          </button>
        </div>
      )}
    </div>
  );
}