/**
 * モーションの統一プリミティブ。Linear/Vercel/Arcブラウザ系の
 * 「しっとり高級」な感触を出すため、easeとdurationを集約。
 */

// Arc browser / Rauno / Vercel 系で多用される、上品なdecelerationカーブ
export const EASE_PREMIUM = [0.32, 0.72, 0, 1] as const;

// Apple系の overshoot 少なめspring代替
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// 微細なin
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

export const DURATION = {
  micro: 0.18,
  fast: 0.32,
  base: 0.6,
  slow: 0.9,
  intro: 1.1,
  hero: 1.4,
} as const;

// 共通spring（タブインジケーター・トグル等の物理的な動き）
export const SPRING_GENTLE = {
  type: "spring" as const,
  stiffness: 280,
  damping: 32,
  mass: 0.9,
};

export const SPRING_SNAPPY = {
  type: "spring" as const,
  stiffness: 420,
  damping: 36,
  mass: 0.7,
};
