import * as Utils from '../utils';
import { IObjectStorage } from '../persistence/IObjectStorage';
import { IBlobStorage } from '../persistence/IBlobStorage';
import { IBlock } from './IBlock';
import { IBlockService } from './IBlockService';
import { IPermalinkService } from "./../permalinks/IPermalinkService";
import { IPermalink } from '../permalinks/IPermalink';
import { ProgressPromise } from '../progressPromise';
import { Contract } from '../contract';

const blockPath = "blocks";

export class BlockService implements IBlockService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    public getBlockByKey(key: string): Promise<IBlock> {
        if (!key.startsWith(blockPath)) {
            return null;
        }
        return this.objectStorage.getObject<IBlock>(key);
    }

    public async search(pattern: string): Promise<IBlock[]> {
        return await this.objectStorage.searchObjects<IBlock>(blockPath);
    }

    public async deleteBlock(block: IBlock): Promise<void> {
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

        const block: IBlock = {
            key: key,
            title: title,
            description: description,
            content: content
        }

        await this.objectStorage.updateObject(key, block);
    }

    public updateBlock(block: IBlock): Promise<void> {
        return this.objectStorage.updateObject(block.key, block);
    }
}