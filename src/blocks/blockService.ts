import * as Utils from "../utils";
import { IObjectStorage, Query, Operator } from "../persistence";
import { IBlockService } from "./IBlockService";
import { Contract } from "../contract";
import { BlockContract } from "./blockContract";

const blockPath = "blocks";

export class BlockService implements IBlockService {
    constructor(
        private readonly objectStorage: IObjectStorage
    ) { }

    public getBlockByKey(key: string): Promise<BlockContract> {
        if (!key) {
            throw new Error(`Parameter "key" not specified.`);
        }

        if (!key.startsWith(blockPath)) {
            return null;
        }
        return this.objectStorage.getObject<BlockContract>(key);
    }

    public async search(pattern: string): Promise<BlockContract[]> {
        const query = Query
            .from<BlockContract>()
            .where("title", Operator.contains, pattern)
            .orderBy("title");

        const result = await this.objectStorage.searchObjects<BlockContract>(blockPath, query);
        
        return Object.values(result);
    }

    public async deleteBlock(block: BlockContract): Promise<void> {
        if (!block) {
            throw new Error(`Parameter "block" not specified.`);
        }

        await this.objectStorage.deleteObject(block.key);
    }

    public async createBlock(title: string, description: string, content: Contract): Promise<void> {
        const key = `${blockPath}/${Utils.guid()}`;

        const block: BlockContract = {
            key: key,
            title: title,
            description: description,
            content: content
        };

        await this.objectStorage.updateObject(key, block);
    }

    public updateBlock(block: BlockContract): Promise<void> {
        if (!block) {
            throw new Error(`Parameter "block" not specified.`);
        }

        return this.objectStorage.updateObject(block.key, block);
    }
}