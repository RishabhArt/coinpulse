'use server';

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error('Could not get base url');

export const fetcher = async <T>(endpoint: string, params?: QueryParams): Promise<T> => {
  // Normalize: ensure endpoint starts with '/' and no double slashes occur
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}${normalizedEndpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Only add API key if it exists (for Pro API)
  if (API_KEY) {
    headers['x-cg-pro-api-key'] = API_KEY;
  }

  const response = await fetch(url, {
    headers,
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));

    // For free API, don't throw errors for rate limiting - return mock data instead
    if (response.status === 429 || response.status === 400) {
      console.warn(`API Error: ${response.status} - Using fallback data`);
      const mockData = getMockData(endpoint, params);
      // Ensure mock data is not an error object
      if (mockData && typeof mockData === 'object' && !('error' in mockData)) {
        return mockData as T;
      }
      // Fallback to empty array if mock data fails
      return [] as T;
    }

    throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText} `);
  }

  return response.json();
}

// Mock data fallback for when API fails
function getMockData(endpoint: string, params?: QueryParams): any {
  // Extract coin ID from endpoint
  const coinIdMatch = endpoint.match(/\/coins\/([^\/]+)/);
  const coinId = coinIdMatch ? coinIdMatch[1] : 'bitcoin';
  
  // Mock coin database
  const mockCoins = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      image: {
        large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        small: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
        thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png'
      }
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      image: {
        large: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        small: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        thumb: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png'
      }
    },
    {
      id: 'siren',
      name: 'Siren',
      symbol: 'SIREN',
      image: {
        large: 'https://assets.coingecko.com/coins/images/32345/large/siren.png',
        small: 'https://assets.coingecko.com/coins/images/32345/small/siren.png',
        thumb: 'https://assets.coingecko.com/coins/images/32345/thumb/siren.png'
      }
    },
    {
      id: 'hyperliquid',
      name: 'HyperLiquid',
      symbol: 'HYPE',
      image: {
        large: 'https://cdn.jsdelivr.net/gh/coin-icons/coins@0.1.0/svg/hype.svg',
        small: 'https://cdn.jsdelivr.net/gh/coin-icons/coins@0.1.0/svg/hype.svg',
        thumb: 'https://cdn.jsdelivr.net/gh/coin-icons/coins@0.1.0/svg/hype.svg'
      }
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      image: {
        large: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        small: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
        thumb: 'https://assets.coingecko.com/coins/images/4128/thumb/solana.png'
      }
    },
    {
      id: 'dogecoin',
      name: 'Dogecoin',
      symbol: 'DOGE',
      image: {
        large: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
        small: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
        thumb: 'https://assets.coingecko.com/coins/images/5/thumb/dogecoin.png'
      }
    },
    {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      image: {
        large: 'https://cdn.jsdelivr.net/gh/coin-icons/coins@0.1.0/svg/ada.svg',
        small: 'https://cdn.jsdelivr.net/gh/coin-icons/coins@0.1.0/svg/ada.svg',
        thumb: 'https://cdn.jsdelivr.net/gh/coin-icons/coins@0.1.0/svg/ada.svg'
      }
    },
    {
      id: 'avalanche-2',
      name: 'Avalanche',
      symbol: 'AVAX',
      image: {
        large: 'https://cdn.jsdelivr.net/gh/coin-icons/coins@0.1.0/svg/avax.svg',
        small: 'https://cdn.jsdelivr.net/gh/coin-icons/coins@0.1.0/svg/avax.svg',
        thumb: 'https://cdn.jsdelivr.net/gh/coin-icons/coins@0.1.0/svg/avax.svg'
      }
    },
    {
      id: 'chainlink',
      name: 'Chainlink',
      symbol: 'LINK',
      image: {
        large: 'https://assets.coingecko.com/coins/images/197/large/chainlink.png',
        small: 'https://assets.coingecko.com/coins/images/197/small/chainlink.png',
        thumb: 'https://assets.coingecko.com/coins/images/197/thumb/chainlink.png'
      }
    },
    {
      id: 'polygon',
      name: 'Polygon',
      symbol: 'MATIC',
      image: {
        large: 'https://assets.coingecko.com/coins/images/197/large/polygon.png',
        small: 'https://assets.coingecko.com/coins/images/197/small/polygon.png',
        thumb: 'https://assets.coingecko.com/coins/images/197/thumb/polygon.png'
      }
    },
    {
      id: 'binancecoin',
      name: 'BNB',
      symbol: 'BNB',
      image: {
        large: 'https://cdn.jsdelivr.net/gh/coin-icons/coins@0.1.0/svg/bnb.svg',
        small: 'https://cdn.jsdelivr.net/gh/coin-icons/coins@0.1.0/svg/bnb.svg',
        thumb: 'https://cdn.jsdelivr.net/gh/coin-icons/coins@0.1.0/svg/bnb.svg'
      }
    }
  ];
  
  // Find the coin or use Bitcoin as fallback
  const mockCoin = mockCoins.find(c => c.id === coinId) || mockCoins[0];
  
  // Generate random price data based on coin ID
  const generatePriceData = (seed: string) => {
    const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let basePrice = 1000 + (hash % 50000); // Range: $1000 - $51000
    
    // Set specific prices for major coins
    if (seed === 'bitcoin') basePrice = 71250;
    if (seed === 'ethereum') basePrice = 3500;
    if (seed === 'solana') basePrice = 180;
    if (seed === 'binancecoin') basePrice = 620;
    if (seed === 'ripple') basePrice = 0.52;
    if (seed === 'cardano') basePrice = 0.58;
    if (seed === 'avalanche-2') basePrice = 38;
    if (seed === 'dogecoin') basePrice = 0.085;
    if (seed === 'siren') basePrice = 0.125;
    if (seed === 'hyperliquid') basePrice = 2.45;
    
    const marketCapMultiplier = 1 + (hash % 100); // Range: 1x - 100x
    return {
      current_price: { usd: basePrice },
      price_change_24h_in_currency: { usd: basePrice * 0.02 * ((hash % 200) - 100) / 100 },
      price_change_percentage_24h_in_currency: { usd: 2 * ((hash % 200) - 100) / 100 },
      price_change_percentage_30d_in_currency: { usd: 5 * ((hash % 200) - 100) / 100 },
      market_cap: { usd: basePrice * 1000000 * marketCapMultiplier },
      total_volume: { usd: basePrice * 1000000 * (marketCapMultiplier / 10) }
    };
  };
  
  const priceData = generatePriceData(mockCoin.id);
  
  // Handle dynamic endpoints
  if (endpoint.startsWith('/coins/') && endpoint.endsWith('/ohlc')) {
    // Generate mock OHLC data based on the days parameter
    const daysParam = params?.days as number | string;
    const days = typeof daysParam === 'string' && daysParam === 'max' ? 365 : (daysParam as number) || 1;
    const now = Date.now();
    const data = [];
    
    for (let i = days; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000); // i days ago
      const volatility = priceData.current_price.usd * 0.02; // 2% volatility
      const open = priceData.current_price.usd + Math.random() * volatility - volatility/2;
      const close = open + Math.random() * volatility * 0.4 - volatility * 0.2;
      const high = Math.max(open, close) + Math.random() * volatility * 0.1;
      const low = Math.min(open, close) - Math.random() * volatility * 0.1;
      
      data.push([timestamp, low, high, low, close]);
    }
    
    return data;
  }
  
  if (endpoint.startsWith('/coins/') && !endpoint.includes('/ohlc')) {
    return {
      id: mockCoin.id,
      name: mockCoin.name,
      symbol: mockCoin.symbol,
      image: mockCoin.image,
      market_data: priceData,
      market_cap_rank: mockCoins.findIndex(c => c.id === mockCoin.id) + 1,
      links: {
        homepage: [`https://${mockCoin.id.toLowerCase()}.org`],
        blockchain_site: [`https://explorer.${mockCoin.id.toLowerCase()}.com`],
        subreddit_url: `https://reddit.com/r/${mockCoin.name.toLowerCase()}`
      }
    };
  }
  
  switch (endpoint) {
    case '/search/trending':
      return {
        coins: mockCoins.slice(0, 3).map((coin, index) => ({
          item: {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            market_cap_rank: index + 1,
            thumb: coin.image.thumb,
            large: coin.image.large,
            data: {
              price: generatePriceData(coin.id).current_price.usd,
              price_change_percentage_24h: { 
                usd: generatePriceData(coin.id).price_change_percentage_24h_in_currency.usd 
              }
            }
          }
        }))
      };
    
    case '/coins/markets':
      const page = params?.page as number || 1;
      const perPage = params?.per_page as number || 10;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedCoins = mockCoins.slice(startIndex, endIndex);
      
      return paginatedCoins.map((coin, index) => {
        const coinPriceData = generatePriceData(coin.id);
        return {
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.image.large,
          current_price: coinPriceData.current_price.usd,
          market_cap: coinPriceData.market_cap.usd,
          market_cap_rank: startIndex + index + 1,
          fully_diluted_valuation: coinPriceData.market_cap.usd * 2,
          total_volume: coinPriceData.total_volume.usd,
          high_24h: coinPriceData.current_price.usd * 1.05,
          low_24h: coinPriceData.current_price.usd * 0.95,
          price_change_24h: coinPriceData.price_change_24h_in_currency.usd,
          price_change_percentage_24h: coinPriceData.price_change_percentage_24h_in_currency.usd,
          market_cap_change_24h: coinPriceData.market_cap.usd * 0.02,
          market_cap_change_percentage_24h: 2.5,
          circulating_supply: 1000000000 + (index * 100000000),
          total_supply: 2000000000 + (index * 100000000),
          max_supply: 2000000000 + (index * 100000000),
          ath: coinPriceData.current_price.usd * 2,
          ath_change_percentage: -50,
          ath_date: '2021-11-10T14:24:11.849Z',
          atl: coinPriceData.current_price.usd * 0.1,
          atl_change_percentage: 900,
          atl_date: '2020-03-13T00:00:00.000Z',
          last_updated: '2024-01-01T12:00:00.000Z'
        };
      });
    
    case '/coins/categories':
      return [
        {
          name: 'Cryptocurrency',
          top_3_coins: ['https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png'],
          market_cap_change_24h: 2.5,
          market_cap: 846521000000,
          volume_24h: 28543200000
        }
      ];
    
    default:
      return {};
  }
}

