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
    ogImageSourceKey?: string;

    /**
     * Key of a document containing page content.
     */
    contentKey?: string;

    /**
     * Permalink referencing this page.
     */    
    permalink?: string;
}