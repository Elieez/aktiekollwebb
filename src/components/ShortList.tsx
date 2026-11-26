import Link from "next/link";
import type { ShortListItem } from "@/lib/types/ShortPosition";
import {
  formatChange,
  formatInsiders,
  formatPercent,
  formatSince,
  stockHref,
  type Tone,
} from "@/lib/shorts-format";

// Rising shorts are bad (sell colour), falling are good (buy colour).
const changeTone: Record<Tone, string> = {
  up: "text-sell",
  down: "text-buy",
  flat: "text-muted",
};
// Insider buying is the positive signal; insider selling the negative one.
const insiderTone: Record<Tone, string> = {
  up: "text-buy",
  down: "text-sell",
  flat: "text-muted",
};

function Name({ item }: { item: ShortListItem }) {
  const href = stockHref(item.symbol);
  return href ? (
    <Link href={href} className="font-medium text-ink hover:underline">
      {item.issuerName}
    </Link>
  ) : (
    <span className="font-medium text-ink">{item.issuerName}</span>
  );
}

function Change({ item }: { item: ShortListItem }) {
  const c = formatChange(item.change);
  const since = item.change !== null && c.tone !== "flat" ? formatSince(item.changeSince) : null;
  return (
    <div className="text-right">
      <div className={`font-mono ${changeTone[c.tone]}`}>{c.text}</div>
      {since && <div className="text-[11px] text-faint">{since}</div>}
    </div>
  );
}

export default function ShortList({ items }: { items: ShortListItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg2 card-shadow">
      {/* Table, sm and up */}
      <table className="hidden w-full text-[13px] sm:table">
        <thead>
          <tr className="border-b border-border bg-bg3 text-left font-display text-[11px] font-semibold uppercase tracking-widest text-muted">
            <th className="w-10 px-3.5 py-3">#</th>
            <th className="px-3.5 py-3">Bolag</th>
            <th className="px-3.5 py-3 text-right">Blankning</th>
            <th className="px-3.5 py-3 text-right">30 dagar</th>
            <th className="px-3.5 py-3 text-right">Innehavare</th>
            <th className="px-3.5 py-3 text-right">Insiders 90 d</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const ins = formatInsiders(item.insiderBuys90d, item.insiderSells90d);
            return (
              <tr
                key={item.lei}
                className="border-b border-border transition-colors duration-100 last:border-b-0 hover:bg-bg3"
              >
                <td className="px-3.5 py-3 font-mono text-[11px] text-faint">{i + 1}</td>
                <td className="px-3.5 py-3">
                  <Name item={item} />
                </td>
                <td className="px-3.5 py-3 text-right font-mono text-ink">
                  {formatPercent(item.positionPercent)}
                </td>
                <td className="px-3.5 py-3">
                  <Change item={item} />
                </td>
                <td className="px-3.5 py-3 text-right font-mono text-muted">{item.holderCount}</td>
                <td className={`px-3.5 py-3 text-right font-mono ${insiderTone[ins.tone]}`}>
                  {ins.text}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Compact rows, below sm */}
      <ul className="sm:hidden">
        {items.map((item, i) => (
          <li
            key={item.lei}
            className="flex items-center gap-2.5 border-b border-border px-3.5 py-3 text-[13px] last:border-b-0"
          >
            <span className="w-5 shrink-0 font-mono text-[11px] text-faint">{i + 1}</span>
            <div className="min-w-0 flex-1 truncate">
              <Name item={item} />
            </div>
            <span className="shrink-0 font-mono text-ink">{formatPercent(item.positionPercent)}</span>
            <div className="w-20 shrink-0">
              <Change item={item} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
