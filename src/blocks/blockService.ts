import * as Utils from "../utils";
import * as Objects from "../objects";
import * as Constants from "../constants";
import { IObjectStorage, Query, Operator } from "../persistence";
import { IBlockService } from "./IBlockService";
import { Contract } from "../contract";
import { BlockContract } from "./blockContract";
import { HttpClient } from "../http";
import { ISettingsProvider } from "../configuration";
import { Logger } from "../logging";

const blockPath = "blocks";
const documentsPath = "files";

export class BlockService implements IBlockService {
    private predefinedBlockSnippetsCache: Object;
    private predefinedGridSnippetsCache: Object;

    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly settingsProvider: ISettingsProvider,
        private readonly httpClient: HttpClient,
        private readonly logger: Logger
    ) { }

    public async getPredefinedBlockSnippets(): Promise<Object> {
        if (this.predefinedBlockSnippetsCache) {
            return Objects.clone(this.predefinedBlockSnippetsCache);
        }

        const blockSnippetsUrl = await this.settingsProvider.getSetting<string>(Constants.blockSnippetsLibraryUrlSettingName)
            || Constants.blockSnippetsLibraryUrl;

        try {
            const response = await this.httpClient.send({
                url: blockSnippetsUrl,
                method: "GET"
            });

            if (response.statusCode !== 200) {
                this.logger.trackEvent("BlockService", { message: `Unable to load block snippets from "${blockSnippetsUrl}",` });
            }

            this.predefinedBlockSnippetsCache = response.toObject();
        }
        catch (error) {
            this.logger.trackEvent("BlockService", { message: `Unable to load pre-defined block snippets. ${error.stack}` });
        }

        return Objects.clone(this.predefinedBlockSnippetsCache);
    }

    public async getPredefinedGridSnippets(): Promise<Object> {
        if (this.predefinedGridSnippetsCache) {
            return Objects.clone(this.predefinedGridSnippetsCache);
        }

        const girdSnippetsUrl = await this.settingsProvider.getSetting<string>(Constants.gridSnippetsLibraryUrlSettingName)
            || Constants.gridSnippetsLibraryUrl;

        try {
            const response = await this.httpClient.send({
                url: girdSnippetsUrl,
                method: "GET"
            });

            if (response.statusCode !== 200) {
                this.logger.trackEvent("BlockService", { message: `Unable to load grid snippets from "${girdSnippetsUrl}".` });
                return null;
            }

            this.predefinedGridSnippetsCache = response.toObject();
        }
        catch (error) {
            this.logger.trackEvent("BlockService", { message: `Unable to load pre-defined block snippets. ${error.stack}` });
        }

        return Objects.clone(this.predefinedGridSnippetsCache);
    }

    private async getPreDefinedBlockByKey(key: string): Promise<Contract> {
        const predefinedBlocks = await this.getPredefinedBlockSnippets();
        const block = Objects.getObjectAt<BlockContract>(key, predefinedBlocks);

        if (!block?.key) {
            return null;
        }

        const blockContent = Objects.getObjectAt<Contract>(block.contentKey, this.predefinedBlockSnippetsCache);

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

    public async importSnippet(key: string, snippet: Object): Promise<void> {
        const existingSnippet = await this.objectStorage.getObject(key);

        if (existingSnippet) {
            console.info(`Snippet ${key} already imported.`);
            return;
        }

        if (key.startsWith("styles")) {
            const stylesObject = await this.objectStorage.getObject<Object>("styles");
            const segments = key.split("/");
            const path = segments.slice(1).join("/");

            Objects.setValue(path, stylesObject, snippet);
            await this.objectStorage.updateObject("styles", stylesObject);
        }
        else {
            await this.objectStorage.addObject(key, snippet);
        }
    }
}