import { IBag } from "../core/IBag";

/**
 * Page metadata.
 */
export interface PageContract {
    /**
     * Own key.
     */
    key?: string;

    /**
     * Page title.
     */
    title: string;

     /**
     * Page description. This property is included in SEO attributes.
     */
    description: string;

     /**
     * Page keywords. This property is included in SEO attributes.
     */
    keywords: string;

    /**
     * Key of a file having page content.
     */
    contentKey?: string;

    /**
     * Key of permalink referencing this page.
     */
    permalinkKey?: string;

    /**
     * Keys of anchors used in page content. Anchor is a special type of a permalink.
     */
    anchors?: IBag<string>;
}