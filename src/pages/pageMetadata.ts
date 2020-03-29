import { SocialShareData } from "./socialShareData";

/**
 * Page metadata.
 */
export interface PageMetadata {
    /**
     * Page title.
     */
    title?: string;

    /**
     * Page description. This property is included in SEO attributes.
     */
    description?: string;

    /**
     * Page keywords. This property is included in SEO attributes.
     */
    keywords?: string;

    /**
     * Key of a document containing page content.
     */
    contentKey?: string;

    /**
     * Permalink referencing this page.
     */    
    permalink?: string;

    /**
     * JSON-LD (JavaScript Object Notation for Linked Data) for this page.
     * Note: This is temporary solution until seo module is in-place.
     */    
    jsonLd?: string;

    /**
     * Text and image that display when this page is shared on social networks.
     */
    socialShareData?: SocialShareData;
}
