/**
 * A utility that controls the binding of a specific UI framework component to HTML element.
 */
export interface ComponentBinder {
    /**
     * Instantiates a component and attach it the HTML element.
     * @param element - HTML element that will host the component. 
     * @param componentDefinition - A component definition specific to used UI-framework.
     * @param componentParams - Parameters used for component instantiation.
     */
    bind<TInstance>(element: Element, componentDefinition: unknown, componentParams?: unknown): Promise<TInstance>;

    /**
     * Detached the component from HTML element.
     * @param element - HTML element that hosts the component. 
     */
    unbind?(element: Element): Promise<any>;
}
