const backendUrl = process.env.NEXT_PUBLIC_API_URL;

export async function get<T>(endpoint: string, headers? : HeadersInit): Promise<T> {
  const url = `${backendUrl}/${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json", ...headers }
  });

  if (!response.ok)
    throw new Error(`[get] ${url} failed (HTTP: ${response.status})`);

  return (await response.json()) as T;
}

export function cleanCompanyName(name: string): string {
  return name
    .replace(/\s*[\(\（][^)]*?publ[^)]*?[\)\）]\s*/gi, '')
    .replace(/\u00A0/g, ' ')
    .trim();
}