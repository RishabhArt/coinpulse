import { query } from '@/lib/database';
import { Coin, OHLCData, Category, TrendingCoin } from '@/type';

// Coin database operations
export class CoinService {
  // Get all coins with pagination
  static async getAllCoins(page: number = 1, limit: number = 100) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT * FROM coins ORDER BY market_cap_rank ASC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result;
  }

  // Get coin by ID
  static async getCoinById(id: string): Promise<Coin | null> {
    const result = await query('SELECT * FROM coins WHERE id = $1', [id]);
    return result[0] || null;
  }

  // Search coins
  static async searchCoins(queryText: string, limit: number = 10) {
    const result = await query(
      `SELECT id, symbol, name, image, market_cap_rank, 
              current_price as price, price_change_percentage_24h
       FROM coins 
       WHERE name ILIKE $1 OR symbol ILIKE $1
       ORDER BY market_cap_rank ASC
       LIMIT $2`,
      [`%${queryText}%`, limit]
    );
    return result;
  }

  // Get trending coins
  static async getTrendingCoins() {
    const result = await query(`
      SELECT c.*, tc.rank, tc.price_change_percentage_24h as data_price_change_percentage_24h
      FROM trending_coins tc
      JOIN coins c ON tc.coin_id = c.id
      ORDER BY tc.rank ASC
      LIMIT 10
    `);
    return result;
  }

  // Update or insert coin
  static async upsertCoin(coin: Partial<Coin>) {
    const result = await query(`
      INSERT INTO coins (
        id, symbol, name, image, current_price, market_cap, market_cap_rank,
        fully_diluted_valuation, total_volume, high_24h, low_24h,
        price_change_24h, price_change_percentage_24h,
        market_cap_change_24h, market_cap_change_percentage_24h,
        circulating_supply, total_supply, max_supply,
        ath, ath_change_percentage, ath_date,
        atl, atl_change_percentage, atl_date, last_updated
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      ON CONFLICT (id) DO UPDATE SET
        symbol = EXCLUDED.symbol,
        name = EXCLUDED.name,
        image = EXCLUDED.image,
        current_price = EXCLUDED.current_price,
        market_cap = EXCLUDED.market_cap,
        market_cap_rank = EXCLUDED.market_cap_rank,
        fully_diluted_valuation = EXCLUDED.fully_diluted_valuation,
        total_volume = EXCLUDED.total_volume,
        high_24h = EXCLUDED.high_24h,
        low_24h = EXCLUDED.low_24h,
        price_change_24h = EXCLUDED.price_change_24h,
        price_change_percentage_24h = EXCLUDED.price_change_percentage_24h,
        market_cap_change_24h = EXCLUDED.market_cap_change_24h,
        market_cap_change_percentage_24h = EXCLUDED.market_cap_change_percentage_24h,
        circulating_supply = EXCLUDED.circulating_supply,
        total_supply = EXCLUDED.total_supply,
        max_supply = EXCLUDED.max_supply,
        ath = EXCLUDED.ath,
        ath_change_percentage = EXCLUDED.ath_change_percentage,
        ath_date = EXCLUDED.ath_date,
        atl = EXCLUDED.atl,
        atl_change_percentage = EXCLUDED.atl_change_percentage,
        atl_date = EXCLUDED.atl_date,
        last_updated = EXCLUDED.last_updated
      RETURNING *
    `, [
      coin.id, coin.symbol, coin.name, coin.image, coin.current_price,
      coin.market_cap, coin.market_cap_rank, coin.fully_diluted_valuation,
      coin.total_volume, coin.high_24h, coin.low_24h, coin.price_change_24h,
      coin.price_change_percentage_24h, coin.market_cap_change_24h,
      coin.market_cap_change_percentage_24h, coin.circulating_supply,
      coin.total_supply, coin.max_supply, coin.ath, coin.ath_change_percentage,
      coin.ath_date, coin.atl, coin.atl_change_percentage, coin.atl_date,
      coin.last_updated
    ]);
    return result[0];
  }
}

