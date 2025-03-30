import { createClient } from "contentful";
import {
  ArticleApiResponseSchema,
  JobApiResponseSchema,
  DownloadApiResponseSchema,
} from "~/loaders/contentful/schemas";
import { z } from "astro/zod";

const client = createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});

async function fetchPaginatedArticles(
  skip: number,
  limit: number,
): Promise<z.output<typeof ArticleApiResponseSchema>> {
  let articles;
  try {
    articles = await client.getEntries({
      content_type: "article",
      limit,
      skip,
    });
  } catch (error) {
    throw new Error("Failed to fetch articles from Contentful", {
      cause: error,
    });
  }

  const parsedResponse = ArticleApiResponseSchema.safeParse(articles);

  if (!parsedResponse.success) {
    throw new Error(
      `Failed to parse response from Contentful.\n${parsedResponse.error.issues
        .map((issue) => issue.message)
        .join("\n")}`,
    );
  }

  return parsedResponse.data;
}

async function fetchPaginatedDownloads(
  skip: number,
  limit: number,
): Promise<z.output<typeof DownloadApiResponseSchema>> {
  let downloads;
  try {
    downloads = await client.getEntries({
      content_type: "download",
      limit,
      skip,
    });
  } catch (error) {
    throw new Error("Failed to fetch downloads from Contentful", {
      cause: error,
    });
  }

  const parsedResponse = DownloadApiResponseSchema.safeParse(downloads);

  if (!parsedResponse.success) {
    throw new Error(
      `Failed to parse response from Contentful.\n${parsedResponse.error.issues
        .map((issue) => issue.message)
        .join("\n")}`,
    );
  }
  return parsedResponse.data;
}

export async function fetchPaginatedJobs(
  skip: number,
  limit: number,
): Promise<z.output<typeof JobApiResponseSchema>> {
  let jobs;
  try {
    jobs = await client.getEntries({
      content_type: "job",
      limit,
      skip,
    });
  } catch (error) {
    throw new Error("Failed to fetch jobs from Contentful", {
      cause: error,
    });
  }

  const parsedResponse = JobApiResponseSchema.safeParse(jobs);
  if (!parsedResponse.success) {
    throw new Error(
      `Failed to parse response from Contentful.\n${parsedResponse.error.issues
        .map((issue) => issue.message)
        .join("\n")}`,
    );
  }

  return parsedResponse.data;
}

export async function fetchAllArticles() {
  let limit = 1000;
  let skip = 0;
  let total = 0;
  let entries = [];

  do {
    const data = await fetchPaginatedArticles(skip, limit);
    total = data.total;
    skip += limit;
    entries.push(...data.items);
  } while (skip + limit < total);

  return entries;
}

export async function fetchAllDownloads() {
  let limit = 1000;
  let skip = 0;
  let total = 0;
  let entries = [];

  do {
    const data = await fetchPaginatedDownloads(skip, limit);
    total = data.total;
    skip += limit;
    entries.push(...data.items);
  } while (skip + limit < total);

  return entries;
}

export async function fetchAllJobs() {
  let limit = 1000;
  let skip = 0;
  let total = 0;
  let entries = [];

  do {
    const data = await fetchPaginatedJobs(skip, limit);
    total = data.total;
    skip += limit;
    entries.push(...data.items);
  } while (skip + limit < total);

  return entries;
}
