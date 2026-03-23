# 🚀 CoinPulse Backend & Database System

## 📋 Overview

Complete backend and database system for CoinPulse cryptocurrency tracking application with PostgreSQL database and Next.js API routes.

## 🗄️ Database Schema

### **Tables Created:**

1. **coins** - Cryptocurrency data
2. **categories** - Market categories  
3. **ohlc_data** - Historical price data (OHLC)
4. **trending_coins** - Trending coins rankings
5. **coin_categories** - Many-to-many relationships

### **Database Features:**

- ✅ **Full CRUD Operations** for all entities
- ✅ **OHLC Historical Data** with multiple timeframes
- ✅ **Trending Coins** with rankings
- ✅ **Search & Pagination** support
- ✅ **Mock Data Generation** for development
- ✅ **Type-safe Queries** with PostgreSQL

## 🛠️ Installation & Setup

### **1. Install Dependencies:**
```bash
npm install pg @types/pg tsx
```

### **2. Environment Variables:**
```bash
# .env.local
DATABASE_URL=postgresql://username:password@localhost:5432/coinpulse
NODE_ENV=development
```

### **3. Initialize Database:**
```bash
npm run db:migrate
npm run db:seed
```

### **4. Start Development:**
```bash
npm run dev
```

## 📊 API Endpoints

### **Coins:**
- `GET /api/coins/markets` - All coins with pagination
- `GET /api/coin/[id]` - Individual coin details
- `GET /api/coin/[id]/ohlc` - Historical OHLC data

### **Categories:**
- `GET /api/categories` - All market categories

### **Trending:**
- `GET /api/trending` - Trending coins list

### **Health:**
- `GET /api/health` - Application health check

## 🚀 Railway.app Deployment

### **1. Prepare Repository:**
```bash
git add .
git commit -m "Add backend database system"
git push origin main
```

### **2. Railway Setup:**

1. **Create Railway Account**: https://railway.app
2. **Connect GitHub Repository**
3. **Add PostgreSQL Service**
4. **Set Environment Variables**:
   ```
   DATABASE_URL=postgresql://postgres:password@host:5432/railway
   NODE_ENV=production
   ```
5. **Deploy Application**

### **3. Post-Deployment:**
```bash
# Seed production database (run once)
npx tsx scripts/seed-database.ts
```

## 🔄 Database Migration

### **Development:**
```bash
npm run db:migrate  # Create tables
npm run db:seed    # Seed with mock data
```

### **Production:**
```bash
# Railway Console → Variables → Add DATABASE_URL
# Railway Console → Logs → Check deployment
```

## 📈 Features

### **🔍 Search & Filtering:**
- Coin search by name/symbol
- Category filtering
- Market cap ranking
- Price change filtering

### **📊 Historical Data:**
- OHLC candlestick data
- Multiple timeframes (1h, 1d, 1w)
- Automatic mock data generation
- Real-time price updates

### **🏆 Trending System:**
- Dynamic trending rankings
- Market cap based sorting
- 24h price changes
- Volume tracking

### **🛡️ Error Handling:**
- Graceful database fallbacks
- Mock data when database unavailable
- Comprehensive error logging
- Health check endpoints

## 🔧 Configuration

### **Database Connection:**
```typescript
// lib/database.ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
```

### **API Response Format:**
```typescript
// Standardized response format
{
  id: "bitcoin",
  symbol: "btc", 
  name: "Bitcoin",
  current_price: 71250.50,
  market_cap: 1390000000000,
  // ... other fields
}
```

## 🎯 Performance

### **Optimizations:**
- **Database Indexing** on frequently queried fields
- **Connection Pooling** for efficient database usage
- **Pagination** for large datasets
- **Caching** for static data
- **Mock Data Fallbacks** for reliability

### **Monitoring:**
- Health check endpoints
- Database connection monitoring
- API response time tracking
- Error rate monitoring

## 🔒 Security

### **Best Practices:**
- **Parameterized Queries** to prevent SQL injection
- **Environment Variables** for sensitive data
- **CORS Configuration** for API security
- **Rate Limiting** for API endpoints
- **SSL/TLS** for database connections

## 🧪 Testing

### **Development Testing:**
```bash
# Test database connection
curl http://localhost:3000/api/health

# Test API endpoints  
curl http://localhost:3000/api/coins/markets
curl http://localhost:3000/api/coin/bitcoin
curl http://localhost:3000/api/trending
```

### **Production Testing:**
```bash
# Railway deployed app
curl https://your-app.railway.app/api/health
```

## 📝 Notes

### **Current Status:**
- ✅ Database schema created
- ✅ API routes updated
- ✅ Mock data seeding
- ✅ Railway configuration
- ⏳ Production deployment ready

### **Next Steps:**
1. Deploy to Railway.app
2. Set up production database
3. Configure environment variables
4. Run database seeding
5. Test all API endpoints

### **Compatibility:**
- ✅ Maintains full compatibility with existing frontend
- ✅ No breaking changes to current application
- ✅ Gradual migration from mock to real data
- ✅ Fallback to mock data if database unavailable

The backend system is now ready for production deployment with Railway.app! 🚀
