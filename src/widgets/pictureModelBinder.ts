import { IViewModelBinder } from "./IViewModelBinder";
import { ModelBinderSelector } from "./modelBinderSelector";
import { PictureModel } from "./models/pictureModel";
import { IPictureNode } from "./models/IPictureNode";
import { IWidgetModel } from "./../editing/IWidgetModel";
import { IModelBinder } from "./../editing/IModelBinder";
import { IPermalinkResolver } from "../permalinks/IPermalinkResolver";

export class PictureModelBinder implements IModelBinder {
    private readonly permalinkResolver: IPermalinkResolver;

    constructor(permalinkResolver: IPermalinkResolver) {
        this.permalinkResolver = permalinkResolver;
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "picture";
    }

    public canHandleWidgetModel(model): boolean {
        return model instanceof PictureModel;
    }

    public async nodeToModel(pictureNode: IPictureNode): Promise<PictureModel> {
        let pictureModel = new PictureModel();
        pictureModel.caption = pictureNode.caption;
        pictureModel.layout = pictureNode.layout;
        pictureModel.animation = pictureNode.animation ? pictureNode.animation : "none";

        if (pictureNode.sourceKey) {
            pictureModel.sourceKey = pictureNode.sourceKey;
            pictureModel.sourceUrl = await this.permalinkResolver.getUriByPermalinkKey(pictureNode.sourceKey);
        }

        return pictureModel;
    }

    public async modelToWidgetModel(model: PictureModel, readonly: boolean = false): Promise<IWidgetModel> {
        let pictureWidgetModel: IWidgetModel = {
            name: "paperbits-picture",
            params: {},
            setupViewModel: (viewModel: IViewModelBinder) => {
                viewModel.attachToModel(model);
            },
            nodeType: "picture",
            model: model,
            editor: "picture-editor-editor",
            readonly: readonly
        };

        return pictureWidgetModel;
    }

    public getConfig(pictureModel: PictureModel): IPictureNode {
        let pictureNode: IPictureNode = {
            kind: "block",
            type: "picture",
            sourceKey: pictureModel.sourceKey,
            caption: pictureModel.caption,
            animation: pictureModel.animation,
            layout: pictureModel.layout
        }

        return pictureNode;
    }
}