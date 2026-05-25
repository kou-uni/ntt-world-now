/**
 * BYOK (Bring Your Own Key) — APIキー管理
 *
 * 設計:
 * - localStorage に保存 (ブラウザ単位、自己責任モデル)
 * - サーバーDBには一切保存しない
 * - Route Handler が Authorization ヘッダー経由で受け取り、外部APIへ転送
 * - サーバー側ログにもキーは出さない
 */

export type Provider = "anthropic" | "openai";

const STORAGE_PREFIX = "ntt-world-now:apikey:";

export function storageKey(provider: Provider): string {
  return `${STORAGE_PREFIX}${provider}`;
}

export function getApiKey(provider: Provider): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(storageKey(provider));
}

export function setApiKey(provider: Provider, key: string): void {
  if (typeof window === "undefined") return;
  if (!key.trim()) {
    window.localStorage.removeItem(storageKey(provider));
    return;
  }
  window.localStorage.setItem(storageKey(provider), key.trim());
}

export function removeApiKey(provider: Provider): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey(provider));
}

/** マスキング表示: sk-ant-...XXXX */
export function maskKey(key: string | null): string {
  if (!key) return "未設定";
  if (key.length < 12) return "•••";
  return `${key.slice(0, 7)}…${key.slice(-4)}`;
}

export const PROVIDER_LABELS: Record<Provider, string> = {
  anthropic: "Anthropic (Claude)",
  openai: "OpenAI",
};

export const PROVIDER_HINTS: Record<Provider, { url: string; format: string }> = {
  anthropic: {
    url: "https://console.anthropic.com/settings/keys",
    format: "sk-ant-... で始まるキー",
  },
  openai: {
    url: "https://platform.openai.com/api-keys",
    format: "sk-... または sk-proj-... で始まるキー",
  },
};
