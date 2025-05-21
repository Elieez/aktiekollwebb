import { InsiderTrade } from '../types';
import Image from 'next/image';
import './globals.css';

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
        <div className="trades-list">
          <h2 className="list-title">Recent Transactions</h2>
          {trades.map((trade) => (
            <div key={trade.id} className="trade-item">
              <div className="flex justify-between mb-1">
                <strong>{trade.companyName}</strong>
                <time dateTime={new Date(trade.date).toISOString()}>
                  {new Date(trade.date).toLocaleDateString()}
                </time>
              </div>
              <p>
                <strong>Insider:</strong> {trade.insiderName} ({trade.position})
              </p>
              <p>
                <strong>Type:</strong> {trade.transactionType}
              </p>
              <p>
                <strong>Shares:</strong> {trade.shares.toLocaleString()}
              </p>
              <p>
                <strong>Price:</strong> {trade.price.toFixed(2)} SEK
              </p>
              <p>
                <strong>Total Value:</strong>{' '}
                {(trade.shares * trade.price).toLocaleString()} SEK
              </p>
            </div>
          ))}
        </div>
      </div>      
    </div>
  );
}