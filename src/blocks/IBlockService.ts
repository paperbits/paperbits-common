import { BlockContract } from "./blockContract";
import { Contract } from "../contract";

/**
 * Service for managing design blocks.
 */
export interface IBlockService {
    /**
     * Searches for design blocks that contain specified pattern in their title, description.
     * @param blockType {string} Block type, e.g. "layout-section".
     * @param pattern {string} Search pattern.
     */
    search(blockType: string, pattern: string): Promise<BlockContract[]>;

    /**
     * Returns a design block by specified key;
     * @param blockKey {string} Block type, e.g. "layout-section".
     */
    getBlockByKey(blockKey: string): Promise<BlockContract>;

    /**
     * Deletes a specified design block from storage.
     */
    deleteBlock(block: BlockContract): Promise<void>;

    /**
     * Creates new design block in storage and returns a contract of it. Block can be used in a page or email. 
     * @param title {string} Block title.
     * @param description {string} Block description.
     * @param content {Contact} Content contract.
     * @param blockType {string} Block type, e.g. `layout-section`.
     */
    createBlock(title: string, description: string, content: Contract, blockType: string): Promise<void>;

    /**
     * Updates specified design block.
     */
    updateBlock(block: BlockContract): Promise<void>;

    /**
     * Returns block content by specified key.
     * @param blockKey {string} Block key.
     */
    getBlockContent?(blockKey: string): Promise<Contract>;

    importSnippet?(key: string, snippet: Object): Promise<void>;

    /**
     * Returns pre-defined block snippets.
     */
    getPredefinedBlockSnippets(): Promise<Object>;

    /**
     * Returns pre-defined grid snippets.
     */
    getPredefinedGridSnippets(): Promise<Object>;
}