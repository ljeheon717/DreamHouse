'use client';

import { sampleNews } from '@/lib/data';
import { NewsItem } from '@/lib/types';
import { ExternalLink, Search } from 'lucide-react';
import { useState } from 'react';

type Category = NewsItem['category'] | 'all';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'market', label: '市場動向' },
  { value: 'interest-rate', label: '金利' },
  { value: 'policy', label: '政策' },
  { value: 'development', label: '開発' },
  { value: 'tips', label: 'Tips' },
];

const categoryConfig: Record<string, { label: string; color: string }> = {
  market: { label: '市場動向', color: 'bg-blue-100 text-blue-700' },
  policy: { label: '政策', color: 'bg-purple-100 text-purple-700' },
  development: { label: '開発', color: 'bg-orange-100 text-orange-700' },
  tips: { label: 'Tips', color: 'bg-green-100 text-green-700' },
  'interest-rate': { label: '金利', color: 'bg-red-100 text-red-700' },
};

const REAL_ESTATE_SOURCES = [
  { name: 'SUUMO Journal', url: 'https://suumo.jp/journal/', desc: '総合不動産情報・コラム' },
  { name: "HOME'S PRESS", url: 'https://www.homes.co.jp/cont/press/', desc: '住まいの最新情報' },
  { name: 'アットホームラボ', url: 'https://www.athome.co.jp/kodate/chintai/', desc: '市場データ・統計' },
  { name: '日経不動産マーケット', url: 'https://www.nikkei.com/theme/?theme=housing', desc: 'ビジネス視点の不動産情報' },
  { name: '国土交通省', url: 'https://www.mlit.go.jp/statistics/details/t-jutaku-1_000001.html', desc: '公式統計・政策情報' },
  { name: 'マンション研究所', url: 'https://www.re-guide.jp/', desc: 'マンション専門情報' },
];

export default function NewsPage() {
  const [category, setCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');

  const filtered = sampleNews
    .filter((n) => category === 'all' || n.category === category)
    .filter(
      (n) =>
        !search ||
        (n.titleJp ?? '').includes(search) ||
        n.summary.includes(search) ||
        n.tags.some((t) => t.includes(search))
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">不動産ニュース</h1>
        <p className="text-gray-500 text-sm mt-1">市場動向・政策・Tips などの最新情報</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="キーワードで検索..."
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                category === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="text-sm text-gray-500">{filtered.length}件のニュース</div>
          {filtered.map((news) => {
            const cfg = categoryConfig[news.category] ?? {
              label: news.category,
              color: 'bg-gray-100 text-gray-700',
            };
            return (
              <a
                key={news.id}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-xs text-gray-400">{news.source}</span>
                      <span className="text-xs text-gray-400 ml-auto">{news.publishedAt}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 mb-1">
                      {news.titleJp}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-3">{news.summary}</p>
                    <div className="flex flex-wrap gap-1">
                      {news.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ExternalLink
                    size={16}
                    className="text-gray-300 group-hover:text-blue-500 shrink-0 mt-1"
                  />
                </div>
              </a>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-3xl mb-2">📰</div>
              <div>該当するニュースがありません</div>
            </div>
          )}
        </div>

        {/* Sidebar: Sources */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">主要情報源</h3>
            <div className="space-y-3">
              {REAL_ESTATE_SOURCES.map((source) => (
                <a
                  key={source.name}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 group"
                >
                  <ExternalLink
                    size={14}
                    className="text-gray-300 group-hover:text-blue-500 mt-0.5 shrink-0"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-800 group-hover:text-blue-700">
                      {source.name}
                    </div>
                    <div className="text-xs text-gray-400">{source.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
            <h3 className="font-semibold text-blue-900 mb-2">有用なデータソース</h3>
            <div className="space-y-2 text-sm">
              <a
                href="https://www.land.mlit.go.jp/webland/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-700 hover:underline"
              >
                → 国土交通省 土地総合情報システム
              </a>
              <a
                href="https://www.reinfolib.mlit.go.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-700 hover:underline"
              >
                → 不動産情報ライブラリ
              </a>
              <a
                href="https://www.tochidai.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-700 hover:underline"
              >
                → 土地代データ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
