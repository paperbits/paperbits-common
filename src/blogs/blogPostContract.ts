import { Bag } from "../bag";

export interface BlogPostContract {
    /**
     * Own key.
     */
    key?: string;

    /**
     * Blog post title.
     */
    title: string;

    /**
     * Blog post description. This property is included in SEO attributes.
     */
    description: string;

    /**
     * Page keywords. This property is included in SEO attributes.
     */
    keywords: string;

    /**
     * Key of a document containing page content.
     */
    contentKey?: string;

    /**
     * Permalink referencing this page.
     */    
    permalink?: string;

    /**
     * Keys of anchors used in page content. Anchor is a special type of a permalink.
     */
    anchors?: Bag<string>;

    created?: string;
    updated?: string;
    author?: string;
}