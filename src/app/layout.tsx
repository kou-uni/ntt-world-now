import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NTTグループ ニュースダッシュボード",
  description:
    "NTT・NTT東日本・NTT西日本・NTTドコモ・NTTドコモビジネスの最新ニュース・経営情報を俯瞰",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJp.variable} h-full antialiased`}>
      <body className="min-h-full bg-neutral-50 font-sans text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <header className="border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-900 dark:bg-neutral-950/80">
          <div className="mx-auto flex max-w-[1760px] items-center justify-between px-8 py-5">
            <Link href="/" className="flex items-center gap-3">
              <span className="inline-block h-7 w-1.5 rounded-full bg-[#0033A0]" />
              <span className="text-[20px] font-bold tracking-tight">
                NTTグループ ニュースダッシュボード
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-[15px] font-medium text-neutral-600 dark:text-neutral-300">
              <Link href="/" className="hover:text-neutral-900 dark:hover:text-white">
                ニュース
              </Link>
              <Link href="/ir" className="hover:text-neutral-900 dark:hover:text-white">
                IR・経営戦略
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-[1760px] px-8 py-8">{children}</main>
        <footer className="mx-auto max-w-[1760px] px-8 pb-10 pt-4 text-[13px] text-neutral-500">
          各社の公式ニュースリリースおよびIRページから取得した情報を表示しています。
        </footer>
      </body>
    </html>
  );
}
