'use client';

import { areaAnalyses } from '@/lib/data';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  TrendingUp,
  XCircle,
  Zap,
} from 'lucide-react';

const facilityIcons: Record<string, string> = {
  station: '🚉',
  supermarket: '🛒',
  hospital: '🏥',
  school: '🏫',
  park: '🌳',
  nursery: '👶',
  library: '📚',
  gym: '🏋️',
};

export default function AreaPage() {
  const [selectedKey, setSelectedKey] = useState(areaAnalyses[0].areaKey);
  const area = areaAnalyses.find((a) => a.areaKey === selectedKey) ?? areaAnalyses[0];

  const popData = area.population.map((p) => ({
    year: String(p.year),
    流入: p.inflow,
    流出: p.outflow,
    純増: p.netChange,
    総人口: p.total,
  }));

  const ageData = area.population.slice(-1).map((p) => [
    { name: '30歳未満', value: p.under30 },
    { name: '30-65歳', value: 100 - p.under30 - p.over65 },
    { name: '65歳以上', value: p.over65 },
  ])[0];

  const scores = [
    { label: '交通・利便性', value: area.walkScore, color: '#3b82f6' },
    { label: '安全・治安', value: area.safetyScore, color: '#10b981' },
    { label: '将来・開発', value: area.developmentScore, color: '#f59e0b' },
    { label: '防災・リスク', value: area.disasterRiskScore, color: '#8b5cf6' },
  ];
  const overallScore = Math.round(scores.reduce((s, x) => s + x.value, 0) / scores.length);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">エリア分析</h1>
        <p className="text-gray-500 text-sm mt-1">人口動態・周辺環境・将来性を総合評価</p>
      </div>

      {/* Area Selector */}
      <div className="flex flex-wrap gap-2">
        {areaAnalyses.map((a) => (
          <button
            key={a.areaKey}
            onClick={() => setSelectedKey(a.areaKey)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              selectedKey === a.areaKey
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
            }`}
          >
            {a.prefecture} {a.areaJp}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <MapPin size={20} />
          <h2 className="text-xl font-bold">
            {area.prefecture} {area.areaJp}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{overallScore}</div>
            <div className="text-xs text-blue-100 mt-1">総合スコア /100</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{area.avgCommuteMins}分</div>
            <div className="text-xs text-blue-100 mt-1">平均通勤時間</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{area.avgRentYield}%</div>
            <div className="text-xs text-blue-100 mt-1">想定賃貸利回り</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">
              {(
                ((area.population[area.population.length - 1].total -
                  area.population[0].total) /
                  area.population[0].total) *
                100
              ).toFixed(1)}%
            </div>
            <div className="text-xs text-blue-100 mt-1">5年間人口増加率</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Radar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">エリアスコア評価</h3>
          <div className="space-y-3">
            {scores.map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold" style={{ color }}>
                    {value}/100
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${value}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-blue-50 rounded-lg p-2">
                <Clock size={14} className="mx-auto text-blue-600 mb-1" />
                <div className="text-xs text-gray-500">通勤</div>
                <div className="font-bold text-sm text-gray-900">{area.avgCommuteMins}分</div>
              </div>
              <div className="bg-green-50 rounded-lg p-2">
                <ShieldCheck size={14} className="mx-auto text-green-600 mb-1" />
                <div className="text-xs text-gray-500">治安</div>
                <div className="font-bold text-sm text-gray-900">{area.safetyScore >= 80 ? '良好' : area.safetyScore >= 65 ? '普通' : '注意'}</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-2">
                <TrendingUp size={14} className="mx-auto text-yellow-600 mb-1" />
                <div className="text-xs text-gray-500">利回り</div>
                <div className="font-bold text-sm text-gray-900">{area.avgRentYield}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Population Flow */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">人口動態（流入・流出）</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={popData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => typeof v === 'number' ? v.toLocaleString() : String(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="流入" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="流出" fill="#f87171" radius={[2, 2, 0, 0]} />
              <Bar dataKey="純増" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Population Total Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">総人口推移 &amp; 年齢構成</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={popData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
              <Tooltip formatter={(v) => `${typeof v === 'number' ? v.toLocaleString() : v}人`} />
              <Line type="monotone" dataKey="総人口" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 flex gap-2">
            {ageData.map((d) => (
              <div key={d.name} className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-sm font-bold text-gray-900">{d.value.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">{d.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Facilities */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">周辺施設</h3>
          <div className="space-y-2">
            {area.facilities.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{facilityIcons[f.type] ?? '📍'}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{f.name}</div>
                    <div className="text-xs text-gray-400">
                      {f.type === 'station' ? '最寄駅' : f.type === 'hospital' ? '医療' : f.type === 'school' ? '学校' : f.type === 'park' ? '公園' : f.type === 'supermarket' ? 'スーパー' : f.type === 'nursery' ? '保育所' : f.type === 'gym' ? 'スポーツ' : '施設'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-blue-600">徒歩{f.distanceMin}分</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future Plans */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-yellow-500" />
          <h3 className="font-semibold text-gray-900">将来の開発・再開発計画</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {area.futurePlans.map((plan, i) => (
            <div key={i} className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Building2 size={14} className="text-yellow-600 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{plan}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={18} className="text-green-500" />
            <h3 className="font-semibold text-gray-900">メリット</h3>
          </div>
          <ul className="space-y-2">
            {area.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <XCircle size={18} className="text-red-400" />
            <h3 className="font-semibold text-gray-900">注意点</h3>
          </div>
          <ul className="space-y-2">
            {area.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-red-400 mt-0.5 shrink-0">△</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
