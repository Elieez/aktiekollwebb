// Canonical public URL of the site. aktiekoll.com redirects to www, so www is canonical.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aktiekoll.com").replace(/\/$/, "");
