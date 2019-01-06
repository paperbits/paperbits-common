import { IPermalinkResolver } from "../permalinks";
import { IContentItemService } from "./IContentItemService";

export class ContentItemPermalinkResolver implements IPermalinkResolver {
    private readonly contentItemService: IContentItemService;

    constructor(contentItemService: IContentItemService) {
        this.contentItemService = contentItemService;
    }

    public async getUrlByTargetKey(contentItemKey: string): Promise<string> {
        const contentItem = await this.contentItemService.getContentItemByKey(contentItemKey);

        if (!contentItem) {
            console.warn(`Content item with key ${contentItemKey} not found.`);
            return null;
        }

        return contentItem.permalink;
    }
}