"use client";

import { animate, useMotionValue, useTransform, motion } from "motion/react";
import { useEffect } from "react";
import { EASE_PREMIUM } from "@/lib/motion";

type Props = {
  value: number;
  duration?: number;
  className?: string;
};

export function AnimatedNumber({ value, duration = 1.6, className }: Props) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    const controls = animate(mv, value, {
      duration,
      ease: EASE_PREMIUM,
    });
    return () => controls.stop();
  }, [value, duration, mv]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
