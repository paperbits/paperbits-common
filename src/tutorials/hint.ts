/**
 * A hint that is shown to the user in certain context.
 */
export interface Hint {
    /**
     * Unique hint identifier.
     */
    key: string;

    /**
     * HTML content.
     */
    content: string;
}