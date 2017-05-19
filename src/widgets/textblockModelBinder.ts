import { IWidgetModel } from "./../editing/IWidgetModel";
import { IViewModelBinder } from "./IViewModelBinder";
import { IModelBinder } from "./../editing/IModelBinder";
import { ContentConfig } from "./../editing/contentNode";
import { TextblockModel } from "./models/textblockModel";
import { IHyperlink } from "../permalinks/IHyperlink";
import { IPermalinkService } from "../permalinks/IPermalinkService";


export class TextblockModelBinder implements IModelBinder {
    private readonly permalinkService: IPermalinkService;

    constructor(permalinkService: IPermalinkService) {
        this.permalinkService = permalinkService;

        this.modelToWidgetModel = this.modelToWidgetModel.bind(this);
    }

    private async resolveHyperlinks(nodes: ContentConfig[]): Promise<void> {
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];

            if (node.type == "link") {
                let hyperlink: IHyperlink = node["data"];

                if (hyperlink.permalinkKey) {
                    let permalink = await this.permalinkService.getPermalinkByKey(hyperlink.permalinkKey);
                    hyperlink.href = permalink.uri;
                }
            }

            if (node.nodes) {
                await this.resolveHyperlinks(node.nodes);
            }
        }
    }

    public async nodeToModel(node: ContentConfig): Promise<TextblockModel> {
        // TODO: Scan for unresolved hyperlink permalinks

        if (node.nodes) {
            await this.resolveHyperlinks(node.nodes);
        }

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
        let state;

        if (model.htmlEditor) {
            state = model.htmlEditor.getState();
        }
        else {
            state = model.state;
        }

        let textblockConfig: ContentConfig = {
            kind: "widget",
            type: "text",
            nodes: state["nodes"]
        }

        return textblockConfig;
    }
}
