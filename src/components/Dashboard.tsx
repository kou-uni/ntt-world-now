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
import { RegionTabs } from "./RegionTabs";
import { TierFilter } from "./TierFilter";
import { NewsCard } from "./NewsCard";

const ALL_TIERS: Tier[] = TIERS.map((t) => t.id);

type BandFilter = "signal" | "radar" | "all";

const BAND_TABS: { id: BandFilter; label: string; desc: string }[] = [
  { id: "signal", label: "重要", desc: "NTT直接関連の高品質記事" },
  { id: "radar", label: "周辺", desc: "中程度・関連可能性あり" },
  { id: "all", label: "全部", desc: "重要 + 周辺の両方" },
];

type Props = {
  feeds: SourceFeed[];
};

export function Dashboard({ feeds }: Props) {
  const [band, setBand] = useState<BandFilter>("signal");
  const [region, setRegion] = useState<Region>("global");
  const [tiers, setTiers] = useState<Set<Tier>>(new Set(ALL_TIERS));
  const [query, setQuery] = useState("");
  const [crossRegion, setCrossRegion] = useState(false);
  const [freeOnly, setFreeOnly] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
        if (!crossRegion && src.region !== region) return false;
        if (freeOnly && (src.paywall === "hard" || src.paywall === "soft"))
          return false;
        if (q) {
          const hay = `${it.title} ${src.name} ${src.shortName} ${(it.matchedBrands ?? []).join(" ")}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [allItems, sourceById, band, tiers, region, crossRegion, freeOnly, query]);

  const bandCounts = useMemo(() => {
    const counts: Record<QualityBand, number> = { signal: 0, radar: 0, discard: 0 };
    for (const it of allItems) {
      const src = sourceById.get(it.sourceId);
      if (!src) continue;
      if (!tiers.has(src.tier)) continue;
      if (!crossRegion && src.region !== region) continue;
      if (freeOnly && (src.paywall === "hard" || src.paywall === "soft"))
        continue;
      if (it.band) counts[it.band] += 1;
    }
    return counts;
  }, [allItems, sourceById, tiers, region, crossRegion, freeOnly]);

  const regionCounts = useMemo(() => {
    const counts: Partial<Record<Region, number>> = {};
    const q = query.trim().toLowerCase();
    for (const it of allItems) {
      const src = sourceById.get(it.sourceId);
      if (!src) continue;
      if (band === "signal" && it.band !== "signal") continue;
      if (band === "radar" && it.band !== "radar") continue;
      if (!tiers.has(src.tier)) continue;
      if (freeOnly && (src.paywall === "hard" || src.paywall === "soft"))
        continue;
      if (q) {
        const hay = `${it.title} ${src.name} ${(it.matchedBrands ?? []).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) continue;
      }
      counts[src.region] = (counts[src.region] ?? 0) + 1;
    }
    return counts;
  }, [allItems, sourceById, band, tiers, query, freeOnly]);

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

  const viewKey = `${band}|${crossRegion ? "all" : region}|${[...tiers].sort().join(",")}|${query}|${freeOnly}`;

  const visibleItems = filtered.slice(0, 200);

  // 詳細フィルタが既定状態と違う場合に「ドット」を表示
  const filterDirty =
    !freeOnly ||
    crossRegion ||
    tiers.size !== ALL_TIERS.length ||
    region !== "global";

  return (
    <>
      {/* 検索 (常時) */}
      <SearchBar value={query} onChange={setQuery} />

      {/* 品質バンドタブ (常時) */}
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

      {/* 詳細フィルタトグル */}
      <div className="mb-3 flex items-center justify-between text-[12.5px]">
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <motion.svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: filtersOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: EASE_PREMIUM }}
          >
            <path d="m6 9 6 6 6-6" />
          </motion.svg>
          詳細フィルタ
          {filterDirty && (
            <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--foreground)]" />
          )}
        </button>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] tabular-nums text-[var(--muted)]">
          <motion.span
            key={filtered.length}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE_PREMIUM }}
            className="inline-block font-bold text-[var(--foreground)]"
          >
            {filtered.length}
          </motion.span>{" "}
          / {bandCounts.signal + bandCounts.radar} 件
        </span>
      </div>

      <AnimatePresence initial={false}>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_PREMIUM }}
            className="overflow-hidden"
          >
            <div className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--subtle)] p-4">
              {/* トグル群 */}
              <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2">
                <ToggleChip
                  active={freeOnly}
                  onChange={setFreeOnly}
                  label="🔓 無料記事のみ"
                />
                <ToggleChip
                  active={crossRegion}
                  onChange={setCrossRegion}
                  label="全エリア横断"
                />
              </div>

              <RegionTabs
                active={region}
                counts={regionCounts}
                onChange={setRegion}
                disabled={crossRegion}
              />
              <TierFilter
                selected={tiers}
                onToggle={toggleTier}
                onReset={resetTiers}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </>
  );
}

function ToggleChip({
  active,
  onChange,
  label,
}: {
  active: boolean;
  onChange: (b: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-[var(--muted)] hover:text-[var(--foreground)]">
      <motion.span
        animate={{
          backgroundColor: active ? "rgb(0,0,0)" : "rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.35, ease: EASE_PREMIUM }}
        className={
          "inline-flex h-[18px] w-9 items-center rounded-full border " +
          (active
            ? "border-[var(--foreground)]"
            : "border-[var(--border-strong)]")
        }
      >
        <motion.span
          animate={{
            x: active ? 18 : 3,
            backgroundColor: active ? "var(--background)" : "var(--muted)",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="h-3 w-3 rounded-full"
        />
      </motion.span>
      <input
        type="checkbox"
        checked={active}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      {label}
    </label>
  );
}
