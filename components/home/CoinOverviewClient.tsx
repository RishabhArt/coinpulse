'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import CandlestickChart from '@/components/CandlestickChart';
import { CoinOverviewFallback } from '@/components/home/fallback';

const POPULAR_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
];

interface CoinData {
  name: string;
  symbol: string;
  image: { large: string };
  market_data: {
    current_price: { usd: number };
  };
}

interface CoinOverviewClientProps {
  initialCoinId?: string;
  initialCoin: CoinData;
  initialOHLCData: [number, number, number, number, number][] | null;
}

const CoinOverviewClient = ({
  initialCoinId = 'bitcoin',
  initialCoin,
  initialOHLCData,
}: CoinOverviewClientProps) => {
  const [selectedCoinId, setSelectedCoinId] = useState(initialCoinId);
  const [coin, setCoin] = useState<CoinData>(initialCoin);
  const [ohlcData, setOhlcData] = useState<[number, number, number, number, number][]>(initialOHLCData || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1s');

  const fetchCoinData = async (coinId: string) => {
    setIsLoading(true);
    setError(false);
    try {
      const [coinRes, ohlcRes] = await Promise.all([
        fetch(`/api/coin/${coinId}`),
        fetch(`/api/coin/${coinId}/ohlc`),
      ]);

      if (!coinRes.ok || !ohlcRes.ok) throw new Error('Fetch failed');

      const [coinData, ohlcDataRaw] = await Promise.all([
        coinRes.json(),
        ohlcRes.json(),
      ]);

      if (coinData?.market_data) {
        setCoin(coinData);
      }
      if (Array.isArray(ohlcDataRaw)) {
        setOhlcData(ohlcDataRaw);
      }
    } catch (err) {
      console.error('Error fetching coin data:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoinChange = (coinId: string) => {
    if (coinId === selectedCoinId) return;
    setSelectedCoinId(coinId);
    fetchCoinData(coinId);
  };

  if (error) return <CoinOverviewFallback />;

  return (
    <div id="coin-overview">
      <div className="header pt-2 mb-4">
        {/* Coin image and price info */}
        <div className="flex items-center gap-3 mb-4">
          {coin.image?.large && (
            <Image
              src={coin.image.large}
              alt={coin.name}
              width={40}
              height={40}
              className={`rounded-full transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
              style={{ width: 'auto', height: 'auto' }}
            />
          )}
          <div className="info flex-1">
            <p className="flex text-purple-100 text-xs md:text-sm">
              {coin.name} / {coin.symbol?.toUpperCase()}
            </p>
            <h1 className="text-xl md:text-2xl font-semibold">
              {isLoading ? (
                <span className="text-purple-100">Loading...</span>
              ) : (
                formatCurrency(coin.market_data?.current_price?.usd)
              )}
            </h1>
          </div>
        </div>

        {/* Coin selector dropdown */}
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_COINS.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCoinChange(c.id)}
              disabled={isLoading}
              className={`
                px-2.5 py-1 rounded-sm text-xs font-medium transition-all border-0 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  selectedCoinId === c.id
                    ? 'bg-green-500 text-dark-900'
                    : 'bg-dark-400 text-purple-100 hover:bg-dark-500 hover:text-white'
                }
              `}
            >
              {c.symbol}
            </button>
          ))}
        </div>
      </div>
      
      <CandlestickChart 
        data={ohlcData} 
        coinId={selectedCoinId}
        liveInterval={liveInterval}
        setLiveInterval={setLiveInterval}
        mode="historical"
      />
    </div>
  );
};

export default CoinOverviewClient;
