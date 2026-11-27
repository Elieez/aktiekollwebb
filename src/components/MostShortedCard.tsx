import Link from "next/link";
import type { ShortListItem } from "@/lib/types/ShortPosition";
import { formatChange, formatPercent, stockHref, type Tone } from "@/lib/shorts-format";

// Rising shorts are bad (sell colour), falling are good (buy colour).
const changeTone: Record<Tone, string> = {
  up: "text-sell",
  down: "text-buy",
  flat: "text-muted",
};

export default function MostShortedCard({ items }: { items: ShortListItem[] }) {
  const max = Math.max(...items.map((c) => c.positionPercent), 0.1);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg2 card-shadow">
      <div className="border-b border-border bg-bg3 px-3.5 py-3">
        <div className="font-display text-[11px] font-semibold uppercase tracking-widest text-sell">
          Mest blankade
        </div>
        <div className="mt-0.5 text-[12px] text-faint">Topp 5 bolag</div>
      </div>

      {items.map((item, i) => {
        const href = stockHref(item.symbol);
        const c = formatChange(item.change);
        const rowClass =
          "flex items-center gap-2.5 border-b border-border px-3.5 py-3 transition-colors duration-100 hover:bg-bg3";
        const inner = (
          <>
            <span className="w-3.5 shrink-0 font-mono text-[11px] text-faint">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <div className="mb-1 truncate text-[12px] font-medium leading-none text-ink" title={item.issuerName}>
                {item.issuerName}
              </div>
              <div
                className="h-0.5 rounded-full bg-sell opacity-60"
                style={{ width: `${(item.positionPercent / max) * 100}%` }}
              />
            </div>
            <div className="shrink-0 text-right">
              <div className="font-mono text-[12px] text-ink">{formatPercent(item.positionPercent)}</div>
              <div className={`font-mono text-[11px] ${changeTone[c.tone]}`}>{c.text}</div>
            </div>
          </>
        );
        return href ? (
          <Link key={item.lei} href={href} className={rowClass}>
            {inner}
          </Link>
        ) : (
          <div key={item.lei} className={rowClass}>
            {inner}
          </div>
        );
      })}

      <Link
        href="/blankning"
        className="block px-3.5 py-3 text-[12px] font-medium text-muted transition-colors duration-100 hover:bg-bg3 hover:text-ink"
      >
        Visa alla →
      </Link>
    </div>
  );
}
