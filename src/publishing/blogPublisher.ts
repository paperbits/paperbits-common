import * as Utils from '../core/utils';
import { ISiteSettings } from "./../sites/ISiteSettings";
import { ISiteService } from "./../sites/ISiteService";
import { IBlogPost } from "./../blogs/IBlogPost";
import { IBlogService } from "./../blogs/IBlogService";
import { IPermalinkService } from "./../permalinks/IPermalinkService";
import { IBlobStorage } from "./../persistence/IBlobStorage";
import { PageModelBinder } from "../widgets/page/pageModelBinder";
import { IPublisher } from './IPublisher';
import { LayoutModelBinder } from "../widgets/layout/layoutModelBinder";
import { IRouteHandler } from "../routing/IRouteHandler";


export class BlogPublisher implements IPublisher {
    private readonly layoutModelBinder: LayoutModelBinder;
    private readonly blogPostModelBinder: PageModelBinder;
    private readonly routeHandler: IRouteHandler;
    private readonly permalinkService: IPermalinkService;
    private readonly outputBlobStorage: IBlobStorage;
    private readonly blogPostService: IBlogService;
    private readonly siteService: ISiteService;
    private readonly siteSettings: ISiteSettings;

    constructor(pageModelBinder: PageModelBinder, layoutModelBinder: LayoutModelBinder, routeHandler: IRouteHandler, blogService: IBlogService, permalinkService: IPermalinkService, siteService: ISiteService, outputBlobStorage: IBlobStorage) {
        this.blogPostModelBinder = pageModelBinder;
        this.layoutModelBinder = layoutModelBinder;
        this.routeHandler = routeHandler;
        this.blogPostService = blogService;
        this.permalinkService = permalinkService;
        this.siteService = siteService;
        this.outputBlobStorage = outputBlobStorage;

        this.publish = this.publish.bind(this);
        this.renderBlogPost = this.renderBlogPost.bind(this);
    }

    private async renderBlogPost(post: IBlogPost): Promise<{ name, bytes }> {
        console.log(`Publishing blog post ${post.title}...`);

        let documentModel = {
            siteSettings: null,
            pageModel: post,
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
            let permalink = await this.permalinkService.getPermalinkByKey(post.permalinkKey);
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

        if (!resourceUri || resourceUri === "/blog") {
            resourceUri = "/blog/index.html";
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
        let blogPosts = await this.blogPostService.search("");
        let results = [];
        for (let i = 0; i < blogPosts.length; i++) {
            let page = await this.renderBlogPost(blogPosts[i]);
            results.push(this.outputBlobStorage.uploadBlob(page.name, page.bytes));
        }
        await Promise.all(results);
    }
}
