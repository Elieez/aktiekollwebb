import { get } from "./utils";
import { InsiderTrade } from "../types/InsiderTrade";
import { CompanyTradeCount } from "../types/CompanyTradeCount";
import { TradeStats } from "../types/TradeStats";

export async function getInsiderTrades(page = 1, pageSize = 15) {
  const query = `page=${page}&pageSize=${pageSize}`;
  return await get<InsiderTrade[]>(`insidertrades/page?${query}`);
}

export async function getBigInsiderTrades() {
  return await get<InsiderTrade[]>("insidertrades/top");
}

export async function getCompanyTradesCountBuy(queryParams?: string) {
  return await get<CompanyTradeCount[]>(
    `insidertrades/count-buy${queryParams ? `?${queryParams}` : ""}`
  );
}

export async function getCompanyTradesCountSell(queryParams?: string) {
  return await get<CompanyTradeCount[]>(
    `insidertrades/count-sell${queryParams ? `?${queryParams}` : ""}`
  );
}

export async function getInsiderTradesByCompanyName(companyName: string, skip: number = 0, take: number = 10) {
  const encoded = encodeURIComponent(companyName);
  return await get<InsiderTrade[]>(`insidertrades/company?name=${encoded}&skip=${skip}&take=${take}`);
}

export async function getInsiderTradesStats(): Promise<TradeStats> {
  return await get<TradeStats>("insiderTrades/ytd-stats", {
    next: { revalidate: 21600 }, 
  });
}
