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

    // public async getUriByPermalink(permalink: PermalinkContract): Promise<string> {
    //     return permalink.uri;
    // }

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
        // else if (permalink.parentKey) {
        //     const parentPermalink = await this.permalinkService.getPermalinkByKey(permalink.parentKey);
        //     const contentItem = await this.contentItemService.getContentItemByKey(parentPermalink.targetKey);

        //     const anchorTitle = contentItem.anchors[permalink.key.replaceAll("/", "|")];

        //     const hyperlinkModel = new HyperlinkModel();
        //     hyperlinkModel.title = `${contentItem.title} > ${anchorTitle}`;
        //     hyperlinkModel.target = target;
        //     hyperlinkModel.permalinkKey = permalink.key;
        //     hyperlinkModel.href = permalink.uri;
        //     hyperlinkModel.type = "anchor";

        //     return hyperlinkModel;
        // }

        return null;
    }
}