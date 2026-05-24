"use client";

import { useState, type ReactNode } from "react";

export type TabDef = {
  id: string;
  label: string;
  description?: string;
  node: ReactNode;
};

export function Tabs({ tabs }: { tabs: TabDef[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="ニュースカテゴリ"
        className="mb-6 flex flex-wrap items-stretch gap-1 rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
      >
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setActive(t.id)}
              className={
                "rounded-xl px-4 py-2 text-[15px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 " +
                (isActive
                  ? "bg-neutral-900 text-white shadow dark:bg-white dark:text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900")
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {current?.description && (
        <p className="mb-4 text-[13.5px] text-neutral-500">{current.description}</p>
      )}

      <div role="tabpanel">{current?.node}</div>
    </div>
  );
}
