'use client';

import PropertyCard from '@/components/PropertyCard';
import PropertyForm from '@/components/PropertyForm';
import { Property, PropertyStatus } from '@/lib/types';
import { Filter, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const STATUS_FILTERS: { value: PropertyStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'watching', label: 'ウォッチ中' },
  { value: 'interested', label: '気になる' },
  { value: 'visited', label: '内覧済み' },
  { value: 'passed', label: '見送り' },
];

export default function WatchlistPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Property | null>(null);
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'addedAt' | 'price' | 'size'>('addedAt');

  async function fetchProperties() {
    const res = await fetch('/api/properties');
    const data = await res.json();
    setProperties(data.properties);
    setLoading(false);
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  async function handleAdd(formData: Partial<Property>) {
    await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setShowForm(false);
    fetchProperties();
  }

  async function handleEdit(formData: Partial<Property>) {
    if (!editTarget) return;
    await fetch(`/api/properties/${editTarget.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setEditTarget(null);
    fetchProperties();
  }

  async function handleDelete(id: string) {
    if (!confirm('この物件をリストから削除しますか？')) return;
    await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    fetchProperties();
  }

  async function handleStatusChange(id: string, status: PropertyStatus) {
    await fetch(`/api/properties/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchProperties();
  }

  const filtered = properties
    .filter((p) => statusFilter === 'all' || p.status === statusFilter)
    .filter((p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.area.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.includes(search))
    )
    .sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'size') return b.size - a.size;
      return b.addedAt.localeCompare(a.addedAt);
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ウォッチリスト</h1>
          <p className="text-gray-500 text-sm mt-1">気になる物件を管理しよう</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          物件を追加
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="物件名・住所・タグで検索..."
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400 shrink-0" />
          <div className="flex gap-1">
            {STATUS_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  statusFilter === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="addedAt">追加日順</option>
          <option value="price">価格順</option>
          <option value="size">面積順</option>
        </select>
      </div>

      {/* Count */}
      <div className="text-sm text-gray-500">
        {loading ? '読み込み中...' : `${filtered.length}件表示中（全${properties.length}件）`}
      </div>

      {/* Grid */}
      {!loading && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-4xl mb-3">🏠</div>
              <div className="font-medium">物件が見つかりません</div>
              <div className="text-sm mt-1">
                {search || statusFilter !== 'all'
                  ? '検索条件を変えてみてください'
                  : '「物件を追加」ボタンから登録しましょう'}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  onEdit={(prop) => setEditTarget(prop)}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </>
      )}

      {showForm && (
        <PropertyForm
          onSubmit={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}

      {editTarget && (
        <PropertyForm
          initial={editTarget}
          onSubmit={handleEdit}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}
