import { IMediaService } from "./IMediaService";
import { IPermalinkResolver } from "../permalinks";

export class MediaPermalinkResolver implements IPermalinkResolver {
    constructor(private readonly mediaService: IMediaService) { }

    public async getUrlByTargetKey(targetKey: string): Promise<string> {
        if (!targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        const media = await this.mediaService.getMediaByKey(targetKey);

        if (media) {
            return media.downloadUrl;
        }
        else {
            return null;
        }
    }
}