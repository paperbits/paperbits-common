import { Bag } from "..";
import { Contract } from "../contract";


/**
 * Utility for conversions between contracts and models.
 */
export interface IModelBinder<TModel> {
    /**
     * @deprecated Determines if specified contract can be converted into model by this model binder.
     * @param contract - Contract.
     */
    canHandleContract?(contract: Contract): boolean;

    /**
     * @deprecated Determines if specified model can be converted into contract by this model binder.
     * @param model - Model.
     */
    canHandleModel?(model: TModel): boolean;

    /**
     * Converts a model to a contract.
     * @param model - Model.
     */
    modelToContract(model: TModel): any;

    /**
     * Converts contract to model.
     * @param contract - Contract.
     * @param bindingContext - Binding context.
     */
    contractToModel(contract: any, bindingContext?: Bag<any>): Promise<any>;
}
