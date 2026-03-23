import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try database connection
    const { query } = await import('@/lib/database');
    await query('SELECT 1');
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Database not available, using fallback:', error);
    
    // Return healthy status even without database for development
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'using_fallback',
      message: 'Database not connected - using mock data',
      version: '1.0.0'
    });
  }
}