// OHLC Data operations
export class OHLCService {
  // Get OHLC data for a coin
  static async getOHLCData(coinId: string, days: number = 1) {
    const result = await query(`
      SELECT timestamp, open, high, low, close
      FROM ohlc_data
      WHERE coin_id = $1 AND period = '1h'
      ORDER BY timestamp DESC
      LIMIT $2
    `, [coinId, days * 24]); // 24 hours per day
    return result.map(row => [row.timestamp, row.open, row.high, row.low, row.close] as OHLCData);
  }

  // Insert OHLC data
  static async insertOHLCData(coinId: string, data: OHLCData[], period: string = '1h') {
    const values = data.map(([timestamp, open, high, low, close]) => 
      `('${coinId}', ${timestamp}, ${open}, ${high}, ${low}, ${close}, '${period}')`
    ).join(', ');

    await query(`
      INSERT INTO ohlc_data (coin_id, timestamp, open, high, low, close, period)
      VALUES ${values}
      ON CONFLICT (coin_id, timestamp, period) DO UPDATE SET
        open = EXCLUDED.open,
        high = EXCLUDED.high,
        low = EXCLUDED.low,
        close = EXCLUDED.close
    `);
  }

  // Generate mock OHLC data for development
  static async generateMockOHLCData(coinId: string, days: number = 7) {
    const data: OHLCData[] = [];
    const now = Date.now();
    const basePrice = Math.random() * 100000 + 1000; // Random base price

    for (let i = 0; i < days * 24; i++) {
      const timestamp = now - (i * 60 * 60 * 1000); // Each hour
      const variation = (Math.random() - 0.5) * 0.05; // 5% variation
      const open = basePrice * (1 + variation);
      const close = basePrice * (1 + variation + (Math.random() - 0.5) * 0.02);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      data.push([timestamp, open, high, low, close]);
    }

    await this.insertOHLCData(coinId, data);
    return data;
  }
}

// Category operations
export class CategoryService {
  // Get all categories
  static async getAllCategories() {
    const result = await query('SELECT * FROM categories ORDER BY name ASC');
    return result;
  }

  // Get category by ID
  static async getCategoryById(id: string) {
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
    return result[0] || null;
  }

  // Update or insert category
  static async upsertCategory(category: Partial<Category>) {
    const result = await query(`
      INSERT INTO categories (id, name, description, market_cap, market_cap_change_24h, volume_24h)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        market_cap = EXCLUDED.market_cap,
        market_cap_change_24h = EXCLUDED.market_cap_change_24h,
        volume_24h = EXCLUDED.volume_24h,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [category.id, category.name, category.description, category.market_cap, category.market_cap_change_24h, category.volume_24h]);
    return result[0];
  }
}

// Trending coins operations
export class TrendingService {
  // Update trending coins
  static async updateTrendingCoins(trendingCoins: TrendingCoin[]) {
    // Clear existing trending coins
    await query('DELETE FROM trending_coins');

    // Insert new trending coins
    for (const coin of trendingCoins) {
      await query(`
        INSERT INTO trending_coins (coin_id, rank, market_cap, total_volume, price_change_percentage_24h)
        VALUES ($1, $2, $3, $4, $5)
      `, [coin.item.id, coin.item.score || 0, coin.item.data?.market_cap || 0, coin.item.data?.total_volume || 0, coin.item.data?.price_change_percentage_24h || 0]);
    }
  }
}

// Data initialization and seeding
export class DataSeeder {
  // Initialize database with mock data
  static async seedDatabase() {
    console.log('Seeding database with initial data...');

    // Seed categories
    const categories = [
      { id: 'cryptocurrency', name: 'Cryptocurrency', description: 'All cryptocurrencies' },
      { id: 'defi', name: 'DeFi', description: 'Decentralized Finance protocols' },
      { id: 'nft', name: 'NFT', description: 'Non-Fungible Tokens' },
      { id: 'gaming', name: 'Gaming', description: 'Blockchain gaming tokens' },
      { id: 'layer-1', name: 'Layer 1', description: 'Layer 1 blockchain platforms' },
      { id: 'layer-2', name: 'Layer 2', description: 'Layer 2 scaling solutions' },
    ];

    for (const category of categories) {
      await CategoryService.upsertCategory(category);
    }

    console.log('Database seeded successfully');
  }
}
