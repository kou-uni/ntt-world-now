"use client";

import { motion, useReducedMotion } from "motion/react";
import { AnimatedNumber } from "./AnimatedNumber";
import { RefreshButton } from "./RefreshButton";
import { formatJpDateTime } from "@/lib/format";
import { EASE_PREMIUM, DURATION } from "@/lib/motion";

type Props = {
  itemCount: number;
  sourceCount: number;
  fetchedAt: string;
  errorCount: number;
};

export function Hero({ itemCount, sourceCount, fetchedAt, errorCount }: Props) {
  const reduce = useReducedMotion();
  const t = (delay: number) => ({
    initial: reduce
      ? { opacity: 0 }
      : { opacity: 0, y: 6, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: DURATION.slow, delay, ease: EASE_PREMIUM },
  });

  return (
    <section className="mb-4 flex items-end justify-between gap-3">
      <motion.div {...t(0)} className="min-w-0 flex-1">
        <h1 className="flex items-baseline gap-2 text-[28px] font-semibold tracking-tight sm:text-[34px]">
          <AnimatedNumber
            value={itemCount}
            className="tabular-nums"
          />
          <span className="text-[14px] font-medium uppercase tracking-[0.12em] text-[var(--muted)] sm:text-[16px]">
            articles
          </span>
        </h1>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--muted)]">
          <span>
            <AnimatedNumber
              value={sourceCount}
              className="tabular-nums text-[var(--foreground)]"
            />{" "}
            sources
          </span>
          <span className="text-[var(--muted-2)]">·</span>
          <span className="tabular-nums">{formatJpDateTime(fetchedAt)}</span>
          {errorCount > 0 && (
            <>
              <span className="text-[var(--muted-2)]">·</span>
              <span className="tabular-nums text-amber-600 dark:text-amber-400">
                {errorCount} err
              </span>
            </>
          )}
        </div>
      </motion.div>
      <motion.div {...t(0.15)} className="shrink-0">
        <RefreshButton />
      </motion.div>
    </section>
  );
}
