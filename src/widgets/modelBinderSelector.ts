import { IModelBinder } from "./../editing";
import { Contract } from "./../contract";
import { PlaceholderModel } from "./placeholder";

export class PlaceholderModelBinder implements IModelBinder {
    constructor(public readonly message?: string) { }

    public async contractToModel(contract: Contract): Promise<PlaceholderModel> {
        return new PlaceholderModel(contract, `Could not find model binder for widget type "${contract.type}".`);
    }

    public modelToContract(model: PlaceholderModel): Contract {
        return model.contract;
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof PlaceholderModel;
    }

    public canHandleContract(contract: Contract): boolean {
        throw new Error("Not implemented");
    }
}

export class ModelBinderSelector {
    constructor(private modelBinders: IModelBinder[]) { }

    public getModelBinderByContract(contract: Contract): IModelBinder {
        const modelBinder = this.modelBinders.find(x => x && x.canHandleContract ? x.canHandleContract(contract) : false);

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