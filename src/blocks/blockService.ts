import * as Utils from "../utils";
import * as Constants from "../constants";
import * as Objects from "../objects";
import { IObjectStorage, Query, Operator } from "../persistence";
import { IBlockService } from "./IBlockService";
import { Contract } from "../contract";
import { BlockContract } from "./blockContract";
import { HttpClient } from "../http/httpClient";
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

    public async search(blockType: string, pattern: string): Promise<BlockContract[]> {
        const query = Query
            .from<BlockContract>()
            .where("type", Operator.equals, blockType);

        if (pattern.length > 0) {
            query.where("title", Operator.contains, pattern).orderBy("title");
        }

        const pageOfObjects = await this.objectStorage.searchObjects<BlockContract>(blockPath, query);
        const results = pageOfObjects.value;

        if (results.length > 0) {
            return results;
        }

        const blockSnippets = await this.loadBlockSnippets();

        if (!blockSnippets) {
            return [];
        }

        const bagOfBlocks: Bag<BlockContract> = blockSnippets[blockPath];
        const blocks = Object.values(bagOfBlocks);

        return blocks.filter(block => block.title.includes(pattern) && block.type === blockType);
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

        if (storedBlock) {
            const content = await this.objectStorage.getObject(storedBlock.contentKey);
            return Objects.clone(content);
        }

        const blockSnippets = await this.loadBlockSnippets();

        if (!blockSnippets) {
            return null;
        }

        const blockSnippet = Objects.getObjectAt<BlockContract>(blockKey, blockSnippets);

        if (!blockSnippet) {
            return null;
        }

        const content = Objects.getObjectAt<Contract>(blockSnippet.contentKey, blockSnippets);
        return Objects.clone(content);
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
}