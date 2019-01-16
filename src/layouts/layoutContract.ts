import { Contract } from "../contract";

/**
 * Layout metadata.
 */
export interface LayoutContract extends Contract {
    /**
     * Own key.
     */
    key?: string;

    /**
     * Layout title, e.g. Master page.
     */
    title: string;

    /**
     * Page description.
     */
    description: string;

    /**
     * Template of URL where layout needs to be applied.
     */
    permalinkTemplate: string;

    /**
     * Key of the document describing content.
     */
    contentKey?: string;
}