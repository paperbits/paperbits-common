import { IViewModelBinder } from "./../IViewModelBinder";
import { IWidgetBinding } from "./../../editing/IWidgetBinding";
import { IModelBinder } from "./../../editing/IModelBinder";
import { Contract } from "./../../contract";
import { ModelBinderSelector } from "./../modelBinderSelector";
import { ColumnModel } from "./columnModel";
import { ColumnContract } from "./columnContract";


export class ColumnModelBinder {
    private readonly modelBinderSelector: ModelBinderSelector;

    constructor(modelBinderSelector: ModelBinderSelector) {
        this.modelBinderSelector = modelBinderSelector;

        this.nodeToModel = this.nodeToModel.bind(this);
    }

    public async nodeToModel(node: ColumnContract): Promise<ColumnModel> {
        let columnModel = new ColumnModel();

        if (node.size) {
            columnModel.sizeXs = Number.parseInt(node.size.xs);
            columnModel.sizeSm = Number.parseInt(node.size.sm);
            columnModel.sizeMd = Number.parseInt(node.size.md);
            columnModel.sizeLg = Number.parseInt(node.size.lg);
            columnModel.sizeXl = Number.parseInt(node.size.xl);
        }

        if (node.alignment) {
            columnModel.alignmentXs = node.alignment.xs;
            columnModel.alignmentSm = node.alignment.sm;
            columnModel.alignmentMd = node.alignment.md
            columnModel.alignmentLg = node.alignment.lg;
            columnModel.alignmentXl = node.alignment.xl;
        }

        if (node.order) {
            columnModel.orderXs = Number.parseInt(node.order.xs);
            columnModel.orderSm = Number.parseInt(node.order.sm);
            columnModel.orderMd = Number.parseInt(node.order.md);
            columnModel.orderLg = Number.parseInt(node.order.lg);
            columnModel.orderXl = Number.parseInt(node.order.xl);
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

    public getColumnConfig(columnModel: ColumnModel): Contract {
        let columnConfig: ColumnContract = {
            type: "layout-column",
            object: "block",
            nodes: []
        };

        columnConfig.size = {};
        columnConfig.alignment = {}
        columnConfig.order = {}

        if (columnModel.sizeSm) {
            columnConfig.size.sm = columnModel.sizeSm.toString();
        }

        if (columnModel.sizeMd) {
            columnConfig.size.md = columnModel.sizeMd.toString();
        }

        if (columnModel.sizeLg) {
            columnConfig.size.lg = columnModel.sizeLg.toString();
        }

        if (columnModel.sizeXl) {
            columnConfig.size.xl = columnModel.sizeXl.toString();
        }

        if (columnModel.alignmentXs) {
            columnConfig.alignment.xs = columnModel.alignmentXs;
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

        if (columnModel.alignmentXl) {
            columnConfig.alignment.xl = columnModel.alignmentXl;
        }

        if (columnModel.orderXs) {
            columnConfig.order.xs = columnModel.orderXs.toString();
        }

        if (columnModel.orderSm) {
            columnConfig.order.sm = columnModel.orderSm.toString();
        }

        if (columnModel.orderMd) {
            columnConfig.order.md = columnModel.orderMd.toString();
        }

        if (columnModel.orderLg) {
            columnConfig.order.lg = columnModel.orderLg.toString();
        }

        if (columnModel.orderXl) {
            columnConfig.order.xl = columnModel.orderXl.toString();
        }

        columnModel.widgets.forEach(widgetModel => {
            let modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            columnConfig.nodes.push(modelBinder.getConfig(widgetModel));

        });

        return columnConfig;
    }
}
