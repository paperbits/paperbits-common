import { IViewModelBinder } from "./IViewModelBinder";
import { SectionConfig } from "./models/ISectionNode";
import { ContentConfig } from "./../editing/contentNode";
import { IModelBinder } from "./../editing/IModelBinder";
import { RowModel } from "./models/rowModel";
import { SectionModel } from "./models/sectionModel";
import { RowModelBinder } from "./rowModelBinder";
import { IWidgetModel } from "./../editing/IWidgetModel";
import { ILinkResolver } from "../permalinks/IPermalinkResolver";

export class SectionModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "layout-section";
    }
    public canHandleWidgetModel(model: Object): boolean {
        return model instanceof SectionModel;
    }

    private readonly rowModelBinder: RowModelBinder;
    private readonly permalinkResolver: ILinkResolver;

    constructor(rowModelBinder: RowModelBinder, permalinkResolver: ILinkResolver) {
        this.rowModelBinder = rowModelBinder;
        this.permalinkResolver = permalinkResolver;

        this.nodeToModel = this.nodeToModel.bind(this);
        this.modelToWidgetModel = this.modelToWidgetModel.bind(this);
    }

    public async nodeToModel(sectionNode: SectionConfig): Promise<SectionModel> {
        let sectionModel = new SectionModel();

        if (!sectionNode.nodes) {
            sectionNode.nodes = [];
        }

        if (sectionNode.layout) {
            sectionModel.layout = sectionNode.layout;
        }

        if (sectionNode.padding) {
            sectionModel.padding = sectionNode.padding;
        }

        if (sectionNode.snapping) {
            sectionModel.snap = sectionNode.snapping;
        }

        if (sectionNode.background) {
            if (sectionNode.background.color) {
                sectionModel.backgroundIntentionKey = sectionNode.background.color;
            }

            if (sectionNode.background.size) {
                sectionModel.backgroundSize = sectionNode.background.size;
            }

            if (sectionNode.background.position) {
                sectionModel.backgroundPosition = sectionNode.background.position;
            }

            if (sectionNode.background.picture) {
                sectionModel.backgroundType = "picture";
                sectionModel.backgroundSourceKey = sectionNode.background.picture.sourcePermalinkKey;
                sectionModel.backgroundPictureUrl = await this.permalinkResolver.getUriByPermalinkKey(sectionModel.backgroundSourceKey);
            }
        }

        let rowModelPromises = sectionNode.nodes.map(this.rowModelBinder.nodeToModel);
        sectionModel.rows = await Promise.all<RowModel>(rowModelPromises);

        return sectionModel;
    }

    public async modelToWidgetModel(model: SectionModel, readonly: boolean = false): Promise<IWidgetModel> {
        let widgetModel: IWidgetModel = {
            name: "layout-section",
            params: {},
            nodeType: "layout-section",
            model: model,
            editor: "layout-section-editor",
            readonly: readonly
        };

        widgetModel.children = await Promise.all(model.rows.map((x) => this.rowModelBinder.modelToWidgetModel(x, readonly)));

        widgetModel.setupViewModel = async (viewModel: IViewModelBinder) => {
            if (this.isChildrenChanged(widgetModel.children, model.rows)) {
                widgetModel.children = await Promise.all(model.rows.map((x) => this.rowModelBinder.modelToWidgetModel(x, readonly)));
            }
            viewModel.attachToModel(widgetModel);
        };

        return widgetModel;
    }

    private isChildrenChanged(widgetChildren: any[], modelItems: any[]) {
        return (widgetChildren && !modelItems) ||
            (!widgetChildren && modelItems) ||
            (widgetChildren && modelItems && widgetChildren.length !== modelItems.length);
    }

    public getConfig(sectionModel: SectionModel): ContentConfig {
        let sectionConfig: SectionConfig = {
            type: "layout-section",
            kind: "block",
            nodes: [],
            layout: sectionModel.layout,
            padding: sectionModel.padding,
            snapping: sectionModel.snap,
            background: {
                color: sectionModel.backgroundIntentionKey,
                size: sectionModel.backgroundSize,
                position: sectionModel.backgroundPosition
            }
        };

        if (sectionModel.backgroundType === "picture") {
            sectionConfig.background.picture = {
                sourcePermalinkKey: sectionModel.backgroundSourceKey,
                repeat: sectionModel.backgroundRepeat
            }
        }

        sectionModel.rows.forEach(row => {
            sectionConfig.nodes.push(this.rowModelBinder.getRowConfig(row));
        });

        return sectionConfig;
    }
}
