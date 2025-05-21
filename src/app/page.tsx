import { InsiderTrade } from '../types';
import Image from 'next/image';

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
              <p><strong>Insider:</strong> {trade.insiderName} ({trade.position})</p>
              <p><strong>Shares:</strong> {trade.shares.toLocaleString()}</p>
              <p><strong>Price:</strong> {trade.price.toFixed(2)} SEK</p>
              <div className="flex justify-between mb-1">
                <p>
                  <strong>Total Value:</strong>{' '}
                  {(trade.shares * trade.price).toLocaleString()} SEK
                </p>
                <span className={`transaction-type ${trade.transactionType.toLowerCase()}`}>
                  {trade.transactionType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}