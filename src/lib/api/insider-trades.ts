import { get } from "./utils";
import { InsiderTrade } from "../types/InsiderTrade";
import { CompanyTradeCount } from "../types/CompanyTradeCount";
import { TradeStats } from "../types/TradeStats";

// Recent trades change frequently — 5-minute cache balances freshness vs. backend load
export async function getInsiderTrades(page = 1, pageSize = 15) {
  const query = `page=${page}&pageSize=${pageSize}`;
  return await get<InsiderTrade[]>(`insidertrades/page?${query}`, {
    next: { revalidate: 300 },
  });
}

// Top-10 list is computed server-side and unlikely to shift within minutes
export async function getBigInsiderTrades() {
  return await get<InsiderTrade[]>("insidertrades/top", {
    next: { revalidate: 300 },
  });
}

// Buy/sell counts — same cadence as trade list
export async function getCompanyTradesCountBuy(queryParams?: string) {
  return await get<CompanyTradeCount[]>(
    `insidertrades/count-buy${queryParams ? `?${queryParams}` : ""}`,
    { next: { revalidate: 300 } }
  );
}

export async function getCompanyTradesCountSell(queryParams?: string) {
  return await get<CompanyTradeCount[]>(
    `insidertrades/count-sell${queryParams ? `?${queryParams}` : ""}`,
    { next: { revalidate: 300 } }
  );
}

// Per-company trade history — 5-minute cache; note: client-side pagination calls
// this from the browser where next.revalidate has no effect (only applies in SSR)
export async function getInsiderTradesByCompanyName(companyName: string, skip: number = 0, take: number = 10) {
  const encoded = encodeURIComponent(companyName);
  return await get<InsiderTrade[]>(`insidertrades/company?name=${encoded}&skip=${skip}&take=${take}`, {
    next: { revalidate: 300 },
  });
}

// YTD stats rarely change intra-day — cache for 6 hours
export async function getInsiderTradesStats(): Promise<TradeStats> {
  return await get<TradeStats>("insiderTrades/ytd-stats", {
    next: { revalidate: 21600 },
  });
}
