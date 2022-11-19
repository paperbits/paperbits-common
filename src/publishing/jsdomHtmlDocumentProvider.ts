import { HtmlDocumentProvider } from "./htmlDocumentProvider";
import { JSDOM } from "jsdom";

export class JsDomHtmlDocumentProvider implements HtmlDocumentProvider {
    public createDocument(html?: string): Document {
        const jsdom = new JSDOM(html, { runScripts: "outside-only" });
        const window = jsdom.window;

        return window.document;
    }
}