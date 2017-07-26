import { IModelBinder } from "./../editing/IModelBinder";
import { ContentConfig } from "./../editing/contentNode";

export class ModelBinderSelector {
    private readonly modelBinders: Array<IModelBinder>;

    constructor(modelBinders: Array<IModelBinder>) {
        this.modelBinders = modelBinders;
    }

    public getModelBinderByNodeType(widgetType: string): IModelBinder {
        let modelBinder = this.modelBinders.find(x => x.canHandleWidgetType(widgetType));

        if (!modelBinder) {
            throw `Could not find model binder for widget type ${widgetType}`;
        }

        return modelBinder;
    }

    public getModelBinderByModel(model): IModelBinder {
        let modelBinder = this.modelBinders.find(x => x.canHandleModel(model));

        if (!modelBinder) {
            throw `Could not find model binder for model.`;
        }

        return modelBinder;
    }
}