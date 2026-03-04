import Page from "@/components/Page";
import YahooFinance from "yahoo-finance2";
import StockChart from "@/components/StockChart";
import TradesList from "@/components/TradesList";
import PieChart from "@/components/PieChart";
import Section from "@/components/Section";
import { cleanCompanyName } from "@/lib/utils";
import { notFound } from "next/navigation";
import { unstable_cache } from 'next/cache'; // ← Add this
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
    title: `${symbol.toUpperCase()} Aktie Information`,
  };
}

// Cached Yahoo Finance functions - cache for 5 minutes
const getCachedQuote = unstable_cache(
  async (symbol: string) => {
    const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
    try {
      return await yahooFinance.quote(symbol);
    } catch (error: any) {
      if (error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
        console.warn(`Rate limited for ${symbol}`);
        return error.message;
      }
      throw error;
    }
  },
  ['yahoo-quote'],
  { revalidate: 300 } // 5 minutes
);

const getCachedChart = unstable_cache(
  async (symbol: string) => {
    const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);
    
    try {
      return await yahooFinance.chart(symbol, {
        period1: start,
        period2: end,
        interval: "1d",
      });
    } catch (error: any) {
      if (error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
        console.warn(`Rate limited for chart ${symbol}`);
        return null;
      }
      throw error;
    }
  },
  ['yahoo-chart'],
  { revalidate: 300 }
);

export default async function StockPage({ params }: PageProps) {
  const { symbol } = await params;
  const cleanSymbol = symbol.toUpperCase().replace('.ST', ''); 
  const yahooSymbol = symbol.includes('.') ? symbol : `${symbol}.ST`;

  try {
    // Use cached functions
    const quote = await getCachedQuote(yahooSymbol);
    
    if (!quote) {
      return (
        <Page>
          <Section className="max-w-5xl mx-auto p-8">
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Rate Limit Reached
              </h1>
              <p className="text-gray-600 mb-4">
                Yahoo Finance is temporarily unavailable. Try again in a few minutes.
              </p>
              <p className="text-sm text-gray-500">
                Stock: {cleanSymbol}
              </p>
            </div>
          </Section>
        </Page>
      );
    }

    const chartRes = await getCachedChart(yahooSymbol);

    const rawCompanyName = quote.longName || quote.shortName || cleanSymbol;
    const companyName = cleanCompanyName(rawCompanyName);

    // Your backend calls (not rate limited)
    const trades = await getInsiderTradesByCompanyName(companyName);

    const chartData = chartRes?.meta?.regularMarketTime && chartRes?.quotes?.length > 0
      ? (chartRes.quotes as ChartQuote[]).map((q) => ({
          date: q.date ? new Date(q.date).toISOString().split('T')[0] : '',
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
              <h1 className="text-3xl font-bold text-gray-900">{companyName}</h1>
              <p className="text-xl font-medium text-gray-500">({cleanSymbol})</p>
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
          
          {chartData.length > 0 ? (
            <div className="mx-auto max-w-4xl flex items-center space-x-6">
              <div className={`${hasTransactions ? 'flex-1' : 'w-full'} border border-gray-300 stock-chart-container h-96`}>
                <StockChart data={chartData} trades={trades} />
              </div>
              {hasTransactions && (
                <div className="w-60">
                  <PieChart data={companyTradeCounts} />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Chart data temporarily unavailable
            </div>
          )}
          
          <div className="pt-8">
            <TradesList trades={trades} enablePagination companyName={companyName}/>
          </div>
        </Section>
      </Page>
    );
  } catch (error: any) {
    console.error("Failed to fetch stock data:", error);
    return notFound();
  }
}

export const revalidate = 300; // Also keep this for production