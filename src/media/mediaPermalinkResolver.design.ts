import { IMediaService } from "./IMediaService";
import { IPermalinkResolver } from "../permalinks";
import { IBlobStorage } from "../persistence";


export class MediaPermalinkResolver implements IPermalinkResolver {
    constructor(
        private readonly mediaService: IMediaService,
        private readonly blobStorage: IBlobStorage
    ) { }

    public canHandleTarget(targetKey: string): boolean {
        return targetKey.startsWith("uploads/");
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
}