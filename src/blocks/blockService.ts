import * as Utils from "../utils";
import * as Objects from "../objects";
import * as Constants from "../constants";
import { IObjectStorage, Query, Operator } from "../persistence";
import { IBlockService } from "./IBlockService";
import { Contract } from "../contract";
import { BlockContract } from "./blockContract";
import { HttpClient } from "../http";
import { Bag } from "../bag";

const blockPath = "blocks";
const documentsPath = "files";

export class BlockService implements IBlockService {
    private preDefinedBlocksCache: Object;

    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly httpClient: HttpClient
    ) { }

    private async getPredefinedBlocks(): Promise<Object> {
        if (this.preDefinedBlocksCache) {
            return this.preDefinedBlocksCache;
        }

        try {
            const response = await this.httpClient.send({
                url: Constants.blockSnippetsLibraryUrl,
                method: "GET"
            });

            this.preDefinedBlocksCache = response.toObject();

            return this.preDefinedBlocksCache;
        }
        catch (error) {
            console.warn(`Unable to load pre-defined blocks. ${error.stack}`);
            this.preDefinedBlocksCache = {};
        }
    }

    private async getPreDefinedBlockByKey(key: string): Promise<Contract> {
        const predefinedBlocks = await this.getPredefinedBlocks();
        const block = Objects.getObjectAt<BlockContract>(key, predefinedBlocks);

        if (!block?.key) {
            return null;
        }

        const blockContent = Objects.getObjectAt<Contract>(block.contentKey, this.preDefinedBlocksCache);

        return blockContent;
    }

    public getBlockByKey(key: string): Promise<BlockContract> {
        if (!key) {
            throw new Error(`Parameter "key" not specified.`);
        }

        if (!key.startsWith(blockPath)) {
            return null;
        }

        return this.objectStorage.getObject<BlockContract>(key);
    }

    public async search(blockType: string, pattern: string): Promise<BlockContract[]> {
        const query = Query
            .from<BlockContract>()
            .where("type", Operator.equals, blockType);

        if (pattern.length > 0) {
            query.where("title", Operator.contains, pattern).orderBy("title");
        }

        const pageOfObjects = await this.objectStorage.searchObjects<BlockContract>(blockPath, query);
        const results = pageOfObjects.value;

        return results;
    }

    public async deleteBlock(block: BlockContract): Promise<void> {
        if (!block) {
            throw new Error(`Parameter "block" not specified.`);
        }

        await this.objectStorage.deleteObject(block.key);
    }

    public async createBlock(title: string, description: string, content: Contract, blockType: string): Promise<void> {
        const identifier = Utils.guid();
        const blockKey = `${blockPath}/${Utils.guid()}`;
        const contentKey = `${documentsPath}/${identifier}`;

        const block: BlockContract = {
            type: blockType,
            key: blockKey,
            title: title,
            description: description,
            contentKey: contentKey
        };

        await this.objectStorage.addObject(blockKey, block);
        await this.objectStorage.addObject(contentKey, content);
    }

    public updateBlock(block: BlockContract): Promise<void> {
        if (!block) {
            throw new Error(`Parameter "block" not specified.`);
        }

        return this.objectStorage.updateObject(block.key, block);
    }

    public async getBlockContent(blockKey: string): Promise<Contract> {
        if (!blockKey) {
            throw new Error(`Parameter "key" not specified.`);
        }

        const predefinedBlock = await this.getPreDefinedBlockByKey(blockKey);

        if (predefinedBlock) {
            return predefinedBlock;
        }

        const storedBlock: BlockContract = await this.getBlockByKey(blockKey);

        if (!storedBlock) {
            throw new Error(`Content not found for block with key ${blockKey}`);
        }

        const content = await this.objectStorage.getObject(storedBlock.contentKey);
        return Objects.clone(content);
    }
}