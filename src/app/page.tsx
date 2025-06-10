import { InsiderTrade } from '../types';
import TradesList from '../components/TradesList';
import BigTradesList from '../components/BigTradesList';

export const metadata = {
  title: 'Insider Trades & Big Trades',
};

export default async function InsiderTradesPage() {
  const [tradesRes, bigRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/insidertrades`, {
      cache: 'no-store',
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bigtrades`, {
      cache: 'no-store',
    }),
  ]);
  if (!tradesRes.ok) throw new Error('Failed to load insider trades');
  if (!bigRes.ok) throw new Error('Failed to load big trades');
  const trades: InsiderTrade[] = await tradesRes.json();
  const bigTrades: InsiderTrade[] = await bigRes.json();

  return (
    <div className="container">
      <header className="header">
        <div className="title">
          AktieKoll
        </div>
      </header>

      <main className="main-content">
        <TradesList trades={trades} />
        <BigTradesList trades={bigTrades} />
      </main>
    </div>
  );
}