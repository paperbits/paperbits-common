import { Bag } from "..";
import { Contract } from "../contract";


/**
 * Utility for conversions between contracts and models.
 */
export interface IModelBinder<TModel> {
    canHandleContract(contract: Contract): boolean;
    canHandleModel(model: Object): boolean;

    /**
     * Converts a model to a contract.
     */
    modelToContract(model: TModel): Contract;

    /**
     * Converts contract to model.
     * @param A contract.
     * @param params Additional parameters needed to create a model.
     */
    contractToModel(contract: any, bindingContext?: Bag<any>): Promise<TModel>;
}
