import Page from "@/components/Page";
import YahooFinance from "yahoo-finance2";
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

const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey'],
});

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

export default async function StockPage({ params }: PageProps) {
  const { symbol } = await params;
  const cleanSymbol = symbol.toUpperCase().replace('.ST', ''); 
  const yahooSymbol = symbol.includes('.') ? symbol : `${symbol}.ST`;

  try {
    // Clean - no validation options needed in v3
    const quote = await yahooFinance.quote(yahooSymbol);

    if (!quote || !quote.regularMarketPrice) {
      console.error(`No valid quote for ${yahooSymbol}`);
      return notFound();
    }

    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);

    let chartRes;
    try {
      // Clean - no validation options
      chartRes = await yahooFinance.chart(yahooSymbol, {
        period1: start,
        period2: end,
        interval: "1d",
      });
    } catch (chartError) {
      console.warn(`Chart fetch failed:`, chartError);
      chartRes = null;
    }

    const rawCompanyName = quote.longName || quote.shortName || cleanSymbol;
    const companyName = cleanCompanyName(rawCompanyName);

    console.log(`[Stock Page] Cleaned company name: "${companyName}" from "${rawCompanyName}"`);

    const trades = await getInsiderTradesByCompanyName(companyName);

    const chartData = (chartRes && Array.isArray(chartRes.quotes) && chartRes.quotes.length > 0)
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
            <div className="text-center text-gray-500 py-8 border border-gray-300 rounded h-96 flex items-center justify-center">
              <div>
                <p className="font-medium">Chart Unavailable</p>
                <p className="text-sm mt-2">Historical data not found</p>
              </div>
            </div>
          )}
          
          <div className="pt-8">
            <TradesList trades={trades} enablePagination companyName={companyName}/>
          </div>
        </Section>
      </Page>
    );
  } catch (error: any) {
    console.error("Stock page error:", error.message);
    return notFound();
  }
}

export const revalidate = 300;