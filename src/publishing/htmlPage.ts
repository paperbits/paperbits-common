import { OpenGraph } from "./openGraph";
import { PageLinkedData } from "./pageLinkedData";
import { Bag } from "..";
import { SocialShareData } from "../pages/socialShareData";
import { LocaleModel } from "../localization";
import { SourceLink } from "./sourceLink";

export interface HtmlPage {
    title: string;
    keywords?: string;
    description?: string;
    author?: string;
    permalink: string;
    url?: string;
    locale?: LocaleModel;
    siteHostName?: string;
    openGraph?: OpenGraph;
    linkedData?: PageLinkedData;
    socialShareData?: SocialShareData;
    faviconPermalink?: string;
    styleReferences: SourceLink[];
    template: string;
    bindingContext?: Bag<any>;
}
