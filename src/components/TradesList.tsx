"use client";

import { useState, useTransition } from "react";
import { InsiderTrade } from "@/lib/types/InsiderTrade";
import { getInsiderTrades } from "@/lib/api/insider-trades";

interface TradesListProps {
  trades: InsiderTrade[];
  enablePagination?: boolean;
}

const getTransactionTypeColor = (type: string) => {
  switch (type) {
    case 'Förvärv':
      return 'text-green-600 bg-green-100';
    case 'Avyttring':
      return 'text-red-600 bg-red-100';
    case 'Teckning':
      return 'text-blue-600 bg-blue-100';
    case 'Tilldelning':
      return 'text-purple-600 bg-purple-100';
    default:
      return 'text-gray-600 bg-gray-100';
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
    return `Today ${time}`;
  }

  if (date >= yesterday && date < today) {
    return `Yesterday ${time}`;
  }

  const dayMonth = date
    .toLocaleDateString('sv-SE', { month: 'short', day: '2-digit' })
    .replace(/\//g, ' ');

  return `${dayMonth} ${time}`;
};

export default function TradesList({ trades, enablePagination = false }: TradesListProps) {
  const [items, setItems] = useState(trades);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1;
      const more = await getInsiderTrades(nextPage, 10);
      setItems(prev => [...prev, ...more]);
      setPage(nextPage);
    });
  };

  return (
    <div>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        <p className="text-sm text-gray-600 mt-1">Latest insider trading activity</p>
      </div>

      <div className="overflow-hidden">
        {items.length === 0 && (
          <p className="p-6 text-center text-gray-500">No Transactions</p>
        )}
        {items.map((trade, index) => (
          <div
            key={`${trade.id}-${index}`}
            className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{trade.companyName}</h3>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${getTransactionTypeColor(trade.transactionType)}`}>
                    {trade.transactionType}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <p className="text-gray-700">{trade.insiderName}</p>
                  <p className="text-sm text-gray-500">{mapPosition(trade.position)}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Shares</span>
                    <p className="font-medium text-gray-900">{formatNumber(trade.shares)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Price/Share</span>
                    <p className="font-medium text-gray-900">{trade.price.toFixed(2)} SEK</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Value</span>
                    <p className="font-medium text-gray-900">{formatCurrency(trade.shares * trade.price)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date</span>
                    <p className="font-medium text-gray-900">{formatDate(trade.publishingDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {enablePagination && (
        <div className="p-6 text-center">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-300 cursor-pointer"
          >
            {isPending ? "Laddar..." : "Visa Mer"}
          </button>
        </div>
      )}
    </div>
  );
}