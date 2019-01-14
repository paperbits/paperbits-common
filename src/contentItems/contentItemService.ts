import { Bag } from "./../bag";
import * as Utils from "../utils";
import { ContentItemContract, IContentItemService } from "../contentItems";
import { IObjectStorage } from "../persistence";
import { IBlockService } from "../blocks";
import { Contract } from "../contract";

const contentItemsPath = "contentItems";
const documentsPath = "files";
const templateBlockKey = "blocks/new-content-template";

export class ContentItemService implements IContentItemService {
    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly blockService: IBlockService
    ) { }

    private async searchByProperties(properties: string[], value: string): Promise<ContentItemContract[]> {
        const result = await this.objectStorage.searchObjects<Bag<ContentItemContract>>(contentItemsPath, properties, value);
        return Object.keys(result).map(key => result[key]);
    }

    public async getContentItemByPermalink(permalink: string): Promise<ContentItemContract> {
        return null;

        // const result = await this.objectStorage.searchObjects<Bag<ContentItemContract>>("contentItem", ["permalink"], permalink);

        // const permalinks = Object.keys(result).map(key => result[key]);

        // if (!permalinks || permalinks.length === 0) {
        //     return undefined;
        // }

        // const contentItemKey = permalinks[0].targetKey;
        // const contentItemContract = await this.getContentItemByKey(contentItemKey);

        // return contentItemContract;
    }

    public async getContentItemByKey(key: string): Promise<ContentItemContract> {
        return await this.objectStorage.getObject<ContentItemContract>(key);
    }

    public search(pattern: string): Promise<ContentItemContract[]> {
        return this.searchByProperties(["title"], pattern);
    }

    public async deleteContentItem(contentItem: ContentItemContract): Promise<void> {
        const deleteContentPromise = this.objectStorage.deleteObject(contentItem.contentKey);
        const deleteContentItemPromise = this.objectStorage.deleteObject(contentItem.key);

        await Promise.all([deleteContentPromise, deleteContentItemPromise]);
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
