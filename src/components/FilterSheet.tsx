"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { EASE_PREMIUM, SPRING_GENTLE } from "@/lib/motion";
import {
  REGIONS,
  TIERS,
  type Region,
  type Tier,
} from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;

  // 状態
  region: Region;
  onRegionChange: (r: Region) => void;
  regionCounts: Partial<Record<Region, number>>;

  tiers: Set<Tier>;
  onTierToggle: (t: Tier) => void;
  onTierReset: () => void;

  freeOnly: boolean;
  onFreeOnlyChange: (b: boolean) => void;

  // 集計
  totalCount: number;
};

const REGION_LABEL: Record<Region, string> = {
  global: "グローバル",
  "north-america": "北米",
  europe: "ヨーロッパ",
  "southeast-asia": "東南アジア",
  "middle-east": "中東",
  africa: "アフリカ",
  "latin-america": "中南米",
  japan: "日本",
};

const REGION_FLAG: Record<Region, string> = {
  global: "🌐",
  "north-america": "🇺🇸",
  europe: "🇪🇺",
  "southeast-asia": "🌏",
  "middle-east": "🕌",
  africa: "🌍",
  "latin-america": "🌎",
  japan: "🇯🇵",
};

export function FilterSheet({
  open,
  onClose,
  region,
  onRegionChange,
  regionCounts,
  tiers,
  onTierToggle,
  onTierReset,
  freeOnly,
  onFreeOnlyChange,
  totalCount,
}: Props) {
  // open中は背面スクロールを止める
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Escapeで閉じる
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* バックドロップ */}
          <motion.button
            type="button"
            aria-label="閉じる"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_PREMIUM }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* シート本体 */}
          <motion.div
            role="dialog"
            aria-label="フィルタ"
            aria-modal="true"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SPRING_GENTLE}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-hidden rounded-t-2xl border-t border-[var(--border)] bg-[var(--background)] shadow-2xl sm:inset-x-auto sm:left-1/2 sm:bottom-auto sm:top-1/2 sm:w-[460px] sm:max-w-[90vw] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border"
          >
            {/* grab handle */}
            <div className="flex justify-center pt-2 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-[var(--border-strong)]" />
            </div>

            {/* ヘッダー */}
            <div className="flex items-center justify-between px-5 py-4 sm:px-6">
              <h2 className="text-[17px] font-semibold tracking-tight">
                フィルタ
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="閉じる"
                className="rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--subtle)] hover:text-[var(--foreground)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* スクロール領域 */}
            <div className="max-h-[calc(88vh-130px)] overflow-y-auto px-5 pb-4 sm:max-h-[60vh] sm:px-6">
              {/* 無料記事のみ */}
              <section className="mb-6">
                <SectionTitle>表示</SectionTitle>
                <SwitchRow
                  active={freeOnly}
                  onChange={onFreeOnlyChange}
                  label="無料記事のみ"
                  hint="ペイウォール (Bloomberg/FT等) を除外"
                />
              </section>

              {/* エリア */}
              <section className="mb-6">
                <SectionTitle>エリア</SectionTitle>
                <div className="grid grid-cols-2 gap-1.5">
                  {REGIONS.map((r) => {
                    const isActive = r.id === region;
                    const count = regionCounts[r.id] ?? 0;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => onRegionChange(r.id)}
                        className={
                          "flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-[14px] font-medium transition-colors " +
                          (isActive
                            ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                            : "border-[var(--border)] hover:border-[var(--border-strong)]")
                        }
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span aria-hidden>{REGION_FLAG[r.id]}</span>
                          <span className="truncate">{REGION_LABEL[r.id]}</span>
                        </span>
                        <span
                          className={
                            "shrink-0 font-mono text-[11px] tabular-nums " +
                            (isActive
                              ? "opacity-70"
                              : "text-[var(--muted-2)]")
                          }
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* メディア種別 */}
              <section className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <SectionTitle as="span">メディア種別</SectionTitle>
                  <button
                    type="button"
                    onClick={onTierReset}
                    className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--foreground)] hover:underline"
                  >
                    全選択
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {TIERS.map((t) => {
                    const isOn = tiers.has(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onTierToggle(t.id)}
                        aria-pressed={isOn}
                        className={
                          "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-[14px] font-medium transition-colors " +
                          (isOn
                            ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                            : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]")
                        }
                      >
                        <span className="font-mono text-[10.5px] font-bold opacity-80">
                          {t.id}
                        </span>
                        <span className="truncate">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* 適用ボタン */}
            <div className="border-t border-[var(--border)] bg-[var(--background)] px-5 py-3 pb-safe sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-[var(--foreground)] py-3.5 text-[15px] font-semibold tracking-tight text-[var(--background)] transition hover:opacity-90"
              >
                <span className="tabular-nums">{totalCount}</span> 件を表示
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SectionTitle({
  children,
  as: As = "h3",
}: {
  children: React.ReactNode;
  as?: "h3" | "span";
}) {
  return (
    <As className="mb-2 block font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
      {children}
    </As>
  );
}

function SwitchRow({
  active,
  onChange,
  label,
  hint,
}: {
  active: boolean;
  onChange: (b: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-[var(--border)] px-4 py-3 transition-colors hover:border-[var(--border-strong)]">
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-medium tracking-tight">{label}</div>
        {hint && (
          <div className="mt-0.5 text-[12.5px] text-[var(--muted)]">{hint}</div>
        )}
      </div>
      <motion.span
        animate={{ backgroundColor: active ? "var(--foreground)" : "var(--border-strong)" }}
        transition={{ duration: 0.3, ease: EASE_PREMIUM }}
        className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full"
      >
        <motion.span
          animate={{ x: active ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
        />
      </motion.span>
      <input
        type="checkbox"
        checked={active}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
    </label>
  );
}
