import { fetchAll } from "@/lib/fetchers";
import { Dashboard } from "@/components/Dashboard";
import { Hero } from "@/components/Hero";

export const revalidate = false;

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
