import { ContentItemContract } from "./../contentItems/contentItemContract";
import { IContentItemService } from "../contentItems";
import { IPermalinkResolver } from "./";
import { HyperlinkContract } from "../editing";
import { HyperlinkModel } from "./hyperlinkModel";

export class PermalinkResolver implements IPermalinkResolver {
    constructor(private readonly contentItemService: IContentItemService) { }

    public async getUrlByContentItemKey(contentItemKey: string): Promise<string> {
        if (!contentItemKey) {
            throw new Error("Permalink key cannot be null or empty.");
        }

        const contentItem = await this.contentItemService.getContentItemByKey(contentItemKey);

        if (!contentItem) {
            throw new Error(`Could not find permalink with key ${contentItemKey}.`);
        }

        return contentItem.permalink;
    }

    public async getHyperlinkByPermalink(contentItem: ContentItemContract, target: string): Promise<HyperlinkModel> {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = contentItem.title;
        hyperlinkModel.target = target;
        hyperlinkModel.targetKey = contentItem.key;
        hyperlinkModel.href = contentItem.permalink;
        hyperlinkModel.type = "page";

        return hyperlinkModel;

        // else if (permalink.parentKey) {
        //     const parentPermalink = await this.permalinkService.getPermalinkByKey(permalink.parentKey);
        //     const page = await this.pageService.getPageByKey(parentPermalink.targetKey);

        //     const anchorTitle = page.anchors[permalink.key.replaceAll("/", "|")];

        //     const hyperlinkModel = new HyperlinkModel();
        //     hyperlinkModel.title = `${page.title} > ${anchorTitle}`;
        //     hyperlinkModel.target = target;
        //     hyperlinkModel.permalinkKey = permalink.key;
        //     hyperlinkModel.href = permalink.uri;
        //     hyperlinkModel.type = "anchor";

        //     return hyperlinkModel;
        // }

        return null;
    }

    public async getHyperlinkFromConfig(hyperlink: HyperlinkContract): Promise<HyperlinkModel> {
        let hyperlinkModel: HyperlinkModel;

        let permalinkKey: string = null;

        if (hyperlink.permalinkKey) {
            permalinkKey = hyperlink.permalinkKey;
        }

        if (permalinkKey) {
            const contentItem = await this.contentItemService.getContentItemByKey(permalinkKey);

            if (contentItem) {
                hyperlinkModel = await this.getHyperlinkByPermalink(contentItem, hyperlink.target);

                if (!hyperlinkModel) {
                    hyperlinkModel = new HyperlinkModel();
                    hyperlinkModel.title = contentItem.title || contentItem.permalink;
                    hyperlinkModel.target = hyperlink.target || "_blank";
                    hyperlinkModel.targetKey = contentItem.key;
                    hyperlinkModel.href = contentItem.permalink;
                    hyperlinkModel.type = "url";
                }

                return hyperlinkModel;
            }
        }

        if (hyperlink.href) {
            hyperlinkModel = new HyperlinkModel();
            hyperlinkModel.title = "External link";
            hyperlinkModel.target = hyperlink.target || "_blank";
            hyperlinkModel.targetKey = null;
            hyperlinkModel.href = hyperlink.href;
            hyperlinkModel.type = "url";

            return hyperlinkModel;
        }

        hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "Unset link";
        hyperlinkModel.target = hyperlink.target || "_blank";
        hyperlinkModel.targetKey = null;
        hyperlinkModel.href = "#";
        hyperlinkModel.type = "url";

        return hyperlinkModel;
    }

    public async getHyperlinkByContentItemKey(contentItemKey: string): Promise<HyperlinkModel> {
        const contentItem = await this.contentItemService.getContentItemByKey(contentItemKey);
        const hyperlink = await this.getHyperlinkByPermalink(contentItem, "blank");

        return hyperlink;
    }
}