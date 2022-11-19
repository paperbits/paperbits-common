import { HtmlDocumentProvider } from "./htmlDocumentProvider";
import { Window } from 'happy-dom';

// declare var global: any;

export class HappydomHtmlDocumentProvider implements HtmlDocumentProvider {
    public createDocument(html?: string): Document {
        const window = new Window();
        // global.window = window;
        // global.document = window.document;
        // global.navigator = window.navigator;

        return <any>window.document;
    }
}