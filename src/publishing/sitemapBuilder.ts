import { ISiteService, SiteSettingsContract } from "../sites";

export class SitemapBuilder {
    private readonly permalinks: string[];

    constructor(private readonly siteService: ISiteService) {
        this.permalinks = [];
    }

    public appendPermalink(permalink: string): void {
        this.permalinks.push(permalink);
    }

    public async buildSitemap(): Promise<string> {
        try {
            const settings = await this.siteService.getSettings<any>();
            const siteSettings: SiteSettingsContract = settings.site;
            const hostname = siteSettings?.hostname;
            const baseUrl = hostname ? `https://${hostname}` : "";

            const now = new Date();
            const dateTimeISO = now.toISOString();
            const urls = this.permalinks.map(permalink =>
                `<url><loc>${baseUrl}${permalink}</loc><lastmod>${dateTimeISO}</lastmod><changefreq>daily</changefreq></url>`
            ).join("");

            return `<?xml version="1.0" encoding="utf-8"?><urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="https://www.w3.org/1999/xhtml">${urls}</urlset>`;
        }
        catch (error) {
            throw new Error(`Unable to build sitemap: ${error.stack || error.message}`);
        }
    }
}