import { InsiderTrade } from '../types';
import Image from 'next/image';
import './globals.css';
import TradesList from '../../components/TradesList';

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
      {/* Header */}
      <div className="header">
        <div className="title">
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={26}
            className="dark:invert mr-2 inline"
            priority
          />
          AktieKoll
        </div>
        {/* If you want stats/buttons in future, drop them here inside .stats-overview */}
      </div>

      {/* Main content: just the list for now */}
      <div className="main-content">
        <TradesList trades={trades} />
      </div>
    </div>
  );
}
