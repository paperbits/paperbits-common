import { IPermalink } from "./IPermalink";
import { IHyperlink } from "./IHyperlink";
import { HyperlinkModel } from "./hyperlinkModel";

export interface ILinkResolver {
    getUriByPermalink(permalink: IPermalink): Promise<string>;
    getUriByPermalinkKey(permalinkKey: string): Promise<string>;
    getHyperlinkFromConfig?(hyperlink: IHyperlink): Promise<HyperlinkModel>;
    getHyperlinkByPermalink?(permalink: IPermalink, target: string): Promise<HyperlinkModel>;
}