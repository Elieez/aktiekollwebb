import yahooFinance from 'yahoo-finance2';
import { NextResponse } from 'next/server';

export async function Get(req: Request) {
    const url = new URL(req.url);
    const query = url.searchParams.get('query');

    if(!query) {
        return NextResponse.json({ result: [] });
    }

    const results = await yahooFinance.search(query); 
    return NextResponse.json(results);
}