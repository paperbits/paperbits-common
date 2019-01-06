import { ContentItemContract } from "./../contentItems/contentItemContract";
import { IContentItemService } from "../contentItems";
import { IPermalinkResolver } from "./";
import { HyperlinkContract } from "../editing";
import { HyperlinkModel } from "./hyperlinkModel";

export class PermalinkResolver implements IPermalinkResolver {
    constructor(private readonly contentItemService: IContentItemService) { }

    public async getUrlByTargetKey(targetKey: string): Promise<string> {
        if (!targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        const contentItem = await this.contentItemService.getContentItemByKey(targetKey);

        if (!contentItem) {
            throw new Error(`Could not find permalink with key ${targetKey}.`);
        }

        return contentItem.permalink;
    }

    public async getHyperlinkByContentType(contentItem: ContentItemContract, target: string): Promise<HyperlinkModel> {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = contentItem.title;
        hyperlinkModel.target = target;
        hyperlinkModel.targetKey = contentItem.key;
        hyperlinkModel.href = contentItem.permalink;
        hyperlinkModel.type = "page";

        return hyperlinkModel;
    }

    public async getHyperlinkFromConfig(hyperlinkContract: HyperlinkContract): Promise<HyperlinkModel> {
        let hyperlinkModel: HyperlinkModel;

        if (hyperlinkContract.targetKey) {
            const contentItem = await this.contentItemService.getContentItemByKey(hyperlinkContract.targetKey);

            if (contentItem) {
                hyperlinkModel = await this.getHyperlinkByContentType(contentItem, hyperlinkContract.target);

                if (!hyperlinkModel) {
                    hyperlinkModel = new HyperlinkModel();
                    hyperlinkModel.title = contentItem.title || contentItem.permalink;
                    hyperlinkModel.target = hyperlinkContract.target || "_blank";
                    hyperlinkModel.targetKey = contentItem.key;
                    hyperlinkModel.href = contentItem.permalink;
                    hyperlinkModel.type = "url";
                }

                return hyperlinkModel;
            }
        }

        if (hyperlinkContract.href) {
            hyperlinkModel = new HyperlinkModel();
            hyperlinkModel.title = "External link";
            hyperlinkModel.target = hyperlinkContract.target || "_blank";
            hyperlinkModel.targetKey = null;
            hyperlinkModel.href = hyperlinkContract.href;
            hyperlinkModel.type = "url";

            return hyperlinkModel;
        }

        hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "Unset link";
        hyperlinkModel.target = hyperlinkContract.target || "_blank";
        hyperlinkModel.targetKey = null;
        hyperlinkModel.href = "#";
        hyperlinkModel.type = "url";

        return hyperlinkModel;
    }

    public async getHyperlinkByTargetKey(targetKey: string): Promise<HyperlinkModel> {
        const contentItem = await this.contentItemService.getContentItemByKey(targetKey);
        const hyperlink = await this.getHyperlinkByContentType(contentItem, "blank");

        return hyperlink;
    }
}