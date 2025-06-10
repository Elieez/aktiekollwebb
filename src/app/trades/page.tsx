import { InsiderTrade } from '../../types';
import '../../app/globals.css';
import TradesList from '../../components/TradesList';
import BigTradesList from '../../components/BigTradesList';

export const metadata = {
  title: 'Insider Trades & Big Trades',
};

export default async function TradesPage() {
  // Fetch the data once
  const tradesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/insidertrades`, {
    cache: 'no-store',
  });

  if (!tradesRes.ok) throw new Error('Failed to load insider trades');

  const trades: InsiderTrade[] = await tradesRes.json();

  // Simulate "big trades" by filtering the top 3
  const bigTrades: InsiderTrade[] = trades
    .sort((a, b) => b.shares * b.price - a.shares * a.price) // Sort by trade value
    .slice(0, 10); // Take the top 10 trades

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AktieKoll</h1>
          <p className="text-gray-600 mt-2">Track the latest insider transactions</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trades Section */}
          <section className="lg:col-span-2">
            <TradesList trades={trades} />
          </section>

          {/* Big Trades Section */}
          <section className="lg:col-span-1">
            <BigTradesList trades={bigTrades} />
          </section>
        </main>
      </div>
    </div>
  );
}
