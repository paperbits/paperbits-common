import { OpenGraph } from "./openGraph";
import { PageStructuredData } from "./structuredData";

export interface HtmlPage {
    title: string;
    keywords?: string;
    description?: string;
    author?: string;
    permalink: string;
    openGraph?: OpenGraph;
    structuredData?: PageStructuredData;
    faviconPermalink?: string;
}
