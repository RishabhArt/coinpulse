'use client';

import { useEffect, useState, useRef } from 'react';
import { searchCoins } from '@/lib/coingecko.actions';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchCoin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
          e.preventDefault();
          const selectedCoin = results[selectedIndex];
          window.location.href = `/coins/${selectedCoin.id}`;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const searchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchCoins(query.trim());
        setResults(data?.coins?.slice(0, 8) || []); // Limit to 8 results
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (coinId: string) => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        className="trigger"
        onClick={() => setIsOpen(true)}
      >
        <Search size={16} />
        Search coins...
        <kbd className="hidden sm:inline-flex">
          <span className="text-xs">⌘K</span>
        </kbd>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="fixed inset-0 bg-black/50" />
      <div
        ref={modalRef}
        className="relative w-full max-w-lg mx-4 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
      >
        <div className="flex items-center border-b border-border">
          <Search size={20} className="text-muted-foreground ml-3" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search coins..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {isLoading && <Loader2 className="animate-spin mr-3" size={20} />}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {query.trim().length < 2 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Search size={48} className="mx-auto mb-2 opacity-50" />
              <p>Type at least 2 characters to search</p>
            </div>
          ) : results.length === 0 && !isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((coin, index) => {
                const priceChange24h = coin.data?.price_change_percentage_24h || 0;
                const isTrendingUp = priceChange24h > 0;
                const isSelected = index === selectedIndex;

                return (
                  <Link
                    key={coin.id}
                    href={`/coins/${coin.id}`}
                    onClick={() => handleSelect(coin.id)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors cursor-pointer',
                      isSelected && 'bg-accent'
                    )}
                  >
                    <Image
                      src={coin.thumb}
                      alt={coin.name}
                      width={32}
                      height={32}
                      style={{ width: 'auto', height: 'auto' }}
                      className="rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{coin.name}</span>
                        <span className="text-muted-foreground text-sm">
                          {coin.symbol.toUpperCase()}
                        </span>
                        {coin.market_cap_rank && (
                          <span className="text-xs text-muted-foreground">
                            #{coin.market_cap_rank}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        {coin.data?.price && (
                          <span className="text-sm">
                            {formatCurrency(coin.data.price)}
                          </span>
                        )}
                        <div
                          className={cn(
                            'flex items-center gap-1 text-sm',
                            isTrendingUp ? 'text-green-500' : 'text-red-500'
                          )}
                        >
                          {isTrendingUp ? (
                            <TrendingUp size={14} />
                          ) : (
                            <TrendingDown size={14} />
                          )}
                          {formatPercentage(priceChange24h)}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-border p-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>↑↓ Navigate • Enter to select • ESC to close</span>
            <span>Powered by CoinGecko</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
