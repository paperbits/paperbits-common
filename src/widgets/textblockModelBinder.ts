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

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "text";
    }

    public canHandleModel(model): boolean {
        return model instanceof TextblockModel;
    }

    public getConfig(model: TextblockModel): ContentConfig {
        let state;

        if (model.htmlEditor) {
            state = model.htmlEditor.getState();
            model.state = state;
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