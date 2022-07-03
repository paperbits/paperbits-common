import { Bag } from "../bag";
import { IWidgetOrder, IWidgetHandler, WidgetContext, WidgetBinding, ComponentFlow } from "./";
import { ComponentBinder } from "@paperbits/common/editing/componentBinder";
import { ViewModelBinder } from "../widgets";
import { EventManager } from "../events";
import { IInjector } from "../injection";


export interface WidgetDefinition { // Registration is not the same as binding!!!
    name: string;
    modelClass: any;
    flow: ComponentFlow;
    componentBinder: string, // ComponentBinder; // instead of "framework" property

    /**
     * This should specify what's needed in order to create view model instance, 
     * ```ts
     *  const component = Reflect.getMetadata("paperbits-vue-component", binding.viewModelClass).component;
        const container = document.createElement("div");
        element.appendChild(container);
        const viewModelInstance = new component().$mount(container);
     * ```
     * or
     * ```ts
       const reactElement = React.createElement(binding.viewModelClass, {});
       const viewModelInstance = ReactDOM.render(reactElement, element);
     * ```
     */
    componentBinderArguments: any;
    modelBinder: any;
    viewModelBinder: any;
}

export interface WidgetDesignerDefinition {
    displayName: string; // Widget display name
    editorComponent: string | any; // class
    handlerComponent: string | any; // class
    iconClass: string; // "widget-icon widget-icon-button";
    requires: [];
    draggable: boolean;
}



export class WidgetRegistry {
    private widgetEntries: Bag<WidgetDefinition> = {};
    private widgetDesignerEntries: Bag<WidgetDesignerDefinition> = {};
    private readonly eventManager: EventManager;

    constructor(private readonly injector: IInjector) {

    }

    public register(widgetName: string, widgetDefinition: WidgetDefinition, widgetDesignerDefinition?: WidgetDesignerDefinition): void {
        this.widgetEntries[widgetName] = widgetDefinition;

        if (widgetDesignerDefinition) {
            this.widgetDesignerEntries[widgetName] = widgetDesignerDefinition;
        }
    }

    public unregister(widgetName: string): void {
        delete this.widgetEntries[widgetName];
        delete this.widgetDesignerEntries[widgetName];
    }

    public getWidgetDefinition(widgetName: string): WidgetDefinition {
        return this.widgetEntries[widgetName];
    }

    public getWidgetDefinitionForModel(model: any): WidgetDefinition {
        const values = Object.values(this.widgetEntries);
        return values.find(x => model instanceof x.modelClass);
    }

    public getWidgetDesignerDefinition(widgetName: string): WidgetDesignerDefinition {
        return this.widgetDesignerEntries[widgetName];
    }

    public getWidgetViewModelBinder(widgetName: string): ViewModelBinder<any, any> {
        return {};
    }

    public async createWidgetBinding<TModel, TViewModel>(widgetDefinition: WidgetDefinition, model: any, bindingContext: Bag<any>): Promise<WidgetBinding<TModel, TViewModel>> {
        const widgetDesignerDefinition = this.getWidgetDesignerDefinition(widgetDefinition.name);
        const viewModelBinder = this.injector.resolveClass<any>(widgetDefinition.viewModelBinder);

        const binding = new WidgetBinding<TModel, TViewModel>();
        const eventManager = this.injector.resolve<EventManager>("eventManager");

        // common
        binding.framework = widgetDefinition.componentBinder; // TODO: replace string with class
        binding.componentBinderArgs = widgetDefinition.componentBinderArguments; // componentBinderArgs parameters. i.e. for React it can be any of this: https://react-tutorial.app/app.html?id=338;
        binding.model = model;
        binding.layer = bindingContext.layer;

        // widget definition
        binding.name = widgetDefinition.name;
        binding.flow = widgetDefinition.flow;

        // widget designer definition
        if (widgetDesignerDefinition) {
            binding.displayName = widgetDesignerDefinition.displayName;
            binding.editor = widgetDesignerDefinition.editorComponent;
            binding.draggable = widgetDesignerDefinition.draggable;
        }

        binding.applyChanges = async () => {
            await viewModelBinder.modelToViewModel(model, binding.viewModel, bindingContext);
            eventManager.dispatchEvent("onContentUpdate");
        };
        binding.onCreate = async (viewModelInstance) => {
            await viewModelBinder.modelToViewModel(model, binding.viewModel, bindingContext);
        };
        binding.onDispose = async () => {
            if (model.styles?.instance) {
                bindingContext.styleManager.removeStyleSheet(model.styles.instance.key);
            }
        };

        return binding;
    }
}