import { OpenGraph } from "./openGraph";
import { PageStructuredData } from "./structuredData";
import { Contract } from "../contract";
import { Bag } from "..";

export interface HtmlPage {
    title: string;
    keywords?: string;
    description?: string;
    author?: string;
    permalink: string;
    openGraph?: OpenGraph;
    structuredData?: PageStructuredData;
    faviconPermalink?: string;
    styleReferences?: string[];
    content: Contract;
    bindingContext?: Bag<any>;
}
