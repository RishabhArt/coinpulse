import { NextRequest, NextResponse } from 'next/server';
import { OHLCService } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get('days') || '1');
  const interval = searchParams.get('interval') || 'hourly';

  try {
    // Try to get OHLC data from database
    let data = await OHLCService.getOHLCData(id, days);
    
    // If no data exists, generate mock data
    if (data.length === 0) {
      console.log(`No OHLC data found for ${id}, generating mock data...`);
      data = await OHLCService.generateMockOHLCData(id, days);
    }

    // Transform to match expected format for different intervals
    if (interval === 'daily' && days > 1) {
      // Group hourly data into daily candles
      const dailyData: number[][] = [];
      const dailyMap = new Map<string, number[]>();
      
      data.forEach(([timestamp, open, high, low, close]) => {
        const date = new Date(timestamp).toDateString();
        if (!dailyMap.has(date)) {
          dailyMap.set(date, [timestamp, open, high, low, close]);
        } else {
          const existing = dailyMap.get(date)!;
          existing[2] = Math.max(existing[2], high); // Update high
          existing[3] = Math.min(existing[3], low);  // Update low
          existing[4] = close; // Update close
        }
      });
      
      dailyData.push(...Array.from(dailyMap.values()));
      data = dailyData;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`OHLC API error for ${id}:`, error);
    return NextResponse.json([], { status: 500 });
  }
}
