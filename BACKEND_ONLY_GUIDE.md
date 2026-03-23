# Backend API Only Deployment

## 🚀 Backend-Only Deployment Options

### **Option 1: Vercel (API Only)**
Deploy only the API routes without the frontend:

1. **Create backend-only branch:**
```bash
git checkout -b backend-only
```

2. **Create backend-only structure:**
```
📁 backend/
├── api/              # API routes only
├── lib/              # Database and models
├── scripts/          # Database scripts
├── package.json      # Backend dependencies
└── vercel.json       # API-only config
```

3. **API-only vercel.json:**
```json
{
  "version": 2,
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

### **Option 2: Railway (Backend Only)**
Configure Railway to run only API server:

1. **Update railway.toml:**
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm run start:api"
healthcheckPath = "/api/health"

[env]
NODE_ENV = "production"
```

2. **Add API-only start script:**
```json
{
  "scripts": {
    "start:api": "next start --port 3000"
  }
}
```

### **Option 3: Express.js Backend**
Create a separate Express.js API server:

```javascript
// backend/server.js
const express = require('express');
const { CoinService } = require('./lib/models');

const app = express();
app.use(express.json());

// API Routes
app.get('/api/health', async (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/coins/markets', async (req, res) => {
  const coins = await CoinService.getAllCoins();
  res.json(coins);
});

app.listen(3000, () => {
  console.log('Backend API running on port 3000');
});
```

## 🎯 Quick Fix for Current Deployment:

### **Fix Display Size Issues:**
Update CSS to fix large display:

```css
/* Add to globals.css */
body {
  font-size: 14px !important;
  line-height: 1.5 !important;
}

.main-container {
  max-width: 1200px !important;
  margin: 0 auto !important;
  padding: 0 1rem !important;
}
```

### **Create API Documentation Page:**
Add a backend-only documentation page:

```typescript
// app/api-docs/page.tsx
export default function APIDocs() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">CoinPulse Backend API</h1>
      
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Available Endpoints</h2>
        
        <div className="space-y-4">
          <div className="border rounded p-4">
            <h3 className="font-mono text-blue-600">GET /api/health</h3>
            <p>Check API health status</p>
          </div>
          
          <div className="border rounded p-4">
            <h3 className="font-mono text-blue-600">GET /api/coins/markets</h3>
            <p>Get all coins with pagination</p>
          </div>
          
          <div className="border rounded p-4">
            <h3 className="font-mono text-blue-600">GET /api/coin/[id]</h3>
            <p>Get individual coin details</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 🚀 Recommended Solution:

**Create a separate backend repository:**
1. Fork current repo as `coinpulse-backend`
2. Remove frontend components
3. Keep only API routes and database
4. Deploy as backend-only service

This gives you:
- ✅ Clean backend API
- ✅ Database integration
- ✅ API documentation
- ✅ Separate from frontend
- ✅ Easy to manage
