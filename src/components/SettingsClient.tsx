"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  getApiKey,
  setApiKey,
  removeApiKey,
  maskKey,
  PROVIDER_LABELS,
  PROVIDER_HINTS,
  type Provider,
} from "@/lib/apiKeys";
import { EASE_PREMIUM } from "@/lib/motion";

export function SettingsClient() {
  const [keys, setKeys] = useState<Record<Provider, string | null>>({
    anthropic: null,
    openai: null,
  });
  const [editing, setEditing] = useState<Provider | null>(null);
  const [draft, setDraft] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  const [savedFlash, setSavedFlash] = useState<Provider | null>(null);

  useEffect(() => {
    setKeys({
      anthropic: getApiKey("anthropic"),
      openai: getApiKey("openai"),
    });
  }, []);

  const beginEdit = (p: Provider) => {
    setEditing(p);
    setDraft(keys[p] ?? "");
    setShowRaw(false);
  };

  const save = () => {
    if (!editing) return;
    setApiKey(editing, draft);
    setKeys({ ...keys, [editing]: draft.trim() || null });
    setSavedFlash(editing);
    setEditing(null);
    setTimeout(() => setSavedFlash(null), 1800);
  };

  const remove = (p: Provider) => {
    removeApiKey(p);
    setKeys({ ...keys, [p]: null });
  };

  return (
    <div className="space-y-3">
      {(Object.keys(PROVIDER_LABELS) as Provider[]).map((p) => {
        const current = keys[p];
        const hint = PROVIDER_HINTS[p];
        const isEditing = editing === p;
        return (
          <motion.section
            key={p}
            layout
            transition={{ duration: 0.3, ease: EASE_PREMIUM }}
            className="rounded-xl border border-[var(--border)] p-5"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[16px] font-semibold tracking-tight">
                  {PROVIDER_LABELS[p]}
                </h3>
                <div className="mt-0.5 font-mono text-[11.5px] text-[var(--muted)]">
                  {hint.format}
                </div>
              </div>
              <a
                href={hint.url}
                target="_blank"
                rel="noreferrer noopener"
                className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--foreground)] hover:underline"
              >
                key発行 →
              </a>
            </div>

            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="space-y-3"
                >
                  <input
                    type={showRaw ? "text" : "password"}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={hint.format}
                    autoFocus
                    className="w-full rounded-lg border border-[var(--border-strong)] bg-transparent px-3 py-2.5 font-mono text-[14px] outline-none focus:border-[var(--foreground)]"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={save}
                      className="rounded-md bg-[var(--foreground)] px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--background)] transition hover:opacity-90"
                    >
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="rounded-md border border-[var(--border)] px-4 py-2 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                    >
                      キャンセル
                    </button>
                    <label className="ml-auto inline-flex cursor-pointer items-center gap-1.5 text-[12px] text-[var(--muted)] hover:text-[var(--foreground)]">
                      <input
                        type="checkbox"
                        checked={showRaw}
                        onChange={(e) => setShowRaw(e.target.checked)}
                        className="h-3.5 w-3.5"
                      />
                      表示
                    </label>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className={
                        "font-mono text-[14px] tabular-nums " +
                        (current ? "text-[var(--foreground)]" : "text-[var(--muted-2)]")
                      }
                    >
                      {maskKey(current)}
                    </div>
                    {current && (
                      <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400">
                        ● connected
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => beginEdit(p)}
                      className="rounded-md border border-[var(--border)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] hover:border-[var(--foreground)]"
                    >
                      {current ? "変更" : "+ 追加"}
                    </button>
                    {current && (
                      <button
                        type="button"
                        onClick={() => remove(p)}
                        className="rounded-md border border-[var(--border)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted)] hover:border-red-400 hover:text-red-500"
                      >
                        削除
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {savedFlash === p && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400"
                >
                  ✓ 保存しました
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        );
      })}
    </div>
  );
}
