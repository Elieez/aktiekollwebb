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

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

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

    const trades = await getInsiderTradesByCompanyName(companyName, 0, 10);

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

    const priceChange = quote.regularMarketChangePercent;
    const isPositive = typeof priceChange === 'number' && priceChange > 0;
    const isNegative = typeof priceChange === 'number' && priceChange < 0;


    return (
      <Page>
        <div className="max-w-5xl mx-auto px-8 py-8 space-y-6">
          {/* Stock header */}
          <Section className="bg-bg2 border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm_items-center justify-between gap-4">
              {/* Left: name + ticker */}
              <div>
                <h1 className="font-display text-2xl font-bold text-ink tracking-tight">
                  {companyName}
                </h1>
                <p className="font-mono text-[13px] text-faint mt-0.5">
                  {cleanSymbol} · Stockholmsbörsen
                </p>
              </div>

              {/* Right: price + change */}
              <div className="text-right">
                <p className="font-display text-3xl font-semibold text-ink leading-none">
                  {quote.regularMarketPrice?.toLocaleString('sv-SE')} 
                  <span className="font-mono text-base font-normal text-faint ml-1">
                    {quote.currency}
                  </span>
                </p>
                {typeof priceChange === 'number' && (
                  <p className={`font-mono text-[13px] mt-1 ${
                    isPositive ? 'text-buy' 
                    : isNegative ? 'text-sell'
                    : 'text-muted' 
                  }`}
                  >
                    {isPositive ? '▲' : isNegative ? '▼' : ''}
                    {' '}{priceChange.toFixed(2)}%
                  </p>
                )}
              </div>
            </div>
            </Section>

            {/* Chart + Pie */}
            <Section className="bg-bg2 border border-border rounded-xl overflow-hidden">
              {chartData.length > 0 ? (
                <div className="flex items-stretch gap-0">

                  {/* Chart */}
                  <div className={`${hasTransactions ? 'flex-1' : 'w-full'} h-120 p-4
                                  border-r border-border`}>
                    <StockChart data={chartData} trades={trades} />
                  </div>

                  {/* Pie */}
                  {hasTransactions && (
                    <div className="w-52 shrink-0 flex items-center justify-center border border-border">
                      <PieChart data={companyTradeCounts} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-80 flex flex-col items-center justify-center gap-2 text-center">
                  <p className="font-display text-[13px] font-medium text-muted">
                    Graf ej tillgänglig
                  </p>
                  <p className="text-[12px] text-faint">
                    Historisk data hittades inte
                  </p>
                </div>
              )}
            </Section>
            <Section className="bg-bg2 border border-border rounded-xl overflow-hidden">
              <TradesList trades={trades} enablePagination companyName={companyName}/>
          </Section>
        </div>
      </Page>
    );
  } catch (error: any) {
    console.error("Stock page error:", error.message);
    return notFound();
  }
}

export const revalidate = 300;