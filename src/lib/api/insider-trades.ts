import { get } from "./utils";
import { InsiderTrade } from "../types/InsiderTrade";
import { CompanyTradeCount } from "../types/CompanyTradeCount";
import { TradeStats } from "../types/TradeStats";

export async function getInsiderTrades(page = 1, pageSize = 15) {
  const query = `page=${page}&pageSize=${pageSize}`;
  return await get<InsiderTrade[]>(`insidertrades/page?${query}`, {
    next: { revalidate: 3600 }
  });
}

export async function getBigInsiderTrades() {
  return await get<InsiderTrade[]>("insidertrades/top", {
    next: { revalidate: 3600 }
  });
}

export async function getCompanyTradesCountBuy(queryParams?: string) {
  return await get<CompanyTradeCount[]>(
    `insidertrades/count-buy${queryParams ? `?${queryParams}` : ""}`, {
    next: { revalidate: 3600 }
  });
}

export async function getCompanyTradesCountSell(queryParams?: string) {
  return await get<CompanyTradeCount[]>(
    `insidertrades/count-sell${queryParams ? `?${queryParams}` : ""}`, {
    next: { revalidate: 3600 }
  });
}

export async function getInsiderTradesBySymbol(symbol: string, skip: number = 0, take: number = 10) {
  const encoded = encodeURIComponent(symbol);
  return await get<InsiderTrade[]>(`insidertrades/company?symbol=${encoded}&skip=${skip}&take=${take}`, {
    next: { revalidate: 3600 }
  });
}

export async function getInsiderTradesStats(): Promise<TradeStats> {
  return await get<TradeStats>("insiderTrades/ytd-stats", {
    next: { revalidate: 21600 }, 
  });
}
