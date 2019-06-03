import { IModelBinder } from "./../editing";
import { Contract } from "./../contract";
import { PlaceholderModel } from "./placeholder";

export class PlaceholderModelBinder implements IModelBinder<PlaceholderModel> {
    constructor(public readonly message?: string) { }

    public async contractToModel(contract: Contract): Promise<PlaceholderModel> {
        return new PlaceholderModel(`Could not find model binder for widget type "${contract.type}".`);
    }

    public modelToContract(model: PlaceholderModel): Contract {
        return { type: "placeholder" };
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof PlaceholderModel;
    }

    public canHandleContract(contract: Contract): boolean {
        throw new Error("Not implemented");
    }
}

export class ModelBinderSelector {
    constructor(private modelBinders: IModelBinder<any>[]) { }

    public getModelBinderByContract<TModel>(contract: Contract): IModelBinder<TModel> {
        const modelBinder = this.modelBinders.find(x => x && x.canHandleContract ? x.canHandleContract(contract) : false);

        if (!modelBinder) {
            return <any>(new PlaceholderModelBinder());
        }

        return modelBinder;
    }

    public getModelBinderByModel(model: Object): IModelBinder<any> {
        const modelBinder = this.modelBinders.find(x => x.canHandleModel(model));

        if (!modelBinder) {
            return new PlaceholderModelBinder();
        }

        return modelBinder;
    }
}