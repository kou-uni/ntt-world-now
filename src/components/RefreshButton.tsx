"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { refreshFeeds } from "@/app/actions";
import { useLoading } from "./LoadingProvider";
import { EASE_PREMIUM } from "@/lib/motion";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const { start, end } = useLoading();
  const busy = loading || isPending;

  const onClick = async () => {
    setLoading(true);
    start();
    try {
      await refreshFeeds();
      startTransition(() => router.refresh());
    } finally {
      setLoading(false);
      setTimeout(() => end(), 300);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-busy={busy}
      whileHover={busy ? undefined : { y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25, ease: EASE_PREMIUM }}
      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 font-mono text-[12px] font-bold uppercase tracking-[0.12em] transition-colors hover:border-[var(--foreground)] disabled:opacity-40"
    >
      <motion.svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={busy ? { rotate: 360 } : { rotate: 0 }}
        transition={
          busy
            ? { duration: 1.1, ease: "linear", repeat: Infinity }
            : { duration: 0.4, ease: EASE_PREMIUM }
        }
      >
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 4v5h-5" />
      </motion.svg>
      {busy ? "更新中" : "更新"}
    </motion.button>
  );
}
