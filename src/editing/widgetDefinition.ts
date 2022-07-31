import { ComponentFlow } from "./componentFlow";

/**
 * Widget definition.
 */
export interface WidgetDefinition {
    /**
     * Component flow determines how component flows on the page, e.g. `inline` or `block`.
     */
    componentFlow?: ComponentFlow;

    /**
     * Component definition describes the component view model. Depending on the UI framework, it can be
     * shaped differently. For example, in React it's a class that extends `React.Component`. In Vue
     * it is an object describing the component with composition API or declaration options.
     */
    componentDefinition: any;

    /**
     * Component binder is a UI framework-specific utility that helps to create an instance of the component
     * and attach it to an HTML element. For example, ReactComponentBinder used to handle React components,
     * or KnockoutComponentBinder handles Knockout components.
     */
    componentBinder: Function;

    /**
     * Model binder is a utility for conversions between widget contract (the entity stored in the database)
     * and model (the entity used by the Paperbits framework as widget configuration).
     */
    modelBinder: Function;

    /**
     * Model definition is the entity used by the Paperbits framework as a widget configuration.
     */
    modelDefinition: any;

    /**
     * This is a UI framework-specific utility that translates the widget model into its view model (described
     * by the component definition).
     */
    viewModelBinder: Function;
}
