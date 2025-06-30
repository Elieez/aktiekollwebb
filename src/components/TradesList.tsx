import { InsiderTrade } from '../types';

interface TradesListProps {
  trades: InsiderTrade[];
}

const getTransactionTypeColor = (type: string) => {
  switch (type) {
    case 'Förvärv':
      return 'text-green-600 bg-green-50';
    case 'Avyttring':
      return 'text-red-600 bg-red-50';
    case 'Teckning':
      return 'text-blue-600 bg-blue-50';
    case 'Tilldelning':
      return 'text-purple-600 bg-purple-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('sv-SE').format(num);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const time = date.toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  });
  if (date >= today && date < new Date(today.getTime() + 86400000)) {
    return `Today ${time}`;
  }

  if (date >= yesterday && date < today) {
    return `Yesterday ${time}`;
  }

  const dayMonth = date
    .toLocaleDateString('sv-SE', { month: 'short', day: '2-digit' })
    .replace(/\//g, ' ');

  return `${dayMonth} ${time}`;
};

export default function TradesList({ trades }: TradesListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        <p className="text-sm text-gray-600 mt-1">Latest insider trading activity</p>
      </div>

      <div className="overflow-hidden">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{trade.companyName}</h3>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Ticker
                  </span>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded ${getTransactionTypeColor(trade.transactionType)}`}>
                    {trade.transactionType}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <p className="text-gray-700">{trade.insiderName}</p>
                  <p className="text-sm text-gray-500">{trade.position}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Shares:</span>
                    <p className="font-medium text-gray-900">{formatNumber(trade.shares)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Price/Share:</span>
                    <p className="font-medium text-gray-900">{trade.price.toFixed(2)} SEK</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Value:</span>
                    <p className="font-medium text-gray-900">{formatCurrency(trade.shares * trade.price)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <p className="font-medium text-gray-900">{formatDate(trade.publishingDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
