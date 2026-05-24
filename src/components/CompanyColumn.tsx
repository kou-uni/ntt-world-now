import type { SourceFeed } from "@/lib/types";
import { getSource } from "@/lib/sources";
import { formatJpDate, daysSince } from "@/lib/format";

type Props = {
  feed: SourceFeed;
  maxItems?: number;
};

export function CompanyColumn({ feed, maxItems = 15 }: Props) {
  const source = getSource(feed.sourceId);
  const items = feed.items.slice(0, maxItems);

  return (
    <section
      className="flex h-full min-w-0 flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
      aria-labelledby={`col-${source.id}`}
    >
      <header className="flex items-center gap-3 border-b border-neutral-100 px-5 py-4 dark:border-neutral-900">
        <span
          aria-hidden
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: source.color }}
        />
        <div className="min-w-0 flex-1">
          <h2
            id={`col-${source.id}`}
            className="truncate text-[18px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
          >
            {source.name}
          </h2>
          <a
            href={source.newsPage}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[12.5px] text-neutral-500 hover:text-neutral-900 hover:underline dark:hover:text-neutral-200"
          >
            一覧を見る →
          </a>
        </div>
      </header>

      {feed.error ? (
        <div className="flex-1 px-5 py-6 text-[14px] text-amber-700 dark:text-amber-400">
          取得に失敗しました。手動更新をお試しください。
          <div className="mt-1 text-[12px] text-neutral-500">{feed.error}</div>
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 px-5 py-6 text-[14px] text-neutral-500">
          表示できるニュースがありません。
        </div>
      ) : (
        <ol className="flex-1 divide-y divide-neutral-100 overflow-hidden dark:divide-neutral-900">
          {items.map((item) => {
            const isNew = daysSince(item.publishedAt) <= 3;
            return (
              <li key={item.id} className="group">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block px-5 py-3.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
                >
                  <div className="flex items-center gap-2 text-[13px] text-neutral-500">
                    <time dateTime={item.publishedAt} className="tabular-nums">
                      {formatJpDate(item.publishedAt)}
                    </time>
                    {isNew && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                        style={{ backgroundColor: source.color }}
                      >
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[15.5px] leading-snug text-neutral-900 group-hover:underline dark:text-neutral-100">
                    {item.title}
                  </p>
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
