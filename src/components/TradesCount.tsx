interface CompanyTradeCount {
  companyName: string;
  transactionCount: number;
}

interface TradesCountProps {
  companies: CompanyTradeCount[];
}

export default function TradesCount({ companies }: TradesCountProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-2">Transactions per Company</h3>
      <ul>
        {companies.map((company) => (
          <li key={company.companyName} className="flex justify-between py-1 border-b last:border-b-0">
            <span>{company.companyName}</span>
            <span className="font-mono">{company.transactionCount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}