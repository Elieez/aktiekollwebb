const backendUrl = process.env.NEXT_PUBLIC_API_URL;

// Default revalidation: 5 minutes. Callers can override via options.next.
// This avoids hammering the backend on every SSR render while keeping data reasonably fresh.
const DEFAULT_REVALIDATE = 300;

export async function get<T>(
  endpoint: string,
  options?: {
    headers?: HeadersInit;
    next?: NextFetchRequestConfig;
  }
): Promise<T> {
  const url = `${backendUrl}/${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json", ...options?.headers },
    // Merge caller-supplied next config; fall back to default revalidate
    next: { revalidate: DEFAULT_REVALIDATE, ...options?.next },
  });

  if (!response.ok)
    throw new Error(`[get] ${url} failed (HTTP: ${response.status})`);

  return (await response.json()) as T;
}