import Page from "@/components/Page";
import CompanySearch from "@/components/SearchBar";
import Section from "@/components/Section";
import TradesCount from "@/components/TradesCount";
import TradesList from "../../components/TradesList";
import BigTradesList from "../../components/BigTradesList";

import {
  getInsiderTrades,
  getBigInsiderTrades,
  getCompanyTradesCountBuy,
  getCompanyTradesCountSell,
} from "@/lib/api/insider-trades";

export const metadata = {
  title: "Insider Trades & Big Trades",
};

export default async function TradesPage() {
  const trades = await getInsiderTrades();
  const bigTrades = await getBigInsiderTrades();
  const tradesCountBuy = await getCompanyTradesCountBuy();
  const tradesCountSell = await getCompanyTradesCountSell();

  const spacing = "space-y-6";

  return (
    <Page className={`${spacing}`}>
      <CompanySearch />
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className={`lg:w-1/6 ${spacing}`}>
          <Section>
            <TradesCount companies={tradesCountBuy} />
          </Section>
          <Section>
            <TradesCount companies={tradesCountSell} />
          </Section>
        </div>
        <Section className="lg:w-3/6">
          <TradesList trades={trades} />
        </Section>
        <Section className="lg:w-2/6">
          <BigTradesList trades={bigTrades} />
        </Section>
      </div>
    </Page>
  );
}
