import { IWidgetBinding } from "./IWidgetBinding";
import { Contract } from "./contentNode";

/**
 * Utility for conversions between widget contracts and and widget models.
 */
export interface IModelBinder {
    canHandleWidgetType(widgetType: string): boolean;
    canHandleModel(model: Object): boolean;

    /**
     * Converts widget model to widget contract.
     * @param {T} model Widget model.
     */
    getConfig<T>(model: T): Contract;

    /**
     * Converts widget contract to widget model.
     * @param {Object} node Widget contract.
     * @param params Additional parameters needed to create widget model.
     */
    nodeToModel(node: Object, params?: any): Promise<any>;
}
