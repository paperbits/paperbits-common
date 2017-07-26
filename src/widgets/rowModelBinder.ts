import { IRowNode } from "./models/IRowNode";
import { IModelBinder } from "./../editing/IModelBinder";
import { ColumnModel } from "./models/columnModel";
import { ColumnModelBinder } from "./columnModelBinder";
import { RowModel } from "./models/rowModel";
import { ContentConfig } from "./../editing/contentNode";
import { IViewModelBinder } from "./IViewModelBinder";
import { IWidgetModel } from "./../editing/IWidgetModel";

export class RowModelBinder {
    private readonly columnModelBinder: ColumnModelBinder;

    constructor(columnModelBinder: ColumnModelBinder) {
        this.columnModelBinder = columnModelBinder;

        this.nodeToModel = this.nodeToModel.bind(this);
    }

    public async nodeToModel(node: IRowNode): Promise<RowModel> {
        let rowModel = new RowModel();

        if (node.align) {
            if (node.align.sm) {
                rowModel.alignSm = node.align.sm;
            }
            if (node.align.md) {
                rowModel.alignMd = node.align.md;
            }
            if (node.align.lg) {
                rowModel.alignLg = node.align.lg;
            }
        }

        if (node.justify) {
            if (node.justify.sm) {
                rowModel.justifySm = node.justify.sm;
            }
            if (node.justify.md) {
                rowModel.justifyMd = node.justify.md;
            }
            if (node.justify.lg) {
                rowModel.justifyLg = node.justify.lg;
            }
        }

        if (!node.nodes) {
            node.nodes = [];
        }

        let columnModelPromises = node.nodes.map(this.columnModelBinder.nodeToModel);
        rowModel.columns = await Promise.all<ColumnModel>(columnModelPromises);

        return rowModel;
    }

    public getRowConfig(rowModel: RowModel): ContentConfig {
        let rowConfig: IRowNode = {
            type: "layout-row",
            kind: "block",
            nodes: []
        };

        rowConfig.align = {};
        rowConfig.align.sm = rowModel.alignSm;
        rowConfig.align.md = rowModel.alignMd;
        rowConfig.align.lg = rowModel.alignLg;

        rowConfig.justify = {};
        rowConfig.justify.sm = rowModel.justifySm;
        rowConfig.justify.md = rowModel.justifyMd;
        rowConfig.justify.lg = rowModel.justifyLg;

        rowModel.columns.forEach(column => {
            rowConfig.nodes.push(this.columnModelBinder.getColumnConfig(column));
        });

        return rowConfig;
    }
}
