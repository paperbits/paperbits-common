import * as Utils from '../core/utils';
import { ISiteSettings } from "./../sites/ISiteSettings";
import { ISiteService } from "./../sites/ISiteService";
import { INewsArticle } from "./../news/INewsElement";
import { INewsService } from "./../news/INewsService";
import { IPermalinkService } from "./../permalinks/IPermalinkService";
import { IBlobStorage } from "./../persistence/IBlobStorage";
import { PageModelBinder } from "../widgets/pageModelBinder";
import { IPublisher } from './IPublisher';
import { LayoutModelBinder } from "../widgets/layoutModelBinder";
import { IRouteHandler } from "../routing/IRouteHandler";


export class NewsPublisher implements IPublisher {
    private readonly layoutModelBinder: LayoutModelBinder;
    private readonly newsElementModelBinder: PageModelBinder;
    private readonly routeHandler: IRouteHandler;
    private readonly permalinkService: IPermalinkService;
    private readonly outputBlobStorage: IBlobStorage;
    private readonly newsElementService: INewsService;
    private readonly siteService: ISiteService;
    private readonly siteSettings: ISiteSettings;

    constructor(pageModelBinder: PageModelBinder, layoutModelBinder: LayoutModelBinder, routeHandler: IRouteHandler, newsService: INewsService, permalinkService: IPermalinkService, siteService: ISiteService, outputBlobStorage: IBlobStorage) {
        this.newsElementModelBinder = pageModelBinder;
        this.layoutModelBinder = layoutModelBinder;
        this.routeHandler = routeHandler;
        this.newsElementService = newsService;
        this.permalinkService = permalinkService;
        this.siteService = siteService;
        this.outputBlobStorage = outputBlobStorage;

        this.publish = this.publish.bind(this);
        this.renderNewsElement = this.renderNewsElement.bind(this);
    }

    private async renderNewsElement(article: INewsArticle): Promise<{ name, bytes }> {
        console.log(`Publishing news element ${article.title}...`);

        let documentModel = {
            siteSettings: null,
            pageModel: article,
            pageContentModel: {},
            layoutContentModel: {},
            permalink: null
        }

        let siteSettingsPromise = new Promise(async (resolve, reject) => {
            let settings = await this.siteService.getSiteSettings();
            documentModel.siteSettings = settings;
            resolve();
        });

        let resourceUri: string;
        let htmlContent: string;

        let buildContentPromise = new Promise(async (resolve, reject) => {
            let permalink = await this.permalinkService.getPermalinkByKey(article.permalinkKey);
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

        if (!resourceUri || resourceUri === "/news") {
            resourceUri = "/news/index.html";
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
        let newsElements = await this.newsElementService.search("");
        let results = [];

        for (let i = 0; i < newsElements.length; i++) {
            let page = await this.renderNewsElement(newsElements[i]);
            results.push(this.outputBlobStorage.uploadBlob(page.name, page.bytes));
        }
        
        await Promise.all(results);
    }
}
