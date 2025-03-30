import { defineCollection } from "astro:content";
import {
  contentfulArticleLoader,
  contentfulDownloadLoader,
  contentfulJobLoader,
} from "./loaders/contentful";

const downloads = defineCollection({
  loader: contentfulDownloadLoader(),
});

const jobs = defineCollection({
  loader: contentfulJobLoader(),
});

const articles = defineCollection({
  loader: contentfulArticleLoader(),
});

export const collections = { jobs, articles, downloads };
