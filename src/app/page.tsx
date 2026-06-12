import { readWatchlist } from '@/lib/store';
import { marketTrends, sampleNews } from '@/lib/data';
import Link from 'next/link';
import { ArrowRight, BookmarkCheck, BarChart2, Building2, TrendingUp, TrendingDown } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const watchlist = readWatchlist();
  const properties = watchlist.properties;

  const watching = properties.filter((p) => p.status === 'watching').length;
  const interested = properties.filter((p) => p.status === 'interested').length;
  const visited = properties.filter((p) => p.status === 'visited').length;

  const avgPrice =
    properties.length > 0
      ? Math.round(properties.reduce((s, p) => s + p.price, 0) / properties.length)
      : 0;

  const areas = ['Tokyo23', 'Osaka', 'Nagoya', 'Fukuoka'];
  const latestByArea = areas.map((area) => {
    const areaData = marketTrends
      .filter((t) => t.area === area)
      .sort((a, b) => b.month.localeCompare(a.month));
    const latest = areaData[0];
    const prev = areaData[1];
    const change = prev
      ? ((latest.avgPricePerSqm - prev.avgPricePerSqm) / prev.avgPricePerSqm) * 100
      : 0;
    return { ...latest, change };
  });

  const recentNews = sampleNews.slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-500 text-sm mt-1">日本不動産市場の最新状況をチェックしよう</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="ウォッチ中"
          value={watching}
          unit="件"
          icon={<BookmarkCheck className="text-blue-600" size={20} />}
          bg="bg-blue-50"
        />
        <StatCard
          title="気になる"
          value={interested}
          unit="件"
          icon={<Building2 className="text-yellow-600" size={20} />}
          bg="bg-yellow-50"
        />
        <StatCard
          title="内覧済み"
          value={visited}
          unit="件"
          icon={<Building2 className="text-green-600" size={20} />}
          bg="bg-green-50"
        />
        <StatCard
          title="平均価格"
          value={avgPrice.toLocaleString()}
          unit="万円"
          icon={<BarChart2 className="text-purple-600" size={20} />}
          bg="bg-purple-50"
        />
      </div>

      {/* Market Overview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">主要エリア 市場概況</h2>
          <Link
            href="/market"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            詳細を見る <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {latestByArea.map((area) => (
            <div key={area.area} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-sm font-medium text-gray-500 mb-1">{area.areaJp}</div>
              <div className="text-2xl font-bold text-gray-900">
                {area.avgPricePerSqm.toFixed(1)}
                <span className="text-sm font-normal text-gray-500 ml-1">万/m²</span>
              </div>
              <div
                className={`flex items-center gap-1 text-xs mt-1 ${
                  area.change >= 0 ? 'text-red-500' : 'text-green-600'
                }`}
              >
                {area.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {area.change >= 0 ? '+' : ''}
                {area.change.toFixed(1)}% 前月比
              </div>
              <div className="text-xs text-gray-400 mt-2">
                中央値: {area.medianPrice.toLocaleString()}万円
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Watchlist */}
      {properties.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">最近のウォッチリスト</h2>
            <Link
              href="/watchlist"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              すべて見る <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.slice(0, 3).map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="font-semibold text-gray-900 truncate mb-1">{p.name}</div>
                <div className="text-sm text-gray-500 truncate mb-2">{p.address}</div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {p.price.toLocaleString()}万円
                  </span>
                  <span className="text-xs text-gray-500">
                    {p.rooms} / {p.size}m²
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent News */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">最新ニュース</h2>
          <Link
            href="/news"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            すべて見る <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recentNews.map((news) => (
            <a
              key={news.id}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow group block"
            >
              <div className="flex items-center gap-2 mb-2">
                <CategoryBadge category={news.category} />
                <span className="text-xs text-gray-400">{news.source}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 mb-1">
                {news.titleJp}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">{news.summary}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  unit,
  icon,
  bg,
}: {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{title}</span>
        <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {value}
        <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
      </div>
    </div>
  );
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  market: { label: '市場', color: 'bg-blue-100 text-blue-700' },
  policy: { label: '政策', color: 'bg-purple-100 text-purple-700' },
  development: { label: '開発', color: 'bg-orange-100 text-orange-700' },
  tips: { label: 'Tips', color: 'bg-green-100 text-green-700' },
  'interest-rate': { label: '金利', color: 'bg-red-100 text-red-700' },
};

function CategoryBadge({ category }: { category: string }) {
  const cfg = categoryLabels[category] ?? { label: category, color: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}
