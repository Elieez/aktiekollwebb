import yahooFinance from 'yahoo-finance2';
import { NextResponse } from 'next/server';
import { cleanCompanyName } from '@/lib/api/utils';

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

    const quotes: QuoteResult[] = Array.isArray(results?.quotes)
      ? results.quotes as QuoteResult[]
      : [];

    const mapped = quotes
      .filter(r => Boolean(r.symbol))
      .map(r => {
        const rawName = r.longname ?? r.shortname ?? r.symbol;
        const description = cleanCompanyName(rawName);
        return {
          symbol: r.symbol,
          description,
        };
      });
    return NextResponse.json(mapped);
  } catch (err) {
    console.error('yahoo search failed', err);
    return NextResponse.json([]);
  }
}