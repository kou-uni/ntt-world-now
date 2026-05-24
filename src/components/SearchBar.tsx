"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { EASE_PREMIUM, SPRING_SNAPPY } from "@/lib/motion";

type Props = {
  value: string;
  onChange: (v: string) => void;
  crossRegion: boolean;
  onToggleCrossRegion: (b: boolean) => void;
};

export function SearchBar({ value, onChange, crossRegion, onToggleCrossRegion }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="mb-5">
      <motion.div
        animate={{
          borderColor: focused ? "var(--foreground)" : "var(--border)",
          boxShadow: focused
            ? "0 8px 28px -8px color-mix(in srgb, var(--foreground) 18%, transparent)"
            : "0 0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.4, ease: EASE_PREMIUM }}
        className="relative rounded-lg border bg-transparent"
      >
        <motion.svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{
            color: focused ? "var(--foreground)" : "var(--muted)",
            scale: focused ? 1.08 : 1,
          }}
          transition={{ duration: 0.35, ease: EASE_PREMIUM }}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </motion.svg>
        <input
          type="search"
          inputMode="search"
          enterKeyHint="search"
          placeholder="Search · Dimension Data, Ayar Labs, 買収..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-lg bg-transparent py-3 pl-10 pr-10 text-[14px] font-light tracking-tight outline-none placeholder:font-light placeholder:text-[var(--muted-2)]"
        />
        <AnimatePresence>
          {value && (
            <motion.button
              type="button"
              onClick={() => onChange("")}
              initial={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: EASE_PREMIUM }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--muted)] hover:bg-[var(--subtle)] hover:text-[var(--foreground)]"
              aria-label="Clear"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.label
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="mt-2.5 inline-flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
      >
        <motion.span
          animate={{
            backgroundColor: crossRegion ? "rgb(0,0,0)" : "rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.35, ease: EASE_PREMIUM }}
          className={
            "inline-flex h-[14px] w-7 items-center rounded-full border transition-colors duration-300 " +
            (crossRegion
              ? "border-[var(--foreground)]"
              : "border-[var(--border-strong)]")
          }
        >
          <motion.span
            animate={{
              x: crossRegion ? 14 : 2,
              backgroundColor: crossRegion ? "var(--background)" : "var(--muted)",
            }}
            transition={SPRING_SNAPPY}
            className="h-2.5 w-2.5 rounded-full"
          />
        </motion.span>
        <input
          type="checkbox"
          checked={crossRegion}
          onChange={(e) => onToggleCrossRegion(e.target.checked)}
          className="sr-only"
        />
        cross-region
      </motion.label>
    </div>
  );
}
