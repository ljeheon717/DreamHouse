import { areaAnalyses } from './data';
import { AreaAnalysis } from './types';

export interface RankedArea {
  rank: number;
  area: AreaAnalysis;
  score: number;
  growthPct: number;       // 5年人口増加率
  latestNetInflow: number; // 直近年の純流入
  highlight: string;
}

const HIGHLIGHTS: Record<string, string> = {
  yokohama_nishi: 'みなとみらい21の開発継続と人口急増（5年で約12%）',
  kawasaki_nakahara: '武蔵小杉ブランド健在。共働き世帯の流入が首都圏トップ級',
  omiya: '7路線ターミナル＋GCS構想で「東日本の玄関口」として再評価',
  shibuya: '駅周辺再開発が完成期へ。若年層比率41%で勢い継続',
  yokohama_kohoku: '新横浜線開通効果で綱島・日吉エリアの人気が急上昇',
  shinagawa: 'リニア始発駅（2027年）を控え地価・需要とも上昇中',
  koto: '湾岸タワマン人気と子育て世帯流入で人口増が加速',
  kawaguchi: '「赤羽まで8分」のコスパで埼玉県内最大の流入数',
  sumida: 'スカイツリー効果と割安感で下町人気が再燃',
};

// 人気度 = 人口増加の勢い（5年増加率 × 5）+ 将来性（開発スコア × 0.5）
export function rankAreas(limit = 5): RankedArea[] {
  const scored = areaAnalyses.map((area) => {
    const first = area.population[0];
    const last = area.population[area.population.length - 1];
    const growthPct = ((last.total - first.total) / first.total) * 100;
    const score = growthPct * 5 + area.developmentScore * 0.5;
    return {
      area,
      score,
      growthPct,
      latestNetInflow: last.netChange,
      highlight: HIGHLIGHTS[area.areaKey] ?? area.pros[0],
    };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s, i) => ({ ...s, rank: i + 1 }));
}
