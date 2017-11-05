import { IRouteHandler } from "./../../routing/IRouteHandler";
import { ILayout } from "./../../layouts/ILayout";
import { LayoutModel } from "./layoutModel";
import { IViewModelBinder } from "./../IViewModelBinder";
import { IWidgetBinding } from "./../../editing/IWidgetBinding";
import { IFileService } from '../../files/IFileService';
import { Contract } from "./../../editing/contentNode";
import { PlaceholderModel } from "../placeholder/placeholderModel";
import { ILayoutService } from "../../layouts/ILayoutService";
import { ModelBinderSelector } from "./../modelBinderSelector";
import { PageModel } from "../page/pageModel";


export class LayoutModelBinder {
    private readonly routeHandler: IRouteHandler;
    private readonly fileService: IFileService;
    private readonly layoutService: ILayoutService;
    private readonly modelBinderSelector: ModelBinderSelector;

    constructor(fileService: IFileService, layoutService: ILayoutService, routeHandler: IRouteHandler, modelBinderSelector: ModelBinderSelector) {
        this.fileService = fileService;
        this.layoutService = layoutService;
        this.routeHandler = routeHandler;
        this.modelBinderSelector = modelBinderSelector;

        // rebinding...
        this.nodeToModel = this.nodeToModel.bind(this);
    }

    public async getLayoutModel(url: string, readonly?:boolean): Promise<LayoutModel> {
        const layoutNode = await this.layoutService.getLayoutByRoute(url);

        return await this.nodeToModel(layoutNode, url, readonly);
    }

    public async nodeToModel(layoutNode: ILayout, currentUrl: string, readonly?:boolean): Promise<LayoutModel> {
        let layoutModel = new LayoutModel();
        layoutModel.title = layoutNode.title;
        layoutModel.description = layoutNode.description;
        layoutModel.uriTemplate = layoutNode.uriTemplate;

        let layoutContentNode = await this.fileService.getFileByKey(layoutNode.contentKey);

        let modelPromises = layoutContentNode.nodes.map(async (config) => {
            if(!readonly && config.type === "page") {
                return new PageModel();
            }
            let modelBinder = this.modelBinderSelector.getModelBinderByNodeType(config.type);

            return await modelBinder.nodeToModel(config, currentUrl);
        });

        let models = await Promise.all<any>(modelPromises);
        layoutModel.sections = models;

        return layoutModel;
    }

    private isChildrenChanged(widgetChildren: any[], modelItems: any[]) {
        return (widgetChildren && !modelItems) ||
            (!widgetChildren && modelItems) ||
            (widgetChildren && modelItems && widgetChildren.length !== modelItems.length);
    }

    public getConfig(layoutModel: LayoutModel): Contract {
        let layoutConfig: Contract = {
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

    public async setConfig(layout: ILayout, config: Contract): Promise<void> {
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