import { IWidgetModel } from "./IWidgetModel";
import { ContentConfig } from "./contentNode";

export interface IModelBinder {
    canHandleWidgetType(widgetType: string): boolean;
    canHandleWidgetModel(model: Object): boolean;
    getConfig<T>(model: T): ContentConfig;
    nodeToModel(node: Object, layoutMode?: boolean): Promise<any>;
    modelToWidgetModel<T>(model: T, readonly?: boolean): Promise<IWidgetModel>;
}
