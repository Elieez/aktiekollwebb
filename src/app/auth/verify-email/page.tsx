"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyEmailApi } from "@/lib/api/auth";

function VerifyEmailContent() {
    const params = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const userId = params.get("userId");
        const token  = params.get("token");

        if (!userId || !token) {
            setStatus("error");
            setMessage("Ogiltig verifieringslänk.");
            return;
        }

        verifyEmailApi(userId, token)
            .then(() => {
                setStatus("success");
                setMessage("Din e-postadress har verifierats! Du kan nu logga in.");
            })
            .catch(() => {
                setStatus("error");
                setMessage("Länken är ogiltig eller har löpt ut. Begär en ny verifieringslänk när du är inloggad.");
            });
    }, [params]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-bg p-6">
            <div className="max-w-sm w-full text-center space-y-5">
                {status === "loading" && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                        <p className="text-muted text-sm">Verifierar…</p>
                    </div>
                )}

                {status === "success" && (
                    <>
                        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-buy-dim">
                            <svg className="h-7 w-7 text-buy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="font-display text-xl font-bold text-ink">E-post verifierad</h1>
                        <p className="text-muted text-sm">{message}</p>
                        <Link href="/auth" className="inline-block mt-2 bg-accent hover:bg-accent/90 text-bg font-display text-[13px] font-bold uppercase tracking-[0.06em] px-6 py-2.5 rounded-xl transition-colors">
                            Logga in
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-sell-dim">
                            <svg className="h-7 w-7 text-sell" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="font-display text-xl font-bold text-ink">Verifiering misslyckades</h1>
                        <p className="text-muted text-sm">{message}</p>
                        <Link href="/auth" className="inline-block mt-2 text-sm text-accent hover:text-accent/80 transition-colors font-medium">
                            Tillbaka till inloggning
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <main className="flex min-h-screen items-center justify-center bg-bg p-6">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </main>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
