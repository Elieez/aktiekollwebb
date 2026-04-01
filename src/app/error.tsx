"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log to error tracking service here when available
    }, [error]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
            <p className="font-mono text-[11px] uppercase tracking-widest text-sell mb-4">Fel</p>
            <h1 className="font-display text-3xl font-bold text-ink mb-3">Något gick fel</h1>
            <p className="text-sm text-muted max-w-xs mb-8">
                Ett oväntat fel inträffade. Försök igen eller gå tillbaka till startsidan.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={reset}
                    className="rounded-xl bg-accent px-5 py-2.5 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-bg hover:opacity-90 transition-opacity cursor-pointer"
                >
                    Försök igen
                </button>
                <Link
                    href="/"
                    className="rounded-xl border border-border bg-bg2 px-5 py-2.5 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-muted hover:text-ink transition-colors"
                >
                    Startsidan
                </Link>
            </div>
        </main>
    );
}
