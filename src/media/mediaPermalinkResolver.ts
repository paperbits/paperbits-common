import { IMediaService } from "./IMediaService";
import { IPermalinkResolver } from "../permalinks";

export class MediaPermalinkResolver implements IPermalinkResolver {
    constructor(private readonly mediaService: IMediaService) { }

    public async getUrlByTargetKey(mediaKey: string): Promise<string> {
        if (!mediaKey) {
            throw new Error(`Parameter "mediaKey" not specified.`);
        }

        const contentItem = await this.mediaService.getMediaByKey(mediaKey);

        if (!contentItem) {
            console.warn(`Could not find permalink with key ${mediaKey}.`);
            return null;
        }

        return contentItem.permalink;
    }
}