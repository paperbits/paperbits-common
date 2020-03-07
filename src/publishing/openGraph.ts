export interface OpenGraphImage {
    /**
     * og:image, e.g. https://example.com/social.jpg
     */
    sourceKey: string;

    /**
     * og:image:width, e.g. 1200
     */
    width: string;

    /**
     * og:image:height, e.g. 620
     */
    height: string;
}

/**
 * The Open Graph protocol enables any web page to become a rich object in a social graph.
 * @see http://ogp.me/
 */
export interface OpenGraph {
    /**
     * og:type
     */
    type: string;

    /**
     * og:title
     */
    title?: string;

    /**
     * og:site_name
     */
    siteName?: string;

    /**
     * og:description
     */
    description?: string;

    /**
     * og:url
     */
    url?: string;

    image?: OpenGraphImage;
}