"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SOURCES } from "@/lib/sources";
import { EASE_PREMIUM } from "@/lib/motion";
import { type Region, type Tier, type SourceFeed, type NewsItem, TIERS } from "@/lib/types";
import { SearchBar } from "./SearchBar";
import { RegionTabs } from "./RegionTabs";
import { TierFilter } from "./TierFilter";
import { NewsCard } from "./NewsCard";

const ALL_TIERS: Tier[] = TIERS.map((t) => t.id);

type Props = {
  feeds: SourceFeed[];
};

export function Dashboard({ feeds }: Props) {
  const [region, setRegion] = useState<Region>("global");
  const [tiers, setTiers] = useState<Set<Tier>>(new Set(ALL_TIERS));
  const [query, setQuery] = useState("");
  const [crossRegion, setCrossRegion] = useState(false);

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
        if (!tiers.has(src.tier)) return false;
        if (!crossRegion && src.region !== region) return false;
        if (q) {
          const hay = `${it.title} ${src.name} ${src.shortName} ${(it.matchedBrands ?? []).join(" ")}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [allItems, sourceById, tiers, region, crossRegion, query]);

  const regionCounts = useMemo(() => {
    const counts: Partial<Record<Region, number>> = {};
    const q = query.trim().toLowerCase();
    for (const it of allItems) {
      const src = sourceById.get(it.sourceId);
      if (!src) continue;
      if (!tiers.has(src.tier)) continue;
      if (q) {
        const hay = `${it.title} ${src.name} ${(it.matchedBrands ?? []).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) continue;
      }
      counts[src.region] = (counts[src.region] ?? 0) + 1;
    }
    return counts;
  }, [allItems, sourceById, tiers, query]);

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
  const viewKey = `${crossRegion ? "all" : region}|${[...tiers].sort().join(",")}|${query}`;

  const visibleItems = filtered.slice(0, 200);

  return (
    <>
      <SearchBar
        value={query}
        onChange={setQuery}
        crossRegion={crossRegion}
        onToggleCrossRegion={setCrossRegion}
      />

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
