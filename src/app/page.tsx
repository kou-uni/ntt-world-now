import { fetchAll } from "@/lib/fetchers";
import { CompanyColumn } from "@/components/CompanyColumn";
import { RefreshButton } from "@/components/RefreshButton";
import { formatJpDateTime } from "@/lib/format";
import { SOURCES } from "@/lib/sources";

export const revalidate = 3600;

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
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">
            主要5社のニュースを一目で
          </h1>
          <p className="mt-1.5 text-[15px] text-neutral-600 dark:text-neutral-400">
            最終取得: <span className="tabular-nums">{formatJpDateTime(fetchedAt)}</span>
            <span className="ml-2 text-neutral-400">/ 自動更新: 毎時</span>
          </p>
        </div>
        <RefreshButton />
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
