import "../../app/globals.css";
import TradesList from "../../components/TradesList";
import BigTradesList from "../../components/BigTradesList";
import TradesCount from "@/components/TradesCount";
import CompanySearchWithRouter from "../../components/CompanySearchWithRouter";

import {
  getCompanyTradesCountSell,
  getBigInsiderTrades,
  getCompanyTradesCountBuy,
  getInsiderTrades,
} from "@/lib/api/insider-trades";

export const metadata = {
  title: "Insider Trades & Big Trades",
};

export default async function TradesPage() {
  const trades = await getInsiderTrades();
  const bigTrades = await getBigInsiderTrades();
  const tradesCountBuy = await getCompanyTradesCountBuy();
  const tradesCountSell = await getCompanyTradesCountSell();

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
            <TradesCount companies={tradesCountBuy} />
            <TradesCount companies={tradesCountSell} />
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
