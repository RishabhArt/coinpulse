import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL || 'https://your-app.vercel.app'
    : 'http://localhost:3000';

  const endpoints = [
    {
      method: 'GET',
      path: '/api/health',
      description: 'Check API health status and database connection',
      example: `${baseUrl}/api/health`
    },
    {
      method: 'GET',
      path: '/api/coins/markets',
      description: 'Get all cryptocurrencies with pagination',
      example: `${baseUrl}/api/coins/markets?page=1&limit=100`
    },
    {
      method: 'GET',
      path: '/api/coin/[id]',
      description: 'Get individual cryptocurrency details',
      example: `${baseUrl}/api/coin/bitcoin`
    },
    {
      method: 'GET',
      path: '/api/coin/[id]/ohlc',
      description: 'Get historical OHLC price data for a coin',
      example: `${baseUrl}/api/coin/bitcoin/ohlc?days=7&interval=1h`
    },
    {
      method: 'GET',
      path: '/api/categories',
      description: 'Get all market categories',
      example: `${baseUrl}/api/categories`
    },
    {
      method: 'GET',
      path: '/api/trending',
      description: 'Get trending cryptocurrencies',
      example: `${baseUrl}/api/trending`
    }
  ];

  return NextResponse.json({
    title: 'CoinPulse Backend API',
    version: '1.0.0',
    status: 'Active',
    database: 'PostgreSQL with fallback to mock data',
    baseUrl: baseUrl,
    endpoints,
    documentation: {
      description: 'RESTful API for cryptocurrency data with PostgreSQL database integration',
      features: [
        'Real-time cryptocurrency data',
        'Historical OHLC price data',
        'Market categories',
        'Trending coins',
        'Search functionality',
        'Pagination support',
        'Database fallback to mock data'
      ],
      authentication: 'None (public API)',
      rateLimit: '100 requests per minute',
      format: 'JSON'
    }
  });
}
