import { PermalinkContract } from "../permalinks/permalinkContract";
import { IPermalinkResolver } from "../permalinks/IPermalinkResolver";
import { IPermalinkService } from "../permalinks";
import { IPageService } from "./IPageService";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";

export class PagePermalinkResolver implements IPermalinkResolver {
    private readonly permalinkService: IPermalinkService;
    private readonly pageService: IPageService;

    constructor(permalinkService: IPermalinkService, pageService: IPageService) {
        this.permalinkService = permalinkService;
        this.pageService = pageService;
    }

    public async getUrlByPermalinkKey(permalinkKey: string): Promise<string> {
        let permalink = await this.permalinkService.getPermalinkByKey(permalinkKey);

        if (!permalink) {
            console.warn(`Permalink with key ${permalinkKey} not found.`);
            return null;
        }

        return this.getUriByPermalink(permalink);
    }

    public async getUriByPermalink(permalink: PermalinkContract): Promise<string> {
        return permalink.uri;
    }

    public async getHyperlinkByPermalink(permalink: PermalinkContract, target: string): Promise<HyperlinkModel> {
        if (permalink.targetKey && permalink.targetKey.startsWith("pages/")) {
            const page = await this.pageService.getPageByKey(permalink.targetKey);

            let hyperlinkModel = new HyperlinkModel();
            hyperlinkModel.title = page.title;
            hyperlinkModel.target = target;
            hyperlinkModel.permalinkKey = permalink.key;
            hyperlinkModel.href = permalink.uri;
            hyperlinkModel.type = "page";

            return hyperlinkModel;
        }
        else if (permalink.parentKey) {
            const parentPermalink = await this.permalinkService.getPermalinkByKey(permalink.parentKey);
            const page = await this.pageService.getPageByKey(parentPermalink.targetKey);

            let anchorTitle = page.anchors[permalink.key.replaceAll("/", "|")];

            let hyperlinkModel = new HyperlinkModel();
            hyperlinkModel.title = `${page.title} > ${anchorTitle}`;
            hyperlinkModel.target = target;
            hyperlinkModel.permalinkKey = permalink.key;
            hyperlinkModel.href = permalink.uri;
            hyperlinkModel.type = "anchor";

            return hyperlinkModel;
        }

        return null;
    }
}