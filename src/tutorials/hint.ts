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

    /**
     * Optional override of the title of the hint.
     */
    title?: string;

    /**
     * Optional override of the close button text of the hint.
     */
    actionTitle?: string;
}