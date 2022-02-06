import { PageMetadata } from "./pageMetadata";
import { ContentItemContract } from "../contentModel";

/**
 * Page metadata.
 */
export interface PageContract extends PageMetadata, ContentItemContract {
    /**
     * Own key.
     */
    key?: string;
}