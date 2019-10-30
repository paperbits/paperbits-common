import template from "./page.html";
import { HtmlDocumentProvider } from "./htmlDocumentProvider";
import { HtmlPage } from "./htmlPage";

export interface HtmlPagePublisherPlugin {
    apply(document: Document, page?: HtmlPage): void;
}

export class HtmlPagePublisher {
    constructor(
        private readonly htmlDocumentProvider: HtmlDocumentProvider,
        private readonly htmlPagePublisherPlugins: HtmlPagePublisherPlugin[]
    ) { }

    private appendMetaTag(document: Document, name: string, content: string): void {
        const element: HTMLMetaElement = document.createElement("meta");
        element.setAttribute("name", name);
        element.setAttribute("content", content);

        document.head.appendChild(element);
    }

    private appendFaviconLink(permalink: string): void {
        const faviconLinkElement = document.createElement("link");
        faviconLinkElement.setAttribute("rel", "shortcut icon");
        faviconLinkElement.setAttribute("href", permalink);
        document.head.insertAdjacentElement("afterbegin", faviconLinkElement);
    }

    public async renderHtml(page: HtmlPage): Promise<string> {
        const document = this.htmlDocumentProvider.createDocument(template);
        document.title = page.title;

        if (page.faviconPermalink) {
            this.appendFaviconLink(page.faviconPermalink);
        }

        if (page.description) {
            this.appendMetaTag(document, "description", page.description);
        }

        if (page.keywords) {
            this.appendMetaTag(document, "keywords", page.keywords);
        }

        if (page.author) {
            this.appendMetaTag(document, "author", page.author);
        }

        for (const plugin of this.htmlPagePublisherPlugins) {
            await plugin.apply(document, page);
        }

        return document.documentElement.outerHTML;
    }
}