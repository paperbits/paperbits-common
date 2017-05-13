import { IModelBinder } from "./../editing/IModelBinder";
import { ContentConfig } from "./../editing/contentNode";

export class ModelBinderSelector {
    private readonly modelBinders: Array<IModelBinder>;

    constructor(modelBinders: Array<IModelBinder>) {
        this.modelBinders = modelBinders;
    }

    public getModelBinderByNodeType(widgetType: string): IModelBinder {
        return this.modelBinders.find(x => x.canHandleWidgetType(widgetType));
    }

    public getModelBinderByModel(model): IModelBinder {
        return this.modelBinders.find(x => x.canHandleWidgetModel(model));
    }
}