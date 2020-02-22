/**
 * Permalink contract. A stucture used for referencing content objects like pages or media files.
 */
export interface PermalinkContract {
    /**
     * Own key.
     */
    key: string;

    /**
     * Target entity key.
     */
    targetKey?: string;

    /**
     * Target entity type. Example: "page", "blog", "external".
     */
    targetType?: string;

    /**
     * Target URL.
     */
    uri: string;
}