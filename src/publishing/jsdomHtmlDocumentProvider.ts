import { HtmlDocumentProvider } from "./htmlDocumentProvider";
import { JSDOM } from "jsdom";

declare var global: any;

export class JsDomHtmlDocumentProvider implements HtmlDocumentProvider {
    public createDocument(html?: string): Document {
        const jsdom = new JSDOM(html, { runScripts: "outside-only" });
        const window = jsdom.window;
        
        global.window = window;
        global.document = window.document;
        global.navigator = window.navigator;

        return window.document;
    }
}