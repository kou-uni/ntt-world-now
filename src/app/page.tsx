import { fetchAll } from "@/lib/fetchers";
import { Dashboard } from "@/components/Dashboard";
import { Hero } from "@/components/Hero";

// Vercel デプロイ対策: 静的事前生成を避け、毎リクエスト動的に描画
// (Next.js 16 のビルド出力が静的事前生成だと404になるケースの回避策)
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function HomePage() {
  const feeds = await fetchAll();
  const fetchedAt =
    feeds.map((f) => f.fetchedAt).sort().pop() ?? new Date().toISOString();
  const errorCount = feeds.filter((f) => f.error).length;
  const itemCount = feeds.reduce((sum, f) => sum + f.items.length, 0);
  const sourceCount = feeds.length;

  return (
    <>
      <Hero
        itemCount={itemCount}
        sourceCount={sourceCount}
        fetchedAt={fetchedAt}
        errorCount={errorCount}
      />
      <Dashboard feeds={feeds} />
    </>
  );
}
