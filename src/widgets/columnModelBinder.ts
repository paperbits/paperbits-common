import { IViewModelBinder } from "./IViewModelBinder";
import { IWidgetModel } from "./../editing/IWidgetModel";
import { IColumnNode } from "./models/IColumnNode";
import { IModelBinder } from "./../editing/IModelBinder";
import { ContentConfig } from "./../editing/contentNode";
import { ModelBinderSelector } from "./modelBinderSelector";
import { ColumnModel } from "./models/columnModel";

export class ColumnModelBinder {
    private readonly modelBinderSelector: ModelBinderSelector;

    constructor(modelBinderSelector: ModelBinderSelector) {
        this.modelBinderSelector = modelBinderSelector;

        this.nodeToModel = this.nodeToModel.bind(this);
        this.modelToWidgetModel = this.modelToWidgetModel.bind(this);
    }

    public async nodeToModel(node: IColumnNode): Promise<ColumnModel> {
        let columnModel = new ColumnModel();

        if (node.size) {
            columnModel.sizeSm = Number.parseInt(node.size.sm);
            columnModel.sizeMd = Number.parseInt(node.size.md);
            columnModel.sizeLg = Number.parseInt(node.size.lg);
        }

        if (node.alignment) {
            columnModel.alignmentSm = node.alignment.sm;
            columnModel.alignmentMd = node.alignment.md
            columnModel.alignmentLg = node.alignment.lg;
        }

        if (!node.nodes) {
            node.nodes = [];
        }

        let modelPromises = node.nodes.map(async (node) => {
            let modelBinder: IModelBinder = this.modelBinderSelector.getModelBinderByNodeType(node.type);
            return await modelBinder.nodeToModel(node);
        });

        columnModel.widgets = await Promise.all<any>(modelPromises);

        return columnModel;
    }

    public async modelToWidgetModel(model: ColumnModel, readonly: boolean = false): Promise<IWidgetModel> {
        let widgetModel: IWidgetModel = {
            name: "layout-column",
            params: {},
            nodeType: "layout-column",
            model: model,
            editor: "layout-column-editor",
            readonly: readonly
        };

        widgetModel.children = await this.getWidgetsFromModel(model.widgets, readonly);

        widgetModel.setupViewModel = async (viewModel: IViewModelBinder) => {
            if (this.isChildrenChanged(widgetModel.children, model.widgets)) {
                widgetModel.children = await this.getWidgetsFromModel(model.widgets, readonly);
            }
            viewModel.attachToModel(widgetModel);
        };

        return widgetModel;
    }

    private async getWidgetsFromModel(widgetModels: any[], readonly: boolean): Promise<IWidgetModel[]> {
        return await Promise.all(widgetModels.map(async (widget) => {
            let modelBinder: IModelBinder = this.modelBinderSelector.getModelBinderByModel(widget);
            return await modelBinder.modelToWidgetModel(widget, readonly);
        }));
    }

    private isChildrenChanged(widgetChildren: any[], modelItems: any[]) {
        return true;

        // return (widgetChildren && !modelItems) ||
        //     (!widgetChildren && modelItems) ||
        //     (widgetChildren && modelItems && widgetChildren.length !== modelItems.length);
    }

    public getColumnConfig(columnModel: ColumnModel): ContentConfig {
        let columnConfig: IColumnNode = {
            type: "layout-column",
            kind: "block",
            nodes: []
        };

        columnConfig.size = {};
        columnConfig.alignment = {}

        if (columnModel.sizeSm) {
            columnConfig.size.sm = columnModel.sizeSm.toString();
        }

        if (columnModel.sizeMd) {
            columnConfig.size.md = columnModel.sizeMd.toString();
        }

        if (columnModel.sizeLg) {
            columnConfig.size.lg = columnModel.sizeLg.toString();
        }

        if (columnModel.alignmentSm) {
            columnConfig.alignment.sm = columnModel.alignmentSm;
        }

        if (columnModel.alignmentMd) {
            columnConfig.alignment.md = columnModel.alignmentMd;
        }

        if (columnModel.alignmentLg) {
            columnConfig.alignment.lg = columnModel.alignmentLg;
        }

        columnModel.widgets.forEach(widgetModel => {
            let modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            columnConfig.nodes.push(modelBinder.getConfig(widgetModel));

        });

        return columnConfig;
    }
}
