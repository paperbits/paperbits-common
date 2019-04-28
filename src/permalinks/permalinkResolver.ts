import { ContentItemContract } from "./../contentItems/contentItemContract";
import { IContentItemService } from "../contentItems";
import { IPermalinkResolver } from "./";
import { HyperlinkContract } from "../editing";
import { HyperlinkModel } from "./hyperlinkModel";
import { IHyperlinkProvider } from "../ui";

export class PermalinkResolver implements IPermalinkResolver {
    private hyperlinkTypes: object;
    constructor(private readonly contentItemService: IContentItemService,
                private readonly resourcePickers: IHyperlinkProvider[]) { }

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

    private getHyperlinkTypeByKey(key: string): string {
        if (this.hyperlinkTypes) {
            let result = this.hyperlinkTypes[key];
            if (!result) {
                const hyperlinkProvider = this.resourcePickers.find(x => x.canHandleHyperlink(key));
                if (hyperlinkProvider) {
                    this.hyperlinkTypes[key] = hyperlinkProvider.componentName.split("-")[0];
                    result = this.hyperlinkTypes[key];
                }
            }
            return result;
        } else {
            this.hyperlinkTypes = {};
            const hyperlinkProvider = this.resourcePickers.find(x => x.canHandleHyperlink(key));
            if (hyperlinkProvider) {
                this.hyperlinkTypes[key] = hyperlinkProvider.componentName.split("-")[0];
                return this.hyperlinkTypes[key];
            } else {
                console.error("not supported hyperlink type for key: ", key);
            }
        }
    }

    public async getHyperlinkByContentType(contentItem: ContentItemContract, target: string): Promise<HyperlinkModel> {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.target = target;
        hyperlinkModel.targetKey = contentItem.key;
        hyperlinkModel.href = contentItem.permalink;
        hyperlinkModel.type = this.getHyperlinkTypeByKey(contentItem.key);
        hyperlinkModel.title = hyperlinkModel.type === "media" ? contentItem["filename"] : contentItem.title;

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
                }

                return hyperlinkModel;
            }
        }

        hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "Unset link";
        hyperlinkModel.target = hyperlinkContract.target || "_blank";
        hyperlinkModel.targetKey = null;
        hyperlinkModel.href = "#";
        hyperlinkModel.anchor = hyperlinkContract.anchor;
        hyperlinkModel.type = "url";

        return hyperlinkModel;
    }

    public async getHyperlinkByTargetKey(targetKey: string): Promise<HyperlinkModel> {
        const contentItem = await this.contentItemService.getContentItemByKey(targetKey);
        if (!contentItem) {
            return null;
        }
        const hyperlink = await this.getHyperlinkByContentType(contentItem, "blank");

        return hyperlink;
    }
}