import { IModelBinder } from "./../editing/IModelBinder";
import { Contract } from "./../contract";

export class ModelBinderSelector {
    private readonly modelBinders: Array<IModelBinder>;

    constructor(modelBinders: Array<IModelBinder>) {
        this.modelBinders = modelBinders;
    }

    public getModelBinderByNodeType(widgetType: string): IModelBinder {
        const modelBinder = this.modelBinders.find(x => x.canHandleWidgetType(widgetType));

        if (!modelBinder) {
            throw `Could not find model binder for widget type ${widgetType}`;
        }

        return modelBinder;
    }

    public getModelBinderByModel(model: Object): IModelBinder {
        const modelBinder = this.modelBinders.find(x => x.canHandleModel(model));

        if (!modelBinder) {
            throw `Could not find model binder for model.`;
        }

        return modelBinder;
    }
}