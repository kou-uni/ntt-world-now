/**
 * 記事の品質スコアリング
 *
 * score = sourceWeight (0-40)
 *       + brandMatchScore (0-40)
 *       + contextScore (0-20)
 *       - noisePenalty (0-30)
 *
 * 閾値:
 *   - Signal:  score >= 60  (高品質、メイン表示)
 *   - Radar:   30 <= score < 60  (中程度、トレンド把握用)
 *   - Discard: score < 30  (画面に出さない)
 */

import type { NewsItem, Source } from "./types";
import { NTT_BRANDS } from "./sources";

// Tierごとの基礎重み
const TIER_WEIGHT: Record<Source["tier"], number> = {
  T1: 35, // 国際通信社 (Reuters, Bloomberg, AP)
  T2: 30, // 主要紙 (BBC, FT, Nikkei Asia)
  T3: 32, // 業界紙 (Light Reading, Telecoms.com)
  T4: 22, // テック (TechCrunch, The Verge)
  T5: 25, // 投資・金融
  T6: 28, // VC・思想（数は少ないが質高い）
};

// キーワード強度: タイトルに直撃したときの加点
const STRONG_KEYWORDS = new Set(
  [
    ...NTT_BRANDS.core,        // NTT, DOCOMO, NTT DATA, NTT Ltd
    "NTT Docomo",
    "NTT Data",
    "NTT Group",
  ].map((s) => s.toLowerCase())
);

const MEDIUM_KEYWORDS = new Set(
  [
    ...NTT_BRANDS.dataGroup,   // Dimension Data, everis, itelligence, Sapphire
    ...NTT_BRANDS.ltdGroup,    // Arkadin, e-shelter, Netmagic 等
    ...NTT_BRANDS.recent,      // Zero & One 等
    ...NTT_BRANDS.affiliates,  // Globe Telecom
  ].map((s) => s.toLowerCase())
);

const WEAK_KEYWORDS = new Set(
  NTT_BRANDS.vcPortfolio.map((s) => s.toLowerCase())  // 投資先（間接関連）
);

// 業界コンテキストキーワード（タイトル中の存在で加点）
const CONTEXT_KEYWORDS = [
  "5g", "6g", "telecom", "telco", "carrier", "operator",
  "data center", "datacenter", "cloud", "edge",
  "ai", "artificial intelligence", "ml ", "llm",
  "fiber", "optical", "submarine cable", "subsea",
  "iot", "mobile", "wireless", "broadband",
  "cybersecurity", "security", "zero trust",
  "investment", "acquisition", "merger", "ipo", "partnership",
  "earnings", "revenue", "profit",
  "通信", "データセンター", "買収", "出資", "提携", "決算",
];

// タイトル後段のノイズパターン（軽い減点用）
const SOFT_NOISE_PATTERNS: RegExp[] = [
  /opinion/i,
  /editorial/i,
  /sponsored/i,
  /interview/i,
  /analyst/i,
];

export type ArticleQuality = {
  score: number;
  band: "signal" | "radar" | "discard";
  reasons: string[];   // デバッグ用
};

export function scoreArticle(
  item: NewsItem,
  source: Source
): ArticleQuality {
  const title = item.title.toLowerCase();
  const reasons: string[] = [];

  // ① ソース基礎重み
  const sourceWeight = TIER_WEIGHT[source.tier] ?? 20;
  reasons.push(`tier(${source.tier})=+${sourceWeight}`);

  // ② キーワードマッチ強度
  let brandScore = 0;
  let hitStrong = false;
  let hitMedium = false;
  let hitWeak = false;
  let hitCount = 0;

  // matchedBrands を見るのではなく、タイトル全体を見る（タイトルに含まれるか重要）
  for (const kw of STRONG_KEYWORDS) {
    if (title.includes(kw)) {
      hitStrong = true;
      hitCount += 1;
    }
  }
  for (const kw of MEDIUM_KEYWORDS) {
    if (title.includes(kw)) {
      hitMedium = true;
      hitCount += 1;
    }
  }
  for (const kw of WEAK_KEYWORDS) {
    if (title.includes(kw)) {
      hitWeak = true;
    }
  }

  if (hitStrong) {
    brandScore = 40;
    reasons.push("strong-brand+40");
  } else if (hitMedium) {
    brandScore = 30;
    reasons.push("medium-brand+30");
  } else if (hitWeak) {
    brandScore = 12;
    reasons.push("weak-brand+12 (VC portfolio only)");
  } else {
    // タイトルに直接ヒットなし → matchedBrands に頼る
    if ((item.matchedBrands?.length ?? 0) > 0) {
      brandScore = 8;
      reasons.push("body-brand+8");
    }
  }

  // 複数キーワードヒットで微加点
  if (hitCount >= 2) {
    brandScore += 5;
    reasons.push("multi-hit+5");
  }

  // ③ コンテキスト加点
  let contextScore = 0;
  for (const ctx of CONTEXT_KEYWORDS) {
    if (title.includes(ctx)) {
      contextScore += 4;
      if (contextScore >= 20) break;
    }
  }
  if (contextScore > 0) reasons.push(`context+${contextScore}`);

  // ④ 罰点
  let penalty = 0;
  for (const p of SOFT_NOISE_PATTERNS) {
    if (p.test(item.title)) {
      penalty += 5;
    }
  }

  // 古い記事（30日超）は緩く減点
  const ageDays =
    (Date.now() - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays > 60) {
    penalty += 15;
    reasons.push("aged>60d -15");
  } else if (ageDays > 30) {
    penalty += 8;
    reasons.push("aged>30d -8");
  } else if (ageDays > 14) {
    penalty += 3;
  }

  // タイトルが極端に短い (タイトル不全の可能性)
  if (item.title.length < 20) {
    penalty += 10;
    reasons.push("short-title -10");
  }

  if (penalty > 0) reasons.push(`penalty -${penalty}`);

  const score = Math.max(
    0,
    Math.min(100, sourceWeight + brandScore + contextScore - penalty)
  );

  let band: ArticleQuality["band"];
  if (score >= 60) band = "signal";
  else if (score >= 30) band = "radar";
  else band = "discard";

  return { score, band, reasons };
}
