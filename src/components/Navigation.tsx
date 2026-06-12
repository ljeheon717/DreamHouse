'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, BookmarkCheck, Calculator, Home, MapPin, Newspaper } from 'lucide-react';

const navItems = [
  { href: '/', label: 'ダッシュボード', icon: Home },
  { href: '/market', label: '市場トレンド', icon: BarChart2 },
  { href: '/area', label: 'エリア分析', icon: MapPin },
  { href: '/watchlist', label: 'ウォッチリスト', icon: BookmarkCheck },
  { href: '/loan', label: 'ローン試算', icon: Calculator },
  { href: '/news', label: 'ニュース', icon: Newspaper },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🏠</span>
            <div>
              <span className="font-bold text-gray-900 text-lg">DreamHouse</span>
              <span className="text-xs text-gray-500 ml-2 hidden sm:inline">日本不動産トラッカー</span>
            </div>
          </div>

          <div className="flex items-center gap-0.5 overflow-x-auto">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={15} />
                  <span className="hidden md:block">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
