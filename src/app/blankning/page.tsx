import Link from "next/link";
import Page from "@/components/Page";
import Section from "@/components/Section";
import ShortList from "@/components/ShortList";
import ShortExplainer from "@/components/ShortExplainer";
import { getMostShorted } from "@/lib/api/short-positions";
import { formatUpdated } from "@/lib/shorts-format";
import type { ShortSort } from "@/lib/types/ShortPosition";

export const metadata = {
  title: "Mest blankade aktier",
  description:
    "Se vilka aktier på Stockholmsbörsen som är mest blankade, och hur blankningspositionerna förändrats de senaste 30 dagarna. Data från Finansinspektionen.",
  alternates: { canonical: "/blankning" },
};

const TABS: { sort: ShortSort; label: string }[] = [
  { sort: "highest", label: "Högst blankning" },
  { sort: "increase", label: "Störst ökning 30 d" },
  { sort: "decrease", label: "Störst minskning 30 d" },
];

function parseSort(v: string | undefined): ShortSort {
  return v === "increase" || v === "decrease" ? v : "highest";
}

const cardClass =
  "rounded-xl border border-border bg-bg2 px-4 py-6 text-center text-[13px] text-muted card-shadow";

export default async function BlankningPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const sort = parseSort((await searchParams).sort);
  const data = await getMostShorted(sort);
  const updated = formatUpdated(data?.updatedAt ?? null);

  return (
    <Page className="min-h-screen bg-bg text-ink antialiased">
      <div className="mx-auto flex max-w-380 flex-col gap-5 px-4 py-6 sm:px-8 sm:py-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Mest blankade aktier</h1>
          {updated && <div className="mt-1 text-[12px] text-faint">{updated}</div>}
        </div>

        <nav className="flex flex-wrap gap-2" aria-label="Sortering">
          {TABS.map((t) => {
            const active = t.sort === sort;
            return (
              <Link
                key={t.sort}
                href={`?sort=${t.sort}`}
                aria-current={active ? "page" : undefined}
                className={
                  "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors " +
                  (active
                    ? "border-ink bg-ink text-bg"
                    : "border-border bg-bg2 text-muted hover:bg-bg3 hover:text-ink")
                }
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        <Section>
          {data === null ? (
            <div className={cardClass}>Data kunde inte hämtas just nu</div>
          ) : data.items.length === 0 ? (
            <div className={cardClass}>
              {sort === "highest"
                ? "Inga positioner att visa just nu."
                : "Trenddata samlas in – jämförelser visas när det finns minst två dagars data."}
            </div>
          ) : (
            <ShortList items={data.items} />
          )}
        </Section>

        <ShortExplainer />
      </div>
    </Page>
  );
}
