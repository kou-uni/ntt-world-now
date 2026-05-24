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

const WORDS = ["NTT", "World", "Now"];

function WordReveal({
  word,
  delay,
  reduce,
}: {
  word: string;
  delay: number;
  reduce: boolean | null;
}) {
  return (
    <span className="mr-[0.18em] inline-block overflow-hidden align-baseline pb-[0.08em]">
      <motion.span
        initial={
          reduce
            ? { opacity: 0 }
            : { y: "105%", opacity: 0, filter: "blur(12px)" }
        }
        animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
        transition={{
          duration: DURATION.hero,
          delay,
          ease: EASE_PREMIUM,
        }}
        className="inline-block"
      >
        {word}
      </motion.span>
    </span>
  );
}

export function Hero({ itemCount, sourceCount, fetchedAt, errorCount }: Props) {
  const reduce = useReducedMotion();

  const meta = {
    initial: reduce
      ? { opacity: 0 }
      : { opacity: 0, y: 14, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: DURATION.slow, delay: 0.85, ease: EASE_PREMIUM },
  };

  return (
    <section className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex-1">
        <h1 className="display shimmer-text relative text-[52px] leading-[1.0] sm:text-[80px] md:text-[96px]">
          <WordReveal word={WORDS[0]} delay={0.1} reduce={reduce} />
          <WordReveal word={WORDS[1]} delay={0.22} reduce={reduce} />
          <WordReveal word={WORDS[2]} delay={0.34} reduce={reduce} />
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 1.0,
              ease: EASE_PREMIUM,
            }}
            className="inline-block text-[var(--muted-2)]"
          >
            .
          </motion.span>
        </h1>

        <motion.div
          {...meta}
          className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--muted)] sm:text-[13px]"
        >
          <span>
            <AnimatedNumber
              value={itemCount}
              className="tabular-nums text-[var(--foreground)]"
            />{" "}
            items
          </span>
          <span className="text-[var(--muted-2)]">·</span>
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
              <span className="tabular-nums text-[var(--foreground)]">
                {errorCount} err
              </span>
            </>
          )}
        </motion.div>
      </div>
      <motion.div
        initial={
          reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 8 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.0, ease: EASE_PREMIUM }}
        className="self-start sm:self-end"
      >
        <RefreshButton />
      </motion.div>
    </section>
  );
}
