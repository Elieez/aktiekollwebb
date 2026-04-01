import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aktiekoll.se";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: BASE,                              lastModified: new Date(), changeFrequency: "daily",   priority: 1 },
        { url: `${BASE}/om`,                      lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: `${BASE}/anvandarvillkor`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
        { url: `${BASE}/integritetspolicy`,        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    ];
}
