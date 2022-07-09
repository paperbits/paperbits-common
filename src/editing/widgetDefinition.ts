import { ComponentFlow } from "./componentFlow";

export interface WidgetDefinition {
    modelClass: any;
    componentFlow: ComponentFlow;
    componentBinder: string; // ComponentBinder; // instead of "framework" property

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
