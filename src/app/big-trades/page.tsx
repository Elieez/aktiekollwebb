import { InsiderTrade } from '../../types';
import TradesList from '../../components/BigTradesList';

export const metadata = {
  title: 'Big Insider Trades',
};

export default async function BigTradesPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bigtrades`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to load big trades');
  const trades: InsiderTrade[] = await res.json();

  return (
    <div className="container">
      <header className="header">
        <div className="title">Big Trades</div>
      </header>
      <main className="main-content">
        <TradesList trades={trades} />
      </main>
    </div>
  );
}
