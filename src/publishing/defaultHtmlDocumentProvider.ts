import { HtmlDocumentProvider } from "./htmlDocumentProvider";


export class DefaultHtmlDocumentProvider implements HtmlDocumentProvider {
    public createDocument(html?: string): Document {
        const document = window.document;
        document.open();
        document.write(html);
        document.close();

        return document;
    }
}