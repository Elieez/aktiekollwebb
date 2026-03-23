"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { loginApi, registerApi, refreshApi, logoutApi} from '../lib/api/auth';

type User = { id?: string; email?: string; displayName?: string } | null;

type AuthContextValue = {
    user: User;
    accessToken: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName?: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    refresh: () => Promise<string | null>;
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

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    try {
      const payload = await refreshApi();
      setAccessToken(payload.accessToken);
      const p = parseJwt(payload.accessToken);
      setUser({ id: p.sub, email: p.email, displayName: p.displayName });
      setLoading(false);
      return payload.accessToken;
    } catch {
      setAccessToken(null);
      setUser(null);
      setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    // attempt silent refresh on mount
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await loginApi(email, password);
    setAccessToken(res.accessToken);
    const p = parseJwt(res.accessToken);
    setUser({ id: p.sub, email: p.email, displayName: p.displayName });
  }, []);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    await registerApi(email, password, displayName);
  }, []);

  const logout = useCallback(async () => {
    try { await logoutApi(); } catch { }
    setAccessToken(null);
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
  }), [user, accessToken, loading, login, register, logout, fetchWithAuth, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

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
          Sign in
        </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="font-display text-[13px] font-medium text-ink">
        {user.displayName ?? user.email}
      </span>
      <button
        onClick={async () => { await logout(); window.location.href = '/'; }}
        className="rounded-lg border border-white/[0.07] bg-bg2 px-3 py-1.5 font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted
        hover:bg-bg3 hover:text-sell hover:border-white/12 transition-colors cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}