import type { CompanyId } from "./sources";

export type NewsItem = {
  id: string;
  companyId: CompanyId;
  title: string;
  url: string;
  publishedAt: string;
};

export type CompanyFeed = {
  companyId: CompanyId;
  items: NewsItem[];
  fetchedAt: string;
  error?: string;
};
