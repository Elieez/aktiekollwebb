import { InsiderTrade } from '../types';

interface TradesListProps {
  trades: InsiderTrade[];
}

export default function TradesList({ trades }: TradesListProps) {
  return (
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
  );
}
