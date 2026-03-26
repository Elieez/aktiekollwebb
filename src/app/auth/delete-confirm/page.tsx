"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/Auth";
import { confirmAccountDeletionApi } from "@/lib/api/auth";

function DeleteConfirmContent() {
    const router      = useRouter();
    const params      = useSearchParams();
    const { accessToken, logout } = useAuth();
    const token       = params.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState<string | null>(null);

    if (!token) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-bg p-6">
                <div className="text-center space-y-3">
                    <p className="text-muted">Ogiltig bekräftelänk.</p>
                    <a href="/settings" className="text-sm text-accent hover:text-accent/80 transition-colors">
                        Gå till inställningar
                    </a>
                </div>
            </main>
        );
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessToken) { router.push("/auth"); return; }
        setError(null);
        setLoading(true);
        try {
            await confirmAccountDeletionApi(accessToken, token, password || undefined);
            await logout();
            router.replace("/?deleted=true");
        } catch (err: unknown) {
            const msg = typeof err === "object" && err !== null && "error" in err
                ? (err as { error: string }).error
                : "Något gick fel. Försök igen.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-bg p-6">
            <div className="max-w-sm w-full space-y-6">
                {/* Warning header */}
                <div className="rounded-xl border border-sell/30 bg-sell-dim p-5 space-y-2">
                    <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-sell shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                        <h1 className="font-display text-base font-bold text-sell">Sista steget – permanent borttagning</h1>
                    </div>
                    <p className="text-sm text-sell/80">
                        Ditt konto och all data raderas permanent och kan <strong>inte återställas</strong>.
                        Det här går inte att ångra.
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                            Lösenord (om du har ett)
                        </label>
                        <input
                            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-sell/40 focus:border-sell/40 transition text-sm"
                            placeholder="••••••••"
                        />
                        <p className="text-xs text-faint mt-1.5">
                            Google-konton som saknar lösenord kan lämna detta tomt.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-sell-dim border border-sell/20 text-sell px-4 py-3 rounded-xl text-sm">{error}</div>
                    )}

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-sell hover:bg-sell/90 disabled:opacity-50 disabled:cursor-not-allowed text-bg font-display text-[13px] font-bold uppercase tracking-[0.06em] py-3 rounded-xl transition-colors cursor-pointer"
                    >
                        {loading ? "Raderar…" : "Radera mitt konto permanent"}
                    </button>

                    <div className="text-center">
                        <a href="/settings" className="text-xs text-faint hover:text-muted transition-colors">
                            Avbryt — behåll mitt konto
                        </a>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default function DeleteConfirmPage() {
    return (
        <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-bg p-6" />}>
            <DeleteConfirmContent />
        </Suspense>
    );
}
