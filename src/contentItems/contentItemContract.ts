import { Bag } from "../";

/**
 * ContentItem metadata.
 */
export interface ContentItemContract {
    /**
     * Own key.
     */
    key?: string;

    /**
     * ContentItem title.
     */
    title: string;

    /**
     * ContentItem description. This property is included in SEO attributes.
     */
    description: string;

    /**
     * ContentItem keywords. This property is included in SEO attributes.
     */
    keywords: string;

    /**
     * Facebook Open Graph: This is how you describe the kind of object you are sharing: website, article, blog.
     */
    ogType?: "website" | "article" | "blog";

    /**
     * Facebook Open Graph: This is how you ensure that a particular thumbnail will be shown when your contentItem is shared.
     */
    ogImagePermalinkKey?: string;

    /**
     * Key of a document containing contentItem content.
     */
    contentKey?: string;

    /**
     * Permalink referencing this contentItem.
     */    
    permalink?: string;

    /**
     * Keys of anchors used in contentItem content. Anchor is a special type of a permalink.
     */
    anchors?: Bag<string>;
}