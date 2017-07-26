//import { Code } from "../widgets/codeblock/code";
import { IWidgetModel } from "../editing/IWidgetModel";
import { PermalinkService } from "../permalinks/permalinkService";
import { IModelBinder } from "../editing/IModelBinder";
import { ContentConfig } from "../editing/contentNode";
import { CodeModel } from "./models/codeModel";

export class CodeblockModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "codeblock";
    }

    public canHandleModel(model): boolean {
        return model instanceof CodeModel;
    }

    public async nodeToModel(node: ContentConfig): Promise<CodeModel> {
        let codeModel = new CodeModel();
        return codeModel;
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