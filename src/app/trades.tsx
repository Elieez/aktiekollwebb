// src/app/trades/page.tsx
import { InsiderTrade } from '../types';

export const metadata = {
  title: 'Insider Trades'
};

export default async function InsiderTradesPage() {
  // Always fetch fresh data
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/insidertrades`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    throw new Error('Failed to load insider trades');
  }
  const trades: InsiderTrade[] = await res.json();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Insider Trades</h1>
      <ul className="space-y-4">
        {trades.map((trade) => (
          <li
            key={trade.Id}
            className="border rounded-xl p-4 shadow-sm"
          >
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold">
                {trade.CompanyName}
              </h2>
              <span className="text-gray-500">
                {new Date(trade.Date).toLocaleDateString()}
              </span>
            </div>
            <p>
              <strong>Insider:</strong> {trade.InsiderName} (
              {trade.Position})
            </p>
            <p>
              <strong>Type:</strong> {trade.TransactionType}
            </p>
            <p>
              <strong>Shares:</strong> {trade.Shares.toLocaleString()}
            </p>
            <p>
              <strong>Price:</strong> €{trade.Price.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
