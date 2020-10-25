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
        
        return media?.downloadUrl || await this.blobStorage.getDownloadUrl(media.blobKey);
    }
}