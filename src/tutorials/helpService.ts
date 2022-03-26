export interface HelpService {
    /**
     * Returns Markdown/HTML content by the specified article key.
     * @param articleKey Article key, e.g. `texteditor/hyperlinks/popups`.
     */
    getHelpContent(articleKey: string): Promise<string>;
}