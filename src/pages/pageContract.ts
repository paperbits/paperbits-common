import { IBag } from "../IBag";

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
     * Facebook Open Graph: This is how you describe the kind of object you are sharing: website, article, blog.
     */
    ogType?: "website" | "article" | "blog";

    /**
     * Facebook Open Graph: This is how you ensure that a particular thumbnail will be shown when your page is shared.
     */
    ogImagePermalinkKey?: string;

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