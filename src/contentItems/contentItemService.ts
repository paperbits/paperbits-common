import * as Utils from "../utils";
import { ContentItemContract, IContentItemService } from "../contentItems";
import { IObjectStorage } from "../persistence";
import { IBlockService } from "../blocks";
import { Contract } from "../contract";

const contentItemsPath = "contentItems";
const documentsPath = "files";
const templateBlockKey = "blocks/8730d297-af39-8166-83b6-9439addca789";

export class ContentItemService implements IContentItemService {
    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly blockService: IBlockService
    ) { }

    private async searchByTags(tags: string[], tagValue: string, startAtSearch: boolean): Promise<ContentItemContract[]> {
        return await this.objectStorage.searchObjects<ContentItemContract>(contentItemsPath, tags, tagValue, startAtSearch);
    }

    public async getContentItemByUrl(url: string): Promise<ContentItemContract> {
        const permalinks = await this.objectStorage.searchObjects<any>("permalinks", ["uri"], url);

        if (!permalinks || permalinks.length === 0) {
            return undefined;
        }

        const contentItemKey = permalinks[0].targetKey;
        const contentItemContract = await this.getContentItemByKey(contentItemKey);

        return contentItemContract;
    }

    public async getContentItemByKey(key: string): Promise<ContentItemContract> {
        return await this.objectStorage.getObject<ContentItemContract>(key);
    }

    public search(pattern: string): Promise<ContentItemContract[]> {
        return this.searchByTags(["title"], pattern, true);
    }

    public async deleteContentItem(contentItem: ContentItemContract): Promise<void> {
        const deleteContentPromise = this.objectStorage.deleteObject(contentItem.contentKey);
        const deletePermalinkPromise = this.objectStorage.deleteObject(contentItem.permalinkKey);
        const deleteContentItemPromise = this.objectStorage.deleteObject(contentItem.key);

        await Promise.all([deleteContentPromise, deletePermalinkPromise, deleteContentItemPromise]);
    }

    public async createContentItem(url: string, title: string, description: string, keywords): Promise<ContentItemContract> {
        const identifier = Utils.guid();
        const contentItemKey = `${contentItemsPath}/${identifier}`;
        const documentKey = `${documentsPath}/${identifier}`;

        const contentItem: ContentItemContract = {
            key: contentItemKey,
            title: title,
            description: description,
            keywords: keywords,
            permalink: url,
            contentKey: documentKey
        };

        await this.objectStorage.addObject(contentItemKey, contentItem);

        const contentTemplate = await this.blockService.getBlockByKey(templateBlockKey);

        await this.objectStorage.addObject(documentKey, { nodes: [contentTemplate.content] });

        return contentItem;
    }

    public async updateContentItem(contentItem: ContentItemContract): Promise<void> {
        await this.objectStorage.updateObject<ContentItemContract>(contentItem.key, contentItem);
    }

    public async getContentItemContent(contentItemKey: string): Promise<Contract> {
        const contentItem = await this.getContentItemByKey(contentItemKey);
        return await this.objectStorage.getObject(contentItem.contentKey);
    }

    public async updateContentItemContent(contentItemKey: string, document: Contract): Promise<void> {
        const contentItem = await this.getContentItemByKey(contentItemKey);
        this.objectStorage.updateObject(contentItem.contentKey, document);
    }
}
