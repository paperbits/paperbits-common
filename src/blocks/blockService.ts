import * as Utils from "../utils";
import * as Objects from "../objects";
import { IObjectStorage, Query, Operator } from "../persistence";
import { IBlockService } from "./IBlockService";
import { Contract } from "../contract";
import { BlockContract } from "./blockContract";

const blockPath = "blocks";
const documentsPath = "files";

export class BlockService implements IBlockService {
    constructor(private readonly objectStorage: IObjectStorage) { }

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

        const storedBlock: BlockContract = await this.getBlockByKey(blockKey);

        if (!storedBlock) {
            throw new Error(`Content not found for block with key ${blockKey}`);
        }

        const content = await this.objectStorage.getObject(storedBlock.contentKey);
        return Objects.clone(content);
    }
}