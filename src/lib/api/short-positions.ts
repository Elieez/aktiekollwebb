import { get } from "./utils";
import type { ShortCompany, ShortSort, ShortTopList } from "@/lib/types/ShortPosition";

export async function getMostShorted(
  sort: ShortSort = "highest",
  limit = 50,
  days = 30
): Promise<ShortTopList | null> {
  try {
    return await get<ShortTopList>(
      `shortpositions/top?sort=${sort}&limit=${limit}&days=${days}`,
      { next: { revalidate: 3600 } }
    );
  } catch {
    return null;
  }
}

export async function getCompanyShorts(symbol: string): Promise<ShortCompany | null> {
  try {
    return await get<ShortCompany>(
      `shortpositions/company?symbol=${encodeURIComponent(symbol)}`,
      { next: { revalidate: 3600 } }
    );
  } catch {
    return null;
  }
}
