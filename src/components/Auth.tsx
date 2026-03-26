"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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

    if (loading) return (
        <div className="h-4 w-16 rounded-md bg-white/6 animate-pulse" />
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

    return (
        <div className="flex items-center gap-3">
            {user.googleAvatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={user.googleAvatar}
                    alt={user.displayName ?? user.email ?? 'avatar'}
                    className="h-7 w-7 rounded-full object-cover border border-white/10"
                />
            )}
            <span className="font-display text-[13px] font-medium text-ink">
                {user.displayName ?? user.googleName ?? user.email}
            </span>
            <button
                onClick={async () => { await logout(); window.location.href = '/'; }}
                className="rounded-lg border border-white/[0.07] bg-bg2 px-3 py-1.5 font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted
                hover:bg-bg3 hover:text-sell hover:border-white/12 transition-colors cursor-pointer"
            >
                Logga ut
            </button>
        </div>
    );
}
