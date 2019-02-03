import { IContentItemService } from "../contentItems";
import { IPermalinkResolver } from "../permalinks";

export class MediaPermalinkResolver implements IPermalinkResolver {
    constructor(private readonly contentItemService: IContentItemService) { }

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
}