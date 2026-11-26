export type Tone = "up" | "down" | "flat";

const pct = new Intl.NumberFormat("sv-SE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** "15,54 %" (regular space before %); 0 -> "< 0,1 %". */
export function formatPercent(v: number): string {
  if (v === 0) return "< 0,1 %";
  return `${pct.format(v)} %`;
}

/** Change in percentage points. |v| < 0.005 or null is flat. */
export function formatChange(v: number | null): { text: string; tone: Tone } {
  if (v === null || Math.abs(v) < 0.005) return { text: "–", tone: "flat" };
  const abs = pct.format(Math.abs(v));
  return v > 0
    ? { text: `▲ +${abs}`, tone: "up" }
    : { text: `▼ \u2212${abs}`, tone: "down" };
}

/** "sedan 26 nov" */
export function formatSince(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const s = new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Stockholm",
  })
    .format(d)
    .replace(/\.$/, "");
  return `sedan ${s}`;
}

export function formatInsiders(
  buys: number,
  sells: number
): { text: string; tone: Tone } {
  if (buys > 0 && sells === 0) return { text: `▲ ${buys} köp`, tone: "up" };
  if (sells > 0 && buys === 0) return { text: `▼ ${sells} sälj`, tone: "down" };
  if (buys > 0 && sells > 0)
    return { text: `${buys} köp · ${sells} sälj`, tone: "flat" };
  return { text: "–", tone: "flat" };
}
