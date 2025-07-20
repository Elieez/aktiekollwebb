import yahooFinance from 'yahoo-finance2';
import { notFound } from 'next/navigation';
import StockChart from '@/components/StockChart';
import TradesList from '@/components/TradesList';
import PieChart from '@/components/PieChart';
import { InsiderTrade } from '@/lib/types/InsiderTrade';

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
  const upper = symbol.toUpperCase();

  try {
    const quote = await yahooFinance.quote(upper);
    if (!quote) return notFound();

    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);

    const chartRes = await yahooFinance.chart(upper, {
      period1: start,
      period2: end,
      interval: '1d',
    });

    const chartData =
      chartRes?.meta?.regularMarketTime && chartRes?.quotes?.length
        ? (chartRes.quotes as ChartQuote[]).map((q) => ({
            date: q.date
              ? new Date(q.date).toISOString().split('T')[0]
              : '',
            close: q.close,
          }))
        : [];

    const companyName = quote.longName || quote.shortName || symbol;
    let trades: InsiderTrade[] = [];
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/InsiderTrades/company?name=${encodeURIComponent(
          companyName
        )}`
      );
      if (res.ok) trades = await res.json();
    } catch (e) {
      console.error('Failed to fetch insider trades:', e);
    }

    const query = `days=365&top=&companyName=${encodeURIComponent(
      companyName
    )}`;
    const [buyRes, sellRes] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/insidertrades/count-buy?${query}`,
        { cache: 'no-store' }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/insidertrades/count-sell?${query}`,
        { cache: 'no-store' }
      ),
    ]);
    if (!buyRes.ok || !sellRes.ok)
      throw new Error('Failed to load trade counts');

    const buyCount =
      (await buyRes.json())[0]?.transactionCount ?? 0;
    const sellCount =
      (await sellRes.json())[0]?.transactionCount ?? 0;

    const companyTradeCounts = [buyCount, sellCount];

    return (
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-bold">
          {companyName} ({quote.symbol})
        </h1>
        <p>
          Price: {quote.regularMarketPrice} {quote.currency}
        </p>
        {typeof quote.regularMarketChangePercent === 'number' && (
          <p>
            Change: {quote.regularMarketChangePercent.toFixed(2)}%
          </p>
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
          <h2 className="text-xl font-semibold mb-4">
            Insider Transactions
          </h2>
          <TradesList trades={trades} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch stock data:', error);
    return notFound();
  }
}
