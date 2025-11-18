export type AuthResponse = { accessToken: string; expiresAt: string | number };
export type MeResponse = { id?: string; email?: string; displayName?: string };

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

async function handleJson(res: Response) {
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw (await handleJson(res)) || new Error('Login failed');
    return res.json() as Promise<AuthResponse>;
}

export async function registerApi(email: string, password: string, displayName?: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
    });
    if (!res.ok) throw (await handleJson(res)) || new Error('Register failed');
    return res.json();
}

export async function refreshApi(): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Refresh failed');
  return res.json();
}

export async function logoutApi() {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}