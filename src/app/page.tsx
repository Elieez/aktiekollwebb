// src/app/page.tsx
import { InsiderTrade } from '../types';
import Image from 'next/image';

export const metadata = {
  title: 'Insider Trades',
};

export default async function InsiderTradesPage() {
  // Fetch fresh data on every request
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/insidertrades`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    throw new Error('Failed to load insider trades');
  }
  const trades: InsiderTrade[] = await res.json();

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-center mb-8">
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={26}
          className="dark:invert mr-4"
          priority
        />
        <h1 className="text-4xl font-bold">Insider Trades</h1>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trades.map((trade) => (
          <li
            key={trade.id}
            className="border rounded-xl p-6 shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold">
                {trade.companyName}
              </h2>
              <time
                dateTime={trade.date}
                className="text-gray-500 text-sm"
              >
                {new Date(trade.date).toLocaleDateString()}
              </time>
            </div>
            <p className="mb-1">
              <span className="font-medium">Insider:</span>{' '}
              {trade.insiderName} <em>({trade.position})</em>
            </p>
            <p className="mb-1">
              <span className="font-medium">Transaction:</span>{' '}
              {trade.transactionType}
            </p>
            <p className="mb-1">
              <span className="font-medium">Shares:</span>{' '}
              {trade.shares.toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Price:</span> €
              {trade.price.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>

      <footer className="mt-12 text-center text-sm text-gray-500">
        Powered by your ASP .NET Core Web API
      </footer>
    </div>
  );
}
