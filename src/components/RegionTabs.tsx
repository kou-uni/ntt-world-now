"use client";

import { motion, LayoutGroup } from "motion/react";
import { REGIONS, type Region } from "@/lib/types";
import { SPRING_GENTLE } from "@/lib/motion";

type Props = {
  active: Region;
  counts: Partial<Record<Region, number>>;
  onChange: (r: Region) => void;
  disabled?: boolean;
};

const CODES: Record<Region, string> = {
  global: "ALL",
  "north-america": "NA",
  europe: "EU",
  "southeast-asia": "SEA",
  "middle-east": "ME",
  africa: "AF",
  "latin-america": "LATAM",
  japan: "JP",
};

const SHORT_LABEL: Record<Region, string> = {
  global: "Global",
  "north-america": "N. America",
  europe: "Europe",
  "southeast-asia": "SE Asia",
  "middle-east": "Middle East",
  africa: "Africa",
  "latin-america": "LATAM",
  japan: "Japan",
};

export function RegionTabs({ active, counts, onChange, disabled }: Props) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="mono-label">region</span>
      </div>
      <LayoutGroup id="region-tabs">
        <div
          role="tablist"
          aria-label="Region"
          className={
            "no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5 sm:-mx-8 sm:px-8 " +
            (disabled ? "pointer-events-none opacity-30" : "")
          }
        >
          {REGIONS.map((r) => {
            const isActive = r.id === active;
            const count = counts[r.id] ?? 0;
            return (
              <motion.button
                key={r.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => onChange(r.id)}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className={
                  "relative flex shrink-0 items-baseline gap-2 rounded-md border px-3 py-2 text-[12.5px] font-light tracking-tight transition-colors duration-300 " +
                  (isActive
                    ? "border-transparent text-[var(--background)]"
                    : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--border-strong)]")
                }
              >
                {isActive && (
                  <motion.span
                    layoutId="region-active-bg"
                    transition={SPRING_GENTLE}
                    className="absolute inset-0 -z-0 rounded-md bg-[var(--foreground)]"
                    style={{
                      boxShadow:
                        "0 4px 14px -4px color-mix(in srgb, var(--foreground) 35%, transparent)",
                    }}
                  />
                )}
                <span className="relative z-10 font-mono text-[10px] font-medium uppercase tracking-[0.15em] opacity-80">
                  {CODES[r.id]}
                </span>
                <span className="relative z-10">{SHORT_LABEL[r.id]}</span>
                {count > 0 && (
                  <span
                    className={
                      "relative z-10 tabular-nums font-mono text-[10px] " +
                      (isActive ? "opacity-60" : "text-[var(--muted-2)]")
                    }
                  >
                    {count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
