import { Contract } from "..";
import { HyperlinkContract } from "../editing/hyperlinkContract";
import { HyperlinkModel } from "./hyperlinkModel";
import { ContentItemContract } from "../contentItems";

export interface IPermalinkResolver {
    canHandleTarget(targetKey: string): boolean;
    getUrlByTargetKey(contentItemKey: string, locale?: string): Promise<string>;
    getHyperlinkFromContract?(hyperlink: HyperlinkContract, locale?: string): Promise<HyperlinkModel>;
    getHyperlinkByTargetKey?(targetKey: string, locale?: string): Promise<HyperlinkModel>;
    getContentByPermalink?(permalink: string, locale?: string): Promise<Contract>;
    getContentItemByPermalink?(permalink: string, locale?: string): Promise<ContentItemContract>;
}