"use client";

import { motion } from "motion/react";
import { TIERS, type Tier } from "@/lib/types";
import { EASE_PREMIUM } from "@/lib/motion";

type Props = {
  selected: Set<Tier>;
  onToggle: (t: Tier) => void;
  onReset: () => void;
};

export function TierFilter({ selected, onToggle, onReset }: Props) {
  return (
    <div className="mb-7">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="mono-label">メディア種別</span>
        <button
          type="button"
          onClick={onReset}
          className="mono-label transition-colors hover:text-[var(--foreground)] hover:underline"
        >
          リセット
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {TIERS.map((t) => {
          const isOn = selected.has(t.id);
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => onToggle(t.id)}
              title={t.description}
              aria-pressed={isOn}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.3, ease: EASE_PREMIUM }}
              className={
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[14px] font-medium tracking-tight transition-colors duration-300 " +
                (isOn
                  ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]")
              }
              style={
                isOn
                  ? {
                      boxShadow:
                        "0 2px 8px -2px color-mix(in srgb, var(--foreground) 25%, transparent)",
                    }
                  : undefined
              }
            >
              <span className="font-mono text-[11px] font-bold">{t.id}</span>
              <span>{t.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
