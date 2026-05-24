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
  weight: ["300", "400", "500"],
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
  maximumScale: 1,
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
          <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/70 backdrop-blur-2xl pt-safe">
            <HeaderShimmer />
            <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3.5 sm:px-8">
              <Link href="/" className="group flex items-baseline gap-2">
                <span className="font-mono text-[12px] font-medium uppercase tracking-[0.18em] transition-colors group-hover:text-[var(--foreground)]">
                  NTT
                </span>
                <span className="font-mono text-[11px] font-light uppercase tracking-[0.2em] text-[var(--muted)] transition-colors group-hover:text-[var(--foreground)]">
                  World Now
                </span>
              </Link>
              <nav className="flex items-center gap-0.5 font-mono text-[11px] uppercase tracking-[0.15em]">
                <Link
                  href="/"
                  className="rounded-md px-2.5 py-1.5 font-medium hover:bg-[var(--subtle)]"
                >
                  news
                </Link>
                <Link
                  href="/ir"
                  className="rounded-md px-2.5 py-1.5 font-light text-[var(--muted)] hover:bg-[var(--subtle)] hover:text-[var(--foreground)]"
                >
                  ir
                </Link>
                <Link
                  href="/sources"
                  className="rounded-md px-2.5 py-1.5 font-light text-[var(--muted)] hover:bg-[var(--subtle)] hover:text-[var(--foreground)]"
                >
                  sources
                </Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-[1400px] px-5 pb-16 pt-6 sm:px-8 sm:pt-10">
            {children}
          </main>

          <footer className="mx-auto max-w-[1400px] border-t border-[var(--border)] px-5 py-6 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] sm:px-8 pb-safe">
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