export async function searchCoins(query: string): Promise<{ coins: SearchCoin[] }> {
  if (!query.trim()) return { coins: [] };

  try {
    return await fetcher<{ coins: SearchCoin[] }>('/search', {
      query: query.trim(),
    });
  } catch (error) {
    // Return mock search results based on query
    const mockCoins = [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'btc',
        market_cap_rank: 1,
        thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
        large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        data: {
          price: 71250.00,
          price_change_percentage_24h: 2.5
        }
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'eth',
        market_cap_rank: 2,
        thumb: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
        large: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        data: {
          price: 2280.50,
          price_change_percentage_24h: 1.8
        }
      },
      {
        id: 'siren',
        name: 'Siren',
        symbol: 'siren',
        market_cap_rank: 3,
        thumb: 'https://assets.coingecko.com/coins/images/32345/thumb/siren.png',
        large: 'https://assets.coingecko.com/coins/images/32345/large/siren.png',
        data: {
          price: 0.125,
          price_change_percentage_24h: -3.2
        }
      }
    ];

    // Filter coins based on query
    const filteredCoins = mockCoins.filter(coin => 
      coin.name.toLowerCase().includes(query.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(query.toLowerCase())
    );

    return { coins: filteredCoins };
  }
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null,
): Promise<PoolData> {
  const fallback: PoolData = {
    id: '',
    address: '',
    name: '',
    network: '',
  };

  if (network && contractAddress) {
    try {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`,
      );

      return poolData.data?.[0] ?? fallback;
    } catch (error) {
      console.log(error);
      return fallback;
    }
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>('/onchain/search/pools', { query: id });

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}
