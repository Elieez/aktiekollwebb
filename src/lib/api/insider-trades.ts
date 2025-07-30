import { get } from "./utils";
import { InsiderTrade } from "../types/InsiderTrade";
import { CompanyTradeCount } from "../types/CompanyTradeCount";

export async function getInsiderTrades(page = 1, pageSize = 10) {
  const query = `page=${page}&pageSize=${pageSize}`;
  return await get<InsiderTrade[]>(`insidertrades/page?${query}`, {
    cache: "no-store",
  });
}

export async function getBigInsiderTrades() {
  return await get<InsiderTrade[]>("insidertrades/top", {
    cache: "no-store",
  });
}

export async function getCompanyTradesCountBuy(queryParams?: string) {
  return await get<CompanyTradeCount[]>(
    `insidertrades/count-buy${queryParams ? `?${queryParams}` : ""}`,
    {
      cache: "no-store",
    }
  );
}

export async function getCompanyTradesCountSell(queryParams?: string) {
  return await get<CompanyTradeCount[]>(
    `insidertrades/count-sell${queryParams ? `?${queryParams}` : ""}`,
    {
      cache: "no-store",
    }
  );
}

export async function getInsiderTradesByCompanyName(companyName: string) {
  const encoded = encodeURIComponent(companyName);
  return await get<InsiderTrade[]>(`insidertrades/company?name=${encoded}`);
}
