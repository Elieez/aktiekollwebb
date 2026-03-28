import { get } from "./utils";

export interface CompanySearchResult {
    code: string;
    name: string;
    isin: string | null;
}

export interface Company {
    id: number;
    code: string;
    name: string;
    isin: string | null;
    currency: string | null;
    type: string | null;
    lastUpdated: string;
}

export async function searchCompanies(query: string, limit = 10) {
    if (!query || query.length < 2) {
        return [];
    }

    const encoded = encodeURIComponent(query);

    return await get<CompanySearchResult[]>(
        `company/search?q=${encoded}&limit=${limit}`,
        { next: { revalidate: 86400 } }
    );
}

export async function getCompanyByCode(code: string) {
    return await get<Company>(
        `company/${encodeURIComponent(code)}`,
        { next: { revalidate: 3600 } }
    );
}
