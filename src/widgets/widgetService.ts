﻿import { KnockoutComponentBinder } from "@paperbits/core/ko/knockoutComponentBinder";
import { Bag } from "../bag";
import { ComponentFlow, IModelBinder, IWidgetBinding, IWidgetHandler, IWidgetOrder, WidgetBinding, WidgetDefinition, WidgetEditorDefinition } from "../editing";
import { EventManager, Events } from "../events";
import { IInjector } from "../injection";
import { StyleManager } from "../styles";
import { IWidgetService, ViewModelBinder } from "../widgets";


const defaultWidgetIconClass = "widget-icon widget-icon-component";

export class WidgetService implements IWidgetService {
    private widgetEntries: Bag<WidgetDefinition> = {};
    private widgetEditorEntries: Bag<WidgetEditorDefinition> = {};

    constructor(
        private readonly widgetHandlers: IWidgetHandler[],
        private readonly injector: IInjector
    ) { }

    private async getWidgetOrdersLegacy(): Promise<IWidgetOrder[]> {
        const widgetOrders = new Array<IWidgetOrder>();

        const tasks = this.widgetHandlers.map(async (handler: IWidgetHandler) => {
            if (handler.getWidgetOrder) {
                const order = await handler.getWidgetOrder();
                widgetOrders.push(order);
            }
        });

        await Promise.all(tasks);

        return widgetOrders;
    }

    public async getWidgetOrders(): Promise<IWidgetOrder[]> {
        const widgetNames = Object.keys(this.widgetEditorEntries);

        const orders = widgetNames.map(widgetName => {
            const definition = this.widgetEditorEntries[widgetName];

            if (definition.selectable === false) {
                return; // skip adding non-selectable widget to "Add widget" dialog
            }

            const handler: IWidgetHandler = this.injector.resolveClass(<Function>definition.handlerComponent);

            const order: IWidgetOrder = {
                name: widgetName,
                displayName: definition.displayName,
                category: definition.category,
                iconClass: definition.iconClass,
                iconUrl: definition.iconUrl,
                requires: definition.requires || [],
                createModel: handler.getWidgetModel
            };

            if (!order.iconClass && !order.iconUrl) {
                order.iconClass = defaultWidgetIconClass;
            }

            return order;
        });

        let legacyOrders = await this.getWidgetOrdersLegacy();

        // filtering out duplicates
        legacyOrders = legacyOrders.filter(legacyOrder => !orders.some(order => order.name == legacyOrder.name));

        return orders.concat(legacyOrders);
    }

    public getWidgetHandler(widgetBinding: IWidgetBinding<any, any>): IWidgetHandler {
        let widgetHandler = this.getWidgetHandlerByWidgetName(widgetBinding.name);

        if (widgetHandler) {
            return widgetHandler;
        }

        return this.getWidgetHandlerByType(widgetBinding.handler);
    }

    private getWidgetHandlerByWidgetName(widgetName: string): IWidgetHandler {
        const editorDefintion = this.widgetEditorEntries[widgetName];

        if (!editorDefintion) {
            return null;
        }

        const widgetHandler = this.injector.resolveClass(<Function>editorDefintion.handlerComponent);
        return widgetHandler;
    }

    private getWidgetHandlerByType(handlerType: any): IWidgetHandler {
        if (!handlerType) {
            throw new Error(`Parameter "handlerType" not specified.`);
        }

        // legacy logic
        const widgetHandler = this.widgetHandlers.find(x => x instanceof handlerType);

        if (!widgetHandler) {
            throw new Error(`No widget handlers of type "${handlerType.name}" registered. Use "registerWidgetHandler" method in IWidgetService to register it.`);
        }

        return widgetHandler;
    }

    public getModelBinder<TModel>(widgetName: string): IModelBinder<TModel> {
        const widgetDefinition = this.widgetEntries[widgetName];

        if (!widgetDefinition) {
            return null;
        }

        return this.injector.resolveClass(widgetDefinition.modelBinder);
    }

    public async getWidgetModel<TModel>(widgetName: string): Promise<TModel> {
        const handler = this.getWidgetHandlerByWidgetName(widgetName);
        const widgetModel = await handler.getWidgetModel<TModel>();

        return widgetModel;
    }

