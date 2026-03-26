"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordApi } from "@/lib/api/auth";

function ResetPasswordContent() {
    const router  = useRouter();
    const params  = useSearchParams();
    const email   = params.get("email") ?? "";
    const token   = params.get("token") ?? "";

    const [newPassword,     setNewPassword]     = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading,         setLoading]         = useState(false);
    const [error,           setError]           = useState<string | null>(null);

    if (!email || !token) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-bg p-6">
                <div className="text-center space-y-3">
                    <p className="text-muted">Ogiltig återställningslänk.</p>
                    <Link href="/auth/forgot-password" className="text-sm text-accent hover:text-accent/80 transition-colors">
                        Begär en ny länk
                    </Link>
                </div>
            </main>
        );
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (newPassword !== confirmPassword) {
            setError("Lösenorden matchar inte.");
            return;
        }
        setLoading(true);
        try {
            await resetPasswordApi(email, token, newPassword);
            router.push("/auth?reset=success");
        } catch (err: unknown) {
            const msg = typeof err === "object" && err !== null && "error" in err
                ? (err as { error: string }).error
                : "Något gick fel. Länken kan ha löpt ut.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-bg p-6">
            <div className="max-w-sm w-full space-y-6">
                <div>
                    <h1 className="font-display text-2xl font-bold text-ink mb-1">Nytt lösenord</h1>
                    <p className="text-muted text-sm">Välj ett nytt lösenord för ditt konto.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted mb-2">Nytt lösenord</label>
                        <input
                            type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            required minLength={8}
                            className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted mb-2">Bekräfta lösenord</label>
                        <input
                            type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            required minLength={8}
                            className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-sell-dim border border-sell/20 text-sell px-4 py-3 rounded-xl text-sm">{error}</div>
                    )}

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-bg font-display text-[13px] font-bold uppercase tracking-[0.06em] py-3 rounded-xl transition-colors cursor-pointer"
                    >
                        {loading ? "Sparar…" : "Spara nytt lösenord"}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-bg p-6" />}>
            <ResetPasswordContent />
        </Suspense>
    );
}
