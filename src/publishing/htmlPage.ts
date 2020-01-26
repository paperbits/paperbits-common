import { OpenGraph } from "./openGraph";
import { PageStructuredData } from "./structuredData";
import { Contract } from "../contract";

export interface HtmlPage {
    title: string;
    keywords?: string;
    description?: string;
    author?: string;
    permalink: string;
    openGraph?: OpenGraph;
    structuredData?: PageStructuredData;
    faviconPermalink?: string;
    content: Contract;
}
