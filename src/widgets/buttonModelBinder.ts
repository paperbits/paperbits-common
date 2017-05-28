import { IViewModelBinder } from "./IViewModelBinder";
import { IWidgetModel } from "../editing/IWidgetModel";
import { PermalinkService } from "../permalinks/permalinkService";
import { IModelBinder } from "../editing/IModelBinder";
import { ButtonModel } from "./models/buttonModel";
import { ContentConfig } from "../editing/contentNode";
import { IPermalinkResolver } from "../permalinks/IPermalinkResolver";

export class ButtonModelBinder implements IModelBinder {
    private readonly permalinkResolver: IPermalinkResolver;

    constructor(permalinkResolver: IPermalinkResolver) {
        this.permalinkResolver = permalinkResolver;
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "button";
    }

    public canHandleWidgetModel(model): boolean {
        return model instanceof ButtonModel;
    }

    public async nodeToModel(buttonContract: ContentConfig): Promise<ButtonModel> {
        let model = new ButtonModel();
        model.label = buttonContract.label;
        model.style = buttonContract.style;
        model.size = buttonContract.size;

        if (buttonContract.hyperlink) {
            model.hyperlink = await this.permalinkResolver.getHyperlinkFromConfig(buttonContract.hyperlink);
        }

        return model;
    }

    public async modelToWidgetModel(buttonModel: ButtonModel, readonly: boolean = false): Promise<IWidgetModel> {
        let widgetModel: IWidgetModel = {
            name: "paperbits-button",
            params: {},
            setupViewModel: (viewModel: IViewModelBinder) => {
                viewModel.attachToModel(buttonModel);
            },
            nodeType: "button",
            model: buttonModel,
            editor: "paperbits-button-editor",
            readonly: readonly
        };

        return widgetModel;
    }

    public getConfig(buttonModel: ButtonModel): ContentConfig {
        let buttonConfig: ContentConfig = {
            kind: "block",
            type: "button",
            label: buttonModel.label,
            style: buttonModel.style,
            size: buttonModel.size
        }

        if (buttonModel.hyperlink) {
            buttonConfig.hyperlink = {
                target: buttonModel.hyperlink.target,
                permalinkKey: buttonModel.hyperlink.permalinkKey,
                href: buttonModel.hyperlink.href
            }
        }

        return buttonConfig;
    }
}
