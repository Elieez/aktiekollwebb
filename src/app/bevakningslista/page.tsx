"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, BellOff, ExternalLink } from "lucide-react";
import { useAuth } from "@/components/Auth";
import { getFollowedCompanies, unfollowCompany, type FollowedCompany } from "@/lib/api/follows";

export default function BevakningslistaPage() {
    const router = useRouter();
    const { user, loading, fetchWithAuth } = useAuth();
    const [companies, setCompanies] = useState<FollowedCompany[]>([]);
    const [fetching, setFetching] = useState(true);
    const [unfollowing, setUnfollowing] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (loading) return;
        if (!user) { router.replace("/auth"); return; }

        getFollowedCompanies(fetchWithAuth)
            .then(setCompanies)
            .catch(() => setError("Kunde inte hämta bevakningslistan."))
            .finally(() => setFetching(false));
    }, [user, loading, fetchWithAuth, router]);

    const handleUnfollow = async (companyId: number) => {
        setUnfollowing(companyId);
        setError(null);
        try {
            await unfollowCompany(companyId, fetchWithAuth);
            setCompanies(prev => prev.filter(c => c.companyId !== companyId));
        } catch {
            setError("Kunde inte ta bort bevakning. Försök igen.");
        } finally {
            setUnfollowing(null);
        }
    };

    if (loading || fetching) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-bg">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-bg py-12 px-4">
            <div className="mx-auto max-w-2xl space-y-8">
                <div className="flex items-center gap-3">
                    <Bell className="h-6 w-6 text-accent" />
                    <div>
                        <h1 className="font-display text-2xl font-bold text-ink">Bevakningslista</h1>
                        <p className="text-muted text-sm mt-0.5">
                            Du bevakar {companies.length} av max 3 bolag.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl border border-sell/20 bg-bg2 px-4 py-3 text-sm text-sell">
                        {error}
                    </div>
                )}

                {companies.length === 0 ? (
                    <div className="rounded-2xl border border-white/[0.07] bg-bg2 p-10 text-center space-y-3">
                        <BellOff className="mx-auto h-8 w-8 text-faint" />
                        <p className="text-muted text-sm">Du bevakar inga bolag ännu.</p>
                        <Link
                            href="/"
                            className="inline-block text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
                        >
                            Hitta bolag att bevaka →
                        </Link>
                    </div>
                ) : (
                    <section className="rounded-2xl border border-border bg-bg2 divide-y divide-border overflow-hidden">
                        {companies.map(company => (
                            <div
                                key={company.companyId}
                                className="flex items-center justify-between gap-4 px-5 py-4"
                            >
                                <div className="min-w-0">
                                    <Link
                                        href={`/stocks/${company.code}`}
                                        className="group flex items-center gap-1.5"
                                    >
                                        <span className="font-medium text-ink group-hover:text-accent transition-colors truncate">
                                            {company.name}
                                        </span>
                                        <ExternalLink className="h-3 w-3 text-faint group-hover:text-accent transition-colors shrink-0" />
                                    </Link>
                                    <p className="text-xs text-faint mt-0.5">{company.code}</p>
                                </div>

                                <button
                                    onClick={() => handleUnfollow(company.companyId)}
                                    disabled={unfollowing === company.companyId}
                                    aria-label={`Sluta bevaka ${company.name}`}
                                    className="shrink-0 rounded-xl border border-sell/20 bg-bg px-3 py-1.5 text-xs font-semibold text-sell hover:bg-sell/10 disabled:opacity-50 disabled:cursor-wait transition-colors cursor-pointer"
                                >
                                    {unfollowing === company.companyId ? "Tar bort…" : "Ta bort"}
                                </button>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}
