import Link from "next/link";

export const metadata = {
  title: "IR · NTT World",
};

type IrLink = {
  title: string;
  description: string;
  url: string;
};

const HOLDING_IR: IrLink[] = [
  {
    title: "IR Top",
    description: "決算・株主還元・統合報告書など最新IR情報",
    url: "https://group.ntt/jp/ir/",
  },
  {
    title: "決算・財務情報",
    description: "四半期・通期決算短信、決算説明会資料",
    url: "https://group.ntt/jp/ir/library/results/",
  },
  {
    title: "中期経営戦略",
    description: "新中期経営戦略の説明資料・経営方針",
    url: "https://group.ntt/jp/ir/mgt/managementstrategy/",
  },
  {
    title: "統合報告書",
    description: "最新の統合報告書・アニュアルレポート",
    url: "https://group.ntt/jp/ir/library/annual/",
  },
  {
    title: "IRニュース",
    description: "適時開示情報・IRニュースリリース",
    url: "https://group.ntt/jp/ir/news/",
  },
];

const SUBSIDIARY_IR: IrLink[] = [
  {
    title: "NTT東日本",
    description: "ニュースリリース・会社概要",
    url: "https://www.ntt-east.co.jp/info/",
  },
  {
    title: "NTT西日本",
    description: "ニュースリリース・会社概要",
    url: "https://www.ntt-west.co.jp/corporate/",
  },
  {
    title: "NTTドコモ IR",
    description: "業績ハイライト・株主向け情報（持株経由）",
    url: "https://group.ntt/jp/ir/",
  },
  {
    title: "NTTドコモビジネス",
    description: "ニュースリリース・会社概要",
    url: "https://www.ntt.com/about-us.html",
  },
  {
    title: "NTT DATA Group",
    description: "Global press releases / IR",
    url: "https://www.nttdata.com/global/en/news/",
  },
];

function Row({ link }: { link: IrLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex items-center justify-between gap-4 border-b border-[var(--border)] py-3 transition hover:bg-[var(--subtle)] sm:rounded-md sm:border sm:px-4 sm:py-3 sm:hover:border-[var(--foreground)]"
    >
      <div className="min-w-0 flex-1">
        <h3 className="text-[14px] font-medium tracking-tight text-[var(--foreground)] group-hover:underline">
          {link.title}
        </h3>
        <p className="mt-0.5 text-[12px] text-[var(--muted)]">
          {link.description}
        </p>
      </div>
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-[var(--muted)] group-hover:text-[var(--foreground)]"
      >
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
      </svg>
    </a>
  );
}

function Section({ label, links }: { label: string; links: IrLink[] }) {
  return (
    <section className="mb-8">
      <h2 className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-[var(--muted)]">
        {label}
      </h2>
      <div className="sm:grid sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
        {links.map((l) => (
          <Row key={l.url} link={l} />
        ))}
      </div>
    </section>
  );
}

export default function IrPage() {
  return (
    <>
      <div className="mb-5">
        <Link
          href="/"
          className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          ← back
        </Link>
        <h1 className="mt-2 text-[22px] font-semibold tracking-tight sm:text-[26px]">
          IR · 公式
        </h1>
        <p className="mt-1 text-[13px] text-[var(--muted)]">
          NTT持株会社・グループ各社の公式IR・企業情報リンク集
        </p>
      </div>

      <Section label="持株会社" links={HOLDING_IR} />
      <Section label="グループ会社" links={SUBSIDIARY_IR} />
    </>
  );
}
