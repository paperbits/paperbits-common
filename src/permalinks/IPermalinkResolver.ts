import { HyperlinkContract } from "../editing/hyperlinkContract";
import { HyperlinkModel } from "./hyperlinkModel";

export interface IPermalinkResolver {
    getUrlByTargetKey(contentItemKey: string): Promise<string>;
    getHyperlinkFromConfig?(hyperlink: HyperlinkContract): Promise<HyperlinkModel>;
    getHyperlinkByTargetKey?(contentItemKey: string): Promise<HyperlinkModel>;
}