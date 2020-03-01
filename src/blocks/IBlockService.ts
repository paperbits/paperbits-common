import { BlockContract } from "./blockContract";
import { Contract } from "../contract";

/**
 * Service for managing design blocks.
 */
export interface IBlockService {
    /**
     * Searches for design blocks that contain specified pattern in their title, description.
     * @param blockType {string}
     * @param pattern {string}
     */
    search(blockType: BlockType, pattern: string): Promise<BlockContract[]>;

    /**
     * Returns a design block by specified key;
     * @param blockKey {string}
     */
    getBlockByKey(blockKey: string): Promise<BlockContract>;

    /**
     * Deletes a specified design block from storage.
     */
    deleteBlock(block: BlockContract): Promise<void>;

    /**
     * Creates new design block in storage and returns a contract of it.
     * Block can be used in a page or email. 
     */
    createBlock(title: string, description: string, content: Contract, type: BlockType): Promise<void>;

    /**
     * Updates specified design block.
     */
    updateBlock(block: BlockContract): Promise<void>;

    /**
     * Returns block content by specified key.
     * @param blockKey {string}
     */
    getBlockContent?(blockKey: string, blockType?: BlockType): Promise<Contract>;
}

export enum BlockType {
    saved = "layout-section",
    blocks = "blocks-section"
}
