import { InsiderTrade } from '../../types';
import '../../app/globals.css';
import TradesList from '../../components/TradesList';
import BigTradesList from '../../components/BigTradesList';
import TradesCount from '../../components/TradesCount';
import CompanySearch from '../../components/SearchBar';

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

  // Fetch the big trades data
  const bigTradesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/insidertrades/top`, {
    cache: 'no-store',
  });

  if (!bigTradesRes.ok) throw new Error('Failed to load big trades');

  const bigTrades: InsiderTrade[] = await bigTradesRes.json();

  const tradesCount = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/insidertrades/top-companies`, {
    cache: 'no-store',
  });

  if (!tradesCount.ok) throw new Error('Failed to load trades count');

  const tradesCountData = await tradesCount.json();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AktieKoll</h1>
          <p className="text-gray-600 mt-2">Track the latest insider transactions</p>
        </header>

          <section className="">
            <CompanySearch />
          </section>
        <main className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          {/* Search Bar Section */}

          {/* Trades Count Section */}
          <section className="lg:col-span-1">
            <TradesCount companies={tradesCountData} />
          </section>

          {/* Trades Section */}
          <section className="lg:col-span-3">
            <TradesList trades={trades} />
          </section>

          {/* Big Trades Section */}
          <section className="lg:col-span-2">
            <BigTradesList trades={bigTrades} />
          </section>
        </main>
      </div>
    </div>
  );
}
