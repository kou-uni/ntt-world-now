"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, LayoutGroup } from "motion/react";
import { SOURCES } from "@/lib/sources";
import { EASE_PREMIUM, SPRING_GENTLE } from "@/lib/motion";
import {
  type Region,
  type Tier,
  type SourceFeed,
  type NewsItem,
  type QualityBand,
  TIERS,
} from "@/lib/types";
import { SearchBar } from "./SearchBar";
import { NewsCard } from "./NewsCard";
import { FilterSheet } from "./FilterSheet";

const ALL_TIERS: Tier[] = TIERS.map((t) => t.id);

type BandFilter = "signal" | "radar" | "all";

const BAND_TABS: { id: BandFilter; label: string }[] = [
  { id: "signal", label: "重要" },
  { id: "radar", label: "周辺" },
  { id: "all", label: "全部" },
];

const REGION_LABEL_SHORT: Record<Region, string> = {
  global: "グローバル",
  "north-america": "北米",
  europe: "欧州",
  "southeast-asia": "東南ア",
  "middle-east": "中東",
  africa: "アフリカ",
  "latin-america": "中南米",
  japan: "日本",
};

type Props = {
  feeds: SourceFeed[];
};

export function Dashboard({ feeds }: Props) {
  const [band, setBand] = useState<BandFilter>("signal");
  const [region, setRegion] = useState<Region>("global");
  const [tiers, setTiers] = useState<Set<Tier>>(new Set(ALL_TIERS));
  const [query, setQuery] = useState("");
  const [freeOnly, setFreeOnly] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  // localStorage 永続化
  useEffect(() => {
    const saved = window.localStorage.getItem("nww:freeOnly");
    if (saved !== null) setFreeOnly(saved === "1");
  }, []);
  useEffect(() => {
    window.localStorage.setItem("nww:freeOnly", freeOnly ? "1" : "0");
  }, [freeOnly]);

  const sourceById = useMemo(
    () => new Map(SOURCES.map((s) => [s.id, s] as const)),
    []
  );

  const allItems = useMemo<NewsItem[]>(
    () => feeds.flatMap((f) => f.items),
    [feeds]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allItems
      .filter((it) => {
        const src = sourceById.get(it.sourceId);
        if (!src) return false;
        if (band === "signal" && it.band !== "signal") return false;
        if (band === "radar" && it.band !== "radar") return false;
        if (!tiers.has(src.tier)) return false;
        if (src.region !== region) return false;
        if (freeOnly && (src.paywall === "hard" || src.paywall === "soft"))
          return false;
        if (q) {
          const hay = `${it.title} ${src.name} ${src.shortName} ${(it.matchedBrands ?? []).join(" ")}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [allItems, sourceById, band, tiers, region, freeOnly, query]);

  // 各bandの件数（現在のregion/tier/freeOnly反映）
  const bandCounts = useMemo(() => {
    const counts: Record<QualityBand, number> = { signal: 0, radar: 0, discard: 0 };
    for (const it of allItems) {
      const src = sourceById.get(it.sourceId);
      if (!src) continue;
      if (!tiers.has(src.tier)) continue;
      if (src.region !== region) continue;
      if (freeOnly && (src.paywall === "hard" || src.paywall === "soft"))
        continue;
      if (it.band) counts[it.band] += 1;
    }
    return counts;
  }, [allItems, sourceById, tiers, region, freeOnly]);

  // sheet用: regionごとの件数
  const regionCounts = useMemo(() => {
    const counts: Partial<Record<Region, number>> = {};
    for (const it of allItems) {
      const src = sourceById.get(it.sourceId);
      if (!src) continue;
      if (band === "signal" && it.band !== "signal") continue;
      if (band === "radar" && it.band !== "radar") continue;
      if (!tiers.has(src.tier)) continue;
      if (freeOnly && (src.paywall === "hard" || src.paywall === "soft"))
        continue;
      counts[src.region] = (counts[src.region] ?? 0) + 1;
    }
    return counts;
  }, [allItems, sourceById, band, tiers, freeOnly]);

  const toggleTier = (t: Tier) => {
    setTiers((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      if (next.size === 0) return new Set(ALL_TIERS);
      return next;
    });
  };
  const resetTiers = () => setTiers(new Set(ALL_TIERS));

  const viewKey = `${band}|${region}|${[...tiers].sort().join(",")}|${query}|${freeOnly}`;

  const visibleItems = filtered.slice(0, 200);

  // 詳細フィルタが既定状態から変わっているか
  const filtersDirty =
    !freeOnly || tiers.size !== ALL_TIERS.length || region !== "global";

  return (
    <>
      {/* 検索 */}
      <SearchBar value={query} onChange={setQuery} />

      {/* 品質バンドタブ */}
      <div className="mb-3">
        <LayoutGroup id="band-tabs">
          <div className="flex gap-1">
            {BAND_TABS.map((b) => {
              const isActive = b.id === band;
              const count =
                b.id === "all"
                  ? bandCounts.signal + bandCounts.radar
                  : bandCounts[b.id];
              return (
                <motion.button
                  key={b.id}
                  type="button"
                  onClick={() => setBand(b.id)}
                  whileTap={{ scale: 0.97 }}
                  className={
                    "relative flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-[14px] font-medium transition-colors duration-300 " +
                    (isActive
                      ? "border-transparent text-[var(--background)]"
                      : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--border-strong)]")
                  }
                >
                  {isActive && (
                    <motion.span
                      layoutId="band-active-bg"
                      transition={SPRING_GENTLE}
                      className="absolute inset-0 -z-0 rounded-lg bg-[var(--foreground)]"
                      style={{
                        boxShadow:
                          "0 4px 14px -4px color-mix(in srgb, var(--foreground) 35%, transparent)",
                      }}
                    />
                  )}
                  <span className="relative z-10">{b.label}</span>
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

      {/* フィルタ起動バー */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] transition hover:border-[var(--border-strong)]"
        >
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
          <span className="font-medium">フィルタ</span>
          <span className="text-[var(--muted)]">
            · {REGION_LABEL_SHORT[region]}
            {tiers.size < ALL_TIERS.length && ` · T${tiers.size}`}
            {!freeOnly && " · 全媒体"}
          </span>
          {filtersDirty && (
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--foreground)]" />
          )}
        </button>
        <span className="font-mono text-[11.5px] uppercase tracking-[0.12em] tabular-nums text-[var(--muted)]">
          <motion.span
            key={filtered.length}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE_PREMIUM }}
            className="inline-block font-bold text-[var(--foreground)]"
          >
            {filtered.length}
          </motion.span>{" "}
          件
        </span>
      </div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: EASE_PREMIUM }}
            className="border-t border-[var(--border)] py-20 text-center text-[15px] text-[var(--muted)]"
          >
            条件に合うニュースが見つかりません
          </motion.div>
        ) : (
          <motion.div
            key={viewKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: EASE_PREMIUM }}
            className="sm:grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4"
          >
            {visibleItems.map((it, i) => (
              <NewsCard key={it.id} item={it} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        region={region}
        onRegionChange={setRegion}
        regionCounts={regionCounts}
        tiers={tiers}
        onTierToggle={toggleTier}
        onTierReset={resetTiers}
        freeOnly={freeOnly}
        onFreeOnlyChange={setFreeOnly}
        totalCount={filtered.length}
      />
    </>
  );
}
