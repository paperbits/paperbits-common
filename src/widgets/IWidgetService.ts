import { Bag } from "../bag";
import { IWidgetBinding, IWidgetHandler, IWidgetOrder, WidgetBinding } from "../editing";
import { WidgetDefinition, WidgetEditorDefinition } from "../editing";


export interface IWidgetService {
    /**
     * Returns the orders of registered widgets.
     */
    getWidgetOrders(): Promise<IWidgetOrder[]>;

    /**
     * Returns the handler for specified widget binding.
     */
    getWidgetHandler(widgetBinding: IWidgetBinding<any, any>): IWidgetHandler;

    /**
     * 
     * @param widgetName 
     * @param widgetDefinition 
     */
    registerWidget(widgetName: string, definition: WidgetDefinition): void;

    /**
     * 
     * @param widgetName 
     */
    unregisterWidget(widgetName: string): void;

    /**
     * 
     * @param widgetName 
     * @param handler 
     */
    registerWidgetEditor(widgetName: string, definition: WidgetEditorDefinition): void;

    /**
     * 
     * @param widgetName 
     */
    unregisterWidgetEditor(widgetName: string): void;

    /**
     * 
     * @param model 
     */
    getWidgetHandlerForModel(model: any): WidgetDefinition

    /**
     * 
     * @param widgetDefinition 
     * @param model 
     * @param bindingContext 
     */
    createWidgetBinding<TModel, TViewModel>(definition: WidgetDefinition, model: any, bindingContext: Bag<any>): Promise<WidgetBinding<TModel, TViewModel>>
}