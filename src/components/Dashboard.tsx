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

const BAND_TABS: { id: BandFilter; label: string; icon: string; desc: string }[] = [
  {
    id: "signal",
    label: "Signal",
    icon: "🟢",
    desc: "高品質・直接NTT関連 (score≥60)",
  },
  {
    id: "radar",
    label: "Radar",
    icon: "🟡",
    desc: "中程度・関連可能性あり (30≤score<60)",
  },
  { id: "all", label: "全部", icon: "⚪", desc: "Signal + Radar 両方" },
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
  // 既定: ペイウォール記事を除外。クリックしても登録要求で読めないため
  const [freeOnly, setFreeOnly] = useState(true);

  // localStorage で freeOnly の選択を記憶
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
        // 品質バンド
        if (band === "signal" && it.band !== "signal") return false;
        if (band === "radar" && it.band !== "radar") return false;
        // all は signal + radar 両方OK (discardは元から除去済み)
        if (!tiers.has(src.tier)) return false;
        if (!crossRegion && src.region !== region) return false;
        if (freeOnly && (src.paywall === "hard" || src.paywall === "soft")) return false;
        if (q) {
          const hay = `${it.title} ${src.name} ${src.shortName} ${(it.matchedBrands ?? []).join(" ")}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [allItems, sourceById, band, tiers, region, crossRegion, query]);

  // band ごとの件数（バッジ用）
  const bandCounts = useMemo(() => {
    const counts: Record<QualityBand, number> = { signal: 0, radar: 0, discard: 0 };
    for (const it of allItems) {
      const src = sourceById.get(it.sourceId);
      if (!src) continue;
      if (!tiers.has(src.tier)) continue;
      if (!crossRegion && src.region !== region) continue;
      if (it.band) counts[it.band] += 1;
    }
    return counts;
  }, [allItems, sourceById, tiers, region, crossRegion]);

  const regionCounts = useMemo(() => {
    const counts: Partial<Record<Region, number>> = {};
    const q = query.trim().toLowerCase();
    for (const it of allItems) {
      const src = sourceById.get(it.sourceId);
      if (!src) continue;
      if (band === "signal" && it.band !== "signal") continue;
      if (band === "radar" && it.band !== "radar") continue;
      if (!tiers.has(src.tier)) continue;
      if (q) {
        const hay = `${it.title} ${src.name} ${(it.matchedBrands ?? []).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) continue;
      }
      counts[src.region] = (counts[src.region] ?? 0) + 1;
    }
    return counts;
  }, [allItems, sourceById, band, tiers, query]);

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

  // 表示キー（filtered内容が変わったらAnimatePresenceでフェードイン更新）
  const viewKey = `${band}|${crossRegion ? "all" : region}|${[...tiers].sort().join(",")}|${query}`;

  const visibleItems = filtered.slice(0, 200);

  return (
    <>
      <SearchBar
        value={query}
        onChange={setQuery}
        crossRegion={crossRegion}
        onToggleCrossRegion={setCrossRegion}
        freeOnly={freeOnly}
        onToggleFreeOnly={setFreeOnly}
      />

      {/* 品質バンドタブ */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="mono-label">品質</span>
          <span className="font-mono text-[10.5px] text-[var(--muted-2)]">
            {BAND_TABS.find((b) => b.id === band)?.desc}
          </span>
        </div>
        <LayoutGroup id="band-tabs">
          <div className="flex gap-1.5">
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
                    "relative flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-4 py-2.5 text-[14px] font-medium transition-colors duration-300 " +
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
                  <span className="relative z-10">{b.icon}</span>
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

      <RegionTabs
        active={region}
        counts={regionCounts}
        onChange={setRegion}
        disabled={crossRegion}
      />

      <TierFilter selected={tiers} onToggle={toggleTier} onReset={resetTiers} />

      <div className="mb-4 flex items-center justify-between border-t border-[var(--border)] pt-4 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--muted)]">
        <span className="tabular-nums">
          <motion.span
            key={filtered.length}
            initial={{ opacity: 0, y: -3, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: EASE_PREMIUM }}
            className="inline-block font-bold text-[var(--foreground)]"
          >
            {filtered.length}
          </motion.span>{" "}
          件
          {crossRegion ? " · 全エリア" : ""}
        </span>
        <AnimatePresence>
          {query && (
            <motion.span
              initial={{ opacity: 0, x: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 6, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: EASE_PREMIUM }}
              className="truncate font-normal normal-case tracking-tight"
            >
              <span className="text-[var(--muted-2)]">検索:</span>{" "}
              <span className="text-[var(--foreground)]">{query}</span>
            </motion.span>
          )}
        </AnimatePresence>
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
    </>
  );
}
