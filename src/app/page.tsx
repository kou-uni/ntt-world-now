import { fetchAll } from "@/lib/fetchers";
import { CompanyColumn } from "@/components/CompanyColumn";
import { RefreshButton } from "@/components/RefreshButton";
import { formatJpDateTime } from "@/lib/format";
import { SOURCES } from "@/lib/sources";

export const revalidate = false;

export default async function HomePage() {
  const feeds = await fetchAll();
  const fetchedAt =
    feeds
      .map((f) => f.fetchedAt)
      .sort()
      .pop() ?? new Date().toISOString();

  const byId = new Map(feeds.map((f) => [f.companyId, f] as const));

  return (
    <>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[17px] leading-relaxed text-neutral-700 dark:text-neutral-300">
            NTTグループ主要5社の最新ニュースリリースをキャッチアップできます。
          </p>
          <p className="mt-1.5 text-[14px] text-neutral-500">
            最終取得: <span className="tabular-nums">{formatJpDateTime(fetchedAt)}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <RefreshButton />
          <span className="text-[13px] text-neutral-500">
            このボタンを押すと全て最新化されます
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {SOURCES.map((s) => {
          const feed = byId.get(s.id);
          if (!feed) return null;
          return <CompanyColumn key={s.id} feed={feed} />;
        })}
      </div>
    </>
  );
}
