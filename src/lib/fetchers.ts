import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { SOURCES, getSource, type CompanyId, type Source } from "./sources";
import type { CompanyFeed, NewsItem } from "./types";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const parser = new Parser({
  headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml, */*" },
  timeout: 15000,
});

async function fetchRss(source: Source): Promise<NewsItem[]> {
  const res = await fetch(source.feedUrl, {
    headers: { "User-Agent": UA },
    next: { revalidate: false, tags: ["news", `news:${source.id}`] },
  });
  if (!res.ok) throw new Error(`RSS ${source.feedUrl} -> HTTP ${res.status}`);
  const xml = await res.text();
  const feed = await parser.parseString(xml);
  const items: NewsItem[] = [];
  for (const it of feed.items ?? []) {
    if (!it.link || !it.title) continue;
    const date = it.isoDate || it.pubDate || new Date().toISOString();
    items.push({
      id: `${source.id}:${it.link}`,
      companyId: source.id,
      title: it.title.trim(),
      url: it.link,
      publishedAt: new Date(date).toISOString(),
    });
  }
  return items;
}

function parseJpDate(s: string): string | null {
  const m = s.match(/(20\d{2})[年./-](\d{1,2})[月./-](\d{1,2})/);
  if (!m) return null;
  const [, y, mo, d] = m;
  const iso = new Date(
    Date.UTC(Number(y), Number(mo) - 1, Number(d), 0, 0, 0)
  ).toISOString();
  return iso;
}

function absUrl(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

async function fetchScrape(source: Source): Promise<NewsItem[]> {
  const res = await fetch(source.feedUrl, {
    headers: { "User-Agent": UA },
    next: { revalidate: false, tags: ["news", `news:${source.id}`] },
  });
  if (!res.ok) throw new Error(`HTML ${source.feedUrl} -> HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const items: NewsItem[] = [];
  const seen = new Set<string>();

  // Generic strategy: find blocks that contain a JP date and an <a> link
  // pointing to a news article. Works for both ntt-west and ntt.com.
  const candidates = $("li, dt, dd, tr, div, article").toArray();
  for (const el of candidates) {
    const $el = $(el);
    const text = $el.text();
    const date = parseJpDate(text);
    if (!date) continue;

    const $a = $el.find("a[href]").first();
    if (!$a.length) continue;
    const href = $a.attr("href");
    if (!href) continue;
    if (/^(mailto:|javascript:|#)/i.test(href)) continue;

    const absolute = absUrl(href, source.feedUrl);
    // Filter: link must look like a news article (not a top-level nav link)
    if (!isNewsLink(absolute, source.id)) continue;

    const title = $a
      .text()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/^20\d{2}[年./-]\d{1,2}[月./-]\d{1,2}日?\s*/, "");
    if (!title || title.length < 4) continue;
    if (seen.has(absolute)) continue;
    seen.add(absolute);

    items.push({
      id: `${source.id}:${absolute}`,
      companyId: source.id,
      title,
      url: absolute,
      publishedAt: date,
    });
    if (items.length >= 30) break;
  }
  return items;
}

function isNewsLink(url: string, companyId: CompanyId): boolean {
  if (companyId === "ntt-west") {
    return /ntt-west\.co\.jp\/news\/\d{4}\//.test(url) ||
      /ntt-west\.co\.jp\/news\/.*\.html/.test(url);
  }
  if (companyId === "docomo-business") {
    return /ntt\.com\/about-us\/(press-releases|news-center)\/.*\.html/.test(url);
  }
  return true;
}

export async function fetchCompany(companyId: CompanyId): Promise<CompanyFeed> {
  const source = getSource(companyId);
  const fetchedAt = new Date().toISOString();
  try {
    const items =
      source.feedType === "rss"
        ? await fetchRss(source)
        : await fetchScrape(source);
    items.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return { companyId, items: items.slice(0, 30), fetchedAt };
  } catch (e) {
    return {
      companyId,
      items: [],
      fetchedAt,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function fetchAll(): Promise<CompanyFeed[]> {
  return Promise.all(SOURCES.map((s) => fetchCompany(s.id)));
}
