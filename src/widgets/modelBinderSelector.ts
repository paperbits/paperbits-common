import { IModelBinder } from "./../editing/IModelBinder";
import { Contract } from "./../contract";
import { PlaceholderModel } from "./placeholder";

export class PlaceholderModelBinder implements IModelBinder {
    constructor(public readonly message?: string) { }

    public async nodeToModel(contract: Contract, message): Promise<PlaceholderModel> {
        return new PlaceholderModel(contract, `Could not find model binder for widget type "${contract.type}".`);
    }

    public getConfig(model: PlaceholderModel): Contract {
        return model.contract;
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof PlaceholderModel;
    }

    public canHandleWidgetType(widgetType: string): boolean {
        throw new Error("Not implemented");
    }
}

export class ModelBinderSelector {
    private readonly modelBinders: Array<IModelBinder>;

    constructor(modelBinders: Array<IModelBinder>) {
        this.modelBinders = modelBinders;
    }

    public getModelBinderByNodeType(widgetType: string): IModelBinder {
        const modelBinder = this.modelBinders.find(x => x.canHandleWidgetType(widgetType));

        if (!modelBinder) {
            return new PlaceholderModelBinder();
        }

        return modelBinder;
    }

    public getModelBinderByModel(model: Object): IModelBinder {
        const modelBinder = this.modelBinders.find(x => x.canHandleModel(model));

        if (!modelBinder) {
            return new PlaceholderModelBinder();
        }

        return modelBinder;
    }
}