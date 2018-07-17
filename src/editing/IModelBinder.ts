import { Contract } from "../contract";

/**
 * Utility for conversions between contracts and models.
 */
export interface IModelBinder {
    canHandleWidgetType(widgetType: string): boolean;
    canHandleModel(model: any): boolean;

    /**
     * Converts a model to a contract.
     */
    modelToContract(model: any): Contract;

    /**
     * Converts contract to model.
     * @param A contract.
     * @param params Additional parameters needed to create a model.
     */
    contractToModel(contract: any, ...params): Promise<any>;
}
