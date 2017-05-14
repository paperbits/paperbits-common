//import { Code } from "../widgets/codeblock/code";
import { IWidgetModel } from "../editing/IWidgetModel";
import { PermalinkService } from "../permalinks/permalinkService";
import { IModelBinder } from "../editing/IModelBinder";
import { ContentConfig } from "../editing/contentNode";
import { CodeModel } from "./models/codeModel";

export class CodeblockModelBinder implements IModelBinder {
    constructor() {
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "codeblock";
    }

    public canHandleWidgetModel(model): boolean {
        return model instanceof CodeModel;
    }

    public async nodeToModel(node: ContentConfig): Promise<CodeModel> {
        let codeModel = new CodeModel();
        return codeModel;
    }

    public modelToWidgetModel(codeNode: ContentConfig, readonly: boolean = false): Promise<{}> {
        return new Promise<IWidgetModel>((resolve, reject) => {

            let codeWidgetModel: IWidgetModel = {
                name: "paperbits-code",
                params: {},
                oncreate: (codeModel: CodeModel) => {
                    codeModel.lang = codeNode.language;
                    codeModel.code = codeNode.code;
                    codeModel.theme = codeNode.theme;
                    codeModel.isEditable = codeNode.isEditable;
                },
                nodeType: codeNode.type,
                readonly: readonly
            };
            resolve(codeWidgetModel);
        });
    }

    public getConfig(codeModel: CodeModel): ContentConfig {
        let codeConfig: ContentConfig = {
            kind: "block",
            type: "codeblock",
            language: codeModel.lang,
            code: codeModel.code,
            theme: codeModel.theme,
            isEditable: codeModel.isEditable
        }

        return codeConfig;
    }
}