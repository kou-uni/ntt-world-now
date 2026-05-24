"use client";

import { AnimatePresence, motion, useAnimation } from "motion/react";
import { useEffect } from "react";
import { useLoading } from "./LoadingProvider";
import { EASE_PREMIUM } from "@/lib/motion";

/**
 * 上部に走る1pxのプログレスバー。
 * - 表示開始で 0 → 70% を素早く
 * - 70% → 90% をゆっくり（indeterminate感）
 * - 完了で 90% → 100% → フェードアウト
 * YouTube/Vercel のナビゲーションバー風。
 */
export function TopProgressBar() {
  const { loading } = useLoading();
  const controls = useAnimation();

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (loading) {
        await controls.start({
          width: "70%",
          opacity: 1,
          transition: { duration: 0.5, ease: EASE_PREMIUM },
        });
        if (cancelled) return;
        await controls.start({
          width: "90%",
          transition: { duration: 6, ease: "easeOut" },
        });
      } else {
        await controls.start({
          width: "100%",
          transition: { duration: 0.25, ease: EASE_PREMIUM },
        });
        if (cancelled) return;
        await controls.start({
          opacity: 0,
          transition: { duration: 0.35, ease: "easeOut" },
        });
        if (cancelled) return;
        await controls.set({ width: "0%" });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [loading, controls]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px"
    >
      <motion.div
        initial={{ width: "0%", opacity: 0 }}
        animate={controls}
        className="h-full bg-gradient-to-r from-transparent via-[var(--foreground)] to-transparent"
        style={{
          boxShadow:
            "0 0 8px 0 color-mix(in srgb, var(--foreground) 30%, transparent)",
        }}
      />
    </div>
  );
}

/**
 * ヘッダー直下に出る、永続シマー（ローディング状態時のみ）。
 * バーよりさらにsubtle。
 */
export function HeaderShimmer() {
  const { loading } = useLoading();
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-x-0 -bottom-px h-px overflow-hidden"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              duration: 1.8,
              ease: "linear",
              repeat: Infinity,
            }}
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-[var(--foreground)] to-transparent opacity-40"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
