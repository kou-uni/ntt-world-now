import Link from "next/link";
import {
  SOURCES,
  NTT_BRANDS,
  ALL_BRAND_KEYWORDS,
} from "@/lib/sources";
import {
  TIERS,
  REGIONS,
  type Tier,
  type Region,
} from "@/lib/types";
import { PORTFOLIO, UNICORNS } from "@/lib/portfolio";

export const metadata = {
  title: "Sources & Methodology · NTT World Now",
};

const REGION_LABEL: Record<Region, string> = {
  global: "Global",
  "north-america": "N. America",
  europe: "Europe",
  "southeast-asia": "SE Asia",
  "middle-east": "Middle East",
  africa: "Africa",
  "latin-america": "LATAM",
  japan: "Japan",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mono-label mb-3 block">{children}</span>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 text-[22px] font-light tracking-tight sm:text-[26px]">
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 max-w-2xl text-[14px] font-light leading-relaxed text-[var(--muted)]">
      {children}
    </p>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-[var(--border-strong)] bg-[var(--subtle)] px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em]">
      {tier}
    </span>
  );
}

function RegionBadge({ region }: { region: Region }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
      {REGION_LABEL[region]}
    </span>
  );
}

export default function SourcesPage() {
  const byTier = (tier: Tier) => SOURCES.filter((s) => s.tier === tier);
  const byRegion = (r: Region) => SOURCES.filter((s) => s.region === r);

  return (
    <>
      {/* Hero */}
      <section className="mb-12">
        <Link
          href="/"
          className="mono-label hover:text-[var(--foreground)]"
        >
          ← back
        </Link>
        <h1 className="display mt-3 text-[36px] sm:text-[52px]">
          Sources &<br />
          Methodology<span className="text-[var(--muted-2)]">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-[14.5px] font-light leading-relaxed text-[var(--muted)]">
          NTT World Now が「どのメディアを、どんな理屈で集めているか」を明らかにする
          ためのページです。情報源は「Tier（信頼性）× Region（地域）」の2軸タクソノミー
          で分類しています。
        </p>
      </section>

      {/* Why */}
      <section className="mb-14">
        <SectionLabel>01 · purpose</SectionLabel>
        <H2>なぜ作ったか</H2>
        <Lead>
          NTT公式リリースだけを追っていても、グローバルな見え方は掴めません。
          世界各地のメディアが NTTグループ（旧買収企業を含む900社）と
          NTT DOCOMO Ventures の投資先をどう語っているかを横断的に拾うことで、
          「世界の中のNTT」を一望できる状態を作るのが目的です。
          日本も世界の中の一つの地域として並列に扱います。
        </Lead>
      </section>

      {/* Taxonomy */}
      <section className="mb-14">
        <SectionLabel>02 · taxonomy</SectionLabel>
        <H2>2軸の分類モデル</H2>
        <Lead>
          各ソースには「<strong className="text-[var(--foreground)]">Tier</strong>（メディアの種別と信頼性）」と
          「<strong className="text-[var(--foreground)]">Region</strong>（地域）」を必ず付与しています。
          この2軸でフィルタすることで、たとえば「中東の業界専門誌」だけ、
          「VC視点の投稿全部」といった見方ができます。
        </Lead>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--border)] p-5">
            <div className="mono-label">axis 1</div>
            <div className="mt-1 text-[16px] font-medium tracking-tight">
              Tier — 信頼性・特性
            </div>
            <div className="mt-2 text-[13px] font-light leading-relaxed text-[var(--muted)]">
              T1（通信社）から T6（VC・思想）まで6段階。「速報の事実報道」
              「業界の深度」「戦略的視点」など、それぞれ役割が違うので
              全部混ぜずに種別フィルタで切り替えられるようにしています。
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-5">
            <div className="mono-label">axis 2</div>
            <div className="mt-1 text-[16px] font-medium tracking-tight">
              Region — 地域
            </div>
            <div className="mt-2 text-[13px] font-light leading-relaxed text-[var(--muted)]">
              Global / N. America / Europe / SE Asia / Middle East / Africa /
              LATAM / Japan の8区分。それぞれの地域の Google News に
              地域言語と検索クエリで問い合わせ、現地報道を取得します。
            </div>
          </div>
        </div>
      </section>

      {/* Tiers detail */}
      <section className="mb-14">
        <SectionLabel>03 · tiers</SectionLabel>
        <H2>Tier 一覧</H2>
        <Lead>
          各Tierの定義と、現在NTT World Nowで購読している該当ソースです。
        </Lead>

        <div className="space-y-2">
          {TIERS.map((t) => {
            const sources = byTier(t.id);
            return (
              <div
                key={t.id}
                className="rounded-lg border border-[var(--border)] p-4 sm:p-5"
              >
                <div className="mb-2 flex items-baseline gap-2">
                  <TierBadge tier={t.id} />
                  <span className="text-[15px] font-medium tracking-tight">
                    {t.label}
                  </span>
                  <span className="mono-label">
                    {sources.length} sources
                  </span>
                </div>
                <p className="mb-3 text-[13px] font-light text-[var(--muted)]">
                  {t.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sources.map((s) => (
                    <a
                      key={s.id}
                      href={s.homepage}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-baseline gap-1.5 rounded-sm border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 text-[11.5px] font-light transition-colors hover:border-[var(--foreground)]"
                    >
                      <span>{s.name}</span>
                      <RegionBadge region={s.region} />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Regions detail */}
      <section className="mb-14">
        <SectionLabel>04 · regions</SectionLabel>
        <H2>地域カバレッジ</H2>
        <Lead>
          地域別の現地メディア網。各地域で2〜6ソースをカバーしています。
        </Lead>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((r) => {
            const sources = byRegion(r.id);
            return (
              <div
                key={r.id}
                className="rounded-lg border border-[var(--border)] p-4"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-[14px] font-medium tracking-tight">
                    {REGION_LABEL[r.id]}
                  </span>
                  <span className="mono-label">
                    {sources.length} sources
                  </span>
                </div>
                <ul className="mt-2 space-y-1">
                  {sources.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-baseline gap-1.5 text-[12px] font-light"
                    >
                      <TierBadge tier={s.tier} />
                      <span className="truncate text-[var(--muted)]">
                        {s.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* NEW: Portfolio data */}
      <section className="mb-14">
        <SectionLabel>05 · portfolio</SectionLabel>
        <H2>NTT DOCOMO Ventures 投資先データ</H2>
        <Lead>
          165社のポートフォリオを構造化し、
          <Link href="/portfolio" className="underline hover:text-[var(--foreground)]">
            /portfolio
          </Link>
          で閲覧可能。各社のステータス・カテゴリ・地域でフィルタでき、
          NTTグループの戦略動向を投資視点で読み解けます。
        </Lead>

        <div className="grid gap-2 sm:grid-cols-4">
          <div className="rounded-lg border border-[var(--border)] p-4">
            <div className="font-mono text-[28px] font-bold tabular-nums">
              {PORTFOLIO.length}
            </div>
            <div className="mono-label mt-1">total</div>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-4">
            <div className="font-mono text-[28px] font-bold tabular-nums">
              {UNICORNS.length}
            </div>
            <div className="mono-label mt-1">🦄 unicorn</div>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-4">
            <div className="font-mono text-[28px] font-bold tabular-nums">
              {PORTFOLIO.filter((c) => c.status === "ipo").length}
            </div>
            <div className="mono-label mt-1">🏢 ipo</div>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-4">
            <div className="font-mono text-[28px] font-bold tabular-nums">
              {PORTFOLIO.filter((c) => c.status === "acquired").length}
            </div>
            <div className="mono-label mt-1">🤝 acquired</div>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-[var(--muted-2)]">
          データ源: NTT DOCOMO Ventures 公式portfolioページ ({new Date().getFullYear()}年取得)
        </p>
      </section>

      {/* Keywords */}
      <section className="mb-14">
        <SectionLabel>06 · keywords</SectionLabel>
        <H2>検索キーワードの設計</H2>
        <Lead>
          NTTグループは約900社あり、社名に「NTT」を含まない旧買収ブランドが多数あります。
          現地メディアでは旧名で呼ばれ続けるため、これらをOR検索のキーワードに含めています。
          NTT DOCOMO Ventures（165社のポートフォリオ）の主要投資先と、
          資本関係先も網羅対象です。
        </Lead>

        <div className="space-y-3">
          <KeywordBlock
            label="Core"
            description="NTTグループ本体・主要ブランド名"
            items={[...NTT_BRANDS.core]}
          />
          <KeywordBlock
            label="NTT DATA group"
            description="コンサル / SI 系（2021〜2024 にNTT DATAブランドへ統合済）"
            items={[...NTT_BRANDS.dataGroup]}
          />
          <KeywordBlock
            label="NTT Ltd group"
            description="データセンター / ネットワーク / セキュリティ系"
            items={[...NTT_BRANDS.ltdGroup]}
          />
          <KeywordBlock
            label="Recent acquisitions"
            description="2025〜2026 の最新買収"
            items={[...NTT_BRANDS.recent]}
          />
          <KeywordBlock
            label="VC portfolio"
            description="NTT DOCOMO Ventures の主要投資先（ユニコーン7社含む）"
            items={[...NTT_BRANDS.vcPortfolio]}
          />
          <KeywordBlock
            label="Affiliates"
            description="資本関係（出資・大株主）"
            items={[...NTT_BRANDS.affiliates]}
          />
        </div>

        <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.15em] text-[var(--muted)]">
          total {ALL_BRAND_KEYWORDS.length} keywords
        </p>
      </section>

      {/* Reliability criteria */}
      <section className="mb-14">
        <SectionLabel>07 · reliability</SectionLabel>
        <H2>信頼性の判定基準</H2>
        <Lead>
          Tier T1〜T6 の格付けは、以下の5項目で判定しています。
          新しいソースを追加するときも同じ基準で評価しています。
        </Lead>

        <ol className="space-y-2">
          {[
            {
              n: "01",
              label: "編集ガバナンス",
              body: "専属編集者・ファクトチェック体制の有無",
            },
            {
              n: "02",
              label: "一次性",
              body: "自社取材か、転載・要約か",
            },
            {
              n: "03",
              label: "業界専門度",
              body: "テレコム / IT領域の継続取材実績",
            },
            {
              n: "04",
              label: "国際評価",
              body: "IFCN認証、主要報道賞、長期発行歴",
            },
            {
              n: "05",
              label: "独立性",
              body: "広告主・親会社からの編集独立",
            },
          ].map((c) => (
            <li
              key={c.n}
              className="flex items-baseline gap-4 rounded-lg border border-[var(--border)] p-4"
            >
              <span className="font-mono text-[12px] font-medium tabular-nums text-[var(--muted)]">
                {c.n}
              </span>
              <div>
                <div className="text-[14px] font-medium tracking-tight">
                  {c.label}
                </div>
                <div className="mt-0.5 text-[12.5px] font-light text-[var(--muted)]">
                  {c.body}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Footer note */}
      <section className="border-t border-[var(--border)] pt-6">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-[var(--muted)]">
          methodology v1 · {SOURCES.length} sources · {REGIONS.length} regions
          · {TIERS.length} tiers · {ALL_BRAND_KEYWORDS.length} keywords
        </p>
        <p className="mt-2 text-[12px] font-light text-[var(--muted-2)]">
          このメソドロジーは継続的に更新されます。
          追加してほしいソース・キーワードがあれば編集してください。
        </p>
      </section>
    </>
  );
}

function KeywordBlock({
  label,
  description,
  items,
}: {
  label: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-4">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="mono-label text-[var(--foreground)]">{label}</span>
        <span className="mono-label">{items.length} keywords</span>
      </div>
      <p className="mb-2 text-[12.5px] font-light text-[var(--muted)]">
        {description}
      </p>
      <div className="flex flex-wrap gap-1">
        {items.map((k) => (
          <span
            key={k}
            className="rounded-sm border border-[var(--border)] bg-[var(--subtle)] px-1.5 py-0.5 font-mono text-[10.5px] font-light tracking-tight"
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}
