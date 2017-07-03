import { IPermalinkService } from "./../permalinks/IPermalinkService";
import { IPageService } from "./../pages/IPageService";
import { IRouteHandler } from "./../routing/IRouteHandler";
import { PageModel } from "./models/pageModel";
import { IViewModelBinder } from "./IViewModelBinder";
import { IWidgetModel } from "./../editing/IWidgetModel";
import * as Utils from '../core/utils';
import { IFile } from '../files/IFile';
import { IFileService } from '../files/IFileService';
import { IPage } from '../pages/IPage';
import { SectionModelBinder } from "../widgets/sectionModelBinder";
import { SectionModel } from "../widgets/models/sectionModel";
import { ContentConfig } from "./../editing/contentNode";
import { IModelBinder } from "../editing/IModelBinder";
import { ISiteService } from "../sites/ISiteService";
import { ModelBinderSelector } from "./modelBinderSelector";
import { PlaceholderModel } from "./models/placeholderModel";

export class PageModelBinder implements IModelBinder {
    private readonly pageService: IPageService;
    private readonly permalinkService: IPermalinkService;
    private readonly fileService: IFileService;
    private readonly sectionModelBinder: SectionModelBinder;
    private readonly routeHandler: IRouteHandler;
    private readonly siteService: ISiteService;
    private readonly modelBinderSelector: ModelBinderSelector;

    constructor(pageService: IPageService, permalinkService: IPermalinkService, fileService: IFileService, sectionModelBinder: SectionModelBinder, routeHandler: IRouteHandler, siteService: ISiteService, modelBinderSelector: ModelBinderSelector) {
        this.pageService = pageService;
        this.permalinkService = permalinkService;
        this.fileService = fileService;
        this.sectionModelBinder = sectionModelBinder;
        this.routeHandler = routeHandler;
        this.siteService = siteService;
        this.modelBinderSelector = modelBinderSelector;

        // rebinding...
        this.nodeToModel = this.nodeToModel.bind(this);
        this.modelToWidgetModel = this.modelToWidgetModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "page";
    }

    public canHandleWidgetModel(model: Object): boolean {
        return model instanceof PageModel;
    }

    public async nodeToModel(pageConfig: IPage, layoutMode?: boolean): Promise<PageModel> {
        if (layoutMode) {
            // TODO: Make it regular page but readonly
            return await Promise.resolve(new PlaceholderModel());
        }

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
            return await modelBinder.nodeToModel(config, layoutMode);
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

    public async modelToWidgetModel(pageModel: PageModel): Promise<IWidgetModel> {
        let widgetModel: IWidgetModel = {
            name: "paperbits-page",
            params: {},
            nodeType: "page",
            model: pageModel
        };

        let widgetModelPromises = pageModel.sections.map(x => {
            let modelBinder = this.modelBinderSelector.getModelBinderByModel(x);
            return modelBinder.modelToWidgetModel(x, false);
        });

        widgetModel.children = await Promise.all(widgetModelPromises);

        widgetModel.setupViewModel = async (viewModel: IViewModelBinder) => {
            if (this.isChildrenChanged(widgetModel.children, pageModel.sections)) {
                widgetModel.children = await Promise.all(pageModel.sections.map(x => {
                    let modelBinder = this.modelBinderSelector.getModelBinderByModel(x);
                    return modelBinder.modelToWidgetModel(x, false);
                }));
            }

            if (viewModel.attachToModel) {
                viewModel.attachToModel(widgetModel);
            }
        };

        return widgetModel;
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
