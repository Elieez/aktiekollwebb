interface CompanyTradeCount {
  companyName: string;
  transactionCount: number;
}

interface TradesCountProps {
  companies: CompanyTradeCount[];
}

export default function TradesCount({ companies }: TradesCountProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-6">Most Insider Transactions</h3>
      <ul className="space-y-4">
        {companies.map((company) => (
          <li key={company.companyName} className="flex justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-150 ease-in-out">
            <span className="font-medium text-gray-700 truncate">{company.companyName}</span>
            <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">{company.transactionCount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}