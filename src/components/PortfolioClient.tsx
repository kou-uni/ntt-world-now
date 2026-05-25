"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import {
  PORTFOLIO,
  CATEGORIES,
  STATUS_LABELS,
  REGION_LABELS,
  type PortfolioCompany,
  type PortfolioCategory,
  type PortfolioStatus,
  type PortfolioRegion,
} from "@/lib/portfolio";
import { EASE_PREMIUM, SPRING_GENTLE } from "@/lib/motion";

type StatusFilter = PortfolioStatus | "all";
type CategoryFilter = PortfolioCategory | "all";
type RegionFilter = PortfolioRegion | "all";

const STATUS_FILTERS: { id: StatusFilter; label: string; count?: number }[] = [
  { id: "all", label: "すべて" },
  { id: "unicorn", label: "🦄 Unicorn" },
  { id: "ipo", label: "🏢 IPO" },
  { id: "active", label: "🚀 Active" },
  { id: "acquired", label: "🤝 Acquired" },
];

export function PortfolioClient() {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [query, setQuery] = useState("");
  const [onlyHighlight, setOnlyHighlight] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PORTFOLIO.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (category !== "all" && c.category !== category) return false;
      if (region !== "all" && c.region !== region) return false;
      if (onlyHighlight && !c.highlight) return false;
      if (q) {
        const hay = `${c.name} ${c.description} ${c.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [status, category, region, onlyHighlight, query]);

  const counts = useMemo(() => {
    const byStatus: Record<string, number> = { all: PORTFOLIO.length };
    for (const c of PORTFOLIO) byStatus[c.status] = (byStatus[c.status] ?? 0) + 1;
    return byStatus;
  }, []);

  return (
    <>
      {/* 検索バー */}
      <div className="mb-5">
        <input
          type="search"
          inputMode="search"
          placeholder="検索 · ElevenLabs, Ayar Labs, AI..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-[16px] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--foreground)]"
        />
      </div>

      {/* ステータスタブ */}
      <div className="mb-4">
        <div className="mono-label mb-2">ステータス</div>
        <LayoutGroup id="portfolio-status">
          <div className="no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5 sm:-mx-8 sm:px-8">
            {STATUS_FILTERS.map((s) => {
              const isActive = s.id === status;
              const count = counts[s.id] ?? 0;
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  onClick={() => setStatus(s.id)}
                  whileTap={{ scale: 0.97 }}
                  className={
                    "relative flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-[14px] font-medium transition-colors duration-300 " +
                    (isActive
                      ? "border-transparent text-[var(--background)]"
                      : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--border-strong)]")
                  }
                >
                  {isActive && (
                    <motion.span
                      layoutId="portfolio-status-bg"
                      transition={SPRING_GENTLE}
                      className="absolute inset-0 -z-0 rounded-lg bg-[var(--foreground)]"
                    />
                  )}
                  <span className="relative z-10">{s.label}</span>
                  <span
                    className={
                      "relative z-10 tabular-nums font-mono text-[11px] " +
                      (isActive ? "opacity-70" : "text-[var(--muted-2)]")
                    }
                  >
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      {/* カテゴリ・地域フィルタ */}
      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mono-label mb-1.5">カテゴリ</div>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as CategoryFilter)
            }
            className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-[14px] outline-none focus:border-[var(--foreground)]"
          >
            <option value="all">すべて</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="mono-label mb-1.5">地域</div>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionFilter)}
            className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-[14px] outline-none focus:border-[var(--foreground)]"
          >
            <option value="all">すべて</option>
            {Object.entries(REGION_LABELS).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="mb-5 inline-flex cursor-pointer items-center gap-2 text-[13px] text-[var(--muted)] hover:text-[var(--foreground)]">
        <input
          type="checkbox"
          checked={onlyHighlight}
          onChange={(e) => setOnlyHighlight(e.target.checked)}
          className="h-4 w-4 rounded border-[var(--border-strong)]"
        />
        ⭐ 注目企業のみ表示
      </label>

      {/* 結果件数 */}
      <div className="mb-3 flex items-center justify-between border-t border-[var(--border)] pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
        <span>
          <span className="font-bold text-[var(--foreground)]">
            {filtered.length}
          </span>{" "}
          / {PORTFOLIO.length} 社
        </span>
      </div>

      {/* カードグリッド */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border-t border-[var(--border)] py-16 text-center text-[14px] text-[var(--muted)]"
          >
            該当する企業が見つかりません
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <CompanyCard key={c.id} company={c} index={i} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

const STATUS_ICON: Record<PortfolioStatus, string> = {
  unicorn: "🦄",
  ipo: "🏢",
  active: "🚀",
  acquired: "🤝",
};

const STATUS_COLOR: Record<PortfolioStatus, string> = {
  unicorn: "border-pink-500 text-pink-600 dark:border-pink-700 dark:text-pink-400",
  ipo: "border-emerald-500 text-emerald-600 dark:border-emerald-700 dark:text-emerald-400",
  active: "border-blue-500 text-blue-600 dark:border-blue-700 dark:text-blue-400",
  acquired: "border-amber-500 text-amber-600 dark:border-amber-700 dark:text-amber-400",
};

function CompanyCard({
  company,
  index,
}: {
  company: PortfolioCompany;
  index: number;
}) {
  const delay = Math.min(index, 20) * 0.02;
  const newsUrl = `https://news.google.com/search?q=${encodeURIComponent(
    company.searchKeywords?.join(" OR ") ?? company.name
  )}&hl=en&gl=US&ceid=US:en`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
      transition={{ duration: 0.6, delay, ease: EASE_PREMIUM }}
      whileHover={{
        y: -3,
        boxShadow:
          "0 10px 30px -10px color-mix(in srgb, var(--foreground) 18%, transparent)",
        transition: { duration: 0.3, ease: EASE_PREMIUM },
      }}
      className="group flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition-colors hover:border-[var(--foreground)]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-semibold tracking-tight text-[var(--foreground)]">
            {company.name}
            {company.highlight && <span className="ml-1.5 text-[12px]">⭐</span>}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--muted)]">
            <span>{company.category}</span>
            <span className="text-[var(--border-strong)]">·</span>
            <span>{REGION_LABELS[company.region]}</span>
          </div>
        </div>
        <span
          className={
            "shrink-0 rounded-md border bg-[var(--background)] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] " +
            STATUS_COLOR[company.status]
          }
        >
          {STATUS_ICON[company.status]} {STATUS_LABELS[company.status]}
        </span>
      </div>

      <p className="text-[13.5px] leading-[1.55] text-[var(--muted)]">
        {company.description}
      </p>

      {company.exitNote && (
        <p className="text-[12px] italic text-[var(--muted-2)]">
          {company.exitNote}
        </p>
      )}

      <div className="mt-auto flex items-center gap-3 border-t border-[var(--border)] pt-2.5 font-mono text-[11px] uppercase tracking-[0.1em]">
        {company.homepage && (
          <a
            href={company.homepage}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)] hover:underline"
          >
            site →
          </a>
        )}
        <a
          href={newsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="ml-auto text-[var(--muted)] transition-colors hover:text-[var(--foreground)] hover:underline"
        >
          news →
        </a>
      </div>
    </motion.article>
  );
}
