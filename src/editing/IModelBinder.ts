import { Bag } from "..";
import { Contract } from "../contract";


/**
 * Utility for conversions between contracts and models.
 */
export interface IModelBinder<TModel> {
    /**
     * @deprecated Determines if specified contract can be converted into model by this model binder.
     * @param contract - Widget data contract.
     */
    canHandleContract?(contract: Contract): boolean;

    /**
     * @deprecated Determines if specified model can be converted into contract by this model binder. If this operation id
     * not defined in the model binder, the model gets compared to `modelDefinition` value of the widget definition.
     * @param model - An instance of the widget model.
     */
    canHandleModel?(model: TModel, widgetName?: string): boolean;

    /**
     * Converts a model to a contract.
     * @param model - An instance of the widget model.
     */
    modelToContract(model: TModel): Contract;

    /**
     * Converts contract to model.
     * @param contract - Widget data contract.
     * @param bindingContext - Binding context.
     */
    contractToModel<TModel>(contract: any, bindingContext?: Bag<any>): Promise<TModel>;
}
