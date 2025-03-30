import { type Loader } from "astro/loaders";
import { documentToHtmlString } from "~/utils/contentful-rich-renderer";
import {
  ArticleLoaderSchema,
  DownloadLoaderSchema,
  JobLoaderSchema,
} from "~/loaders/contentful/schemas";
import {
  fetchAllArticles,
  fetchAllDownloads,
  fetchAllJobs,
} from "~/loaders/contentful/utils";

export function contentfulArticleLoader(): Loader {
  return {
    name: "contentful-article-loader",
    async load({ logger, store, parseData }) {
      logger.info("Loading article data from Contentful...");
      const articles = await fetchAllArticles();
      for (const article of articles) {
        const parsedData = await parseData({
          id: article.slug,
          data: article,
        });
        store.set({
          id: article.slug,
          data: parsedData,
          rendered: {
            html: documentToHtmlString(article.content),
          },
        });
      }
    },
    schema: ArticleLoaderSchema,
  };
}

export function contentfulJobLoader(): Loader {
  return {
    name: "contentful-job-loader",
    async load({ logger, store, parseData }) {
      logger.info("Loading job data from Contentful...");

      const jobs = await fetchAllJobs();
      for (const job of jobs) {
        const parsedData = await parseData({
          id: job.slug,
          data: job,
        });
        store.set({
          id: job.slug,
          data: parsedData,
          rendered: {
            html: documentToHtmlString(job.content),
          },
        });
      }
    },
    schema: JobLoaderSchema,
  };
}

export function contentfulDownloadLoader(): Loader {
  return {
    name: "contentful-download-loader",
    async load({ logger, store, parseData }) {
      logger.info("Loading download data from Contentful...");
      const downloads = await fetchAllDownloads();
      for (const download of downloads) {
        const parsedData = await parseData({
          id: download.slug,
          data: download,
        });
        store.set({
          id: download.slug,
          data: parsedData,
          rendered: {
            html: documentToHtmlString(download.content),
          },
        });
      }
    },
    schema: DownloadLoaderSchema,
  };
}
