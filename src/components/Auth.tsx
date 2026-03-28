"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Settings, LogOut } from 'lucide-react';
import { loginApi, registerApi, refreshApi, logoutApi, resendVerificationApi } from '../lib/api/auth';

type User = {
    id?: string;
    email?: string;
    displayName?: string;
    emailVerified?: boolean;
    googleAvatar?: string;
    googleName?: string;
} | null;

type AuthContextValue = {
    user: User;
    accessToken: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName?: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    refresh: () => Promise<string | null>;
    setAccessToken: (token: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function parseJwt(token: string | null) {
    if (!token) return {};
    try {
        const payload = token.split('.')[1];
        const bin = typeof window !== 'undefined' ? atob(payload) : Buffer.from(payload, 'base64').toString('utf8');
        return JSON.parse(bin);
    } catch {
        return {};
    }
}

function userFromJwt(token: string | null): User {
    if (!token) return null;
    const p = parseJwt(token);
    return {
        id:            p.sub,
        email:         p.email,
        displayName:   p.displayName,
        emailVerified: p.emailVerified === 'true' || p.emailVerified === true,
        googleAvatar:  p.googleAvatar  || undefined,
        googleName:    p.googleName    || undefined,
    };
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessTokenState] = useState<string | null>(null);
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const setAccessToken = useCallback((token: string) => {
        setAccessTokenState(token);
        setUser(userFromJwt(token));
    }, []);

    const refresh = useCallback(async (): Promise<string | null> => {
        setLoading(true);
        try {
            const payload = await refreshApi();
            setAccessTokenState(payload.accessToken);
            setUser(userFromJwt(payload.accessToken));
            setLoading(false);
            return payload.accessToken;
        } catch {
            setAccessTokenState(null);
            setUser(null);
            setLoading(false);
            return null;
        }
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    const login = useCallback(async (email: string, password: string) => {
        const res = await loginApi(email, password);
        setAccessTokenState(res.accessToken);
        setUser(userFromJwt(res.accessToken));
    }, []);

    const register = useCallback(async (email: string, password: string, displayName?: string) => {
        await registerApi(email, password, displayName);
    }, []);

    const logout = useCallback(async () => {
        try { await logoutApi(); } catch { }
        setAccessTokenState(null);
        setUser(null);
    }, []);

    const fetchWithAuth = useCallback(async (input: RequestInfo, init: RequestInit = {}) => {
        let token = accessToken;
        const makeHeaders = (t?: string | null) => {
            const headers = new Headers(init.headers || ({} as HeadersInit));
            if (t) headers.set('Authorization', `Bearer ${t}`);
            return headers;
        };

        let res = await fetch(input, { credentials: 'include', ...init, headers: makeHeaders(token) });
        if (res.status === 401) {
            token = await refresh();
            if (!token) return res;
            res = await fetch(input, { credentials: 'include', ...init, headers: makeHeaders(token) });
        }
        return res;
    }, [accessToken, refresh]);

    const value = useMemo(() => ({
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        fetchWithAuth,
        refresh,
        setAccessToken,
    }), [user, accessToken, loading, login, register, logout, fetchWithAuth, refresh, setAccessToken]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────────────────────
// Email Verification Banner
// ─────────────────────────────────────────────────────────────

export function EmailVerificationBanner() {
    const { user, accessToken } = useAuth();
    const [dismissed, setDismissed] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    if (!user || user.emailVerified || dismissed) return null;

    const handleResend = async () => {
        if (!accessToken || sending) return;
        setSending(true);
        try {
            await resendVerificationApi(accessToken);
            setSent(true);
        } catch {
            // silently ignore — user can try again
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="w-full bg-gold/10 border-b border-gold/20 px-4 py-2.5 flex items-center justify-between gap-4">
            <p className="text-xs text-gold">
                {sent
                    ? 'Verifieringsmejl skickat! Kontrollera din inkorg.'
                    : 'Vänligen verifiera din e-postadress.'}
            </p>
            <div className="flex items-center gap-3 shrink-0">
                {!sent && (
                    <button
                        onClick={handleResend}
                        disabled={sending}
                        className="text-xs font-semibold text-gold underline underline-offset-2 hover:text-gold/80 disabled:opacity-50 cursor-pointer"
                    >
                        {sending ? 'Skickar…' : 'Skicka igen'}
                    </button>
                )}
                <button
                    onClick={() => setDismissed(true)}
                    className="text-gold/60 hover:text-gold transition-colors cursor-pointer text-lg leading-none"
                    aria-label="Stäng"
                >
                    &times;
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Header Auth Status
// ─────────────────────────────────────────────────────────────

export function AuthStatus() {
    const { user, loading, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function handleOutsideClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [open]);

    if (loading) return (
        <div className="h-8 w-8 rounded-full bg-white/6 animate-pulse" />
    );

    if (!user) {
        return (
            <Link
                href="/auth"
                className="rounded-lg border border-white/[0.07] bg-bg2 px-3 py-1.5 font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted
                hover:bg-bg3 hover:text-ink hover:border-white/12 transition-colors"
            >
                Logga in
            </Link>
        );
    }

    const displayName = user.displayName ?? user.googleName ?? user.email ?? '?';
    const initial = displayName[0].toUpperCase();

    const handleLogout = async () => {
        setOpen(false);
        await logout();
        window.location.href = '/';
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setOpen(o => !o)}
                aria-label="Kontomeny"
                aria-expanded={open}
                className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden border border-white/10 cursor-pointer hover:border-white/20 transition-colors"
            >
                {user.googleAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={user.googleAvatar}
                        alt={displayName}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="flex h-full w-full items-center justify-center bg-bg4 font-display text-sm font-bold text-ink">
                        {initial}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 z-50 w-52 overflow-hidden rounded-xl border border-white/[0.07] bg-bg2 shadow-xl">
                    {/* User info */}
                    <div className="border-b border-white/[0.07] px-3 py-2.5">
                        <p className="truncate text-xs font-medium text-ink">{displayName}</p>
                        {user.email && displayName !== user.email && (
                            <p className="truncate text-xs text-faint">{user.email}</p>
                        )}
                    </div>

                    {/* Settings link */}
                    <Link
                        href="/settings"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted hover:text-ink hover:bg-bg3 transition-colors"
                    >
                        <Settings className="h-4 w-4 shrink-0" />
                        Inställningar
                    </Link>

                    {/* Separator */}
                    <div className="my-0.5 border-t border-white/[0.07]" />

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-muted hover:text-sell hover:bg-bg3 transition-colors cursor-pointer"
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        Logga ut
                    </button>
                </div>
            )}
        </div>
    );
}
