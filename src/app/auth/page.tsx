"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/components/Auth";

function GoogleButton() {
    return (
        <a
            href="/api/auth/google"
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

    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (regLoading) return;
    setRegErrors([]);
    setRegLoading(true);
    try {
        await register(regEmail, regPassword, regName);
        setRegisteredEmail(regEmail);
    } catch (err: unknown) {
        if (err !== null && typeof err === "object" && "errors" in err && Array.isArray((err as { errors: unknown }).errors)) {
            // { errors: string[] } — new backend format
            setRegErrors((err as { errors: string[] }).errors);
        } else if (Array.isArray(err) && err.every((e) => typeof e === "string")) {
            // raw string[] — old format fallback
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
            <div className="hidden lg:flex flex-col justify-between h-full bg-bg2 border-r border-border p-12 overflow-hidden relative">

                {/* Background decoration */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {/* Large accent circle — top right */}
                    <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent opacity-[0.06]" />
                    {/* Small accent circle — bottom left */}
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent opacity-[0.04]" />
                    {/* Subtle grid lines */}
                    <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Logo */}
                <Link
                    href="/"
                    className="relative font-display text-2xl font-bold tracking-tight text-ink hover:opacity-80 transition-opacity"
                >
                    Aktie<span className="text-accent">Koll</span>
                </Link>

                {/* Main content */}
                <div className="relative space-y-10">
                    <div className="space-y-4">
                        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                            Bevaka · Notifiera · Reagera
                        </p>
                        <h2 className="font-display text-4xl font-bold text-ink leading-tight">
                            Missa aldrig när<br />en insider köper<br />
                            <span className="text-accent">ditt bolag</span>
                        </h2>
                        <p className="text-muted text-sm leading-relaxed max-w-sm">
                            Skapa ett konto, bevaka de bolag du följer och få en notis
                            direkt när insiders handlar — via e-post eller Discord.
                        </p>
                    </div>

                    {/* Feature cards */}
                    <div className="space-y-3">
                        {/* Follow */}
                        <div className="flex items-start gap-4 rounded-xl border border-border bg-bg/60 px-4 py-3.5">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                                <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-ink">Bevaka valfria bolag</p>
                                <p className="text-xs text-muted mt-0.5">Lägg till de bolag du vill hålla koll på i din personliga bevakningslista.</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-4 rounded-xl border border-border bg-bg/60 px-4 py-3.5">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                                <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-ink">E-postnotifikationer</p>
                                <p className="text-xs text-muted mt-0.5">Få ett mejl direkt när en transaktion rapporteras i ett bevakat bolag.</p>
                            </div>
                        </div>

                        {/* Discord */}
                        <div className="flex items-start gap-4 rounded-xl border border-border bg-bg/60 px-4 py-3.5">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                                <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-ink">Discord-notifikationer</p>
                                <p className="text-xs text-muted mt-0.5">Koppla en webhook och få notiser rakt in i din Discord-server.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <p className="relative text-xs text-faint"></p>
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
                                    <div className="rounded-xl border border-border bg-bg2 px-4 py-3 text-left space-y-1.5">
                                        <p className="text-xs font-semibold text-muted">Fick du inget mejl?</p>
                                        <ul className="text-xs text-faint space-y-1 list-disc list-inside">
                                            <li>Kontrollera din skräppost eller skräppostmapp</li>
                                            <li>Se till att <span className="text-muted">noreply@aktiekoll.se</span> inte är blockerad</li>
                                            <li>Länken är giltig i 24 timmar</li>
                                        </ul>
                                    </div>
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
                                            <Link href="/anvandarvillkor" target="_blank" className="text-muted hover:text-ink transition-colors underline underline-offset-2">Användarvillkor</Link>{" "}och{" "}
                                            <Link href="/integritetspolicy" target="_blank" className="text-muted hover:text-ink transition-colors underline underline-offset-2">Integritetspolicy</Link>
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
