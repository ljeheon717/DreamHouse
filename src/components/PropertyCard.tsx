'use client';

import { Property, PropertyStatus } from '@/lib/types';
import { ExternalLink, MapPin, Pencil, Trash2, TrendingDown, TrendingUp } from 'lucide-react';

const statusConfig: Record<PropertyStatus, { label: string; color: string }> = {
  watching: { label: 'ウォッチ中', color: 'bg-blue-100 text-blue-700' },
  interested: { label: '気になる', color: 'bg-yellow-100 text-yellow-700' },
  visited: { label: '内覧済み', color: 'bg-green-100 text-green-700' },
  passed: { label: '見送り', color: 'bg-gray-100 text-gray-500' },
};

interface Props {
  property: Property;
  onEdit: (p: Property) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: PropertyStatus) => void;
}

export default function PropertyCard({ property, onEdit, onDelete, onStatusChange }: Props) {
  const status = statusConfig[property.status];
  const priceHistory = property.priceHistory;
  const priceChange =
    priceHistory.length >= 2
      ? priceHistory[priceHistory.length - 1].price - priceHistory[0].price
      : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
              {status.label}
            </span>
            <span className="text-xs text-gray-400">{property.type === 'mansion' ? 'マンション' : property.type === 'house' ? '一戸建て' : property.type === 'apartment' ? 'アパート' : '土地'}</span>
          </div>
          <h3 className="font-semibold text-gray-900 truncate">{property.name}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <MapPin size={12} />
            <span className="truncate">{property.address}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <button
            onClick={() => onEdit(property)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(property.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="font-bold text-gray-900">{property.price.toLocaleString()}</div>
          <div className="text-xs text-gray-500">万円</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="font-bold text-gray-900">{property.size}m²</div>
          <div className="text-xs text-gray-500">{property.rooms}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="font-bold text-gray-900">
            {property.floor ? `${property.floor}F` : '-'}
          </div>
          <div className="text-xs text-gray-500">
            {property.age ? `築${property.age}年` : '新築'}
          </div>
        </div>
      </div>

      {priceChange !== 0 && (
        <div
          className={`flex items-center gap-1 text-xs mb-3 ${
            priceChange < 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {priceChange < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
          <span>
            初回から {priceChange > 0 ? '+' : ''}{priceChange.toLocaleString()}万円
          </span>
        </div>
      )}

      {property.notes && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 bg-gray-50 rounded p-2">
          {property.notes}
        </p>
      )}

      {property.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {property.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <select
          value={property.status}
          onChange={(e) => onStatusChange(property.id, e.target.value as PropertyStatus)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 bg-white"
        >
          <option value="watching">ウォッチ中</option>
          <option value="interested">気になる</option>
          <option value="visited">内覧済み</option>
          <option value="passed">見送り</option>
        </select>
        {property.url && (
          <a
            href={property.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
          >
            <ExternalLink size={12} />
            物件を見る
          </a>
        )}
      </div>
    </div>
  );
}
