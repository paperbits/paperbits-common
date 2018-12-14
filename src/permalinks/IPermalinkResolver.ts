import { HyperlinkContract } from "../editing/hyperlinkContract";
import { HyperlinkModel } from "./hyperlinkModel";

export interface IPermalinkResolver {
    getUrlByContentItemKey(contentItemKey: string): Promise<string>;
    getHyperlinkFromConfig?(hyperlink: HyperlinkContract): Promise<HyperlinkModel>;
    getHyperlinkByContentItemKey?(permalinkKey: string): Promise<HyperlinkModel>;
}