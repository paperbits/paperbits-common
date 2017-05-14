import { IPermalink } from "../permalinks/IPermalink";
import { ILinkResolver } from "../permalinks/IPermalinkResolver";
import { IPermalinkService } from "../permalinks/IPermalinkService";
import { INewsService } from "./INewsService";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";

export class NewsPermalinkResolver implements ILinkResolver {
    private readonly permalinkService: IPermalinkService;
    private readonly newsService: INewsService;

    constructor(permalinkService: IPermalinkService, newsService: INewsService) {
        this.permalinkService = permalinkService;
        this.newsService = newsService;
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
        if (!permalink.targetKey.startsWith("news/")) {
            return null;
        }

        let article = await this.newsService.getNewsElementByKey(permalink.targetKey);

        if (!article) {
            return null;
        }

        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = article.title;
        hyperlinkModel.target = target;
        hyperlinkModel.permalinkKey = permalink.key;
        hyperlinkModel.href = permalink.uri;

        return hyperlinkModel;
    }
}