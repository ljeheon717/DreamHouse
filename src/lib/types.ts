export type PropertyStatus = 'watching' | 'visited' | 'interested' | 'passed';
export type PropertyType = 'mansion' | 'apartment' | 'house' | 'land';
export type RiskLevel = 'low' | 'medium' | 'high' | 'unknown';

export interface Property {
  id: string;
  name: string;
  address: string;
  area: string;
  price: number;         // 万円
  size: number;          // m²
  rooms: string;
  floor?: number;
  totalFloors?: number;
  age?: number;          // 築年数
  type: PropertyType;
  status: PropertyStatus;
  url?: string;
  notes?: string;
  addedAt: string;
  priceHistory: PricePoint[];
  tags: string[];
  // location extras
  stationMinutes?: number;   // 駅徒歩分
  stationName?: string;
  managementFee?: number;    // 管理費 (円/月)
  repairFund?: number;       // 修繕積立金 (円/月)
  // risk
  floodRisk?: RiskLevel;
  seismicRisk?: RiskLevel;
  // evaluation
  score?: number;            // 総合スコア 0-100
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface MarketTrend {
  area: string;
  areaJp: string;
  month: string;
  avgPricePerSqm: number;
  totalListings: number;
  medianPrice: number;
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

/* ── Neighborhood / Area Analysis ── */

export interface PopulationPoint {
  year: number;
  total: number;
  inflow: number;
  outflow: number;
  netChange: number;
  under30: number;   // % of total
  over65: number;    // % of total
}

export interface NeighborhoodFacility {
  type: 'school' | 'hospital' | 'supermarket' | 'park' | 'station' | 'nursery' | 'library' | 'gym';
  name: string;
  distanceMin: number;  // 徒歩分
}

export interface AreaAnalysis {
  areaKey: string;
  areaJp: string;
  prefecture: string;
  city: string;
  population: PopulationPoint[];
  avgCommuteMins: number;
  walkScore: number;        // 0-100
  safetyScore: number;      // 0-100 (低犯罪率ほど高い)
  developmentScore: number; // 0-100 (再開発・将来性)
  disasterRiskScore: number;// 0-100 (低リスクほど高い)
  avgRentYield: number;     // % 想定利回り
  facilities: NeighborhoodFacility[];
  futurePlans: string[];
  pros: string[];
  cons: string[];
}

export interface LoanSimulation {
  propertyPrice: number;    // 万円
  downPayment: number;      // 万円
  loanAmount: number;       // 万円
  interestRate: number;     // %
  loanYears: number;
  monthlyPayment: number;   // 万円
  totalPayment: number;     // 万円
  totalInterest: number;    // 万円
}
