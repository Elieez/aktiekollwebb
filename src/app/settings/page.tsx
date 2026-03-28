"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth";
import { requestAccountDeletionApi } from "@/lib/api/auth";
import {
    getNotificationPreferences,
    updateNotificationPreferences,
    type NotificationPreferences,
} from "@/lib/api/follows";

// ─────────────────────────────────────────────────────────────
// Deletion Modal (3-step within modal)
// ─────────────────────────────────────────────────────────────

type ModalStep = "warn" | "confirm-email" | "sending" | "sent";

function DeleteAccountModal({
    userEmail,
    accessToken,
    onClose,
}: {
    userEmail: string;
    accessToken: string;
    onClose: () => void;
}) {
    const [step,          setStep]          = useState<ModalStep>("warn");
    const [typedEmail,    setTypedEmail]    = useState("");
    const [error,         setError]         = useState<string | null>(null);
    const [loading,       setLoading]       = useState(false);

    const emailMatches = typedEmail.trim().toLowerCase() === userEmail.toLowerCase();

    const handleRequestDeletion = async () => {
        if (!emailMatches) return;
        setError(null);
        setLoading(true);
        setStep("sending");
        try {
            await requestAccountDeletionApi(accessToken);
            setStep("sent");
        } catch {
            setError("Något gick fel. Försök igen.");
            setStep("confirm-email");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/[0.07] bg-bg2 p-6 shadow-2xl space-y-5">

                {step === "warn" && (
                    <>
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sell-dim">
                                <svg className="h-5 w-5 text-sell" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-display text-base font-bold text-ink">Radera ditt konto?</h2>
                                <p className="text-xs text-muted mt-0.5">Detta kan inte ångras.</p>
                            </div>
                        </div>

                        <div className="rounded-xl bg-sell-dim/50 border border-sell/20 px-4 py-3 space-y-1.5">
                            <p className="text-xs font-semibold text-sell uppercase tracking-wider">Följande raderas permanent:</p>
                            <ul className="text-xs text-sell/80 space-y-1 list-disc list-inside">
                                <li>Ditt konto och inloggningsuppgifter</li>
                                <li>All personlig data och inställningar</li>
                                <li>Alla aktiva sessioner</li>
                            </ul>
                        </div>

                        <p className="text-xs text-muted">
                            I nästa steg behöver du skriva in din e-postadress för att bekräfta.
                            Du får sedan ett mejl med en bekräftelänk.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 rounded-xl border border-white/[0.07] bg-bg3 px-4 py-2.5 text-sm font-medium text-muted hover:text-ink transition-colors cursor-pointer"
                            >
                                Avbryt
                            </button>
                            <button
                                onClick={() => setStep("confirm-email")}
                                className="flex-1 rounded-xl bg-sell hover:bg-sell/90 px-4 py-2.5 text-sm font-bold text-bg transition-colors cursor-pointer"
                            >
                                Fortsätt
                            </button>
                        </div>
                    </>
                )}

                {step === "confirm-email" && (
                    <>
                        <h2 className="font-display text-base font-bold text-ink">
                            Bekräfta med e-postadress
                        </h2>
                        <p className="text-sm text-muted">
                            Skriv in{" "}
                            <span className="font-mono text-ink text-xs">{userEmail}</span>{" "}
                            för att bekräfta att du vill radera ditt konto.
                        </p>

                        <input
                            type="email"
                            value={typedEmail}
                            onChange={(e) => setTypedEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-sell/40 focus:border-sell/40 transition text-sm"
                            placeholder="Skriv in din e-postadress"
                            autoComplete="off"
                        />

                        {error && (
                            <div className="bg-sell-dim border border-sell/20 text-sell px-3 py-2 rounded-xl text-xs">{error}</div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 rounded-xl border border-white/[0.07] bg-bg3 px-4 py-2.5 text-sm font-medium text-muted hover:text-ink transition-colors cursor-pointer"
                            >
                                Avbryt
                            </button>
                            <button
                                onClick={handleRequestDeletion}
                                disabled={!emailMatches || loading}
                                className="flex-1 rounded-xl bg-sell hover:bg-sell/90 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-bold text-bg transition-colors cursor-pointer"
                            >
                                Skicka bekräftelsemejl
                            </button>
                        </div>
                    </>
                )}

                {step === "sending" && (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sell border-t-transparent" />
                        <p className="text-muted text-sm">Skickar bekräftelsemejl…</p>
                    </div>
                )}

                {step === "sent" && (
                    <>
                        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-accent-dim">
                            <svg className="h-7 w-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="font-display text-base font-bold text-ink">Kontrollera din inkorg</h2>
                            <p className="text-sm text-muted">
                                Vi har skickat en bekräftelänk till din e-post.
                                Länken är giltig i 1 timme.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full rounded-xl border border-white/[0.07] bg-bg3 px-4 py-2.5 text-sm font-medium text-muted hover:text-ink transition-colors cursor-pointer"
                        >
                            Stäng
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Settings Page
// ─────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const router = useRouter();
    const { user, accessToken, loading, fetchWithAuth } = useAuth();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Notification preferences state
    const [prefs, setPrefs] = useState<NotificationPreferences>({
        emailEnabled: true,
        discordEnabled: false,
        discordWebhookUrl: null,
    });
    const [prefsSaving, setPrefsSaving] = useState(false);
    const [prefsSaved, setPrefsSaved] = useState(false);
    const [prefsError, setPrefsError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || !accessToken) return;
        getNotificationPreferences(fetchWithAuth)
            .then(setPrefs)
            .catch(() => { /* use defaults */ });
    }, [user, accessToken, fetchWithAuth]);

    const handleSavePrefs = async () => {
        setPrefsSaving(true);
        setPrefsError(null);
        setPrefsSaved(false);
        try {
            const updated = await updateNotificationPreferences(prefs, fetchWithAuth);
            setPrefs(updated);
            setPrefsSaved(true);
            setTimeout(() => setPrefsSaved(false), 3000);
        } catch {
            setPrefsError("Kunde inte spara inställningar. Försök igen.");
        } finally {
            setPrefsSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-bg">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </main>
        );
    }

    if (!user || !accessToken) {
        router.replace("/auth");
        return null;
    }

    return (
        <main className="min-h-screen bg-bg py-12 px-4">
            <div className="mx-auto max-w-2xl space-y-10">
                <div>
                    <h1 className="font-display text-2xl font-bold text-ink">Inställningar</h1>
                    <p className="text-muted text-sm mt-1">Hantera ditt konto och dina inställningar.</p>
                </div>

                {/* Profile section */}
                <section className="rounded-2xl border border-white/[0.07] bg-bg2 p-6 space-y-4">
                    <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">Profil</h2>
                    <div className="flex items-center gap-4">
                        {user.googleAvatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.googleAvatar} alt="" className="h-12 w-12 rounded-full border border-white/10" />
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg4 text-muted font-display text-lg font-bold">
                                {(user.displayName ?? user.email ?? "?")[0].toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-ink">{user.displayName ?? user.googleName ?? user.email}</p>
                            <p className="text-xs text-muted">{user.email}</p>
                            {user.googleName && (
                                <p className="text-xs text-faint mt-0.5">Inloggad via Google</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Notification preferences */}
                <section className="rounded-2xl border border-white/[0.07] bg-bg2 p-6 space-y-5">
                    <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">Notifikationer</h2>

                    {/* Email toggle */}
                    <div className="rounded-xl border border-white/[0.07] bg-bg p-4 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-ink">E-postnotifikationer</p>
                            <p className="text-xs text-muted mt-0.5">
                                Få ett mejl när insiderhandel sker i bevakade bolag (max 3 bolag).
                            </p>
                        </div>
                        <button
                            onClick={() => setPrefs(p => ({ ...p, emailEnabled: !p.emailEnabled }))}
                            role="switch"
                            aria-checked={prefs.emailEnabled}
                            className={[
                                "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent",
                                "transition-colors duration-200 cursor-pointer focus:outline-none",
                                prefs.emailEnabled ? "bg-accent" : "bg-bg4"
                            ].join(" ")}
                        >
                            <span className={[
                                "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow",
                                "transform transition-transform duration-200",
                                prefs.emailEnabled ? "translate-x-5" : "translate-x-0"
                            ].join(" ")} />
                        </button>
                    </div>

                    {/* Discord section */}
                    <div className="rounded-xl border border-white/[0.07] bg-bg p-4 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-ink">Discord-notifikationer</p>
                                <p className="text-xs text-muted mt-0.5">
                                    Få notifikationer direkt i Discord via en webhook.
                                </p>
                            </div>
                            <button
                                onClick={() => setPrefs(p => ({ ...p, discordEnabled: !p.discordEnabled }))}
                                role="switch"
                                aria-checked={prefs.discordEnabled}
                                className={[
                                    "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent",
                                    "transition-colors duration-200 cursor-pointer focus:outline-none",
                                    prefs.discordEnabled ? "bg-accent" : "bg-bg4"
                                ].join(" ")}
                            >
                                <span className={[
                                    "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow",
                                    "transform transition-transform duration-200",
                                    prefs.discordEnabled ? "translate-x-5" : "translate-x-0"
                                ].join(" ")} />
                            </button>
                        </div>

                        {prefs.discordEnabled && (
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted" htmlFor="discord-webhook">
                                    Webhook-URL
                                </label>
                                <input
                                    id="discord-webhook"
                                    type="url"
                                    value={prefs.discordWebhookUrl ?? ''}
                                    onChange={(e) => setPrefs(p => ({ ...p, discordWebhookUrl: e.target.value || null }))}
                                    placeholder="https://discord.com/api/webhooks/..."
                                    className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition text-sm"
                                />
                                <p className="text-xs text-faint">
                                    Skapa en webhook i Discord: Serverinställningar → Integrationer → Webhooks
                                </p>
                            </div>
                        )}
                    </div>

                    {prefsError && (
                        <div className="rounded-xl border border-sell/20 bg-bg px-3 py-2 text-xs text-sell">
                            {prefsError}
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSavePrefs}
                            disabled={prefsSaving}
                            className="rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-bold text-bg transition-colors cursor-pointer"
                        >
                            {prefsSaving ? 'Sparar…' : 'Spara inställningar'}
                        </button>
                        {prefsSaved && (
                            <span className="text-xs text-accent">Sparat!</span>
                        )}
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="rounded-2xl border-2 border-sell/30 bg-sell-dim/20 p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-sell" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-sell">Farozon</h2>
                    </div>

                    <div className="rounded-xl border border-sell/20 bg-bg p-4 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-ink">Radera konto</p>
                            <p className="text-xs text-muted mt-0.5">
                                Radera ditt konto och all tillhörande data permanent (GDPR).
                                Det här går inte att ångra.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="shrink-0 rounded-xl border border-sell/30 bg-sell-dim px-4 py-2 text-xs font-bold uppercase tracking-wider text-sell hover:bg-sell/20 transition-colors cursor-pointer"
                        >
                            Radera konto
                        </button>
                    </div>
                </section>
            </div>

            {showDeleteModal && (
                <DeleteAccountModal
                    userEmail={user.email ?? ""}
                    accessToken={accessToken}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}
        </main>
    );
}
