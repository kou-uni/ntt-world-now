import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Noto_Sans_JP } from "next/font/google";
import { LoadingProvider } from "@/components/LoadingProvider";
import { TopProgressBar, HeaderShimmer } from "@/components/TopProgressBar";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NTT World Now",
  description:
    "Global news aggregator — NTTグループおよび旧買収企業・VC投資先",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // ユーザーzoomを許可（アクセシビリティ要件）
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${GeistSans.variable} ${GeistMono.variable} ${notoSansJp.variable} h-full`}
    >
      <body className="min-h-full font-sans">
        <LoadingProvider>
          <TopProgressBar />
          <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-2xl pt-safe">
            <HeaderShimmer />
            <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:gap-6 sm:px-8 sm:py-4">
              <Link
                href="/"
                className="group flex shrink-0 items-baseline gap-1.5 whitespace-nowrap"
              >
                <span className="text-[16px] font-bold tracking-tight sm:text-[18px]">
                  NTT
                </span>
                <span className="hidden font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--muted)] sm:inline">
                  / World Now
                </span>
              </Link>
              <nav className="flex flex-1 items-center justify-end gap-0 font-mono text-[11.5px] uppercase tracking-[0.08em] sm:text-[12.5px]">
                <Link
                  href="/"
                  className="rounded-md px-2 py-2 font-bold hover:bg-[var(--subtle)] sm:px-3"
                >
                  news
                </Link>
                <Link
                  href="/portfolio"
                  className="rounded-md px-2 py-2 font-medium text-[var(--muted)] hover:bg-[var(--subtle)] hover:text-[var(--foreground)] sm:px-3"
                >
                  portfolio
                </Link>
                <Link
                  href="/ir"
                  className="rounded-md px-2 py-2 font-medium text-[var(--muted)] hover:bg-[var(--subtle)] hover:text-[var(--foreground)] sm:px-3"
                >
                  ir
                </Link>
                <Link
                  href="/sources"
                  className="rounded-md px-2 py-2 font-medium text-[var(--muted)] hover:bg-[var(--subtle)] hover:text-[var(--foreground)] sm:px-3"
                >
                  src
                </Link>
                <Link
                  href="/settings"
                  aria-label="Settings"
                  className="rounded-md px-2 py-2 text-[var(--muted)] hover:bg-[var(--subtle)] hover:text-[var(--foreground)] sm:px-2.5"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-[1400px] px-5 pb-16 pt-6 sm:px-8 sm:pt-10">
            {children}
          </main>

          <footer className="mx-auto max-w-[1400px] border-t border-[var(--border)] px-5 py-6 font-mono text-[12px] uppercase tracking-[0.15em] text-[var(--muted)] sm:px-8 pb-safe">
            <div className="flex items-center justify-between">
              <span>NTT World Now</span>
              <span className="text-[var(--muted-2)]">
                global news aggregator
              </span>
            </div>
          </footer>
        </LoadingProvider>
      </body>
    </html>
  );
}
