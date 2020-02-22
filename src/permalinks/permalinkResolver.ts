import { ContentItemContract } from "./../contentItems/contentItemContract";
import { IPermalinkResolver, IPermalinkService } from "./";
import { HyperlinkContract } from "../editing";
import { HyperlinkModel } from "./hyperlinkModel";

export class PermalinkResolver implements IPermalinkResolver {
    constructor(private readonly permalinkService: IPermalinkService) { }

    public async getUrlByTargetKey(targetKey: string): Promise<string> {
        if (!targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        const permalinkContract = await this.permalinkService.getPermalinkByKey(targetKey);

        if (!permalinkContract) {
            throw new Error(`Could not find permalink with key ${targetKey}.`);
        }

        return permalinkContract.uri;
    }

    public async getHyperlinkByContentType(contentItem: ContentItemContract): Promise<HyperlinkModel> {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.targetKey = contentItem.key;
        hyperlinkModel.href = contentItem.permalink;
        hyperlinkModel.title = contentItem.title || contentItem["fileName"]; // TODO: Get rid of content item display name guessing.

        return hyperlinkModel;
    }

    public async getHyperlinkFromConfig(hyperlinkContract: HyperlinkContract): Promise<HyperlinkModel> {
        let hyperlinkModel: HyperlinkModel;

        if (hyperlinkContract.targetKey) {
            const permalinkContract = await this.permalinkService.getPermalinkByKey(hyperlinkContract.targetKey);

            if (permalinkContract) {
                hyperlinkModel = await this.getHyperlinkByContentType(contentItem);

                if (!hyperlinkModel) {
                    hyperlinkModel = new HyperlinkModel();
                    hyperlinkModel.title = contentItem.title || contentItem.permalink;
                    hyperlinkModel.target = hyperlinkContract.target;
                    hyperlinkModel.targetKey = contentItem.key;
                    hyperlinkModel.href = contentItem.permalink;
                }

                return hyperlinkModel;
            }
        }

        hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "Unset link";
        hyperlinkModel.target = hyperlinkContract.target;
        hyperlinkModel.targetKey = null;
        hyperlinkModel.href = "#";
        hyperlinkModel.anchor = hyperlinkContract.anchor;

        return hyperlinkModel;
    }

    public async getHyperlinkByTargetKey(targetKey: string): Promise<HyperlinkModel> {
        const contentItem = await this.contentItemService.getContentItemByKey(targetKey);
        
        if (!contentItem) {
            return null;
        }
        const hyperlink = await this.getHyperlinkByContentType(contentItem);

        return hyperlink;
    }
}