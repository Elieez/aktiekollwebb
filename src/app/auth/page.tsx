"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/components/Auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

function GoogleButton() {
    return (
        <a
            href={`${API_BASE}/auth/google`}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.07] bg-bg2
            px-4 py-3 text-sm font-medium text-ink hover:bg-bg3 hover:border-white/12 transition-colors"
        >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Fortsätt med Google
        </a>
    );
}

function Divider() {
    return (
        <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.07]" />
            </div>
            <div className="relative flex justify-center text-xs">
                <span className="bg-bg px-3 text-faint">eller</span>
            </div>
        </div>
    );
}

export default function AuthPage() {
    const router = useRouter();
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

    const switchToLogin   = () => { setIsLogin(true);  setRegErrors([]); setRegisteredEmail(null); };
    const switchToRegister = () => { setIsLogin(false); setLoginError(null); };

    // login state
    const [loginEmail,    setLoginEmail]    = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginLoading,  setLoginLoading]  = useState(false);
    const [loginError,    setLoginError]    = useState<string | null>(null);

    // register state
    const [regEmail,    setRegEmail]    = useState("");
    const [regName,     setRegName]     = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regLoading,  setRegLoading]  = useState(false);
    const [regErrors,   setRegErrors]   = useState<string[]>([]);

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loginLoading) return;
        setLoginError(null);
        setLoginLoading(true);
        try {
            await login(loginEmail, loginPassword);
            router.push("/");
        } catch (err: unknown) {
            setLoginError(typeof err === "string" ? err : err instanceof Error ? err.message : "Felaktig e-post eller lösenord");
        } finally {
            setLoginLoading(false);
        }
    };

    const onRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (regLoading) return;
        setRegErrors([]);
        setRegLoading(true);
        try {
            await register(regEmail, regPassword, regName);
            setRegisteredEmail(regEmail);
        } catch (err: unknown) {
            if (Array.isArray(err) && err.every((e) => typeof e === "string")) {
                setRegErrors(err as string[]);
            } else if (err instanceof Error) {
                setRegErrors([err.message]);
            } else {
                setRegErrors(["Ett oväntat fel inträffade"]);
            }
        } finally {
            setRegLoading(false);
        }
    };

    return (
        <div className="h-dvh w-full overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Branding Panel */}
            <div className="hidden lg:flex flex-col justify-between h-full bg-bg2 border-r border-white/[0.07] p-12">
                <Link
                    href="/"
                    className="font-display text-2xl font-bold tracking-tight text-ink hover:opacity-80 transition-opacity"
                >
                    Aktie<span className="text-accent">Koll</span>
                </Link>
                <div className="space-y-8">
                    <div>
                        <h2 className="font-display text-3xl font-bold text-ink leading-tight mb-3">
                            Spåra insiders.<br />Håll dig steget före.
                        </h2>
                        <p className="text-muted text-sm leading-relaxed max-w-sm">
                            Bevaka insidertransaktioner i realtid och få ett
                            övertag med aktuell marknadsintelligens.
                        </p>
                    </div>
                    <div className="space-y-5">
                        {[
                            { title: "Insidertransaktioner i realtid",   desc: "Bevaka affärer när de sker" },
                            { title: "Detaljerade analyser",              desc: "Utförliga diagram och datainsikter" },
                            { title: "Företagsprofiler",                  desc: "Djupdyk i enskilda aktier" },
                        ].map((item) => (
                            <div key={item.title} className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-dim">
                                    <svg className="h-3 w-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-ink">{item.title}</p>
                                    <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-xs text-faint">Svensk insiderdata &mdash; uppdateras kontinuerligt</p>
            </div>

            {/* Right: Auth Forms */}
            <div className="flex flex-col justify-center bg-bg p-8 lg:p-12 h-full overflow-y-auto dark-scrollbar">
                <div className="max-w-md w-full mx-auto">
                    <div className="lg:hidden mb-8">
                        <Link
                            href="/"
                            className="font-display text-2xl font-bold tracking-tight text-ink hover:opacity-80 transition-opacity"
                        >
                            Aktie<span className="text-accent">Koll</span>
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-8 border-b border-white/[0.07]">
                        <button
                            onClick={switchToLogin}
                            className={`pb-3 px-3 font-display text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors relative cursor-pointer ${
                                isLogin ? "text-ink border-b-2 border-accent" : "text-faint hover:text-muted"
                            }`}
                        >
                            Logga in
                        </button>
                        <button
                            onClick={switchToRegister}
                            className={`pb-3 px-3 font-display text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors relative cursor-pointer ${
                                !isLogin ? "text-ink border-b-2 border-accent" : "text-faint hover:text-muted"
                            }`}
                        >
                            Skapa konto
                        </button>
                    </div>

                    {isLogin ? (
                        <div className="fade-up">
                            <h2 className="font-display text-2xl font-bold text-ink mb-1">Välkommen tillbaka</h2>
                            <p className="text-muted text-sm mb-7">Logga in för att återgå till din översikt</p>

                            <GoogleButton />
                            <Divider />

                            <form onSubmit={onLogin} className="space-y-4">
                                <div>
                                    <label className="block font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                                        E-postadress
                                    </label>
                                    <input
                                        type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition text-sm"
                                        placeholder="du@exempel.com"
                                    />
                                </div>
                                <div>
                                    <label className="block font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                                        Lösenord
                                    </label>
                                    <input
                                        type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {loginError && (
                                    <div className="bg-sell-dim border border-sell/20 text-sell px-4 py-3 rounded-xl text-sm">{loginError}</div>
                                )}

                                <button
                                    type="submit" disabled={loginLoading}
                                    className="w-full mt-2 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-bg font-display text-[13px] font-bold uppercase tracking-[0.06em] py-3 rounded-xl transition-colors cursor-pointer"
                                >
                                    {loginLoading ? "Loggar in…" : "Logga in"}
                                </button>

                                <div className="text-center pt-1">
                                    <Link href="/auth/forgot-password" className="text-xs text-faint hover:text-muted transition-colors">
                                        Glömt lösenordet?
                                    </Link>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="fade-up">
                            {registeredEmail ? (
                                <div className="text-center space-y-4">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-dim">
                                        <svg className="h-7 w-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="font-display text-xl font-bold text-ink">Kontrollera din inkorg</h2>
                                    <p className="text-muted text-sm">
                                        Vi har skickat ett verifieringsmejl till{" "}
                                        <span className="text-ink font-medium">{registeredEmail}</span>.
                                        Klicka på länken i mejlet för att aktivera ditt konto.
                                    </p>
                                    <button
                                        onClick={switchToLogin}
                                        className="mt-4 text-sm text-accent hover:text-accent/80 transition-colors font-medium"
                                    >
                                        Gå till inloggning
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="font-display text-2xl font-bold text-ink mb-1">Skapa konto</h2>
                                    <p className="text-muted text-sm mb-7">Börja bevaka insidertransaktioner idag</p>

                                    <GoogleButton />
                                    <Divider />

                                    <form onSubmit={onRegister} className="space-y-4">
                                        <div>
                                            <label className="block font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                                                E-postadress
                                            </label>
                                            <input
                                                type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required
                                                className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition text-sm"
                                                placeholder="du@exempel.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                                                Visningsnamn{" "}
                                                <span className="normal-case tracking-normal font-normal text-faint">(valfritt)</span>
                                            </label>
                                            <input
                                                type="text" value={regName} onChange={(e) => setRegName(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition text-sm"
                                                placeholder="Anna Svensson"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                                                Lösenord
                                            </label>
                                            <input
                                                type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required
                                                className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition text-sm"
                                                placeholder="••••••••"
                                            />
                                        </div>

                                        {regErrors.length > 0 && (
                                            <div className="bg-sell-dim border border-sell/20 text-sell px-4 py-3 rounded-xl text-sm space-y-1">
                                                {regErrors.map((err, i) => <p key={i}>{err}</p>)}
                                            </div>
                                        )}

                                        <button
                                            type="submit" disabled={regLoading}
                                            className="w-full mt-2 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-bg font-display text-[13px] font-bold uppercase tracking-[0.06em] py-3 rounded-xl transition-colors cursor-pointer"
                                        >
                                            {regLoading ? "Skapar konto…" : "Skapa konto"}
                                        </button>

                                        <p className="text-xs text-faint text-center pt-1">
                                            Genom att skapa ett konto godkänner du våra{" "}
                                            <a href="#" className="text-muted hover:text-ink transition-colors">Användarvillkor</a>{" "}och{" "}
                                            <a href="#" className="text-muted hover:text-ink transition-colors">Integritetspolicy</a>
                                        </p>
                                    </form>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
