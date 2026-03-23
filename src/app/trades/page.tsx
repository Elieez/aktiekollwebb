import Page from "@/components/Page";
import Section from "@/components/Section";
import TradesCount from "@/components/TradesCount";
import TradesList from "@/components/TradesList";
import BigTradesList from "@/components/BigTradesList";
import Hero from "@/components/Hero";

import {
  getInsiderTrades,
  getBigInsiderTrades,
  getCompanyTradesCountBuy,
  getCompanyTradesCountSell,
  getInsiderTradesStats,
} from "@/lib/api/insider-trades";

export const metadata = {
  title: "Insider Trades & Big Trades",
};

export default async function TradesPage() {
  const trades = await getInsiderTrades(1, 15);
  const bigTrades = await getBigInsiderTrades();
  const tradesCountBuy = await getCompanyTradesCountBuy();
  const tradesCountSell = await getCompanyTradesCountSell();
  const stats = await getInsiderTradesStats();

  const spacing = "space-y-6";

  return (
    <Page className="min-h-screen bg-bg text-ink antialiased">
      <Hero stats={stats} />
      <div>
        <div className="mx-auto grid max-w-380 grid-cols-1 gap-6 px-4 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1fr_340px]">
          <Section>
            <TradesList trades={trades} enablePagination/>
          </Section>

          <Section className="flex flex-col gap-6">
            <BigTradesList trades={bigTrades} />

            <Section className="flex flex-col gap-3">
              <div className="mb-2">
                <span className="font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">
                  Denna månad  
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TradesCount companies={tradesCountBuy} title="▲ Mest köpta" variant="buy" />
                <TradesCount companies={tradesCountSell} title="▼ Mest sålda" variant="sell" />
              </div>
            </Section>
          </Section>
        </div>
      </div>
    </Page>
  );
}
