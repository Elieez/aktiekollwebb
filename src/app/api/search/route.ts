import yahooFinance from 'yahoo-finance2';
import { NextResponse } from 'next/server';

interface QuoteResult {
  symbol: string;
  shortname?: string;
  longname?: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const results = await yahooFinance.search(query);
    const raw = results.quotes ?? [];

    const quotes = raw.filter(
      (item) =>
        'symbol' in item &&
        typeof item.symbol === 'string'
    );

    const mapped = quotes.map((r) => {
      const quote = r as QuoteResult;
      return {
        symbol: quote.symbol,
        description: quote.shortname ?? quote.longname ?? quote.symbol,
      };
    });

    return NextResponse.json(mapped);
  } catch (err) {
    console.error('yahoo search failed', err);
    return NextResponse.json([]);
  }
}