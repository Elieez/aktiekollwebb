
export type FollowedCompany = {
    companyId: number;
    code: string;
    name: string;
    isin: string | null;
    followedSince: string;
};

export type FollowStatus = {
    isFollowing: boolean;
    followCount: number;
};

export type NotificationPreferences = {
    emailEnabled: boolean;
    discordEnabled: boolean;
    discordWebhookUrl: string | null;
};

async function handleJson(res: Response) {
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
}

export async function followCompany(
    companyId: number,
    fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<Response>
): Promise<FollowStatus> {
    const res = await fetchWithAuth(`/api/follow/${companyId}`, {
        method: 'POST',
    });
    const data = await handleJson(res);
    if (!res.ok) throw data;
    return data as FollowStatus;
}

export async function unfollowCompany(
    companyId: number,
    fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<Response>
): Promise<FollowStatus> {
    const res = await fetchWithAuth(`/api/follow/${companyId}`, {
        method: 'DELETE',
    });
    const data = await handleJson(res);
    if (!res.ok) throw data;
    return data as FollowStatus;
}

export async function getFollowStatus(
    companyId: number,
    fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<Response>
): Promise<FollowStatus> {
    const res = await fetchWithAuth(`/api/follow/${companyId}`);
    const data = await handleJson(res);
    if (!res.ok) throw data;
    return data as FollowStatus;
}

export async function getFollowedCompanies(
    fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<Response>
): Promise<FollowedCompany[]> {
    const res = await fetchWithAuth(`/api/follow`);
    const data = await handleJson(res);
    if (!res.ok) throw data;
    return data as FollowedCompany[];
}

export async function getNotificationPreferences(
    fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<Response>
): Promise<NotificationPreferences> {
    const res = await fetchWithAuth(`/api/notification/preferences`);
    const data = await handleJson(res);
    if (!res.ok) throw data;
    return data as NotificationPreferences;
}

export async function updateNotificationPreferences(
    prefs: NotificationPreferences,
    fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<Response>
): Promise<void> {
    // Backend requires a non-null string for discordWebhookUrl even when Discord is disabled
    const payload = { ...prefs, discordWebhookUrl: prefs.discordWebhookUrl ?? "" };
    const res = await fetchWithAuth(`/api/notification/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const data = await handleJson(res);
        throw data;
    }
}
