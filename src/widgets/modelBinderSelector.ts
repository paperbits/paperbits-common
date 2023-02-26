import { IModelBinder } from "./../editing";
import { Contract } from "./../contract";
import { ContentPartModel } from "./contentPart";

export class ContentPartModelBinder implements IModelBinder<ContentPartModel> {
    constructor(public readonly message?: string) { }

    public async contractToModel(contract: Contract): Promise<ContentPartModel> {
        return new ContentPartModel(`Could not find model binder for widget type "${contract.type}".`);
    }

    public modelToContract(model: ContentPartModel): Contract {
        return { type: "contentPart" };
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof ContentPartModel;
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
            return <any>(new ContentPartModelBinder());
        }

        return modelBinder;
    }

    public getModelBinderByModel(model: Object): IModelBinder<any> {
        const modelBinder = this.modelBinders.find(x => x.canHandleModel(model));

        if (!modelBinder) {
            return new ContentPartModelBinder();
        }

        return modelBinder;
    }
}