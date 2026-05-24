"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { refreshFeeds } from "@/app/actions";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const busy = loading || isPending;

  const onClick = async () => {
    setLoading(true);
    try {
      await refreshFeeds();
      startTransition(() => router.refresh());
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-[15px] font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 hover:shadow disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      aria-busy={busy}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={busy ? "animate-spin" : ""}
      >
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 4v5h-5" />
      </svg>
      {busy ? "更新中..." : "最新を取得"}
    </button>
  );
}
