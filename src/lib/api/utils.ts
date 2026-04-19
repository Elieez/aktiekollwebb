const backendUrl = process.env.NEXT_PUBLIC_API_URL;

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
    ...(typeof window === "undefined" && {
      next: { revalidate: DEFAULT_REVALIDATE, ...options?.next },
    }),
  });

  if (!response.ok)
    throw new Error(`[get] ${url} failed (HTTP: ${response.status})`);

  return (await response.json()) as T;
}