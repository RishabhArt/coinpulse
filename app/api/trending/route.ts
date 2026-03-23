import { NextResponse } from 'next/server';
import { CoinService } from '@/lib/models';

export async function GET() {
  try {
    const trendingCoins = await CoinService.getTrendingCoins();
    
    // Transform to match expected format
    const transformedTrending = trendingCoins.map((coin: any) => ({
      item: {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        market_cap_rank: coin.market_cap_rank,
        thumb: coin.image,
        large: coin.image,
        data: {
          price: coin.current_price,
          price_change_percentage_24h: coin.price_change_percentage_24h,
        },
        score: coin.rank,
      },
    }));

    return NextResponse.json(transformedTrending);
  } catch (error) {
    console.error('Trending API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