    public registerWidget(widgetName: string, widgetDefinition: WidgetDefinition): void {
        if (!widgetName) {
            throw new Error(`Parameter "widgetName" not specified.`)
        }

        if (!widgetDefinition) {
            throw new Error(`Parameter "widgetDefinition" not specified.`)
        }

        if (!widgetDefinition.componentFlow) {
            widgetDefinition.componentFlow = ComponentFlow.Contents;
        }

        this.widgetEntries[widgetName] = widgetDefinition;
    }

    public unregisterWidget(widgetName: string): void {
        delete this.widgetEntries[widgetName];
        delete this.widgetEditorEntries[widgetName];
    }

    public registerWidgetEditor(widgetName: string, definition: WidgetEditorDefinition): void {
        if (!this.widgetEntries[widgetName]) {
            throw new Error(`Widget "${widgetName}" is not registered.`);
        }

        if (definition.requires === undefined) {
            definition.requires = [];
        }

        if (definition.draggable === undefined) {
            definition.draggable = true;
        }

        if (definition.selectable === undefined) {
            definition.selectable = true;
        }

        this.widgetEditorEntries[widgetName] = definition;
    }

    public unregisterWidgetEditor(widgetName: string): void {
        delete this.widgetEditorEntries[widgetName];
    }

    public unregisterWidgetHandler(widgetName: string): void {
        delete this.widgetEditorEntries[widgetName];
    }

    public getWidgetDefinitionForModel<TModel>(model: TModel): WidgetDefinition {
        const values = Object.values(this.widgetEntries);
        return values.find(x => model instanceof x.modelDefinition);
    }

    public getModelBinderForModel<TModel>(model: TModel): IModelBinder<TModel> {
        const values = Object.values(this.widgetEntries);
        const definition = values.find(x => model instanceof x.modelDefinition);

        if (!definition) {
            return null;
        }

        return this.injector.resolveClass(definition.modelBinder);
    }

    public async createWidgetBinding<TModel, TViewModel>(definition: WidgetDefinition, model: TModel, bindingContext: Bag<any>): Promise<WidgetBinding<TModel, TViewModel>> {
        const widgetName = Object.keys(this.widgetEntries).find(key => this.widgetEntries[key] === definition);

        if (!widgetName) {
            return null;
        }

        const widgetDefinition = this.widgetEntries[widgetName];
        const editorDefinition = this.widgetEditorEntries[widgetName];
        const viewModelBinder = this.injector.resolveClass<ViewModelBinder<TModel, TViewModel>>(widgetDefinition.viewModelBinder);

        const widgetBinding = new WidgetBinding<TModel, TViewModel>();
        const eventManager = this.injector.resolve<EventManager>("eventManager");

        // common
        widgetBinding.componentBinder = this.injector.resolveClass(widgetDefinition.componentBinder);
        widgetBinding.componentBinderArgs = widgetDefinition.componentDefinition;
        widgetBinding.model = model;
        widgetBinding.layer = bindingContext.layer;

        // widget definition
        widgetBinding.name = widgetName;
        widgetBinding.flow = widgetDefinition.componentFlow;
        widgetBinding.wrapped = widgetBinding.flow !== ComponentFlow.Contents;

        if (editorDefinition) {
            widgetBinding.displayName = editorDefinition.displayName;
            widgetBinding.editor = editorDefinition.componentDefinition;
            widgetBinding.draggable = editorDefinition.draggable;
            widgetBinding.selectable = editorDefinition.selectable;
        }

        const widgetState = {};
        const styleManager: StyleManager = bindingContext?.styleManager;

        widgetBinding.applyChanges = async () => {
            await viewModelBinder.modelToState(model, widgetState, bindingContext);

            if (bindingContext?.styleManager && widgetState["styles"]?.styleSheet) {
                bindingContext.styleManager.setStyleSheet(widgetState["styles"]?.styleSheet);
            }

            viewModelBinder.stateToIntance<any, any>(widgetState, widgetBinding.viewModel);
            eventManager.dispatchEvent(Events.ContentUpdate);
        };

        await viewModelBinder.modelToState(model, widgetState, bindingContext);

        widgetBinding.onCreate = (instance) => {
            if (styleManager && widgetState["styles"]?.styleSheet) {
                styleManager.setStyleSheet(widgetState["styles"]?.styleSheet);
            }

            viewModelBinder.stateToIntance(widgetState, instance);
        }

        widgetBinding.onDispose = () => {
            if (widgetState["styles"]?.styleSheet) {
                styleManager.removeStyleSheet(widgetState["styles"]?.styleSheet);
            }
        };

        return widgetBinding;
    }
}
