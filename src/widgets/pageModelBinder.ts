import { IPermalinkService } from "./../permalinks/IPermalinkService";
import { IPageService } from "./../pages/IPageService";
import { IRouteHandler } from "./../routing/IRouteHandler";
import { PageModel } from "./models/pageModel";
import * as Utils from '../core/utils';
import { IFileService } from '../files/IFileService';
import { IPage } from '../pages/IPage';
import { ContentConfig } from "./../editing/contentNode";
import { IModelBinder } from "../editing/IModelBinder";
import { ISiteService } from "../sites/ISiteService";
import { ModelBinderSelector } from "./modelBinderSelector";


export class PageModelBinder implements IModelBinder {
    private readonly pageService: IPageService;
    private readonly permalinkService: IPermalinkService;
    private readonly fileService: IFileService;
    private readonly routeHandler: IRouteHandler;
    private readonly siteService: ISiteService;
    private readonly modelBinderSelector: ModelBinderSelector;

    constructor(pageService: IPageService, permalinkService: IPermalinkService, fileService: IFileService, routeHandler: IRouteHandler, siteService: ISiteService, modelBinderSelector: ModelBinderSelector) {
        this.pageService = pageService;
        this.permalinkService = permalinkService;
        this.fileService = fileService;
        this.routeHandler = routeHandler;
        this.siteService = siteService;
        this.modelBinderSelector = modelBinderSelector;

        // rebinding...
        this.nodeToModel = this.nodeToModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "page";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof PageModel;
    }

    public async nodeToModel(pageConfig: IPage): Promise<PageModel> {
        let type = "page";

        if (!pageConfig.key) {
            let currentUrl = this.routeHandler.getCurrentUrl();
            let permalink = await this.permalinkService.getPermalinkByUrl(currentUrl);
            let pageKey = permalink.targetKey;

            if (pageKey.startsWith("posts")) {
                type = "post"
            }

            pageConfig = await this.pageService.getPageByKey(pageKey);
        }

        let pageModel = new PageModel();
        pageModel.title = pageConfig.title;
        pageModel.description = pageConfig.description;
        pageModel.keywords = pageConfig.keywords;

        let pageContentNode = await this.fileService.getFileByKey(pageConfig.contentKey);
        let modelPromises = pageContentNode.nodes.map(async (config) => {
            let modelBinder = this.modelBinderSelector.getModelBinderByNodeType(config.type);
            return await modelBinder.nodeToModel(config);
        });

        let models = await Promise.all<any>(modelPromises);
        pageModel.sections = models;

        let settings = await this.siteService.getSiteSettings();

        switch (type) {
            case "page":
                document.title = `${settings.title} | ${pageModel.title}`;
                break;
            case "post":
                document.title = `${settings.title} | Blog - ${pageModel.title}`;
                break;
            case "news":
                document.title = `${settings.title} | News - ${pageModel.title}`;
                break;
            default:
                throw "Unknown type";
        }

        return pageModel;
    }

    private isChildrenChanged(widgetChildren: any[], modelItems: any[]) {
        return (widgetChildren && !modelItems) ||
            (!widgetChildren && modelItems) ||
            (widgetChildren && modelItems && widgetChildren.length !== modelItems.length);
    }

    public getConfig(pageModel: PageModel): ContentConfig {
        let pageConfig: ContentConfig = {
            kind: "block",
            type: "page",
            nodes: []
        };
        pageModel.sections.forEach(section => {
            let modelBinder = this.modelBinderSelector.getModelBinderByModel(section);
            pageConfig.nodes.push(modelBinder.getConfig(section));
        });

        return pageConfig;
    }

    public async updateContent(pageModel: PageModel): Promise<void> {
        let url = this.routeHandler.getCurrentUrl();
        let permalink = await this.permalinkService.getPermalinkByUrl(url);
        let pageKey = permalink.targetKey;
        let page = await this.pageService.getPageByKey(pageKey);
        let file = await this.fileService.getFileByKey(page.contentKey);
        let config = this.getConfig(pageModel);

        Object.assign(file, config);

        await this.fileService.updateFile(file);
    }
}
