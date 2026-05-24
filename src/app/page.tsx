import { fetchPrimary, fetchExtended } from "@/lib/fetchers";
import { CompanyColumn } from "@/components/CompanyColumn";
import { RefreshButton } from "@/components/RefreshButton";
import { formatJpDateTime } from "@/lib/format";
import {
  PRIMARY_SOURCES,
  MEDIA_SOURCES,
  REGULATOR_SOURCES,
  COMPETITOR_SOURCES,
} from "@/lib/sources";

export const revalidate = false;

export default async function HomePage() {
  const [primary, extended] = await Promise.all([
    fetchPrimary(),
    fetchExtended(),
  ]);
  const fetchedAt =
    [
      ...primary,
      ...extended.media,
      ...extended.regulator,
      ...extended.competitor,
    ]
      .map((f) => f.fetchedAt)
      .sort()
      .pop() ?? new Date().toISOString();

  const primaryById = new Map(primary.map((f) => [f.sourceId, f] as const));
  const mediaById = new Map(extended.media.map((f) => [f.sourceId, f] as const));
  const regulatorById = new Map(
    extended.regulator.map((f) => [f.sourceId, f] as const)
  );
  const competitorById = new Map(
    extended.competitor.map((f) => [f.sourceId, f] as const)
  );

  return (
    <>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[17px] leading-relaxed text-neutral-700 dark:text-neutral-300">
            NTTグループ各社およびNTT Global(英語)の最新ニュースリリースをキャッチアップできます。
          </p>
          <p className="mt-1.5 text-[14px] text-neutral-500">
            最終取得:{" "}
            <span className="tabular-nums">{formatJpDateTime(fetchedAt)}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <RefreshButton />
          <span className="text-[13px] text-neutral-500">
            このボタンを押すと全て最新化されます
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {PRIMARY_SOURCES.map((s) => {
          const feed = primaryById.get(s.id);
          if (!feed) return null;
          return <CompanyColumn key={s.id} feed={feed} />;
        })}
      </div>

      <div className="mt-12 mb-5 flex items-baseline gap-3 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <h2 className="text-[22px] font-bold tracking-tight">周辺情報</h2>
        <p className="text-[13.5px] text-neutral-500">
          メディア報道・規制動向・競合の動きを俯瞰
        </p>
      </div>

      <section className="mb-8">
        <h3 className="mb-3 text-[15px] font-semibold text-neutral-600 dark:text-neutral-400">
          メディア報道・規制
        </h3>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {MEDIA_SOURCES.map((s) => {
            const feed = mediaById.get(s.id);
            if (!feed) return null;
            return <CompanyColumn key={s.id} feed={feed} maxItems={10} />;
          })}
          {REGULATOR_SOURCES.map((s) => {
            const feed = regulatorById.get(s.id);
            if (!feed) return null;
            return <CompanyColumn key={s.id} feed={feed} maxItems={10} />;
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-[15px] font-semibold text-neutral-600 dark:text-neutral-400">
          競合動向
        </h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {COMPETITOR_SOURCES.map((s) => {
            const feed = competitorById.get(s.id);
            if (!feed) return null;
            return <CompanyColumn key={s.id} feed={feed} maxItems={10} />;
          })}
        </div>
      </section>
    </>
  );
}
