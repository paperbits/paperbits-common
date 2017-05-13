import { IPermalink } from "../permalinks/IPermalink";
import { ILinkResolver } from "../permalinks/IPermalinkResolver";
import { IPermalinkService } from "../permalinks/IPermalinkService";
import { IPageService } from "./IPageService";
import { IHyperlink } from "../permalinks/IHyperlink";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";

export class PagePermalinkResolver implements ILinkResolver {
    private readonly permalinkService: IPermalinkService;
    private readonly pageService: IPageService;

    constructor(permalinkService: IPermalinkService, pageService: IPageService) {
        this.permalinkService = permalinkService;
        this.pageService = pageService;
    }

    public async getUriByPermalinkKey(permalinkKey: string): Promise<string> {
        let permalink = await this.permalinkService.getPermalinkByKey(permalinkKey);

        if (!permalink) {
            console.warn(`Permalink with key ${permalinkKey} not found.`);
            return null;
        }

        return this.getUriByPermalink(permalink);
    }

    public async getUriByPermalink(permalink: IPermalink): Promise<string> {
        return permalink.uri;
    }

    public async getHyperlinkByPermalink(permalink: IPermalink, target: string): Promise<HyperlinkModel> {
        if (!permalink.targetKey.startsWith("pages/")) {
            return null;
        }

        let page = await this.pageService.getPageByKey(permalink.targetKey);

        if (!page) {
            return null;
        }

        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = page.title;
        hyperlinkModel.target = target;
        hyperlinkModel.permalinkKey = permalink.key;
        hyperlinkModel.href = permalink.uri;

        return hyperlinkModel;
    }
}