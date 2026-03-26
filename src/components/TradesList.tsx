"use client";

import { useState, useTransition } from "react";
import { InsiderTrade } from "@/lib/types/InsiderTrade";
import { 
  getInsiderTrades,
  getInsiderTradesBySymbol,
} from "@/lib/actions/insider-trades";

interface TradesListProps {
  trades: InsiderTrade[];
  enablePagination?: boolean;
  symbol?: string;
  variant?: 'home' | 'stock';
  title?: string;
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

const formatCurrency = (amount: number, showDecimals: boolean = false) => {

  const hasDecimals = amount % 1 !== 0;

  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: showDecimals && hasDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals && hasDecimals ? 2 : 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('sv-SE').format(num);
};

const mapPosition = (position: string) => {
  if (
    position ===
    'Annan medlem i bolagets administrations-, lednings- eller kontrollorgan'
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
 
export default function TradesList({ 
  trades, 
  enablePagination = false, 
  symbol,
  variant = 'home',
  title 
}: TradesListProps) {
  const pageSize = symbol ? 10 : 15;
  const [items, setItems] = useState(trades);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [hasMore, setHasMore] = useState(trades.length >= pageSize);
  
  const loadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1;

      let more: InsiderTrade[] = [];

      if (symbol) {
        const skip = (nextPage - 1) * pageSize;
        more = await getInsiderTradesBySymbol(symbol, skip, pageSize);
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

    const headers = variant === 'stock'
  ? [
      { label: "Insider", align: "left", hideClass: "" },
      { label: "Roll", align: "left", hideClass: "hidden xl:table-cell" },
      { label: "Typ", align: "left", hideClass: "" },
      { label: "Antal", align: "right", hideClass: "hidden md:table-cell" },
      { label: "Pris/aktie", align: "right", hideClass: "hidden md:table-cell" },
      { label: "Totalt värde", align: "right", hideClass: "" },
      { label: "Datum", align: "right", hideClass: "hidden sm:table-cell" }
    ]
  : [
      { label: "Bolag", align: "left", hideClass: "" },
      { label: "Insider", align: "left", hideClass: "hidden sm:table-cell" },
      { label: "Roll", align: "left", hideClass: "hidden xl:table-cell" },
      { label: "Typ", align: "left", hideClass: "" },
      { label: "Totalt värde", align: "right", hideClass: "" },
      { label: "Datum", align: "right", hideClass: "hidden sm:table-cell" }
    ];

    const defaultTitle = variant === 'stock' 
      ? 'Insideraffärer' 
      : 'Senaste insideraffärer';

  return (
    <div>
      {/* Section header */}
      <div className="mb-4 px-1">
        <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">
          {title || defaultTitle}
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-bg2 mt-2">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/[0.07] bg-bg3">
            {headers.map((h) => (
              <th
                key={h.label}
                className={`px-2 py-2.5 sm:px-4 font-display text-[11px] font-semibold uppercase tracking-widest text-[#666]
                  ${h.align === "right" ? "text-left sm:text-right" : "text-left"} ${h.hideClass}`}
                >
                  {h.label}
                </th>
            ))}
            </tr>
          </thead>
          <tbody>
            {items.map((t, idx) => {
              const colors = getTransactionTypeColor(t.transactionType);
              return (
                <tr 
                  key={idx}
                  className="cursor-pointer border-b border-white/[0.07] transition-colors last:border-b-0 hover:bg-bg3">
                  {variant === 'home' && (
                    <td className="px-2 py-3 sm:px-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-ink">{t.companyName}</span>
                      </div>
                    </td>
                  )}

                  <td className={`px-2 py-3 text-[13px] text-muted sm:px-4 ${variant === 'home' ? 'hidden sm:table-cell' : ''}`}>{t.insiderName}</td>

                  <td className="hidden px-2 py-3 max-w-50 sm:px-4 xl:table-cell">
                    <div className="truncate text-[12px] text-[#666]" title={t.position || '-'}>
                      {mapPosition(t.position)}
                    </div>
                  </td>

                  <td className="px-2 py-3 sm:px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-[5px] px-2 py-0.75 font-mono text-[11px] font-medium ${colors.badge}`}
                    >
                      <span className={`inline-block h-1.25 w-1.25 rounded-full ${colors.dot}`}/>
                      {t.transactionType}
                    </span>
                  </td>

                  {variant === 'stock' && (
                    <>
                      <td className="hidden px-2 py-3 text-right sm:px-4 md:table-cell">
                        <span className="font-mono text-[13px] text-[#D1D5DB]">
                          {formatNumber(t.shares)}
                        </span>
                        <span className="ml-1 text-[12px] text-[#666]">st</span>
                      </td>
                      <td className="hidden px-2 py-3 text-right sm:px-4 md:table-cell">
                        <span className="font-mono text-[13px] text-[#D1D5DB]">
                          {formatCurrency(t.price, true)}
                        </span>
                      </td>
                    </>
                  )}

                  <td className="px-2 py-3 text-left font-mono text-[13px] text-[#FFFFFF] sm:px-4 sm:text-right">
                    {formatCurrency(t.shares * t.price)}
                  </td>

                  <td className="hidden px-2 py-3 text-right font-mono text-[12px] whitespace-nowrap text-[#666] sm:table-cell sm:px-4">
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
              bg-bg2
              px-4 py-2.5
              font-display text-[12px] font-medium uppercase tracking-[0.06em]
              text-muted
              transition-all duration-200

              hover:bg-bg3
              hover:text-ink
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