import { get } from "./utils";
import { InsiderTrade } from "../types/InsiderTrade";
import { CompanyTradeCount } from "../types/CompanyTradeCount";

export async function getInsiderTrades() {
  return await get<InsiderTrade[]>("insidertrades", {
    cache: "no-store",
  });
}

export async function getBigInsiderTrades() {
  return await get<InsiderTrade[]>("insidertrades/top", {
    cache: "no-store",
  });
}

export async function getCompanyTradesCountBuy() {
  return await get<CompanyTradeCount[]>("insidertrades/count-buy", {
    cache: "no-store",
  });
}

export async function getCompanyTradesCountSell() {
  return await get<CompanyTradeCount[]>("insidertrades/count-sell", {
    cache: "no-store",
  });
}
