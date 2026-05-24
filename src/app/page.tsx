import { fetchAllGrouped } from "@/lib/fetchers";
import { CompanyColumn } from "@/components/CompanyColumn";
import { RefreshButton } from "@/components/RefreshButton";
import { Tabs, type TabDef } from "@/components/Tabs";
import { formatJpDateTime } from "@/lib/format";
import {
  PRIMARY_SOURCES,
  INTERNATIONAL_SOURCES,
  MEDIA_SOURCES,
  REGULATOR_SOURCES,
  COMPETITOR_SOURCES,
} from "@/lib/sources";
import type { SourceFeed } from "@/lib/types";

export const revalidate = false;

function Grid({
  cols,
  feeds,
  order,
  maxItems,
}: {
  cols: string;
  feeds: SourceFeed[];
  order: { id: string }[];
  maxItems?: number;
}) {
  const byId = new Map(feeds.map((f) => [f.sourceId, f] as const));
  return (
    <div className={`grid grid-cols-1 gap-4 ${cols}`}>
      {order.map((s) => {
        const feed = byId.get(s.id as SourceFeed["sourceId"]);
        if (!feed) return null;
        return <CompanyColumn key={s.id} feed={feed} maxItems={maxItems} />;
      })}
    </div>
  );
}

export default async function HomePage() {
  const grouped = await fetchAllGrouped();
  const fetchedAt =
    [
      ...grouped.primary,
      ...grouped.international,
      ...grouped.media,
      ...grouped.regulator,
      ...grouped.competitor,
    ]
      .map((f) => f.fetchedAt)
      .sort()
      .pop() ?? new Date().toISOString();

  const tabs: TabDef[] = [
    {
      id: "domestic",
      label: "国内主要",
      description: "NTT(持株)・データ・ドコモ・都市開発・東日本・西日本",
      node: (
        <Grid
          cols="md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
          feeds={grouped.primary}
          order={PRIMARY_SOURCES}
        />
      ),
    },
    {
      id: "international",
      label: "国外・関連",
      description: "NTT Globalおよびドコモビジネス(NTT Com事業を含む)",
      node: (
        <Grid
          cols="md:grid-cols-2"
          feeds={grouped.international}
          order={INTERNATIONAL_SOURCES}
        />
      ),
    },
    {
      id: "media",
      label: "メディア・規制",
      description: "メディア報道(Google News)および総務省の発表",
      node: (
        <Grid
          cols="lg:grid-cols-2"
          feeds={[...grouped.media, ...grouped.regulator]}
          order={[...MEDIA_SOURCES, ...REGULATOR_SOURCES]}
          maxItems={12}
        />
      ),
    },
    {
      id: "competitor",
      label: "競合動向",
      description: "KDDI・ソフトバンク・楽天モバイル(各社のメディア報道)",
      node: (
        <Grid
          cols="md:grid-cols-2 lg:grid-cols-3"
          feeds={grouped.competitor}
          order={COMPETITOR_SOURCES}
          maxItems={12}
        />
      ),
    },
  ];

  return (
    <>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[17px] leading-relaxed text-neutral-700 dark:text-neutral-300">
            NTTグループ各社・メディア報道・規制動向・競合の最新ニュースをタブで切り替えて確認できます。
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

      <Tabs tabs={tabs} />
    </>
  );
}
