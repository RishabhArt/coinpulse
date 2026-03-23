# Supabase Deployment Guide for CoinPulse

## 🚀 Supabase Free Tier Setup

### **Step 1: Create Supabase Project**
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up/login with GitHub
4. Create new organization: "RishabhArt"
5. Create new project: "coinpulse"
6. Choose region closest to you
7. Create database password (save it!)

### **Step 2: Get Database URL**
In Supabase Dashboard → Settings → Database:
```
Connection string: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
```

### **Step 3: Update Environment Variables**
Create `.env.local`:
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

### **Step 4: Deploy to Vercel**
1. Go to https://vercel.com
2. Import GitHub repository: `RishabhArt/coinpulse`
3. Add environment variables in Vercel dashboard
4. Deploy

### **Step 5: Run Database Migration**
After deployment, run migration once:
```bash
# Connect to Supabase SQL Editor and run:
CREATE TABLE IF NOT EXISTS coins (
  id VARCHAR(50) PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  image VARCHAR(500),
  current_price DECIMAL(20,8),
  market_cap BIGINT,
  market_cap_rank INTEGER,
  -- ... (add all other fields from lib/database.ts)
);

-- Run the rest of the schema from lib/database.ts
```

## 🎯 Supabase Free Tier Limits:
- **Database**: 500MB storage
- **Bandwidth**: 2GB/month
- **API Calls**: 50,000/month
- **Rows**: 50,000
- **Always Free**: No credit card required

## 🌐 Vercel Free Tier Limits:
- **Bandwidth**: 100GB/month
- **Serverless Functions**: 100GB-hours/month
- **Builds**: Unlimited
- **Domains**: 1 custom domain
- **Always Free**: No credit card required

## 🔧 Alternative: Netlify + PlanetScale

### **PlanetScale (Free MySQL)**
1. Go to https://planetscale.com
2. Create database: "coinpulse"
3. Get connection string
4. Update DATABASE_URL

### **Netlify (Free Hosting)**
1. Go to https://netlify.com
2. Connect GitHub repository
3. Deploy with environment variables

## 💡 Quick Setup Recommendation:

**Easiest Option: Vercel + Supabase**
- Vercel hosts your Next.js app (free)
- Supabase provides PostgreSQL database (free)
- Both have generous free tiers
- Perfect for CoinPulse application

## 🚀 Next Steps:
1. Create Supabase account
2. Set up database
3. Deploy to Vercel
4. Run database migration
5. Test your live application!

Your CoinPulse will be fully functional with real database! 🎉
