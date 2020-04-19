import { IMediaService } from "./IMediaService";
import { IPermalinkResolver, HyperlinkModel } from "../permalinks";
import { MediaContract } from ".";

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
            const contentItem = await this.mediaService.getMediaByKey(mediaKey);

            if (!contentItem) {
                console.warn(`Could not find permalink with key ${mediaKey}.`);
                return null;
            }

            return contentItem.permalink;
        }
        catch (error) {
            return "";
        }
    }

    private async getHyperlink(mediaContract: MediaContract, target: string = "_self"): Promise<HyperlinkModel> {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.targetKey = mediaContract.key;
        hyperlinkModel.href = mediaContract.permalink;
        hyperlinkModel.title = mediaContract.fileName || mediaContract.permalink;
        hyperlinkModel.target = target;

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
}