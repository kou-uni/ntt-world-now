"use server";

import { updateTag } from "next/cache";

export async function refreshFeeds(): Promise<{ ok: true; refreshedAt: string }> {
  updateTag("news");
  return { ok: true, refreshedAt: new Date().toISOString() };
}
