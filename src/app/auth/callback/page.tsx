"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/Auth";

export default function OAuthCallbackPage() {
    const router       = useRouter();
    const params       = useSearchParams();
    const { setAccessToken } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = params.get("token");
        const err   = params.get("error");

        if (err) {
            setError("Google-inloggningen misslyckades. Försök igen.");
            return;
        }

        if (token) {
            setAccessToken(token);
            // Remove token from URL immediately, then navigate home
            window.history.replaceState({}, document.title, "/");
            router.replace("/");
        } else {
            setError("Inget token mottaget. Försök logga in igen.");
        }
    }, [params, setAccessToken, router]);

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-bg p-6">
                <div className="max-w-sm w-full text-center space-y-4">
                    <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-sell-dim">
                        <svg className="h-7 w-7 text-sell" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="font-display text-xl font-bold text-ink">Något gick fel</h1>
                    <p className="text-muted text-sm">{error}</p>
                    <a href="/auth" className="inline-block mt-2 text-sm text-accent hover:text-accent/80 transition-colors font-medium">
                        Tillbaka till inloggning
                    </a>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-bg">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <p className="text-muted text-sm">Loggar in…</p>
            </div>
        </main>
    );
}
