import { IBlockService, BlockType } from "../../src/blocks/IBlockService";
import { Contract } from "../../src/contract";
import { BlockContract } from "../../src/blocks/blockContract";


export class MockBlockService implements IBlockService {
    public getBlockByKey(key: string): Promise<BlockContract> {
        throw new Error("Not implemented");
    }

    public async search(type: BlockType, pattern: string): Promise<BlockContract[]> {
        throw new Error("Not implemented");
    }

    public async deleteBlock(block: BlockContract): Promise<void> {
        throw new Error("Not implemented");
    }

    public async createBlock(title: string, description: string, content: Contract, type: BlockType): Promise<void> {
        throw new Error("Not implemented");
    }

    public updateBlock(block: BlockContract): Promise<void> {
       throw new Error("Not implemented");
    }

    public async getBlockContent(key: string, blockType?: BlockType): Promise<Contract> {
        return <any>{};
    }
}