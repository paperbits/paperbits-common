import { PermalinkContract } from "../permalinks/permalinkContract";
import { IPermalinkResolver } from "../permalinks";
import { IContentItemService } from "./IContentItemService";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";

export class ContentItemPermalinkResolver implements IPermalinkResolver {
    private readonly contentItemService: IContentItemService;

    constructor(contentItemService: IContentItemService) {
        this.contentItemService = contentItemService;
    }

    public async getUrlByContentItemKey(contentItemKey: string): Promise<string> {
        const contentItem = await this.contentItemService.getContentItemByKey(contentItemKey);

        if (!contentItem) {
            console.warn(`Content item with key ${contentItemKey} not found.`);
            return null;
        }

        return contentItem.permalink;
    }

    public async getHyperlinkByPermalink(permalink: PermalinkContract, target: string): Promise<HyperlinkModel> {
        if (permalink.targetKey && permalink.targetKey.startsWith("contentItems/")) {
            const contentItem = await this.contentItemService.getContentItemByKey(permalink.targetKey);

            const hyperlinkModel = new HyperlinkModel();
            hyperlinkModel.title = contentItem.title;
            hyperlinkModel.target = target;
            hyperlinkModel.targetKey = permalink.key;
            hyperlinkModel.href = permalink.uri;
            hyperlinkModel.type = "contentItem";

            return hyperlinkModel;
        }

        return null;
    }
}