import { IPermalink } from "../permalinks/IPermalink";
import { IPermalinkResolver } from "../permalinks/IPermalinkResolver";
import { IPermalinkService } from "../permalinks";
import { IUrlService } from "./IUrlService";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";


export class UrlPermalinkResolver implements IPermalinkResolver {
    private readonly permalinkService: IPermalinkService;
    private readonly urlService: IUrlService;

    constructor(permalinkService: IPermalinkService, urlService: IUrlService) {
        this.permalinkService = permalinkService;
        this.urlService = urlService;
    }

    public async getUrlByPermalinkKey(permalinkKey: string): Promise<string> {
        const permalink = await this.permalinkService.getPermalinkByKey(permalinkKey);

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
        if (permalink.targetKey && permalink.targetKey.startsWith("urls/")) {
            const url = await this.urlService.getUrlByKey(permalink.targetKey);

            let hyperlinkModel = new HyperlinkModel();
            hyperlinkModel.title = url.title;
            hyperlinkModel.target = target;
            hyperlinkModel.permalinkKey = permalink.key;
            hyperlinkModel.href = permalink.uri;
            hyperlinkModel.type = "url";

            return hyperlinkModel;
        }

        return null;
    }
}