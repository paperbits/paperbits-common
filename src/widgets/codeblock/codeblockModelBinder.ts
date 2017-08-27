//import { Code } from "../widgets/codeblock/code";
import { IWidgetBinding } from "../../editing/IWidgetBinding";
import { PermalinkService } from "../../permalinks/permalinkService";
import { IModelBinder } from "../../editing/IModelBinder";
import { Contract } from "../../editing/contentNode";
import { CodeModel } from "./codeModel";


export class CodeblockModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "codeblock";
    }

    public canHandleModel(model): boolean {
        return model instanceof CodeModel;
    }

    public async nodeToModel(node: Contract): Promise<CodeModel> {
        let codeModel = new CodeModel();
        return codeModel;
    }

    public getConfig(codeModel: CodeModel): Contract {
        let codeConfig: Contract = {
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