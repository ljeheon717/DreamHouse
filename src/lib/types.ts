export type PropertyStatus = 'watching' | 'visited' | 'interested' | 'passed';
export type PropertyType = 'mansion' | 'apartment' | 'house' | 'land';

export interface Property {
  id: string;
  name: string;
  address: string;
  area: string; // 東京, 大阪, etc.
  price: number; // 万円
  size: number; // m²
  rooms: string; // 1K, 2LDK, etc.
  floor?: number;
  totalFloors?: number;
  age?: number; // 築年数
  type: PropertyType;
  status: PropertyStatus;
  url?: string;
  notes?: string;
  addedAt: string;
  priceHistory: PricePoint[];
  tags: string[];
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface MarketTrend {
  area: string;
  areaJp: string;
  month: string;
  avgPricePerSqm: number; // 万円/m²
  totalListings: number;
  medianPrice: number; // 万円
}

export interface NewsItem {
  id: string;
  title: string;
  titleJp?: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: 'market' | 'policy' | 'development' | 'tips' | 'interest-rate';
  tags: string[];
}

export interface WatchlistData {
  properties: Property[];
  lastUpdated: string;
}

export interface DashboardStats {
  totalWatching: number;
  avgPrice: number;
  priceChange: number; // % from last month
  newListings: number;
}
