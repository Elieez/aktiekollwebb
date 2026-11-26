import Link from "next/link";
import Section from "@/components/Section";
import ShortChart from "@/components/ShortChart";
import type { ShortCompany } from "@/lib/types/ShortPosition";
import { formatChange, formatPercent, formatSince } from "@/lib/shorts-format";

const toneClass = { up: "text-sell", down: "text-buy", flat: "text-muted" } as const;

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm" }).format(d);
}

export default function ShortInterestSection({ data }: { data: ShortCompany | null }) {
  if (!data) return null;

  const change = formatChange(data.change);
  const since = formatSince(data.changeSince);
  const percentText =
    data.positionPercent === 0
      ? `${formatPercent(0)} (under rapporteringsgränsen)`
      : formatPercent(data.positionPercent);

  return (
    <Section className="bg-bg2 border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-5 sm:px-6 space-y-5">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-lg font-semibold text-ink">Blankning</h2>
          <p className="font-display text-3xl font-semibold text-ink leading-tight">
            {percentText}
          </p>
          <p className={`font-mono text-[14px] ${toneClass[change.tone]}`}>
            {change.text}
            {since && change.text !== "–" && (
              <span className="text-muted"> {since}</span>
            )}
          </p>
        </div>

        <ShortChart
          totalSeries={data.totalSeries}
          significantSeries={data.significantSeries}
        />

        {data.holders.length === 0 ? (
          <p className="text-[13px] text-muted">Inga innehavare över 0,5 %</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="font-mono text-[12px] text-muted border-b border-border">
                  <th className="py-2 pr-3 font-normal">Innehavare</th>
                  <th className="py-2 px-3 font-normal text-right whitespace-nowrap">Position</th>
                  <th className="py-2 pl-3 font-normal text-right whitespace-nowrap">Datum</th>
                </tr>
              </thead>
              <tbody>
                {data.holders.map((h) => (
                  <tr key={h.holderName} className="border-b border-border last:border-0">
                    <td className="py-2 pr-3 text-ink">{h.holderName}</td>
                    <td className="py-2 px-3 text-right font-mono text-ink whitespace-nowrap">
                      {formatPercent(h.positionPercent)}
                    </td>
                    <td className="py-2 pl-3 text-right font-mono text-muted whitespace-nowrap">
                      {formatDate(h.positionDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link href="/blankning" className="inline-block text-[13px] text-muted hover:text-ink">
          Se alla mest blankade →
        </Link>
      </div>
    </Section>
  );
}
