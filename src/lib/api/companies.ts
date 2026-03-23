import { get } from "./utils";

export interface CompanySearchResult {
    code: string;
    name: string;
    isin: string | null;
}

export async function searchCompanies(query: string, limit = 10) {
    if (!query || query.length < 2) {
        return [];
    }

    const encoded = encodeURIComponent(query);
    // Company list is stable — cache for 1 hour to reduce backend calls on repeated searches
    return await get<CompanySearchResult[]>(
      `company/search?q=${encoded}&limit=${limit}`,
      { next: { revalidate: 3600 } }
    );
}