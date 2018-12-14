import { Contract } from "../contract";

/**
 * Block metadata.
 */
export interface BlockContract extends Contract {
    /**
     * Own key.
     */
    key?: string;

    /**
     * Block title.
     */
    title: string;

    /**
     * Block description.
     */
    description: string;

    /**
     * Key of a document having block content.
     */
    contentKey?: string;
}