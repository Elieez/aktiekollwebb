import Link from "next/link";
import { CompanyTradeCount } from "@/lib/types/CompanyTradeCount";

interface TradesCountProps {
  companies: CompanyTradeCount[];
  title?: string;
  variant: "buy" | "sell";
}

export default function TradesCount({ companies, title, variant }: TradesCountProps) {
  const isBuy = variant === "buy";
  const titleColor = isBuy ? "text-buy" : "text-sell";
  const barColor   = isBuy ? "bg-buy"   : "bg-sell";
  const max = Math.max(...companies.map(c => c.transactionCount), 1);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg2 card-shadow">
      {/* Header */}
      <div className="border-b border-border bg-bg3 px-3.5 py-3">
        <div className={`font-display text-[11px] font-semibold uppercase tracking-widest ${titleColor}`}>
          {title}
        </div>
        <div className="mt-0.5 text-[12px] text-faint">Topp 3 bolag</div>
      </div>

      {/* Rows */}
      {companies.map((company, i) => {
        const canNavigate = !!company.symbol && company.symbol !== "UNRESOLVED";
        const href = canNavigate
          ? `/stocks/${company.symbol!.replace(/\.ST$/i, "")}.ST`
          : undefined;

        const rowClass =
          "flex items-center gap-2.5 border-b border-border px-3.5 py-3 transition-colors duration-100 last:border-b-0 hover:bg-bg3" +
          (canNavigate ? " cursor-pointer" : "");

        const inner = (
          <>
            <span className="w-3.5 shrink-0 font-mono text-[11px] text-faint">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-medium text-ink leading-none mb-1" title={company.companyName || "-"}>
                {company.companyName}
              </div>
              <div
                className={`h-0.5 rounded-full transition-all duration-500 ${barColor} opacity-60`}
                style={{ width: `${(company.transactionCount / max) * 100}%` }}
              />
              <div className="mt-1 text-[11px] text-faint">{company.transactionCount} transaktioner</div>
            </div>
          </>
        );

        return canNavigate ? (
          <Link key={i} href={href!} className={rowClass}>
            {inner}
          </Link>
        ) : (
          <div key={i} className={rowClass}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
