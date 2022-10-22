import { Bag } from "../bag";
import { IModelBinder, IWidgetBinding, IWidgetHandler, IWidgetOrder, WidgetBinding } from "../editing";
import { WidgetDefinition, WidgetEditorDefinition } from "../editing";

/**
 * Widget service.
 */
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
     * Removes specified widget from registry.
     * @param widgetName Name of the widget.
     */
    unregisterWidgetEditor(widgetName: string): void;

    /**
     * Returns widget definition for specified widget model.
     * @param model Instance of the widget model.
     */
    getWidgetDefinitionForModel<TModel>(model: TModel): WidgetDefinition

    /**
     * Returns model binder for specified widget.
     * @param widgetName Name of the widget.
     */
    getModelBinder<TModel>(widgetName: string): IModelBinder<TModel>;

    /**
     * Returns model binder for instance of the widget model.
     * @param model Instance of the widget model.
     */
    getModelBinderForModel<TModel>(model: unknown): IModelBinder<TModel>;

    /**
     * Creates a binding for specified widget definition.
     * @param widgetDefinition Widget definition.
     * @param model Instance of the widget model.
     * @param bindingContext Binding context.
     */
    createWidgetBinding<TModel, TViewModel>(definition: WidgetDefinition, model: TModel, bindingContext: Bag<any>): Promise<WidgetBinding<TModel, TViewModel>>
}