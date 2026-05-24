import type { SourceId } from "./sources";

export type NewsItem = {
  id: string;
  sourceId: SourceId;
  title: string;
  url: string;
  publishedAt: string;
};

export type SourceFeed = {
  sourceId: SourceId;
  items: NewsItem[];
  fetchedAt: string;
  error?: string;
};

// Backwards-compat
export type CompanyFeed = SourceFeed & { companyId: SourceId };
