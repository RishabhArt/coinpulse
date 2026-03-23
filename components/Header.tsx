'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import SearchModal from '@/components/SearchModal';
import { Bot } from 'lucide-react';

const Header = () => {
  const pathname = usePathname();

  return (
    <header>
      <div className="main-container inner">
        <Link href="/">
          <Image 
            src="/logo.svg" 
            alt="CoinPulse logo" 
            width={132} 
            height={40}
            loading="eager"
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>

        <nav>
          <Link
            href="/"
            className={cn('nav-link', {
              'is-active': pathname === '/',
              'is-home': true,
            })}
          >
            Home
          </Link>

          <SearchModal />

          <Link
            href="/coins"
            className={cn('nav-link', {
              'is-active': pathname === '/coins',
            })}
          >
            All Coins
          </Link>

          <Link
            href="/ai-coach"
            className={cn('nav-link', {
              'is-active': pathname === '/ai-coach',
            })}
          >
            <Bot className="w-4 h-4" />
            AI Coach
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
