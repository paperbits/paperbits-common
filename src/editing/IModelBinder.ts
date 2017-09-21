import { IWidgetBinding } from "./IWidgetBinding";
import { Contract } from "./contentNode";

export interface IModelBinder {
    canHandleWidgetType(widgetType: string): boolean;
    canHandleModel(model: Object): boolean;
    getConfig<T>(model: T): Contract;
    nodeToModel(node: Object, params?: any): Promise<any>;
}
