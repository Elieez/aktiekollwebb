export function cleanCompanyName(name: string): string {
  return name
    .replace(/\s*[\(\（][^)]*?publ[^)]*?[\)\）]\s*/gi, "")
    .replace(/\u00A0/g, " ")
    .trim();
}
