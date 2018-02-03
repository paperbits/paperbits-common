import { IModelBinder } from "../../editing/IModelBinder";
import { FormModel } from "./formModel";
import { Contract } from "../../contract";


export class FormModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "form";
    }

    public canHandleModel(model: Contract): boolean {
        return model instanceof FormModel;
    }

    public async nodeToModel(formContract: Contract): Promise<FormModel> {
        return new FormModel();
    }

    public getConfig(formModel: FormModel): Contract {
        let formConfig: Contract = {
            object: "block",
            type: "form"
        }

        return formConfig;
    }
}
