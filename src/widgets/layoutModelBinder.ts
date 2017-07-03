import { IPermalinkService } from "./../permalinks/IPermalinkService";
import { IRouteHandler } from "./../routing/IRouteHandler";
import { IPageService } from "./../pages/IPageService";
import { PageModel } from "./models/pageModel";
import { IPage } from "./../pages/IPage";
import { PageModelBinder } from "./pageModelBinder";
import { ILayout } from "./../layouts/ILayout";
import { LayoutModel } from "./models/layoutModel";
import { IViewModelBinder } from "./IViewModelBinder";
import { IWidgetModel } from "./../editing/IWidgetModel";
import { IFileService } from '../files/IFileService';
import { SectionModelBinder } from "../widgets/sectionModelBinder";
import { SectionModel } from "../widgets/models/sectionModel";
import { ContentConfig } from "./../editing/contentNode";
import { PlaceholderModel } from "./models/placeholderModel";
import { ILayoutService } from "../layouts/ILayoutService";
import { ISiteService } from "../sites/ISiteService";
import { ModelBinderSelector } from "./modelBinderSelector";


export class LayoutModelBinder {
    private readonly routeHandler: IRouteHandler;
    private readonly fileService: IFileService;
    private readonly layoutService: ILayoutService;
    private readonly pageService: IPageService;
    private readonly pageModelBinder: PageModelBinder;
    private readonly modelBinderSelector: ModelBinderSelector;

    constructor(fileService: IFileService, layoutService: ILayoutService, routeHandler: IRouteHandler, pageModelBinder: PageModelBinder, layoutModelBinderSelector: ModelBinderSelector) {
        this.fileService = fileService;
        this.layoutService = layoutService;
        this.routeHandler = routeHandler;
        this.pageModelBinder = pageModelBinder;
        this.modelBinderSelector = layoutModelBinderSelector;

        // rebinding...
        this.nodeToModel = this.nodeToModel.bind(this);
        this.modelToWidgetModel = this.modelToWidgetModel.bind(this);
    }

    public async getCurrentLayout(layoutMode?: boolean): Promise<IWidgetModel> {
        let layoutModel = await this.getCurrentLayoutModel(layoutMode);
        let layoutComponentAreReadonly = !layoutMode;

        return await this.modelToWidgetModel(layoutModel, layoutComponentAreReadonly);
    }

    public async getCurrentLayoutModel(layoutMode?: boolean): Promise<LayoutModel> {
        let url = this.routeHandler.getCurrentUrl();
        let layoutNode = await this.layoutService.getLayoutByRoute(url);

        return await this.nodeToModel(layoutNode, url, layoutMode);
    }

    public async nodeToModel(layoutNode: ILayout, currentUrl: string, layoutMode?: boolean): Promise<LayoutModel> {
        let layoutModel = new LayoutModel();
        layoutModel.title = layoutNode.title;
        layoutModel.description = layoutNode.description;
        layoutModel.uriTemplate = layoutNode.uriTemplate;

        let layoutContentNode = await this.fileService.getFileByKey(layoutNode.contentKey);

        let modelPromises = layoutContentNode.nodes.map(async (config) => {
            let modelBinder = this.modelBinderSelector.getModelBinderByNodeType(config.type);

            return await modelBinder.nodeToModel(config, layoutMode);
        });

        let models = await Promise.all<any>(modelPromises);
        layoutModel.sections = models;

        return layoutModel;
    }

    public async modelToWidgetModel(model: LayoutModel, readonly: boolean = false): Promise<IWidgetModel> {
        let widgetModel: IWidgetModel = {
            name: "paperbits-layout",
            params: {},
            nodeType: "layout",
            model: model,
            readonly: readonly
        };

        widgetModel.children = await this.getWidgetsFromModel(model.sections, readonly);

        widgetModel.setupViewModel = async (viewModel: IViewModelBinder) => {
            if (this.isChildrenChanged(widgetModel.children, model.sections)) {
                widgetModel.children = await this.getWidgetsFromModel(model.sections);
            }

            if (viewModel.attachToModel) {
                viewModel.attachToModel(widgetModel);
            }
        };

        return widgetModel;
    }

    private async getWidgetsFromModel(models: any[], readonly: boolean = false): Promise<IWidgetModel[]> {
        return await Promise.all(models.map(async (model) => {
            if (model instanceof PlaceholderModel) {
                let widgetModel: IWidgetModel = {
                    name: "paperbits-placeholder",
                    params: {},
                    nodeType: "placeholder",
                    setupViewModel: (viewModel: IViewModelBinder) => {
                        if (viewModel.attachToModel) {
                            viewModel.attachToModel(model);
                        }
                    },
                    model: model
                };
                return await Promise.resolve(widgetModel);
            }
            else {
                let modelBinder = this.modelBinderSelector.getModelBinderByModel(model);

                return await modelBinder.modelToWidgetModel(model, readonly);
            }
        }));
    }

    private isChildrenChanged(widgetChildren: any[], modelItems: any[]) {
        return (widgetChildren && !modelItems) ||
            (!widgetChildren && modelItems) ||
            (widgetChildren && modelItems && widgetChildren.length !== modelItems.length);
    }

    public getConfig(layoutModel: LayoutModel): ContentConfig {
        let layoutConfig: ContentConfig = {
            kind: "block",
            type: "layout",
            nodes: []
        };
        layoutModel.sections.forEach(model => {
            if (model instanceof PlaceholderModel) {
                layoutConfig.nodes.push({ kind: "block", type: "page" });
            }
            else {
                let modelBinder = this.modelBinderSelector.getModelBinderByModel(model);
                layoutConfig.nodes.push(modelBinder.getConfig(model));
            }
        });

        return layoutConfig;
    }

    public async setConfig(layout: ILayout, config: ContentConfig): Promise<void> {
        let file = await this.fileService.getFileByKey(layout.contentKey);

        Object.assign(file, config);

        await this.fileService.updateFile(file);
    }

    public async updateContent(layoutModel: LayoutModel): Promise<void> {
        let url = this.routeHandler.getCurrentUrl();
        let layout = await this.layoutService.getLayoutByRoute(url);
        let file = await this.fileService.getFileByKey(layout.contentKey);
        let config = this.getConfig(layoutModel);

        Object.assign(file, config);

        await this.fileService.updateFile(file);
    }
}
