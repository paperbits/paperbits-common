import { ContentItemContract } from "./../contentItems/contentItemContract";
import { IPermalinkResolver, IPermalinkService } from "./";
import { HyperlinkContract } from "../editing";
import { HyperlinkModel } from "./hyperlinkModel";
import { IContentItemService } from "../contentItems";

export class PermalinkResolver implements IPermalinkResolver {
    constructor(
        private readonly permalinkService: IPermalinkService,
        private readonly contentItemService: IContentItemService
    ) { }

    public async getUrlByTargetKey(targetKey: string): Promise<string> {
        if (!targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        const contentItem = await this.contentItemService.getContentItemByKey(targetKey);

        if (!contentItem) {
            console.warn(`Content item with key ${targetKey} not found.`);
            return null;
        }

        const permalink = await this.permalinkService.getPermalinkByKey(contentItem.permalinkKey);

        if (!permalink) {
            console.warn(`Permalink with key ${contentItem.permalinkKey} not found.`);
        }

        return permalink.uri;
    }

    public async getHyperlinkByContentType(contentItem: ContentItemContract): Promise<HyperlinkModel> {
        const permalink = await this.permalinkService.getPermalinkByKey(contentItem.permalinkKey);

        if (!permalink) {
            console.warn(`Permalink with key ${contentItem.permalinkKey} not found.`);
        }

        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.targetKey = contentItem.key;
        hyperlinkModel.href = permalink?.uri;
        hyperlinkModel.title = contentItem.title || contentItem["fileName"]; // TODO: Get rid of content item display name guessing.

        return hyperlinkModel;
    }

    private getEmptyHyperlinkModel(hyperlinkContract: HyperlinkContract): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "Unset link";
        hyperlinkModel.target = hyperlinkContract.target;
        hyperlinkModel.targetKey = null;
        hyperlinkModel.href = "#";
        hyperlinkModel.anchor = hyperlinkContract.anchor;

        return hyperlinkModel;
    }

    public async getHyperlinkFromConfig(hyperlinkContract: HyperlinkContract): Promise<HyperlinkModel> {
        if (!hyperlinkContract.targetKey) {
            return this.getEmptyHyperlinkModel(hyperlinkContract);
        }

        const contentItem = await this.contentItemService.getContentItemByKey(hyperlinkContract.targetKey);

        if (!contentItem) {
            console.warn(`Content item with key ${hyperlinkContract.targetKey} not found.`);
            return this.getEmptyHyperlinkModel(hyperlinkContract);
        }

        return await this.getHyperlinkByContentType(contentItem);
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