/**
 * URL metadata.
 */
export interface UrlContract {
    /**
     * Own key.
     */
    key?: string;

    /**
     * URL title.
     */
    title: string;

    /**
     * URL description.
     */
    description?: string;

    /**
     * Permalink of a resource.
     */
    permalink?: string;
}