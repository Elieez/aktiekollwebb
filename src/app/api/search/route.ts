import yahooFinance from 'yahoo-finance2';
import { NextResponse } from 'next/server';
import { cleanCompanyName } from '@/lib/utils';

interface QuoteResult {
  symbol: string;
  shortname?: string;
  longname?: string;
  exchange?: string;
  exchDisp?: string;
  fullExchangeName?: string;
  region?: string;
  country?: string;
}

function trigramSimilarity(a:string, b: string) {
  const makeTrigrams = (s: string) => {
    const up = s.toUpperCase();
    if (up.length < 3) return [up];
    const out: string[] = [];
    for (let i = 0; i < up.length - 2; i++) out.push(up.slice(i, i + 3));
    return out;
  };

  const aTris = makeTrigrams(a);
  const bSet = new Set(makeTrigrams(b));
  let count = 0;
  for (const tri of aTris) if (bSet.has(tri)) count++;
  return count;
}

function isSwedish(r: QuoteResult) {
  const symbol = (r.symbol || '').toUpperCase();
  const exch = (r.fullExchangeName || r.exchDisp || r.exchange || '').toLowerCase();
  const region = (r.region || r.country || '').toUpperCase();
  return (
    region === 'SE' ||
    exch.includes('stockholm') || 
    symbol.endsWith('.ST') ||
    symbol.endsWith('.STO')
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  const regionBias = searchParams.get('regionBias') ?? undefined;
  const regionOnly = searchParams.get('regionOnly') ?? undefined;
  const exchangesPreferred = searchParams
    .get('exchangesPreferred')
    ?.split(',')
    .filter(Boolean);
  const suffixesPreferred = searchParams
    .get('suffixesPreferred')
    ?.split(',')
    .filter(Boolean);


  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const results = await yahooFinance.search(query, {
      lang: 'sv-SE',
      region: 'SE',
      quotesCount: 30,
      newsCount: 0,
    });

    let quotes: QuoteResult[] = Array.isArray(results?.quotes)
      ? (results.quotes as QuoteResult[])
      : [];

    const defaultExchanges = (regionBias === 'SE' || regionOnly === 'SE')
      ? ['Stockholm']
      : [];
    const defaultSuffixes = (regionBias === 'SE' || regionOnly === 'SE')
      ? ['.ST', '.STO']
      : [];

    const exchangePrefs = exchangesPreferred?.length
      ? exchangesPreferred
      : defaultExchanges;
    const suffixPrefs = suffixesPreferred?.length
      ? suffixesPreferred
      : defaultSuffixes;

    const matchesPreferred = (r: QuoteResult) => {
      const symbol = r.symbol.toUpperCase();
      const exchange = (r.fullExchangeName ?? r.exchDisp ?? r.exchange ?? '').toLowerCase();
      const suffixMatch = suffixPrefs.some((s) => symbol.endsWith(s.toUpperCase()));
      const exchangeMatch = exchangePrefs.some((e) => exchange.includes(e.toLowerCase()));
      return suffixMatch || exchangeMatch;
    };

    if (regionOnly === 'SE') {
      quotes = quotes.filter(isSwedish);
    }

    const queryUpper = query.toUpperCase();
    const ranked = quotes
      .filter((r) => Boolean(r.symbol))
      .map((r) => {
        const rawName = r.longname ?? r.shortname ?? r.symbol;
        const description = cleanCompanyName(rawName);
        const symbolUpper = r.symbol.toUpperCase();
        const nameUpper = description.toUpperCase();
        const prefix = symbolUpper.startsWith(queryUpper) ? 1 : 0;
        const trigram = Math.max(
          trigramSimilarity(queryUpper, symbolUpper),
          trigramSimilarity(queryUpper, nameUpper)
        );
        const preferred = matchesPreferred(r) ? 1 : 0;
        return {
          symbol: r.symbol,
          description,
          _rank: { preferred, prefix, trigram },
        };
      })
      .sort((a, b) => {
        if (regionBias && a._rank.preferred !== b._rank.preferred) {
          return b._rank.preferred - a._rank.preferred;
        }
        if (a._rank.prefix !== b._rank.prefix) {
          return b._rank.prefix - a._rank.prefix;
        }
        if (a._rank.trigram !== b._rank.trigram) {
          return b._rank.trigram - a._rank.trigram;
        }
        return a.description.localeCompare(b.description);
      })
      .map(({ symbol, description }) => ({ symbol, description }));

    return NextResponse.json(ranked);
  } catch (err) {
    console.error('yahoo search failed', err);
    return NextResponse.json([]);
  }
}