/**
 * Provides an HTML document.
 */
export interface HtmlDocumentProvider {
    /**
     * Creates an HTML document.
     * @param html - Initial HTML content.
     */
    createDocument(html?: string): Document;
}
