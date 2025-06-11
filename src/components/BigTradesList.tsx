import { InsiderTrade } from '../types';

interface TopTradesProps {
  trades: InsiderTrade[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(amount);
};

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

export default function BigTradesList({ trades }: TopTradesProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Top 10 Trades</h2>
        <p className="text-sm text-gray-600 mt-1">Highest value transactions</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {trades.map((trade, index) => (
            <div
              key={trade.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-150"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-600">{index + 1}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 truncate">{trade.companyName}</h4>
                  <span
                    className={`text-xs font-medium ${getTransactionTypeColor(
                      trade.transactionType
                    )}`}
                  >
                    {trade.transactionType}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{trade.insiderName}</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(trade.shares * trade.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
