import { LayoutMetadata } from "./layoutMetadata";

/**
 * Layout metadata.
 */
export interface LayoutContract extends LayoutMetadata {
    /**
     * Unique identifier.
     */
    key?: string;
}