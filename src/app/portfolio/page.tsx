import Link from "next/link";
import { PortfolioClient } from "@/components/PortfolioClient";
import { PORTFOLIO, UNICORNS } from "@/lib/portfolio";

export const metadata = {
  title: "Portfolio · NTT World Now",
  description: "NTT DOCOMO Ventures 投資先ポートフォリオ",
};

export default function PortfolioPage() {
  const totalIPO = PORTFOLIO.filter((c) => c.status === "ipo").length;
  const totalAcquired = PORTFOLIO.filter((c) => c.status === "acquired").length;

  return (
    <>
      <section className="mb-8">
        <Link
          href="/"
          className="mono-label hover:text-[var(--foreground)]"
        >
          ← back
        </Link>
        <h1 className="display mt-3 text-[40px] sm:text-[60px]">
          Portfolio<span className="text-[var(--muted-2)]">.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-[var(--muted)]">
          NTT DOCOMO Ventures が
          <span className="font-bold text-[var(--foreground)]">
            {" "}
            {PORTFOLIO.length}社{" "}
          </span>
          に投資中。うちユニコーン
          <span className="font-bold text-[var(--foreground)]">
            {" "}
            {UNICORNS.length}社{" "}
          </span>
          、IPO
          <span className="font-bold text-[var(--foreground)]">
            {" "}
            {totalIPO}社{" "}
          </span>
          、買収済み
          <span className="font-bold text-[var(--foreground)]">
            {" "}
            {totalAcquired}社{" "}
          </span>
          。NTTグループの戦略動向を投資先から読み解きます。
        </p>
      </section>

      <PortfolioClient />
    </>
  );
}
