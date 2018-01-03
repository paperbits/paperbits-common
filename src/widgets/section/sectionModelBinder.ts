import { IViewModelBinder } from "./../IViewModelBinder";
import { SectionConfig } from "./ISectionNode";
import { Contract } from "./../../contract";
import { IModelBinder } from "./../../editing/IModelBinder";
import { RowModel } from "../row/rowModel";
import { SectionModel } from "./sectionModel";
import { RowModelBinder } from "../row/rowModelBinder";
import { IWidgetBinding } from "./../../editing/IWidgetBinding";
import { BackgroundModelBinder } from "../background/backgroundModelBinder";


export class SectionModelBinder implements IModelBinder {
    private readonly rowModelBinder: RowModelBinder;
    private readonly backgroundModelBinder: BackgroundModelBinder;

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "layout-section";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof SectionModel;
    }

    constructor(rowModelBinder: RowModelBinder, backgroundModelBinder: BackgroundModelBinder) {
        this.rowModelBinder = rowModelBinder;
        this.backgroundModelBinder = backgroundModelBinder;

        this.nodeToModel = this.nodeToModel.bind(this);
    }

    public async nodeToModel(sectionContract: SectionConfig): Promise<SectionModel> {
        const sectionModel = new SectionModel();

        if (!sectionContract.nodes) {
            sectionContract.nodes = [];
        }

        if (sectionContract.layout) {
            sectionModel.layout = sectionContract.layout;
        }

        if (sectionContract.padding) {
            sectionModel.padding = sectionContract.padding;
        }

        if (sectionContract.snapping) {
            sectionModel.snap = sectionContract.snapping;
        }

        if (sectionContract.background) {
            sectionModel.background = await this.backgroundModelBinder.nodeToModel(sectionContract.background);
        }

        let rowModelPromises = sectionContract.nodes.map(this.rowModelBinder.nodeToModel);
        sectionModel.rows = await Promise.all<RowModel>(rowModelPromises);

        return sectionModel;
    }

    private isChildrenChanged(widgetChildren: any[], modelItems: any[]) {
        return (widgetChildren && !modelItems) ||
            (!widgetChildren && modelItems) ||
            (widgetChildren && modelItems && widgetChildren.length !== modelItems.length);
    }

    public getConfig(sectionModel: SectionModel): Contract {
        const sectionConfig: SectionConfig = {
            type: "layout-section",
            kind: "block",
            nodes: [],
            layout: sectionModel.layout,
            padding: sectionModel.padding,
            snapping: sectionModel.snap
        };

        if (sectionModel.background) {
            sectionConfig.background = {
                color: sectionModel.background.colorKey,
                size: sectionModel.background.size,
                position: sectionModel.background.position
            }

            if (sectionModel.background.sourceType === "picture") {
                sectionConfig.background.picture = {
                    sourcePermalinkKey: sectionModel.background.sourceKey,
                    repeat: sectionModel.background.repeat
                }
            }
        }

        sectionModel.rows.forEach(row => {
            sectionConfig.nodes.push(this.rowModelBinder.getRowConfig(row));
        });

        return sectionConfig;
    }
}
