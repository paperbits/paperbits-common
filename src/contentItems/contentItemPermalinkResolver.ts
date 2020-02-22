import { IPermalinkResolver, IPermalinkService } from "../permalinks";
import { IContentItemService } from "./IContentItemService";

export class ContentItemPermalinkResolver implements IPermalinkResolver {
    constructor(
        private readonly contentItemService: IContentItemService,
        private readonly permalinkService: IPermalinkService
    ) { }

    public async getUrlByTargetKey(contentItemKey: string): Promise<string> {
        const contentItem = await this.contentItemService.getContentItemByKey(contentItemKey);

        if (!contentItem) {
            console.warn(`Content item with key ${contentItemKey} not found.`);
            return null;
        }

        const permalink = await this.permalinkService.getPermalinkByKey(contentItem.permalinkKey);

        if (!permalink) {
            console.warn(`Permalink with key ${contentItem.permalinkKey} not found.`);
            return null;
        }

        return permalink.uri;
    }
}