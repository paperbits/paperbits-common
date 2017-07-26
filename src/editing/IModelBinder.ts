import { IWidgetModel } from "./IWidgetModel";
import { ContentConfig } from "./contentNode";

export interface IModelBinder {
    canHandleWidgetType(widgetType: string): boolean;
    canHandleModel(model: Object): boolean;
    getConfig<T>(model: T): ContentConfig;
    nodeToModel(node: Object): Promise<any>;
}
