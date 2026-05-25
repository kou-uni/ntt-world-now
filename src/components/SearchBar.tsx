"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { EASE_PREMIUM } from "@/lib/motion";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="mb-3">
      <motion.div
        animate={{
          borderColor: focused ? "var(--foreground)" : "var(--border)",
          boxShadow: focused
            ? "0 8px 28px -8px color-mix(in srgb, var(--foreground) 18%, transparent)"
            : "0 0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.4, ease: EASE_PREMIUM }}
        className="relative rounded-xl border bg-[var(--background)]"
      >
        <motion.svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{
            color: focused ? "var(--foreground)" : "var(--muted)",
            scale: focused ? 1.08 : 1,
          }}
          transition={{ duration: 0.35, ease: EASE_PREMIUM }}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </motion.svg>
        <input
          type="search"
          inputMode="search"
          enterKeyHint="search"
          placeholder="記事を検索…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-xl bg-transparent py-3.5 pl-12 pr-12 text-[16px] font-normal tracking-tight outline-none placeholder:text-[var(--muted-2)]"
        />
        <AnimatePresence>
          {value && (
            <motion.button
              type="button"
              onClick={() => onChange("")}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2, ease: EASE_PREMIUM }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[var(--muted)] hover:bg-[var(--subtle)] hover:text-[var(--foreground)]"
              aria-label="クリア"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
