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
  return await get<CompanySearchResult[]>(
    `company/search?q=${encoded}&limit=${limit}`
  );
}