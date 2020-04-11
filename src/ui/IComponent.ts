/**
 * Definition of a UI component.
 */
export interface IComponent {
    /**
     * Component name.
     */
    name: string;

    /**
     * Constructor parameters.
     */
    params?: any;

    /**
     * A lifecycle hook fired after the component mounted.
     */
    oncreate?: (viewModel?: any, element?: HTMLElement) => void;
}