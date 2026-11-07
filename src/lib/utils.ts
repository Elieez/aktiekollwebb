export function cleanCompanyName(name: string): string {
  return name
    .replace(/\s*[\(\（][^)]*?publ[^)]*?[\)\）]\s*/gi, "")
    .replace(/\u00A0/g, " ")
    .trim();
}

const isSek = (currency?: string | null) => !currency || currency.toUpperCase() === "SEK";

/** Trade value in SEK, or null when it's a foreign-currency trade without an FX rate. */
export function tradeValueSek(t: { shares: number; price: number; currency?: string | null; valueSek?: number | null }): number | null {
  if (t.valueSek != null) return t.valueSek;
  return isSek(t.currency) ? t.shares * t.price : null;
}

/** Formats an amount in its own currency, e.g. "1 234 kr", "1 234 €", "1 234 US$". */
export function formatMoney(amount: number, currency?: string | null, decimals = false): string {
  const code = (currency || "SEK").toUpperCase();
  const fraction = decimals && amount % 1 !== 0 ? 2 : 0;
  try {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: code,
      minimumFractionDigits: fraction,
      maximumFractionDigits: fraction,
    }).format(amount);
  } catch {
    // Unknown ISO code from the register — fall back to number + raw code.
    return `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: fraction }).format(amount)} ${code}`;
  }
}
