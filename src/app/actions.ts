"use server";

import { revalidateTag } from "next/cache";

export async function refreshFeeds(): Promise<{ ok: true; refreshedAt: string }> {
  revalidateTag("news");
  return { ok: true, refreshedAt: new Date().toISOString() };
}
