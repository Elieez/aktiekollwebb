import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getTradedSymbols } from "@/lib/api/insider-trades";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const staticPages: MetadataRoute.Sitemap = [
        { url: SITE_URL,                         lastModified: now, changeFrequency: "daily",   priority: 1 },
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

    return [...staticPages, ...stockPages];
}
