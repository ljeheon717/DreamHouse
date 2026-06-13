'use client';

import { Property } from '@/lib/types';
import { X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  initial?: Partial<Property>;
  onSubmit: (data: Partial<Property>) => void;
  onClose: () => void;
}

export default function PropertyForm({ initial, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<Partial<Property>>({
    name: '',
    address: '',
    area: '東京23区',
    price: 0,
    size: 0,
    rooms: '2LDK',
    type: 'mansion',
    status: 'watching',
    url: '',
    notes: '',
    tags: [],
    ...initial,
  });
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(', '));

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['price', 'size', 'floor', 'totalFloors', 'age'].includes(name)
        ? Number(value) || 0
        : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onSubmit({ ...form, tags });
  }

  const areas = ['東京23区', '東京市部', '横浜市', '川崎市', '千葉市', '市川市', '船橋市', '松戸市', '柏市', 'さいたま市', '川口市', 'その他'];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold text-gray-900">
            {initial?.id ? '物件を編集' : '物件を追加'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">物件名 *</label>
              <input
                name="name"
                value={form.name ?? ''}
                onChange={handleChange}
                required
                placeholder="例：パークコート渋谷"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">住所 *</label>
              <input
                name="address"
                value={form.address ?? ''}
                onChange={handleChange}
                required
                placeholder="例：東京都渋谷区神南1丁目"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">エリア</label>
              <select
                name="area"
                value={form.area ?? '東京23区'}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {areas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">種別</label>
              <select
                name="type"
                value={form.type ?? 'mansion'}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="mansion">マンション</option>
                <option value="apartment">アパート</option>
                <option value="house">一戸建て</option>
                <option value="land">土地</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">価格（万円） *</label>
              <input
                name="price"
                type="number"
                value={form.price ?? ''}
                onChange={handleChange}
                required
                min={0}
                placeholder="例：8000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">面積（m²）</label>
              <input
                name="size"
                type="number"
                step="0.01"
                value={form.size ?? ''}
                onChange={handleChange}
                placeholder="例：60.5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">間取り</label>
              <input
                name="rooms"
                value={form.rooms ?? ''}
                onChange={handleChange}
                placeholder="例：2LDK"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">階数</label>
              <input
                name="floor"
                type="number"
                value={form.floor ?? ''}
                onChange={handleChange}
                placeholder="例：10"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">築年数</label>
              <input
                name="age"
                type="number"
                value={form.age ?? ''}
                onChange={handleChange}
                placeholder="例：5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
              <select
                name="status"
                value={form.status ?? 'watching'}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="watching">ウォッチ中</option>
                <option value="interested">気になる</option>
                <option value="visited">内覧済み</option>
                <option value="passed">見送り</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">物件URL</label>
              <input
                name="url"
                value={form.url ?? ''}
                onChange={handleChange}
                placeholder="https://suumo.jp/..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">タグ（カンマ区切り）</label>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="例：渋谷, 眺望, 駅近"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
              <textarea
                name="notes"
                value={form.notes ?? ''}
                onChange={handleChange}
                rows={3}
                placeholder="内覧のメモ、気になる点など..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700"
            >
              {initial?.id ? '保存する' : '追加する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
