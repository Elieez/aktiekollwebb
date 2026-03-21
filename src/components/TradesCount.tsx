import { CompanyTradeCount } from "@/lib/types/CompanyTradeCount";

interface TradesCountProps {
  companies: CompanyTradeCount[];
  title?: string;
  variant: "buy" | "sell";
}



export default function TradesCount({ companies, title, variant }: TradesCountProps) {
  
  const isBuy = variant === "buy";
  const titleColor = isBuy ? "text-[#4deba8]" : "text-[#f06b4d]";
  const barColor = isBuy ? "bg-[#4deba8]" : "bg-[#f06b4d]";

  const max = Math.max(...companies.map(c => c.transactionCount), 1);

  return (
   <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-bg2">
      {/* Header */}
      <div className="border-b border-white/[0.07] bg-bg3 px-3.5 py-3">
        <div className={`font-display text-[10px] font-semibold uppercase tracking-widest ${titleColor}`}>
          {title}
        </div>
        <div className="mt-px text-[11px] text-[#555]">Top 3 bolag</div>
      </div>

      {/* Rows */}
      {companies.map((company, i) => (
        <div
          key={i}
          className="flex cursor-pointer items-center gap-2 border-b border-white/[0.07] px-3.5 py-2.5 transition-colors
          last:border-b-0 hover:bg-bg3"
          >
            <span className="w-3.5 shrink-0 font-mono text-[10px] text-[#555]">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-medium text-ink">{company.companyName}</div>

              <div className="mt-0.75">
                <div
                className={`h-0.5 rounded-sm transition-all duration-500 ${barColor}`}
                style={{ width: `${(company.transactionCount / max) * 100}%` }}
                />
              </div>
              <div className="mt-0.75 text-[10px] text-[#555]">{company.transactionCount} transaktioner</div>
        </div>
        </div>
      ))}
   </div>
  );
}