import yahooFinance from 'yahoo-finance2';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const results = await yahooFinance.search(query);
    const mapped = (results.quotes || []).map((r: any) => ({
      symbol: r.symbol,
      description: r.shortname || r.longname || r.symbol,
    }));
    return NextResponse.json(mapped);
  } catch (err) {
    console.error('yahoo search failed', err);
    return NextResponse.json([]);
  }
}