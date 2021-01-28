import { IMediaService } from "./IMediaService";
import { HyperlinkModel, IPermalinkResolver } from "../permalinks";
import { IBlobStorage } from "../persistence";
import { HyperlinkContract } from "../editing";
import { MediaContract } from "./mediaContract";


export class MediaPermalinkResolver implements IPermalinkResolver {
    protected mediaPath: string = "uploads/";

    constructor(
        private readonly mediaService: IMediaService,
        private readonly blobStorage: IBlobStorage
    ) { }

    public canHandleTarget(targetKey: string): boolean {
        return targetKey.startsWith(this.mediaPath);
    }

    public async getUrlByTargetKey(mediaKey: string): Promise<string> {
        if (!mediaKey) {
            throw new Error(`Parameter "mediaKey" not specified.`);
        }

        const media = await this.mediaService.getMediaByKey(mediaKey);

        if (!media) {
            return null;
        }

        let mediaUrl = null;

        if (media.blobKey) {
            mediaUrl = await this.blobStorage.getDownloadUrl(media.blobKey);
        }

        if (mediaUrl) {
            return mediaUrl;
        }

        if (media.downloadUrl) {
            mediaUrl = media.downloadUrl;
        }

        return mediaUrl;
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