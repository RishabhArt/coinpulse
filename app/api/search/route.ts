import { NextRequest, NextResponse } from 'next/server';
import { fetcher } from '@/lib/coingecko.actions';

interface SearchResult {
  coins: Array<{
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    market_cap_rank: number | null;
    data?: {
      price: number;
      price_change_percentage_24h?: { usd: number };
    };
  }>;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 1) {
    return NextResponse.json({ coins: [] });
  }

  try {
    const data = await fetcher<SearchResult>('/search', { query: q.trim() });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ coins: [] }, { status: 500 });
  }
}
