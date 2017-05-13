import * as Utils from '../core/utils';
import { ISiteSettings } from "./../sites/ISiteSettings";
import { ISiteService } from "./../sites/ISiteService";
import { IPage } from "./../pages/IPage";
import { IPageService } from "./../pages/IPageService";
import { IPermalinkService } from "./../permalinks/IPermalinkService";
import { IBlobStorage } from "./../persistence/IBlobStorage";
import { IPublisher } from './IPublisher';
import { IRouteHandler } from "../routing/IRouteHandler";


export class PagePublisher implements IPublisher {
    private readonly routeHandler: IRouteHandler;
    private readonly permalinkService: IPermalinkService;
    private readonly outputBlobStorage: IBlobStorage;
    private readonly pageService: IPageService;
    private readonly siteService: ISiteService;
    private readonly siteSettings: ISiteSettings;

    constructor(routeHandler: IRouteHandler, pageService: IPageService, permalinkService: IPermalinkService, siteService: ISiteService, outputBlobStorage: IBlobStorage) {
        this.routeHandler = routeHandler;
        this.pageService = pageService;
        this.permalinkService = permalinkService;
        this.siteService = siteService;
        this.outputBlobStorage = outputBlobStorage;

        this.publish = this.publish.bind(this);
        this.renderPage = this.renderPage.bind(this);
    }

    private async renderPage(page: IPage): Promise<{ name, bytes }> {
        console.log(`Publishing page ${page.title}...`);

        let documentModel = {
            siteSettings: null,
            pageModel: page,
            pageContentModel: {},
            layoutContentModel: {},
            permalink: null
        }

        let siteSettingsPromise = new Promise<void>(async (resolve, reject) => {
            let settings = await this.siteService.getSiteSettings();
            documentModel.siteSettings = settings;
            resolve();
        });

        let resourceUri: string;
        let htmlContent: string;

        let buildContentPromise = new Promise<void>(async (resolve, reject) => {
            let permalink = await this.permalinkService.getPermalinkByKey(page.permalinkKey);

            documentModel.permalink = permalink;
            resourceUri = permalink.uri;

            this.routeHandler.navigateTo(resourceUri);

            setTimeout(() => {
                htmlContent = document.documentElement.outerHTML;
                resolve();
            }, 3000);
        });

        await Promise.all([siteSettingsPromise, buildContentPromise]);

        let contentBytes = Utils.stringToUnit8Array(htmlContent);

        if (!resourceUri || resourceUri === "/") {
            resourceUri = "/index.html";
        }
        else {
            // if filename has no extension we publish it to a dedicated folder with index.html
            if (!resourceUri.substr((~-resourceUri.lastIndexOf(".") >>> 0) + 2)) {
                resourceUri = `/${resourceUri}/index.html`;
            }
        }

        return { name: resourceUri, bytes: contentBytes };
    }

    public async publish(): Promise<void> {
        let pages = await this.pageService.search("");
        let results = [];

        for (let i = 0; i < pages.length; i++) {
            let page = await this.renderPage(pages[i]);

            results.push(this.outputBlobStorage.uploadBlob(page.name, page.bytes));
        }

        await Promise.all(results);
    }
}

