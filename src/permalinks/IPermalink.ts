/**
 * Permalink metadata. A stucture used for referencing content objects like pages or media files.
 */
export interface IPermalink {
    /**
     * Own key.
     */
    key: string;

    /**
     * Target entity key.
     */
    targetKey: string;

    /**
     * Target URL.
     */
    uri: string;

    /**
     * Key of parent permalink.
     */
    parentKey?: string;
}