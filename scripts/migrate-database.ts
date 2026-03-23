import { initializeDatabase, query } from '@/lib/database';
import { CoinService, OHLCService } from '@/lib/models';

// Mock data for seeding
const mockCoins = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 71250.50,
    market_cap: 1390000000000,
    market_cap_rank: 1,
    fully_diluted_valuation: 1490000000000,
    total_volume: 28000000000,
    high_24h: 72000.00,
    low_24h: 70500.00,
    price_change_24h: 750.50,
    price_change_percentage_24h: 1.06,
    market_cap_change_24h: 15000000000,
    market_cap_change_percentage_24h: 1.09,
    circulating_supply: 19500000,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 73750,
    ath_change_percentage: -3.4,
    ath_date: '2024-03-14T07:00:00.000Z',
    atl: 67.81,
    atl_change_percentage: 105000.0,
    atl_date: '2013-07-05T00:00:00.000Z',
    last_updated: new Date(),
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3500.75,
    market_cap: 420000000000,
    market_cap_rank: 2,
    fully_diluted_valuation: 420000000000,
    total_volume: 15000000000,
    high_24h: 3600.00,
    low_24h: 3400.00,
    price_change_24h: 100.75,
    price_change_percentage_24h: 2.96,
    market_cap_change_24h: 12000000000,
    market_cap_change_percentage_24h: 2.94,
    circulating_supply: 120000000,
    total_supply: 120000000,
    max_supply: null,
    ath: 4878,
    ath_change_percentage: -28.2,
    ath_date: '2021-11-10T14:24:11.849Z',
    atl: 0.4329,
    atl_change_percentage: 808000.0,
    atl_date: '2015-10-20T00:00:00.000Z',
    last_updated: new Date(),
  }
];

export async function seedDatabase() {
  try {
    console.log('🚀 Initializing database...');
    await initializeDatabase();
    
    console.log('📊 Seeding coins data...');
    for (const coin of mockCoins) {
      await CoinService.upsertCoin(coin);
    }
    
    console.log('📈 Generating OHLC data...');
    for (const coin of mockCoins) {
      await OHLCService.generateMockOHLCData(coin.id, 7);
    }
    
    console.log('🏷️ Seeding categories...');
    const categories = [
      { id: 'cryptocurrency', name: 'Cryptocurrency', description: 'All cryptocurrencies' },
      { id: 'defi', name: 'DeFi', description: 'Decentralized Finance protocols' },
      { id: 'nft', name: 'NFT', description: 'Non-Fungible Tokens' },
      { id: 'gaming', name: 'Gaming', description: 'Blockchain gaming tokens' },
    ];

    for (const category of categories) {
      await query(`
        INSERT INTO categories (id, name, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description
      `, [category.id, category.name, category.description]);
    }
    
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
