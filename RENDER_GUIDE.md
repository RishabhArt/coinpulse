# Render.com Deployment Guide

## 🚀 Render Free Tier Setup

### **Step 1: Create Render Account**
1. Go to https://render.com
2. Sign up with GitHub
3. Verify email

### **Step 2: Deploy Web Service**
1. Click "New" → "Web Service"
2. Connect GitHub repository: `RishabhArt/coinpulse`
3. Configure:
   - Name: `coinpulse`
   - Branch: `main`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Instance Type: `Free`

### **Step 3: Add PostgreSQL Database**
1. Click "New" → "PostgreSQL"
2. Name: `coinpulse-db`
3. Database Name: `coinpulse`
4. Choose Free tier
5. Create database

### **Step 4: Environment Variables**
In Web Service → Environment:
```
DATABASE_URL=[POSTGRES-URL-FROM-RENDER-DATABASE]
NODE_ENV=production
```

### **Step 5: Deploy**
- Render will automatically build and deploy
- Your app will be available at: `https://coinpulse.onrender.com`

## 🎯 Render Free Tier Limits:
- **Web Service**: 750 hours/month (free)
- **PostgreSQL**: 90 days free, then $7/month
- **Bandwidth**: 100GB/month
- **Builds**: Unlimited

## 💡 Recommendation:
Use Render for the web service (free) and consider upgrading database later, or use Supabase for database (free).
