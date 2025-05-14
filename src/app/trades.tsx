// src/app/trades/page.tsx
import { InsiderTrade } from '../types';

export const metadata = {
  title: 'Insider Trades'
};

export default async function InsiderTradesPage() {
  // Always fetch fresh data
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/InsiderTrades`,
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
          <li key={trade.id} className="border rounded-xl p-4 shadow-sm">
  <div className="flex justify-between">
    <h2 className="text-2xl font-semibold">
      {trade.companyName}
    </h2>
    <time
      dateTime={new Date(trade.date).toISOString()}
      className="text-gray-500 text-sm"
    >
      {new Date(trade.date).toLocaleDateString()}
    </time>
  </div>
  <p>
    <strong>Insider:</strong> {trade.insiderName} (
    {trade.position})
  </p>
  <p>
    <strong>Type:</strong> {trade.transactionType}
  </p>
  <p>
    <strong>Shares:</strong> {trade.shares.toLocaleString()}
  </p>
  <p>
    <strong>Price:</strong> {trade.price.toFixed(2)} Sek
  </p>
</li>
        ))}
      </ul>
    </main>
  );
}
