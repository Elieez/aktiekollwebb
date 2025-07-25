import Page from "@/components/Page";
import yahooFinance from "yahoo-finance2";
import StockChart from "@/components/StockChart";
import TradesList from "@/components/TradesList";
import PieChart from "@/components/PieChart";
import Section from "@/components/Section";
import { cleanCompanyName } from "@/lib/utils";

import { notFound } from "next/navigation";
import {
  getCompanyTradesCountBuy,
  getCompanyTradesCountSell,
  getInsiderTradesByCompanyName,
} from "@/lib/api/insider-trades";

interface PageProps {
  params: Promise<{ symbol: string }>;
}

interface ChartQuote {
  date?: string | number | Date;
  close: number;
}

export async function generateMetadata({ params }: PageProps) {
  const { symbol } = await params;
  return {
    title: `${symbol.toUpperCase()} Stock Information`,
  };
}

export default async function StockPage({ params }: PageProps) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  try {
    const quote = await yahooFinance.quote(upperSymbol);
    if (!quote) {
      return notFound();
    }

    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);

    const chartRes = await yahooFinance.chart(upperSymbol, {
      period1: start,
      period2: end,
      interval: "1d",
    });

    const rawCompanyName = quote.longName || quote.shortName || upperSymbol;
    const companyName = cleanCompanyName(rawCompanyName);
    const trades = await getInsiderTradesByCompanyName(companyName);

    const chartData =
      chartRes?.meta?.regularMarketTime && chartRes?.quotes?.length > 0
        ? (chartRes.quotes as ChartQuote[]).map((q) => ({
            date: q.date
              ? new Date(q.date).toISOString().split('T')[0]
              : '',
              close: q.close,
          }))
        : [];

    const query = `days=365&top=&companyName=${encodeURIComponent(companyName)}`;

    const companyTradeCountsBuy = await getCompanyTradesCountBuy(query);
    const companyTradeCountsSell = await getCompanyTradesCountSell(query);

    const buyCount = companyTradeCountsBuy[0]?.transactionCount || 0;
    const sellCount = companyTradeCountsSell[0]?.transactionCount || 0;

    const companyTradeCounts = [buyCount, sellCount];
    const hasTransactions = trades.length > 0;

    return (
            <Page>
                <Section className="max-w-5xl mx-auto p-8 space-y-8">
                    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {companyName}
                            </h1>
                            <p className="text-xl font-medium text-gray-500">({quote.symbol})</p>
                        </div>
                        <div className="mt-4 sm:mt-0 text-right">
                            <p className="text-4xl font-semibold text-gray-900">
                                {quote.regularMarketPrice} 
                                <span className="text-xl font-medium text-gray-600">{quote.currency}</span>
                            </p>
                            {typeof quote.regularMarketChangePercent === 'number' && (
                                <p className={`mt-1 text-lg font-medium ${
                                    quote.regularMarketChangePercent > 0 
                                    ? 'text-green-500' 
                                    : 'text-red-500'
                                }`}>
                                    {quote.regularMarketChangePercent.toFixed(2)}%
                                </p>
                            )}
                        </div>
                    </header>
                    <div className="border-b border-gray-200 my-4 -mx-8" />
                    {chartData.length > 0 && (
                        <div className={`mx-auto max-w-4xl flex items-center space-x-6`}>
                          <div 
                              className={`${hasTransactions ? 'flex-1' : 'w-full'} border rounded-md border-gray-300 stock-chart-container h-96`}>
                                <StockChart data={chartData} />
                            </div>
                            {hasTransactions && (
                            <div className="w-60">
                                <PieChart data={companyTradeCounts} />
                            </div>
                            )}
                        </div>
                    )}
                    <div className="pt-8">
                        <TradesList trades={trades} />
                    </div>
                </Section>
            </Page>
        );
  } catch (error) {
    console.error("Failed to fetch stock data:", error);
    return notFound();
  }
}
