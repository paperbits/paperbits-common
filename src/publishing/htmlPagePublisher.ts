import { MimeTypes } from "@paperbits/common";
import { Attributes } from "@paperbits/common/html";
import { HtmlDocumentProvider } from "./htmlDocumentProvider";
import { HtmlPage } from "./htmlPage";
import { HtmlPageOptimizer } from "./htmlPageOptimizer";
import { HtmlPagePublisherPlugin } from "./htmlPagePublisherPlugin";
import { SourceLink } from "./sourceLink";


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

    private appendStyleLink(document: Document, stylesheetLink: SourceLink): void {
        const element: HTMLStyleElement = document.createElement("link");
        element.setAttribute(Attributes.Href, stylesheetLink.src);

        if (stylesheetLink.integrity) {
            element.setAttribute(Attributes.Integrity, stylesheetLink.integrity);
        }

        element.setAttribute(Attributes.Rel, "stylesheet");
        element.setAttribute(Attributes.Type, MimeTypes.textCss);

        document.head.appendChild(element);
    }

    private appendFaviconLink(document: Document, permalink: string): void {
        const faviconLinkElement = document.createElement("link");
        faviconLinkElement.setAttribute(Attributes.Rel, "shortcut icon");
        faviconLinkElement.setAttribute(Attributes.Href, permalink);
        document.head.insertAdjacentElement("afterbegin", faviconLinkElement);
    }

    public async renderHtml(page: HtmlPage, overridePlugins?: HtmlPagePublisherPlugin[]): Promise<string> {
        try {
            const document = this.htmlDocumentProvider.createDocument(page.template);
            document.title = page.title;

            if (page.faviconPermalink) {
                this.appendFaviconLink(document, page.faviconPermalink);
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

            if (page.locale) {
                document.documentElement.setAttribute("lang", page.locale.code.split("-")[0]);

                if (page.locale.direction) {
                    document.documentElement.setAttribute("dir", page.locale.direction);
                }
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
            document.defaultView.window.close();

            const optimizedHtmlContent = await this.htmlPageOptimizer.optimize(htmlContent);

            return optimizedHtmlContent;
        }
        catch (error) {
            throw new Error(`Unable to render page: ${error.stack}`);
        }
    }
}