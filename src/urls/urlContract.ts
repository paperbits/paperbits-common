/**
 * URL metadata.
 */
export interface UrlContract {
    /**
     * Own key, e.g. `urls/c25f5533-3e4d-4580-a7e2-09134ef9e0c3`.
     */
    key?: string;

    /**
     * URL title, e.g. `Google Fonts`.
     */
    title?: string;

    /**
     * URL description.
     */
    description?: string;

    /**
     * Permalink of a resource, e.g. `https://fonts.google.com`;
     */
    permalink?: string;
}