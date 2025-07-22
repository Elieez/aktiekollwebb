import Page from "@/components/Page";
import yahooFinance from "yahoo-finance2";
import StockChart from "@/components/StockChart";
import TradesList from "@/components/TradesList";
import PieChart from "@/components/PieChart";

import { notFound } from "next/navigation";
import {
  getCompanyTradesCountBuy,
  getCompanyTradesCountSell,
  getInsiderTradesByCompanyName,
} from "@/lib/api/insider-trades";

interface PageProps {
  params: { symbol: string };
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `${params.symbol.toUpperCase()} Stock Information`,
  };
}

export default async function StockPage({ params }: PageProps) {
  const symbol = params.symbol.toUpperCase();

  try {
    const quote = await yahooFinance.quote(symbol);
    if (!quote) {
      return notFound();
    }

    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);

    const chartRes = await yahooFinance.chart(symbol, {
      period1: start,
      period2: end,
      interval: "1d",
    });

    const companyName = quote.longName || quote.shortName || symbol;
    const trades = await getInsiderTradesByCompanyName(companyName);

    const chartData =
      chartRes?.meta?.regularMarketTime && chartRes?.quotes?.length > 0
        ? chartRes.quotes.map((quote: any, idx: number) => ({
            date: quote.date
              ? new Date(quote.date).toISOString().split("T")[0]
              : "",
            close: quote.close,
          }))
        : [];

    const query = `days=365&top=&companyName=${encodeURIComponent(
      companyName
    )}`;

    const companyTradeCountsBuy = await getCompanyTradesCountBuy(query);
    const companyTradeCountsSell = await getCompanyTradesCountSell(query);

    const buyCount = companyTradeCountsBuy[0]?.transactionCount || 0;
    const sellCount = companyTradeCountsSell[0]?.transactionCount || 0;

    const companyTradeCounts = [buyCount, sellCount];

    return (
      <Page>
        <div className="p-8 space-y-4">
          <h1 className="text-2xl font-bold">
            {quote.longName || quote.shortName || symbol} ({quote.symbol})
          </h1>
          <p>
            Price: {quote.regularMarketPrice} {quote.currency}
          </p>
          {typeof quote.regularMarketChangePercent === "number" && (
            <p>Change: {quote.regularMarketChangePercent.toFixed(2)}%</p>
          )}
          {chartData.length > 0 && (
            <div className="mx-auto h-150 max-w-4xl">
              <StockChart data={chartData} />
            </div>
          )}
          <div className="max-w-xs mx-auto">
            <PieChart data={companyTradeCounts} />
          </div>
          <div className="pt-8">
            <h2 className="text-xl font-semibold mb-4">Insider Transactions</h2>
            <TradesList trades={trades} />
          </div>
        </div>
      </Page>
    );
  } catch (error) {
    console.error("Failed to fetch stock data:", error);
    return notFound();
  }
}
