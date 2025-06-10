import { InsiderTrade } from '../types';
import TradesList from '../components/TradesList';

export const metadata = {
  title: 'Insider Trades',
};

export default async function InsiderTradesPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/insidertrades`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to load insider trades');
  const trades: InsiderTrade[] = await res.json();

  return (
    <div className="container">
      <header className="header">
        <div className="title">
          AktieKoll
        </div>
      </header>

      <main className="main-content">
        <TradesList trades={trades} />
      </main>
    </div>
  );
}