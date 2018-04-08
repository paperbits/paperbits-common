/**
 * Url metadata.
 */
export interface UrlContract {
    /**
     * Own key.
     */
    key?: string;

    /**
     * Url title.
     */
    title: string;

    /**
     * Url description.
     */
    description?: string;

    /**
     * Key of permalink referencing this url.
     */
    permalinkKey?: string;
}