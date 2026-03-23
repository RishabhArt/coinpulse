import { Pool } from 'pg';

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/coinpulse',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create coins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS coins (
        id VARCHAR(50) PRIMARY KEY,
        symbol VARCHAR(20) NOT NULL,
        name VARCHAR(100) NOT NULL,
        image VARCHAR(500),
        current_price DECIMAL(20,8),
        market_cap BIGINT,
        market_cap_rank INTEGER,
        fully_diluted_valuation BIGINT,
        total_volume BIGINT,
        high_24h DECIMAL(20,8),
        low_24h DECIMAL(20,8),
        price_change_24h DECIMAL(20,8),
        price_change_percentage_24h DECIMAL(10,4),
        market_cap_change_24h BIGINT,
        market_cap_change_percentage_24h DECIMAL(10,4),
        circulating_supply DECIMAL(30,8),
        total_supply DECIMAL(30,8),
        max_supply DECIMAL(30,8),
        ath DECIMAL(20,8),
        ath_change_percentage DECIMAL(10,4),
        ath_date TIMESTAMP,
        atl DECIMAL(20,8),
        atl_change_percentage DECIMAL(10,4),
        atl_date TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        market_cap BIGINT,
        market_cap_change_24h BIGINT,
        volume_24h BIGINT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create ohlc_data table for historical prices
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ohlc_data (
        id SERIAL PRIMARY KEY,
        coin_id VARCHAR(50) REFERENCES coins(id),
        timestamp BIGINT NOT NULL,
        open DECIMAL(20,8) NOT NULL,
        high DECIMAL(20,8) NOT NULL,
        low DECIMAL(20,8) NOT NULL,
        close DECIMAL(20,8) NOT NULL,
        period VARCHAR(20) NOT NULL, -- '1h', '1d', '1w', etc.
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(coin_id, timestamp, period)
      );
    `);

    // Create trending_coins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trending_coins (
        id SERIAL PRIMARY KEY,
        coin_id VARCHAR(50) REFERENCES coins(id),
        rank INTEGER NOT NULL,
        market_cap BIGINT,
        total_volume BIGINT,
        price_change_percentage_24h DECIMAL(10,4),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create coin_categories table (many-to-many relationship)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS coin_categories (
        coin_id VARCHAR(50) REFERENCES coins(id),
        category_id VARCHAR(50) REFERENCES categories(id),
        PRIMARY KEY (coin_id, category_id)
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Database query helper
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: result.rowCount });
      return result.rows;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Transaction helper
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Close pool connection
export async function closePool() {
  await pool.end();
}

export default pool;
