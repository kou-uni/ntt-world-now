import Link from "next/link";

export const metadata = {
  title: "IR・経営戦略 | NTTグループ ニュースダッシュボード",
};

type IrLink = {
  title: string;
  description: string;
  url: string;
};

const HOLDING_IR: IrLink[] = [
  {
    title: "IRトップ(NTT)",
    description: "決算・株主還元・統合報告書など最新IR情報",
    url: "https://group.ntt/jp/ir/",
  },
  {
    title: "決算・財務情報",
    description: "四半期・通期決算短信、決算説明会資料",
    url: "https://group.ntt/jp/ir/library/results/",
  },
  {
    title: "中期経営計画 / 経営戦略",
    description: "新中期経営戦略の説明資料",
    url: "https://group.ntt/jp/ir/management/strategy/",
  },
  {
    title: "統合報告書 / アニュアルレポート",
    description: "最新の統合報告書",
    url: "https://group.ntt/jp/ir/library/annual/",
  },
  {
    title: "IRニュース・適時開示",
    description: "適時開示情報・IRニュースリリース",
    url: "https://group.ntt/jp/ir/news/",
  },
];

const SUBSIDIARY_IR: IrLink[] = [
  {
    title: "NTT東日本 企業情報",
    description: "ニュースリリース・会社概要",
    url: "https://www.ntt-east.co.jp/info/",
  },
  {
    title: "NTT西日本 企業情報",
    description: "ニュースリリース・会社概要",
    url: "https://www.ntt-west.co.jp/info/",
  },
  {
    title: "NTTドコモ IR・投資家情報",
    description: "業績ハイライト・株主向け情報(持株経由)",
    url: "https://group.ntt/jp/ir/",
  },
  {
    title: "NTTドコモビジネス 企業情報",
    description: "ニュースリリース・会社概要",
    url: "https://www.ntt.com/about-us.html",
  },
];

function Card({ link, accent }: { link: IrLink; accent: string }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group block rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
    >
      <div className="flex items-center gap-3">
        <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${accent}`} />
        <h3 className="text-[18px] font-semibold tracking-tight group-hover:underline">
          {link.title}
        </h3>
      </div>
      <p className="mt-2 text-[14px] leading-relaxed text-neutral-600 dark:text-neutral-400">
        {link.description}
      </p>
      <span className="mt-3 inline-flex text-[13px] text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
        公式ページを開く →
      </span>
    </a>
  );
}

export default function IrPage() {
  return (
    <>
      <section className="mb-7">
        <div className="text-[13px] text-neutral-500">
          <Link href="/" className="hover:underline">
            ← ダッシュボードに戻る
          </Link>
        </div>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight">
          IR・経営戦略
        </h1>
        <p className="mt-1.5 text-[15px] text-neutral-600 dark:text-neutral-400">
          NTT(持株会社)のIR情報および各社の企業情報リンク集
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-[20px] font-semibold tracking-tight">
          NTT(持株会社)
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {HOLDING_IR.map((l) => (
            <Card key={l.url} link={l} accent="bg-[#0033A0]" />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-[20px] font-semibold tracking-tight">
          グループ会社
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SUBSIDIARY_IR.map((l) => (
            <Card key={l.url} link={l} accent="bg-neutral-400" />
          ))}
        </div>
      </section>
    </>
  );
}
