'use client';

import { useEffect, useRef, useState } from 'react';

// Mock WebSocket implementation for when real WebSocket is not available
const useMockWebSocket = (coinId: string) => {
  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate connection
    setIsConnected(true);

    // Simulate initial price data
    setPrice({
      usd: 43250.00 + Math.random() * 1000 - 500,
      coin: coinId,
      price: 43250.00 + Math.random() * 1000 - 500,
      change24h: 2.5 + Math.random() * 2 - 1,
      marketCap: 846521000000,
      volume24h: 28543200000,
      timestamp: Date.now(),
    });

    // Simulate live price updates
    const priceInterval = setInterval(() => {
      setPrice(prev => {
        const currentPrice = prev?.price || 43250.00;
        const currentChange24h = prev?.change24h || 2.5;
        const currentMarketCap = prev?.marketCap || 846521000000;
        const currentVolume24h = prev?.volume24h || 28543200000;
        
        return {
          usd: currentPrice + (Math.random() * 100 - 50),
          coin: coinId,
          price: currentPrice + (Math.random() * 100 - 50),
          change24h: currentChange24h + (Math.random() * 0.2 - 0.1),
          marketCap: currentMarketCap + (Math.random() * 10000000 - 5000000),
          volume24h: currentVolume24h + (Math.random() * 1000000 - 500000),
          timestamp: Date.now(),
        };
      });
    }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds

    // Simulate OHLCV updates
    const ohlcvInterval = setInterval(() => {
      const now = Date.now();
      const basePrice = 43250.00;
      const volatility = 500;
      
      setOhlcv([
        now,
        basePrice + Math.random() * volatility - volatility/2,
        basePrice + Math.random() * volatility,
        basePrice - Math.random() * volatility,
        basePrice + Math.random() * volatility - volatility/2,
      ]);
    }, 5000 + Math.random() * 5000); // Random interval between 5-10 seconds

    // Simulate trades
    const tradeInterval = setInterval(() => {
      const newTrade: Trade = {
        price: 43250.00 + Math.random() * 1000 - 500,
        value: Math.random() * 10000 + 1000,
        timestamp: Date.now(),
        type: Math.random() > 0.5 ? 'b' : 's',
        amount: Math.random() * 2 + 0.1,
      };

      setTrades(prev => [newTrade, ...prev].slice(0, 7));
    }, 1000 + Math.random() * 2000); // Random interval between 1-3 seconds

    return () => {
      clearInterval(priceInterval);
      clearInterval(ohlcvInterval);
      clearInterval(tradeInterval);
      setIsConnected(false);
    };
  }, [coinId]);

  return { price, trades, ohlcv, isConnected };
};

export const useCoinGeckoWebSocket = ({
  coinId,
  poolId,
  liveInterval,
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
  // Check if WebSocket URL is available
  const wsUrl = process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL;
  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

  // If WebSocket is not configured, use mock implementation
  if (!wsUrl || !apiKey) {
    return useMockWebSocket(coinId);
  }

  // Real WebSocket implementation (for when API keys are properly configured)
  const wsRef = useRef<WebSocket | null>(null);
  const subscribed = useRef(<Set<string>>new Set());

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
  const [isWsReady, setIsWsReady] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`${wsUrl}?x_cg_pro_api_key=${apiKey}`);
    wsRef.current = ws;

    const send = (payload: Record<string, unknown>) => ws.send(JSON.stringify(payload));

    const handleMessage = (event: MessageEvent) => {
      const msg: WebSocketMessage = JSON.parse(event.data);

      if (msg.type === 'ping') {
        send({ type: 'pong' });
        return;
      }
      if (msg.type === 'confirm_subscription') {
        const { channel } = JSON.parse(msg?.identifier ?? '');
        subscribed.current.add(channel);
      }
      if (msg.c === 'C1') {
        setPrice({
          usd: msg.p ?? 0,
          coin: msg.i,
          price: msg.p,
          change24h: msg.pp,
          marketCap: msg.m,
          volume24h: msg.v,
          timestamp: msg.t,
        });
      }
      if (msg.c === 'G2') {
        const newTrade: Trade = {
          price: msg.pu,
          value: msg.vo,
          timestamp: msg.t ?? 0,
          type: msg.ty,
          amount: msg.to,
        };

        setTrades((prev) => [newTrade, ...prev].slice(0, 7));
      }
      if (msg.ch === 'G3') {
        const timestamp = msg.t ?? 0;

        const candle: OHLCData = [
          timestamp,
          Number(msg.o ?? 0),
          Number(msg.h ?? 0),
          Number(msg.l ?? 0),
          Number(msg.c ?? 0),
        ];

        setOhlcv(candle);
      }
    };

    ws.onopen = () => setIsWsReady(true);
    ws.onmessage = handleMessage;
    ws.onclose = () => setIsWsReady(false);
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsWsReady(false);
    };

    return () => ws.close();
  }, [wsUrl, apiKey]);

  useEffect(() => {
    if (!isWsReady) return;
    const ws = wsRef.current;
    if (!ws) return;

    const send = (payload: Record<string, unknown>) => ws.send(JSON.stringify(payload));

    const unsubscribeAll = () => {
      subscribed.current.forEach((channel) => {
        send({
          command: 'unsubscribe',
          identifier: JSON.stringify({ channel }),
        });
      });

      subscribed.current.clear();
    };

    const subscribe = (channel: string, data?: Record<string, unknown>) => {
      if (subscribed.current.has(channel)) return;

      send({ command: 'subscribe', identifier: JSON.stringify({ channel }) });

      if (data) {
        send({
          command: 'message',
          identifier: JSON.stringify({ channel }),
          data: JSON.stringify(data),
        });
      }
    };

    queueMicrotask(() => {
      setPrice(null);
      setTrades([]);
      setOhlcv(null);

      unsubscribeAll();

      subscribe('CGSimplePrice', { coin_id: [coinId], action: 'set_tokens' });
    });

    const poolAddress = poolId.replace('_', ':') ?? '';

    if (poolAddress) {
      subscribe('OnchainTrade', {
        'network_id:pool_addresses': [poolAddress],
        action: 'set_pools',
      });

      subscribe('OnchainOHLCV', {
        'network_id:pool_addresses': [poolAddress],
        interval: liveInterval,
        action: 'set_pools',
      });
    }
  }, [coinId, poolId, isWsReady, liveInterval]);

  return {
    price,
    trades,
    ohlcv,
    isConnected: isWsReady,
  };
};
