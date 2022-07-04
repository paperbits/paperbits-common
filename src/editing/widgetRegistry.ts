import { Bag } from "../bag";
import { WidgetBinding, ComponentFlow, IWidgetOrder, IWidgetHandler } from "./";
import { EventManager, Events } from "../events";
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
    category?: string;
    requires?: string[];
    draggable: boolean;
}

export class WidgetRegistry {
    private widgetEntries: Bag<WidgetDefinition> = {};
    private widgetDesignerEntries: Bag<WidgetDesignerDefinition> = {};

    constructor(private readonly injector: IInjector) { }

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

    public getWidgetDesignerDefinitions(): WidgetDesignerDefinition[] {
        return Object.values(this.widgetDesignerEntries);
    }

    public async createWidgetBinding<TModel, TViewModel>(widgetDefinition: WidgetDefinition, model: any, bindingContext: Bag<any>): Promise<WidgetBinding<TModel, TViewModel>> {
        const widgetDesignerDefinition = this.widgetDesignerEntries[widgetDefinition.name];
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
        binding.wrapped = binding.flow !== ComponentFlow.Contents;

        // widget designer definition
        if (widgetDesignerDefinition) {
            binding.displayName = widgetDesignerDefinition.displayName;
            binding.editor = widgetDesignerDefinition.editorComponent;
            binding.handler = widgetDesignerDefinition.handlerComponent
            binding.draggable = widgetDesignerDefinition.draggable;
        }

        binding.applyChanges = async () => {
            await viewModelBinder.modelToViewModel(model, binding.viewModel, bindingContext);
            eventManager.dispatchEvent(Events.ContentUpdate);
        };

        binding.onCreate = () => viewModelBinder.modelToViewModel(model, binding.viewModel, bindingContext);

        binding.onDispose = async () => {
            if (model.styles?.instance) {
                bindingContext.styleManager.removeStyleSheet(model.styles.instance.key);
            }
        };

        return binding;
    }
}