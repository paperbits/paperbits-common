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
}