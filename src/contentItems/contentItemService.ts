import * as Utils from "../utils";
import { ContentItemContract, IContentItemService } from "../contentItems";
import { IObjectStorage, Query, Operator } from "../persistence";
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

    public async search(pattern: string): Promise<ContentItemContract[]> {
        const query = Query
            .from<ContentItemContract>()
            .where("title", Operator.contains, pattern)
            .orderBy("title");

        const result = await this.objectStorage.searchObjects<ContentItemContract>(contentItemsPath, query);
        return Object.values(result);
    }

    public async deleteContentItem(contentItem: ContentItemContract): Promise<void> {
        const deleteContentPromise = this.objectStorage.deleteObject(contentItem.contentKey);
        const deleteContentItemPromise = this.objectStorage.deleteObject(contentItem.key);

        await Promise.all([deleteContentPromise, deleteContentItemPromise]);
    }

    public async createContentItem(url: string, title: string, description: string, keywords: string): Promise<ContentItemContract> {
        const identifier = Utils.guid();
        const contentItemKey = `${contentItemsPath}/${identifier}`;
        const contentKey = `${documentsPath}/${identifier}`;

        const contentItem: ContentItemContract = {
            key: contentItemKey,
            title: title,
            description: description,
            keywords: keywords,
            permalink: url,
            contentKey: contentKey
        };

        await this.objectStorage.addObject(contentItemKey, contentItem);

        const template = await this.blockService.getBlockContent(templateBlockKey);

        await this.objectStorage.addObject(contentKey, template);

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
