import * as Utils from "../utils";
import * as Constants from "../constants";
import { IObjectStorage, Query, Operator } from "../persistence";
import { IBlockService, BlockType } from "./IBlockService";
import { Contract } from "../contract";
import { BlockContract } from "./blockContract";
import { HttpClient } from "../http/httpClient";
import { ISettingsProvider } from "../configuration/ISettingsProvider";
import { Bag } from "../bag";

const blockPath = "blocks";
const documentsPath = "files";

export class BlockService implements IBlockService {
    private blocksData: object;

    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly httpClient: HttpClient
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

    public async search(type: BlockType, pattern: string): Promise<BlockContract[]> {
        let results: BlockContract[] = [];

        if (type === BlockType.saved) {
            const query = Query
                .from<BlockContract>()
                .where("type", Operator.equals, type);

            if (pattern.length > 0) {
                query.where("title", Operator.contains, pattern).orderBy("title");
            }

            const pageOfObjects = await this.objectStorage.searchObjects<BlockContract>(blockPath, query);
            results = pageOfObjects.value;
        }
        else {
            const data = await this.loadBlockSnippets();

            if (!data) {
                return [];
            }
            const blocks: Bag<BlockContract> = data[blockPath];
            const blockKeys = Object.keys(blocks);

            for (const blockKey of blockKeys) {
                if (blocks[blockKey].title.indexOf(pattern) !== -1) {
                    results.push(blocks[blockKey]);
                }
            }
        }

        return results;
    }

    public async deleteBlock(block: BlockContract): Promise<void> {
        if (!block) {
            throw new Error(`Parameter "block" not specified.`);
        }

        await this.objectStorage.deleteObject(block.key);
    }

    public async createBlock(title: string, description: string, content: Contract, type: BlockType): Promise<void> {
        const identifier = Utils.guid();
        const blockKey = `${blockPath}/${Utils.guid()}`;
        const contentKey = `${documentsPath}/${identifier}`;

        const block: BlockContract = {
            type: type,
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

    public async getBlockContent(key: string, blockType?: BlockType): Promise<Contract> {
        if (!key) {
            throw new Error(`Parameter "key" not specified.`);
        }

        if (!blockType || blockType === BlockType.saved) {
            const block = await this.getBlockByKey(key);
            return await this.objectStorage.getObject(block.contentKey);
        }

        const data = await this.loadBlockSnippets();

        if (!data) {
            return null;
        }
        const block = this.getObjectByPath(data, key);
        if (!block) {
            return null;
        }
        return this.getObjectByPath(data, block.contentKey);
    }

    private async loadBlockSnippets(): Promise<any> {
        if (!this.blocksData) {
            await this.loadData();
        }
        return this.blocksData;
    }

    private async loadData(): Promise<void> {
        try {
            const blocksUrl = Constants.blockSnippetsLibraryUrl;

            if (!blocksUrl) {
                console.warn("Settings for blocksUrl not found.");
                return;
            }
            const response = await this.httpClient.send({
                url: blocksUrl,
                method: "GET"
            });

            this.blocksData = <any>response.toObject();
        }
        catch (error) {
            console.error("Load blocks error: ", error);
        }
    }

    private getObjectByPath(obj: any, pathKey: string): any {
        for (let i = 0, path = pathKey.split("/"), len = path.length; i < len; i++) {
            obj = obj[path[i]];
        }
        return obj;
    }
}