export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cleanCompanyName } from '@/lib/utils';

// ---------- types ----------
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

// ---------- helpers ----------
function trigramSimilarity(a: string, b: string) {
  const make = (s: string) => {
    const up = s.toUpperCase();
    if (up.length < 3) return [up];
    const out: string[] = [];
    for (let i = 0; i < up.length - 2; i++) out.push(up.slice(i, i + 3));
    return out;
  };
  const A = make(a), B = new Set(make(b));
  let c = 0; for (const tri of A) if (B.has(tri)) c++;
  return c;
}

function isSwedish(r: QuoteResult) {
  const symbol = (r.symbol || '').toUpperCase();
  const exch = (r.fullExchangeName || r.exchDisp || r.exchange || '').toLowerCase();
  const region = (r.region || r.country || '').toUpperCase();
  return (
    region === 'SE' ||
    exch.includes('stockholm') ||
    exch.includes('first north') ||
    exch.includes('ngm') ||
    exch.includes('spotlight') ||
    symbol.endsWith('.ST') ||
    symbol.endsWith('.STO')
  );
}

function norm(s: string) {
  return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Raw Yahoo Search (same as yahoo-finance2 under the hood but no schema validation)
async function fetchYahooSearchRaw(query: string) {
  const url = new URL('https://query2.finance.yahoo.com/v1/finance/search');
  url.searchParams.set('q', query);
  url.searchParams.set('quotesCount', '50');
  url.searchParams.set('newsCount', '0');
  url.searchParams.set('region', 'SE');
  url.searchParams.set('lang', 'sv-SE');

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json',
    },
    // some hosts require GET only; keep it simple
  });
  if (!res.ok) return [];
  const data = await res.json() as any;
  const quotes: any[] = Array.isArray(data?.quotes) ? data.quotes : [];
  return quotes.map(q => ({
    symbol: q.symbol,
    shortname: q.shortname,
    longname: q.longname,
    exchange: q.exchange,
    exchDisp: q.exchDisp,
    fullExchangeName: q.fullExchangeName,
    region: q.region,
    country: q.country,
  } as QuoteResult));
}

// Yahoo Autocomplete (two hosts; try both)
async function fetchYahooAutoc(query: string) {
  const hosts = [
    // JSON autocomplete
    (q: string) => `https://autoc.finance.yahoo.com/autoc?query=${encodeURIComponent(q)}&region=SE&lang=sv-SE`,
    // Legacy host (also JSON when no callback is given)
    (q: string) => `https://s.yimg.com/aq/autoc?query=${encodeURIComponent(q)}&region=SE&lang=sv-SE`,
  ];
  for (const build of hosts) {
    try {
      const res = await fetch(build(query), {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json',
        },
      });
      if (!res.ok) continue;
      const data = await res.json() as any;
      const items: any[] = data?.ResultSet?.Result ?? [];
      if (!items.length) continue;
      return items.map(r => ({
        symbol: r.symbol,
        shortname: r.name,
        longname: r.name,
        exchange: r.exch,             // e.g. "STO"
        exchDisp: r.exchDisp,         // e.g. "Stockholm"
        fullExchangeName: r.exchDisp,
        region: r.region,
        country: r.country,
      } as QuoteResult));
    } catch { /* try next host */ }
  }
  return [];
}

// ---------- handler ----------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('query') || '').trim();
  const regionOnly = searchParams.get('regionOnly') || undefined; // 'SE' to force Swedish-only

  if (query.length < 2) return NextResponse.json([]);

  try {
    const isShort = query.length <= 5;
    const primary = isShort ? await fetchYahooAutoc(query) : await fetchYahooSearchRaw(query);
    const needFallback = primary.length === 0;
    const secondary = needFallback
      ? (isShort ? await fetchYahooSearchRaw(query) : await fetchYahooAutoc(query))
      : [];

    // merge unique by symbol (primary order wins)
    const bySymbol = new Map<string, QuoteResult>();
    for (const r of primary) if (r?.symbol) bySymbol.set(r.symbol, r);
    for (const r of secondary) if (r?.symbol && !bySymbol.has(r.symbol)) bySymbol.set(r.symbol, r);

    let quotes = Array.from(bySymbol.values());

    if (regionOnly === 'SE') quotes = quotes.filter(isSwedish);

    const qn = norm(query);
    const ranked = quotes
      .filter(r => r?.symbol)
      .map(r => {
        const raw = r.longname ?? r.shortname ?? r.symbol;
        const description = cleanCompanyName(raw);
        const sym = r.symbol!;
        const sn = norm(sym);
        const dn = norm(description);

        const prefix = Number(sn.startsWith(qn) || dn.startsWith(qn)); // 0/1
        const substr = !prefix && (sn.includes(qn) || dn.includes(qn)) ? 1 : 0;
        const tri = Math.max(
          trigramSimilarity(query.toUpperCase(), sym.toUpperCase()),
          trigramSimilarity(query.toUpperCase(), description.toUpperCase())
        );

        return { symbol: sym, description, _rank: { prefix, substr, tri } };
      })
      .sort((a, b) => {
        if (a._rank.prefix !== b._rank.prefix) return b._rank.prefix - a._rank.prefix;
        if (a._rank.substr !== b._rank.substr) return b._rank.substr - a._rank.substr;
        if (a._rank.tri !== b._rank.tri) return b._rank.tri - a._rank.tri;
        return a.description.localeCompare(b.description);
      })
      .slice(0, 15)
      .map(({ symbol, description }) => ({ symbol, description }));

    return NextResponse.json(ranked);
  } catch (err) {
    console.error('search route error', err);
    return NextResponse.json([]);
  }
}
