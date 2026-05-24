"use client";

import { motion, useReducedMotion } from "motion/react";
import type { NewsItem } from "@/lib/types";
import { getSource } from "@/lib/sources";
import { formatJpDate, daysSince } from "@/lib/format";
import { EASE_PREMIUM } from "@/lib/motion";

type Props = {
  item: NewsItem;
  index: number;
};

export function NewsCard({ item, index }: Props) {
  const source = getSource(item.sourceId);
  const isNew = daysSince(item.publishedAt) <= 3;
  const reduce = useReducedMotion();

  const delay = reduce ? 0 : Math.min(index, 20) * 0.022;

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noreferrer noopener"
      layout
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y: 12, filter: "blur(6px)" }
      }
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, filter: "blur(4px)" }}
      transition={{
        duration: 0.8,
        delay,
        ease: EASE_PREMIUM,
      }}
      whileHover={
        reduce
          ? undefined
          : {
              y: -3,
              boxShadow:
                "0 10px 30px -10px color-mix(in srgb, var(--foreground) 18%, transparent)",
              transition: { duration: 0.4, ease: EASE_PREMIUM },
            }
      }
      className="group relative flex flex-col gap-2.5 border-b border-[var(--border)] py-4 transition-colors duration-300 hover:bg-[var(--subtle)] sm:rounded-lg sm:border sm:px-4 sm:py-4 sm:hover:border-[var(--foreground)]"
    >
      <div className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.15em] text-[var(--muted)]">
        <span className="font-medium text-[var(--foreground)]">
          {source.tier}
        </span>
        <span className="text-[var(--border-strong)]">/</span>
        <span className="truncate font-light">{source.shortName}</span>
        <span className="text-[var(--border-strong)]">·</span>
        <time
          dateTime={item.publishedAt}
          className="tabular-nums shrink-0 font-light"
        >
          {formatJpDate(item.publishedAt)}
        </time>
        {isNew && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: delay + 0.35,
              duration: 0.55,
              ease: EASE_PREMIUM,
            }}
            className="ml-auto rounded-sm bg-[var(--foreground)] px-1 py-px text-[9px] font-medium text-[var(--background)]"
            style={{
              boxShadow:
                "0 0 12px -2px color-mix(in srgb, var(--foreground) 50%, transparent)",
            }}
          >
            NEW
          </motion.span>
        )}
      </div>

      <p className="text-[14.5px] font-normal leading-[1.45] tracking-tight text-[var(--foreground)] transition-colors duration-300 group-hover:underline group-hover:decoration-[var(--muted-2)] group-hover:underline-offset-2 sm:text-[14px]">
        {item.title}
      </p>

      {item.matchedBrands && item.matchedBrands.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.matchedBrands.slice(0, 4).map((b, bi) => (
            <motion.span
              key={b}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: delay + 0.4 + bi * 0.04,
                duration: 0.5,
                ease: EASE_PREMIUM,
              }}
              className="rounded-sm border border-[var(--border)] px-1.5 py-0.5 font-mono text-[9px] font-light uppercase tracking-[0.12em] text-[var(--muted)] transition-colors duration-300 group-hover:border-[var(--border-strong)] group-hover:text-[var(--foreground)]"
            >
              {b}
            </motion.span>
          ))}
        </div>
      )}
    </motion.a>
  );
}
