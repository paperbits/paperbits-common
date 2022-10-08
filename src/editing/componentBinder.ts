export interface ComponentBinder {
    /**
     * Instantiates a component and attach it the HTML element.
     * @param element - HTML element that will host the component. 
     * @param componentDefinition - A component definition specific to used UI-framework.
     * @param componentParams - Parameters used for component instantiation.
     */
    bind(element: Element, componentDefinition: any, componentParams?: unknown): Promise<any>;

    /**
     * Detached the component from HTML element.
     * @param element - HTML element that hosts the component. 
     */
    unbind?(element: Element): Promise<any>;
}
