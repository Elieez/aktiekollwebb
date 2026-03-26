"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordApi } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
    const [email,    setEmail]   = useState("");
    const [loading,  setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            await forgotPasswordApi(email);
        } catch { /* always show success — prevents enumeration */ }
        finally {
            setLoading(false);
            setSubmitted(true);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-bg p-6">
            <div className="max-w-sm w-full space-y-6">
                <div>
                    <Link href="/auth" className="text-xs text-faint hover:text-muted transition-colors">
                        ← Tillbaka till inloggning
                    </Link>
                    <h1 className="font-display text-2xl font-bold text-ink mt-4 mb-1">Återställ lösenord</h1>
                    <p className="text-muted text-sm">
                        Ange din e-postadress så skickar vi en återställningslänk.
                    </p>
                </div>

                {submitted ? (
                    <div className="bg-accent-dim border border-accent/20 rounded-xl px-5 py-4 text-sm text-ink">
                        Om det finns ett konto kopplat till den e-postadressen har vi skickat en återställningslänk.
                        Kontrollera din inkorg (och skräppost).
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                                E-postadress
                            </label>
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition text-sm"
                                placeholder="du@exempel.com"
                            />
                        </div>
                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-bg font-display text-[13px] font-bold uppercase tracking-[0.06em] py-3 rounded-xl transition-colors cursor-pointer"
                        >
                            {loading ? "Skickar…" : "Skicka återställningslänk"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
