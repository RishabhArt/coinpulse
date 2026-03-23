import React from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import { CoinOverviewFallback } from './fallback';
import CoinOverviewClient from '@/components/home/CoinOverviewClient';

const CoinOverview = async () => {
  try {
    const [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>('/coins/bitcoin', {
        dex_pair_format: 'symbol',
      }),
      fetcher<OHLCData[]>('/coins/bitcoin/ohlc', {
        vs_currency: 'usd',
        days: 1,
        interval: 'hourly',
        precision: 'full',
      }),
    ]);

    if (!coin || !coin.market_data) {
      return <CoinOverviewFallback />;
    }

    return (
      <CoinOverviewClient
        initialCoinId="bitcoin"
        initialCoin={coin}
        initialOHLCData={coinOHLCData ?? []}
      />
    );
  } catch (error) {
    console.error('Error fetching coin overview:', error);
    return <CoinOverviewFallback />;
  }
};

export default CoinOverview;
