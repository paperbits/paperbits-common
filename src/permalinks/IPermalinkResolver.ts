import { PermalinkContract } from "./permalinkContract";
import { HyperlinkContract } from "../editing/hyperlinkContract";
import { HyperlinkModel } from "./hyperlinkModel";

export interface IPermalinkResolver {
    getUriByPermalink(permalink: PermalinkContract): Promise<string>;
    getUrlByPermalinkKey(permalinkKey: string): Promise<string>;
    getHyperlinkFromConfig?(hyperlink: HyperlinkContract): Promise<HyperlinkModel>;
    getHyperlinkByPermalink?(permalink: PermalinkContract, target: string): Promise<HyperlinkModel>;
    getHyperlinkByPermalinkKey?(permalinkKey: string): Promise<HyperlinkModel>;
}