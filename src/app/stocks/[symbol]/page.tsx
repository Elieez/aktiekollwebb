import yahooFinance from 'yahoo-finance2';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {symbol: string};
}

export const metadata = ({ params }: PageProps) => ({
    title: `${params.symbol.toUpperCase()} Stock Information`,
});

export default async function StockPage({ params }: PageProps) {
    const symbol = params.symbol.toUpperCase();

    try {
        const quote = await yahooFinance.quote(symbol);
        if (!quote) {
            return notFound();
        }
        
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
        </div>
    )
    } catch (error) {
        console.error('Failed to fetch stock data:', error);
        return notFound();
    }
}