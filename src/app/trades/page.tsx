import "../../app/globals.css";
import TradesList from "../../components/TradesList";
import BigTradesList from "../../components/BigTradesList";
import TradesCount from "@/components/TradesCount";
import CompanySearchWithRouter from "../../components/CompanySearchWithRouter";

import { get } from "@/lib/api/utils";
import { InsiderTrade } from "@/lib/types/InsiderTrade";
import { CompanyTradeCount } from "@/lib/types/CompanyTradeCount";

export const metadata = {
  title: "Insider Trades & Big Trades",
};

export default async function TradesPage() {
  
  const trades = await get<InsiderTrade[]>("insidertrades", {
    cache: "no-store",
  });
  const bigTrades = await get<InsiderTrade[]>("insidertrades/top", {
    cache: "no-store",
  });
  const tradesCountBuyData = await get<CompanyTradeCount[]>(
    "insidertrades/count-buy",
    { cache: "no-store" }
  );
  const tradesCountSellData = await get<CompanyTradeCount[]>(
    "insidertrades/count-sell",
    { cache: "no-store" }
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="">
          <CompanySearchWithRouter />
        </section>
        <main className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          {/* Search Bar Section */}

          {/* Trades Count Section */}
          <section className="lg:col-span-1">
            <TradesCount companies={tradesCountBuyData} />
            <TradesCount companies={tradesCountSellData} />
          </section>

          {/* Trades Section */}
          <section className="lg:col-span-3">
            <TradesList trades={trades} />
          </section>

          {/* Big Trades Section */}
          <section className="lg:col-span-2">
            <BigTradesList trades={bigTrades} />
          </section>
        </main>
      </div>
    </div>
  );
}
