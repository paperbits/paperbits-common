import { IBlockService } from "../../src/blocks";
import { Contract } from "../../src/contract";
import { BlockContract } from "../../src/blocks/blockContract";


export class MockBlockService implements IBlockService {
    importSnippet?(key: string, snippet: Object): Promise<void> {
        throw new Error("Not implemented");
    }
    getPredefinedBlockSnippets(): Promise<Object> {
        throw new Error("Not implemented");
    }
    getPredefinedGridSnippets(): Promise<Object> {
        throw new Error("Not implemented");
    }
    public getBlockByKey(key: string): Promise<BlockContract> {
        throw new Error("Not implemented");
    }

    public async search(type: string, pattern: string): Promise<BlockContract[]> {
        throw new Error("Not implemented");
    }

    public async deleteBlock(block: BlockContract): Promise<void> {
        throw new Error("Not implemented");
    }

    public async createBlock(title: string, description: string, content: Contract, type: string): Promise<void> {
        throw new Error("Not implemented");
    }

    public updateBlock(block: BlockContract): Promise<void> {
       throw new Error("Not implemented");
    }

    public async getBlockContent(key: string, blockType?: string): Promise<Contract> {
        return <any>{};
    }
}