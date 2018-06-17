import * as Utils from '../utils';
import { IObjectStorage } from '../persistence/IObjectStorage';
import { IBlockService } from './IBlockService';
import { Contract } from '../contract';
import { BlockContract } from './blockContract';

const blockPath = "blocks";

export class BlockService implements IBlockService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    public getBlockByKey(key: string): Promise<BlockContract> {
        if (!key.startsWith(blockPath)) {
            return null;
        }
        return this.objectStorage.getObject<BlockContract>(key);
    }

    public async search(pattern: string): Promise<BlockContract[]> {
        return await this.objectStorage.searchObjects<BlockContract>(blockPath);
    }

    public async deleteBlock(block: BlockContract): Promise<void> {
        try {
            await this.objectStorage.deleteObject(block.key);
        }
        catch (error) {
            // TODO: Do proper handling.
            console.warn(error);
        }
    }

    public async createBlock(title: string, description: string, content: Contract): Promise<void> {
        const key = `${blockPath}/${Utils.guid()}`;

        const block: BlockContract = {
            key: key,
            title: title,
            description: description,
            content: content
        }

        await this.objectStorage.updateObject(key, block);
    }

    public updateBlock(block: BlockContract): Promise<void> {
        return this.objectStorage.updateObject(block.key, block);
    }
}