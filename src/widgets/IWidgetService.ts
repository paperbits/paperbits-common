import { Bag } from "../bag";
import { IModelBinder, IWidgetBinding, IWidgetHandler, IWidgetOrder, WidgetBinding } from "../editing";
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
     * Adds widget definition to the regsitry.
     * @param widgetName Name of the widget, e.g. `button`.
     * @param widgetDefinition Widget defintion.
     */
    registerWidget(widgetName: string, definition: WidgetDefinition): void;

    /**
     * Removes specified widget definition from the registry.
     * @param widgetName 
     */
    unregisterWidget(widgetName: string): void;

    /**
     * Adds widget editor definition to the registry.
     * @param widgetName Name of the widget, e.g. `button`.
     * @param definition Widget editor definition.
     */
    registerWidgetEditor(widgetName: string, definition: WidgetEditorDefinition): void;

    /**
     * 
     * @param widgetName 
     */
    unregisterWidgetEditor(widgetName: string): void;

    /**
     * Returns widget handler that can work with the specified widget model.
     * @param model Instance of the widget model.
     */
    getWidgetDefinitionForModel<TModel>(model: TModel): WidgetDefinition

    /**
     * 
     * @param widgetName 
     */
    getModelBinder<TModel>(widgetName: string): IModelBinder<TModel>;

    /**
     * 
     * @param model 
     */
    getModelBinderForModel<TModel>(model: unknown): IModelBinder<TModel>;

    /**
     * 
     * @param widgetDefinition 
     * @param model 
     * @param bindingContext 
     */
    createWidgetBinding<TModel, TViewModel>(definition: WidgetDefinition, model: TModel, bindingContext: Bag<any>): Promise<WidgetBinding<TModel, TViewModel>>
}