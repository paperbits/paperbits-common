/**
 * Entity describing searchable document.
 */
export interface SearchableDocument {
    /**
     * Document location.
     */
    ref: string;

    /**
     * Document title, e.g. "About".
     */
    title: string;

    /**
     * Document description.
     */
    summary: string;

    /**
     * Document content.
     */
    body: string;
}
