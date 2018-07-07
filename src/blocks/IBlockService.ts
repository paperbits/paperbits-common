import { BlockContract } from "./blockContract";
import { Contract } from "../contract";

/**
 * Service for managing design blocks.
 */
export interface IBlockService {
    /**
     * Searches for design blocks that contain specified pattern in their title, description.
     */
    search(pattern?: string): Promise<BlockContract[]>;

    /**
     * Returns a design block by specified key;
     */
    getBlockByKey(key: string): Promise<BlockContract>;

    /**
     * Deletes a specified design block from storage.
     */
    deleteBlock(block: BlockContract): Promise<void>;

    /**
     * Creates new design block in storage and returns a contract of it.
     */
    createBlock(title: string, description: string, content: Contract): Promise<void>;

    /**
     * Updates specified design block.
     */
    updateBlock(block: BlockContract): Promise<void>;
}