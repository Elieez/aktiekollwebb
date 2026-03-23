import { NextResponse } from 'next/server';
import { searchCompanies } from '@/lib/api/companies';

const QUERY_MAX_LENGTH = 100;
// Allow only letters (including Swedish ÅÄÖåäö), digits, spaces, hyphens, dots
const QUERY_ALLOWED = /^[\p{L}\p{N}\s.\-]+$/u;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get('query') ?? '';
  const query = raw.trim().slice(0, QUERY_MAX_LENGTH);

  if (query.length < 2 || !QUERY_ALLOWED.test(query)) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchCompanies(query, 10);

    const mapped = results.map(company => ({
      symbol: company.code,
      description: company.name,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error('company search failed', err);
    return NextResponse.json([]);
  }
}