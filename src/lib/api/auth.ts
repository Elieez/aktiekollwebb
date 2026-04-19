export type AuthResponse = { accessToken: string; expiresAt: string | number };
export type MeResponse = { id?: string; email?: string; displayName?: string };


async function handleJson(res: Response) {
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw (await handleJson(res)) || new Error('Login failed');
    return res.json() as Promise<AuthResponse>;
}

export async function registerApi(email: string, password: string, displayName?: string) {
    const res = await fetch(`/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
    });
    const data = await res.json();
    if (!res.ok) throw data as string[];
    return data;
}

export async function refreshApi(): Promise<AuthResponse> {
    const res = await fetch(`/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Refresh failed');
    return res.json();
}

export async function logoutApi() {
    await fetch(`/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
}

export async function verifyEmailApi(code: string) {
    const res = await fetch(
        `/api/auth/verify-email?code=${encodeURIComponent(code)}`,
        { credentials: 'include' }
    );
    const data = await handleJson(res);
    if (!res.ok) throw data;
    return data;
}

export async function resendVerificationApi(accessToken: string) {
    const res = await fetch(`/api/auth/resend-verification`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await handleJson(res);
    if (!res.ok) throw data;
    return data;
}

export async function forgotPasswordApi(email: string) {
    const res = await fetch(`/api/auth/forgot-password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Request failed');
    return res.json();
}

export async function resetPasswordApi(email: string, token: string, newPassword: string) {
    const res = await fetch(`/api/auth/reset-password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
    });
    const data = await handleJson(res);
    if (!res.ok) throw data;
    return data;
}

export async function requestAccountDeletionApi(accessToken: string) {
    const res = await fetch(`/api/auth/account/delete/request`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await handleJson(res);
    if (!res.ok) throw data;
    return data;
}

export async function confirmAccountDeletionApi(accessToken: string, token: string, password?: string) {
    const res = await fetch(`/api/auth/account/delete/confirm`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ token, password }),
    });
    const data = await handleJson(res);
    if (!res.ok) throw data;
    return data;
}
