'use client';

import { marketTrends } from '@/lib/data';
import { useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const AREAS = [
  { key: 'Tokyo23', label: '東京23区', color: '#3b82f6' },
  { key: 'Yokohama', label: '横浜市', color: '#f97316' },
  { key: 'Saitama', label: 'さいたま市', color: '#10b981' },
  { key: 'ChibaWest', label: '千葉県西部', color: '#8b5cf6' },
];

type Metric = 'avgPricePerSqm' | 'medianPrice' | 'totalListings';

const metricConfig: Record<Metric, { label: string; unit: string }> = {
  avgPricePerSqm: { label: '坪単価（万円/m²）', unit: '万/m²' },
  medianPrice: { label: '中央値（万円）', unit: '万円' },
  totalListings: { label: '物件数（件）', unit: '件' },
};

export default function MarketPage() {
  const [selectedAreas, setSelectedAreas] = useState<string[]>(['Tokyo23', 'Yokohama']);
  const [metric, setMetric] = useState<Metric>('avgPricePerSqm');

  const months = Array.from(new Set(marketTrends.map((t) => t.month))).sort();

  const chartData = months.map((month) => {
    const row: Record<string, string | number> = { month: month.slice(0, 7) };
    for (const area of AREAS) {
      const entry = marketTrends.find((t) => t.area === area.key && t.month === month);
      if (entry) row[area.key] = entry[metric];
    }
    return row;
  });

  function toggleArea(key: string) {
    setSelectedAreas((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  }

  const latestByArea = AREAS.map((area) => {
    const data = marketTrends.filter((t) => t.area === area.key).sort((a, b) => b.month.localeCompare(a.month));
    return { ...area, latest: data[0] };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">市場トレンド</h1>
        <p className="text-gray-500 text-sm mt-1">首都圏（東京・横浜・さいたま・千葉）の価格推移を確認できます</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {latestByArea.map(({ key, label, color, latest }) => (
          <div key={key} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {latest.avgPricePerSqm.toFixed(1)}
              <span className="text-sm font-normal text-gray-500 ml-1">万/m²</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              中央値 {latest.medianPrice.toLocaleString()}万円
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              物件数 {latest.totalListings.toLocaleString()}件
            </div>
          </div>
        ))}
      </div>

      {/* Chart Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {AREAS.map((area) => (
              <button
                key={area.key}
                onClick={() => toggleArea(area.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  selectedAreas.includes(area.key)
                    ? 'text-white border-transparent'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
                style={
                  selectedAreas.includes(area.key)
                    ? { backgroundColor: area.color, borderColor: area.color }
                    : {}
                }
              >
                {area.label}
              </button>
            ))}
          </div>

          <div className="sm:ml-auto">
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as Metric)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(metricConfig).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => v.replace('-', '/')}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)
              }
            />
            <Tooltip
              formatter={(value, name) => {
                const area = AREAS.find((a) => a.key === String(name));
                const numVal = typeof value === 'number' ? value.toFixed(1) : value;
                return [`${numVal} ${metricConfig[metric].unit}`, area?.label ?? String(name)];
              }}
              labelFormatter={(label) => `${label}月`}
            />
            <Legend
              formatter={(value) => AREAS.find((a) => a.key === value)?.label ?? value}
            />
            {AREAS.filter((a) => selectedAreas.includes(a.key)).map((area) => (
              <Line
                key={area.key}
                type="monotone"
                dataKey={area.key}
                stroke={area.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Area Detail Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">最新データ（{months[months.length - 1]}）</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left px-6 py-3 font-medium">エリア</th>
                <th className="text-right px-6 py-3 font-medium">坪単価（万/m²）</th>
                <th className="text-right px-6 py-3 font-medium">中央値（万円）</th>
                <th className="text-right px-6 py-3 font-medium">物件数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {latestByArea.map(({ key, label, color, latest }) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      {label}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right font-medium">
                    {latest.avgPricePerSqm.toFixed(1)}
                  </td>
                  <td className="px-6 py-3 text-right">
                    {latest.medianPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-500">
                    {latest.totalListings.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
