import { IMediaService } from "./IMediaService";
import { IPermalinkResolver } from "../permalinks";

export class MediaPermalinkResolver implements IPermalinkResolver {
    constructor(private readonly mediaService: IMediaService) { }

    public canHandleTarget(targetKey: string): boolean {
        return targetKey.startsWith("uploads/");
    }

    public async getUrlByTargetKey(mediaKey: string): Promise<string> {
        if (!mediaKey) {
            throw new Error(`Parameter "mediaKey" not specified.`);
        }

        const media = await this.mediaService.getMediaByKey(mediaKey);

        if (media) {
            return media.downloadUrl;
        }
        else {
            return null;
        }
    }
}