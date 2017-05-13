import { IWidgetModel } from "./../editing/IWidgetModel";
import { IViewModelBinder } from "./IViewModelBinder";
import { IModelBinder } from "./../editing/IModelBinder";
import { ContentConfig } from "./../editing/contentNode";
import { TextblockModel } from "./models/textblockModel";

export class TextblockModelBinder implements IModelBinder {
    constructor() {
        this.modelToWidgetModel = this.modelToWidgetModel.bind(this);
    }

    public async nodeToModel(node: ContentConfig): Promise<TextblockModel> {
        let textblockModel = new TextblockModel({ "nodes": node.nodes });

        return textblockModel;
    }

    public async modelToWidgetModel(textblockModel: TextblockModel, readonly: boolean = false): Promise<IWidgetModel> {
        let widgetModel: IWidgetModel = {
            name: "paperbits-text",
            params: {
                state: textblockModel.state
            },
            nodeType: "text",
            model: textblockModel,
            editor: "paperbits-text-editor",
            hideCloseButton: true,
            readonly: readonly
        };

        widgetModel.setupViewModel = (viewModel: IViewModelBinder) => {                
            viewModel.attachToModel(widgetModel);
        };

        return widgetModel;
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "text";
    }

    public canHandleWidgetModel(model): boolean {
        return model instanceof TextblockModel;
    }

    public getConfig(model: TextblockModel): ContentConfig {
        let textblockConfig: ContentConfig = {
            kind: "widget",
            type: "text",
            nodes: model.state["nodes"]
        }

        return textblockConfig;
    }
}
