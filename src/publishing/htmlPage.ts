import { OpenGraph } from "./openGraph";
import { PageLinkedData } from "./pageLinkedData";
import { Contract } from "../contract";
import { Bag } from "..";
import { SocialShareData } from "../pages/socialShareData";

export interface HtmlPage {
    title: string;
    keywords?: string;
    description?: string;
    author?: string;
    permalink: string;
    url?: string;
    siteHostName?: string;
    openGraph?: OpenGraph;
    linkedData?: PageLinkedData;
    socialShareData?: SocialShareData;
    faviconPermalink?: string;
    styleReferences: string[];
    content: Contract;
    template: string;
    bindingContext?: Bag<any>;
}
