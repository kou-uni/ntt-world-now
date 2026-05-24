"use client";

import { motion } from "motion/react";
import { EASE_PREMIUM } from "@/lib/motion";

/**
 * 高級感のあるスケルトン。
 * - ベース: subtle gray box
 * - 上を斜め45度のlinear-gradientがゆっくり流れる
 * - 各スケルトンは微妙にdelayをつけて呼吸する
 */
function ShimmerBar({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.5, 0.9, 0.5] }}
      transition={{
        duration: 2.2,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
      className={
        "rounded-sm bg-[var(--border)] " +
        "relative overflow-hidden " +
        className
      }
    >
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          duration: 2.4,
          ease: "linear",
          repeat: Infinity,
          delay,
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--background)]/60 to-transparent"
      />
    </motion.div>
  );
}

function SkeletonCard({ index }: { index: number }) {
  const d = (index % 8) * 0.05;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay: index * 0.025, ease: EASE_PREMIUM }}
      className="flex flex-col gap-2.5 border-b border-[var(--border)] py-4 sm:rounded-lg sm:border sm:px-4 sm:py-4"
    >
      <div className="flex items-center gap-2">
        <ShimmerBar className="h-2.5 w-6" delay={d} />
        <ShimmerBar className="h-2.5 w-12" delay={d + 0.05} />
        <ShimmerBar className="ml-auto h-2.5 w-10" delay={d + 0.1} />
      </div>
      <ShimmerBar className="h-3.5 w-full" delay={d + 0.1} />
      <ShimmerBar className="h-3.5 w-4/5" delay={d + 0.15} />
      <div className="flex gap-1">
        <ShimmerBar className="h-2.5 w-12" delay={d + 0.2} />
        <ShimmerBar className="h-2.5 w-10" delay={d + 0.22} />
      </div>
    </motion.div>
  );
}

export function SkeletonGrid({ count = 16 }: { count?: number }) {
  return (
    <div className="sm:grid sm:grid-cols-2 sm:gap-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <section className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.0, ease: EASE_PREMIUM }}
        className="space-y-3"
      >
        <ShimmerBar className="h-[44px] w-[200px] sm:h-[64px] sm:w-[260px]" />
        <ShimmerBar className="h-3 w-[260px]" delay={0.1} />
      </motion.div>
    </section>
  );
}

export function SkeletonControls() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: EASE_PREMIUM }}
      className="mb-6 space-y-4"
    >
      <ShimmerBar className="h-12 w-full rounded-lg" />
      <div className="flex gap-1.5 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <ShimmerBar
            key={i}
            className="h-9 w-24 shrink-0 rounded-md"
            delay={i * 0.04}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <ShimmerBar
            key={i}
            className="h-7 w-20 rounded-md"
            delay={i * 0.04}
          />
        ))}
      </div>
    </motion.div>
  );
}
