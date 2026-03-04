import { NextResponse } from 'next/server';
import { searchCompanies } from '@/lib/api/companies';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  
  if (!query || query.length < 2) {
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