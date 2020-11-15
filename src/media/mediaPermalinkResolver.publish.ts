import { IMediaService } from "./IMediaService";
import { IPermalinkResolver, HyperlinkModel } from "../permalinks";
import { MediaContract } from ".";
import { ContentItemContract } from "../contentItems";
import { HyperlinkContract } from "../editing";

export class MediaPermalinkResolver implements IPermalinkResolver {
    protected mediaPath: string = "uploads/";

    constructor(private readonly mediaService: IMediaService) { }

    public canHandleTarget(targetKey: string): boolean {
        return targetKey.startsWith("uploads/");
    }

    public async getUrlByTargetKey(mediaKey: string): Promise<string> {
        if (!mediaKey) {
            throw new Error(`Parameter "mediaKey" not specified.`);
        }

        try {
            const media = await this.mediaService.getMediaByKey(mediaKey);

            if (!media) {
                console.warn(`Could not find permalink by key ${mediaKey}.`);
                return null;
            }

            return media.permalink;
        }
        catch (error) {
            console.warn(`Could not fetch permalink by key ${mediaKey}.`);
            return null;
        }
    }

    private async getHyperlink(mediaContract: MediaContract, hyperlinkContract?: HyperlinkContract): Promise<HyperlinkModel> {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.targetKey = mediaContract.key;
        hyperlinkModel.href = mediaContract.permalink;
        hyperlinkModel.title = mediaContract.fileName || mediaContract.permalink;

        if (hyperlinkContract) {
            hyperlinkModel.target = hyperlinkContract.target;
            hyperlinkModel.anchor = hyperlinkContract.anchor;
            hyperlinkModel.anchorName = hyperlinkContract.anchorName;
        }

        return hyperlinkModel;
    }


    public async getHyperlinkByTargetKey(targetKey: string): Promise<HyperlinkModel> {
        if (!targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!targetKey.startsWith(this.mediaPath)) {
            return null;
        }

        const mediaContract = await this.mediaService.getMediaByKey(targetKey);

        if (!mediaContract) {
            console.warn(`Could create hyperlink for target with key ${targetKey}.`);
            return null;
        }

        const hyperlink = await this.getHyperlink(mediaContract);

        return hyperlink;
    }

    public async getContentItemByPermalink(permalink: string): Promise<ContentItemContract> {
        if (!permalink) {
            throw new Error(`Parameter "permalink" not specified.`);
        }

        const mediaContract = await this.mediaService.getMediaByPermalink(permalink);

        return mediaContract;
    }

    public async getHyperlinkFromContract(hyperlinkContract: HyperlinkContract, locale?: string): Promise<HyperlinkModel> {
        if (!hyperlinkContract.targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!hyperlinkContract.targetKey.startsWith(this.mediaPath)) {
            return null;
        }

        let hyperlinkModel: HyperlinkModel;

        if (hyperlinkContract.targetKey) {
            const mediaContract = await this.mediaService.getMediaByKey(hyperlinkContract.targetKey);

            if (mediaContract) {
                return this.getHyperlink(mediaContract, hyperlinkContract);
            }
        }

        hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "Unset link";
        hyperlinkModel.target = hyperlinkContract.target;
        hyperlinkModel.targetKey = hyperlinkContract.targetKey;
        hyperlinkModel.href = "#";
        hyperlinkModel.anchor = hyperlinkContract.anchor;
        hyperlinkModel.anchorName = hyperlinkContract.anchorName;

        return hyperlinkModel;
    }

}