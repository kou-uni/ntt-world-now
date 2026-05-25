import Link from "next/link";
import { SettingsClient } from "@/components/SettingsClient";

export const metadata = {
  title: "Settings · NTT World Now",
};

export default function SettingsPage() {
  return (
    <>
      <section className="mb-8">
        <Link href="/" className="mono-label hover:text-[var(--foreground)]">
          ← back
        </Link>
        <h1 className="display mt-3 text-[40px] sm:text-[60px]">
          Settings<span className="text-[var(--muted-2)]">.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-[var(--muted)]">
          AIによる記事分類・要約を有効化するためのAPIキー設定（BYOK / 自己持ち込み）。
          キーはブラウザ内に保存され、サーバーには保存されません。
        </p>
      </section>

      <section className="mb-10">
        <div className="mono-label mb-3">api keys</div>
        <SettingsClient />
      </section>

      <section className="mb-12 rounded-xl border border-[var(--border)] bg-[var(--subtle)] p-5">
        <h2 className="mb-2 text-[16px] font-semibold tracking-tight">
          🔒 セキュリティ・プライバシー
        </h2>
        <ul className="space-y-1.5 text-[13px] leading-relaxed text-[var(--muted)]">
          <li>
            • APIキーは <strong>ブラウザの localStorage</strong>{" "}
            にのみ保存されます。サーバー（Vercel）には一切保存されません
          </li>
          <li>
            • AI分類リクエスト時は、Route Handler（サーバー）が
            <code className="mx-1 rounded bg-[var(--background)] px-1.5 py-0.5 font-mono text-[12px]">
              Authorization
            </code>
            ヘッダーで鍵を受け取り、外部API（Anthropic / OpenAI）に転送します
          </li>
          <li>• サーバーのログには鍵が出力されません</li>
          <li>
            • 別ブラウザ・別端末からは鍵が見えません（端末ごとに登録が必要）
          </li>
          <li>
            • 不要になったら「削除」で localStorage から完全に消去できます
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <div className="mono-label mb-3">使い道（実装中）</div>
        <div className="space-y-2">
          {[
            {
              title: "記事の自動分類",
              desc: "M&A / 提携 / 技術発表 / 業績 / 規制 / 人事 等のカテゴリを自動判定",
            },
            {
              title: "NTT関連度の精密スコアリング",
              desc: "本文（or タイトル+スニペット）から 0-100 の関連度を判定。Radar の記事を Signal に昇格させる",
            },
            {
              title: "30字 要約",
              desc: "各記事に日本語の要約を生成。タイトルだけでは分からないニュアンスを補完",
            },
            {
              title: "ステークホルダー影響度",
              desc: "高/中/低でビジネスインパクトを判定",
            },
          ].map((u) => (
            <div
              key={u.title}
              className="rounded-lg border border-[var(--border)] p-4"
            >
              <div className="text-[14px] font-medium tracking-tight">
                {u.title}
              </div>
              <div className="mt-0.5 text-[12.5px] text-[var(--muted)]">
                {u.desc}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--muted-2)]">
          現状: キー入力UIのみ。AI分類本体は次フェーズで実装予定
        </p>
      </section>
    </>
  );
}
