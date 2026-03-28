"use client";

import { useState, useEffect } from "react";
import { Bell, BellRing } from "lucide-react";
import { useAuth } from "@/components/Auth";
import { followCompany, unfollowCompany, getFollowStatus } from "@/lib/api/follows";

const MAX_FOLLOWS = 3;

interface FollowButtonProps {
    companyId: number;
    companyName: string;
}

export default function FollowButton({ companyId, companyName }: FollowButtonProps) {
    const { user, fetchWithAuth } = useAuth();
    const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
    const [followCount, setFollowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || companyId === 0) return;

        let cancelled = false;
        getFollowStatus(companyId, fetchWithAuth)
            .then((s) => {
                if (!cancelled) {
                    setIsFollowing(s.isFollowing);
                    setFollowCount(s.followCount);
                }
            })
            .catch(() => {
                // Not authenticated or failed — keep null (renders nothing)
            });

        return () => { cancelled = true; };
    }, [user, companyId, fetchWithAuth]);

    // Not logged in — render nothing
    if (!user) return null;

    // Still loading initial state
    if (isFollowing === null) {
        return (
            <button
                disabled
                aria-label="Laddar bevakningsstatus"
                className="rounded-xl border border-white/[0.07] bg-bg3 p-2 opacity-50 cursor-wait"
            >
                <Bell className="h-5 w-5 text-muted" />
            </button>
        );
    }

    const atLimit = !isFollowing && followCount >= MAX_FOLLOWS;

    const handleToggle = async () => {
        if (loading) return;
        if (atLimit) {
            setError(`Du kan bevaka max ${MAX_FOLLOWS} bolag.`);
            setTimeout(() => setError(null), 3000);
            return;
        }

        setLoading(true);
        setError(null);

        // Optimistic update
        const nextState = !isFollowing;
        setIsFollowing(nextState);

        try {
            if (nextState) {
                const result = await followCompany(companyId, fetchWithAuth);
                setFollowCount(result.followCount);
            } else {
                const result = await unfollowCompany(companyId, fetchWithAuth);
                setFollowCount(result.followCount);
            }
        } catch (err: unknown) {
            // Roll back optimistic update
            setIsFollowing(!nextState);
            const msg = err && typeof err === 'object' && 'error' in err
                ? String((err as { error: string }).error)
                : 'Något gick fel.';
            setError(msg);
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                disabled={loading}
                aria-label={isFollowing
                    ? `Sluta bevaka ${companyName}`
                    : atLimit
                        ? `Max ${MAX_FOLLOWS} bevakningar uppnådda`
                        : `Bevaka ${companyName}`}
                title={isFollowing ? "Sluta bevaka" : atLimit ? `Max ${MAX_FOLLOWS} bevakningar` : "Bevaka"}
                className={[
                    "rounded-xl border p-2 transition-all duration-150",
                    loading ? "opacity-60 cursor-wait" : "cursor-pointer",
                    isFollowing
                        ? "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
                        : atLimit
                            ? "border-white/[0.07] bg-bg3 text-faint cursor-not-allowed"
                            : "border-white/[0.07] bg-bg3 text-muted hover:text-ink hover:bg-bg4"
                ].join(" ")}
            >
                {isFollowing
                    ? <BellRing className="h-5 w-5" />
                    : <Bell className="h-5 w-5" />
                }
            </button>

            {error && (
                <div className="absolute right-0 top-full mt-2 z-10 w-52 rounded-xl border border-sell/20 bg-bg2 px-3 py-2 text-xs text-sell shadow-lg whitespace-nowrap">
                    {error}
                </div>
            )}
        </div>
    );
}
