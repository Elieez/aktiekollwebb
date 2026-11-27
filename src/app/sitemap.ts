import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getTradedSymbols } from "@/lib/api/insider-trades";
import { getMostShorted } from "@/lib/api/short-positions";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const staticPages: MetadataRoute.Sitemap = [
        { url: SITE_URL,                         lastModified: now, changeFrequency: "daily",   priority: 1 },
        { url: `${SITE_URL}/blankning`,           lastModified: now, changeFrequency: "daily",   priority: 0.9 },
        { url: `${SITE_URL}/om`,                 lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${SITE_URL}/anvandarvillkor`,    lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
        { url: `${SITE_URL}/integritetspolicy`,  lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    ];

    // Stock pages are the main search-engine landing pages ("insiderhandel <bolag>").
    // If the backend is unavailable we still serve the static part of the sitemap.
    const symbols = await getTradedSymbols().catch(() => []);
    const stockPages: MetadataRoute.Sitemap = symbols.map((s) => ({
        url: `${SITE_URL}/stocks/${encodeURIComponent(s.symbol)}`,
        lastModified: new Date(s.lastTradeDate),
        changeFrequency: "daily",
        priority: 0.8,
    }));

    // Shorted stocks may lack insider trades; add them unless already listed. Errors -> skip.
    const baseOf = (sym: string) => sym.replace(/\.ST$/i, "").toUpperCase();
    const seen = new Set(symbols.map((s) => baseOf(s.symbol)));
    const shorted = await getMostShorted("highest", 100);
    const shortedPages: MetadataRoute.Sitemap = [];
    for (const item of shorted?.items ?? []) {
        if (!item.symbol) continue;
        const symbol = item.symbol.replace(/\.ST$/i, "");
        if (seen.has(symbol.toUpperCase())) continue;
        seen.add(symbol.toUpperCase());
        shortedPages.push({
            url: `${SITE_URL}/stocks/${encodeURIComponent(symbol)}`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.7,
        });
    }

    return [...staticPages, ...stockPages, ...shortedPages];
}
