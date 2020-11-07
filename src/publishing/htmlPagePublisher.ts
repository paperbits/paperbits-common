import { HtmlDocumentProvider } from "./htmlDocumentProvider";
import { HtmlPage } from "./htmlPage";
import { HtmlPageOptimizer } from "./htmlPageOptimizer";
import { HtmlPagePublisherPlugin } from "./htmlPagePublisherPlugin";


export class HtmlPagePublisher {
    constructor(
        private readonly htmlDocumentProvider: HtmlDocumentProvider,
        private readonly htmlPagePublisherPlugins: HtmlPagePublisherPlugin[],
        private readonly htmlPageOptimizer: HtmlPageOptimizer
    ) { }

    private appendMetaTag(document: Document, name: string, content: string): void {
        const element: HTMLMetaElement = document.createElement("meta");
        element.setAttribute("name", name);
        element.setAttribute("content", content);

        document.head.appendChild(element);
    }

    private appendStyleLink(document: Document, styleSheetUrl: string): void {
        const element: HTMLStyleElement = document.createElement("link");
        element.setAttribute("href", styleSheetUrl);
        element.setAttribute("rel", "stylesheet");
        element.setAttribute("type", "text/css");

        document.head.appendChild(element);
    }

    private appendFaviconLink(permalink: string): void {
        const faviconLinkElement = document.createElement("link");
        faviconLinkElement.setAttribute("rel", "shortcut icon");
        faviconLinkElement.setAttribute("href", permalink);
        document.head.insertAdjacentElement("afterbegin", faviconLinkElement);
    }

    public async renderHtml(page: HtmlPage, overridePlugins?: HtmlPagePublisherPlugin[]): Promise<string> {
        try {
            const document = this.htmlDocumentProvider.createDocument(page.template);
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

            page.styleReferences.forEach(reference => {
                this.appendStyleLink(document, reference);
            });

            if (overridePlugins) {
                for (const plugin of overridePlugins) {
                    await plugin.apply(document, page);
                }
            }
            else {
                for (const plugin of this.htmlPagePublisherPlugins) {
                    await plugin.apply(document, page);
                }
            }

            const htmlContent = "<!DOCTYPE html>" + document.documentElement.outerHTML;
            const optimizedHtmlContent = await this.htmlPageOptimizer.optimize(htmlContent);

            return optimizedHtmlContent;
        }
        catch (error) {
            throw new Error(`Unable to render page: ${error.stack}`);
        }
    }
}