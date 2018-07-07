import { IPermalink } from "./IPermalink";
import { HyperlinkContract } from "../editing/hyperlinkContract";
import { HyperlinkModel } from "./hyperlinkModel";

export interface IPermalinkResolver {
    getUriByPermalink(permalink: IPermalink): Promise<string>;
    getUrlByPermalinkKey(permalinkKey: string): Promise<string>;
    getHyperlinkFromConfig?(hyperlink: HyperlinkContract): Promise<HyperlinkModel>;
    getHyperlinkByPermalink?(permalink: IPermalink, target: string): Promise<HyperlinkModel>;
    getHyperlinkByPermalinkKey?(permalinkKey: string): Promise<HyperlinkModel>
}