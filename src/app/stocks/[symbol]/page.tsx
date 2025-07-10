import yahooFinance from 'yahoo-finance2';
import { notFound } from 'next/navigation';
import StockChart from '@/components/StockChart';

interface PageProps {
    params: {symbol: string};
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

        const history = await yahooFinance.historical(symbol, {
            period1: start,
            period2: end,
            interval: '1d',
        });

        const chartData = (history || []).map((h: any) => ({
            date: h.date.toISOString().split('T')[0],
            close: h.close,
        }));

        return (
            <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">
                {quote.longName || quote.shortName || symbol} ({quote.symbol})
            </h1>
            <p>
                Price: {quote.regularMarketPrice} {quote.currency}
            </p>
            {typeof quote.regularMarketChangePercent === 'number' && (
                <p>Change: {quote.regularMarketChangePercent.toFixed(2)}%</p>
            )}
            {chartData.length > 0 && (
                <div className="mx-auto h-150 max-w-4xl">
                    <StockChart data={chartData} />
                </div>
            )}
        </div>
    )
    } catch (error) {
        console.error('Failed to fetch stock data:', error);
        return notFound();
    }
}