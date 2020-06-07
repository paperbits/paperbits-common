import { ISiteService, SiteSettingsContract } from "../sites";
import { HtmlPage } from "./htmlPage";
import { HtmlPagePublisherPlugin } from "./htmlPagePublisherPlugin";


export class LinkedDataHtmlPagePublisherPlugin implements HtmlPagePublisherPlugin {
    constructor(private readonly siteService: ISiteService) { }

    public async apply(document: Document, page: HtmlPage): Promise<void> {
        let linkedDataObject: any = page.linkedData;

        /* Ensure rendering structured data for home page only */
        if (page.permalink !== "/" && !linkedDataObject) {
            return;
        }

        if (!linkedDataObject) {
            const settings = await this.siteService.getSettings<any>();
            const siteSettings: SiteSettingsContract = settings.site;

            linkedDataObject = {
                "@context": "http://www.schema.org",
                "@type": "Organization",
                "name": siteSettings.title,
                "description": siteSettings.description
            };
        }

        const structuredDataScriptElement = document.createElement("script");
        structuredDataScriptElement.setAttribute("type", "application/ld+json");
        structuredDataScriptElement.innerHTML = JSON.stringify(linkedDataObject);
        document.head.appendChild(structuredDataScriptElement);
    }
}
