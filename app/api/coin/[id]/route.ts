import { NextRequest, NextResponse } from 'next/server';
import { CoinService } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const coin = await CoinService.getCoinById(id);
    
    if (!coin) {
      return NextResponse.json({ error: 'Coin not found' }, { status: 404 });
    }

    // Transform to match expected format
    const transformedCoin = {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      fully_diluted_valuation: coin.fully_diluted_valuation,
      total_volume: coin.total_volume,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap_change_24h: coin.market_cap_change_24h,
      market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
      max_supply: coin.max_supply,
      ath: coin.ath,
      ath_change_percentage: coin.ath_change_percentage,
      ath_date: coin.ath_date,
      atl: coin.atl,
      atl_change_percentage: coin.atl_change_percentage,
      atl_date: coin.atl_date,
      last_updated: coin.last_updated,
    };

    return NextResponse.json(transformedCoin);
  } catch (error) {
    console.error(`Coin API error for ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch coin data' }, { status: 500 });
  }
}
