import { HyperlinkModel } from "../permalinks";

/**
 * Provider that helps to create a hyperlink out of a resource.
 */
export interface IHyperlinkProvider {
    /**
     * Display name of the provider, e.g. Pages.
     */
    name: string;

    /**
     * Name of the component that is used for hyperlink selection.
     */
    componentName: string;

    /**
     * CSS class used to display icon, e.g. `paperbits-icon paperbits-menu-4`.
     */
    iconClass: string;

    /**
     * Determines if this provider is suitable for a resource the permalink points to.
     */
    canHandleHyperlink?(contentItemKey: string): boolean;

    hyperlinkDetailsComponentName?: string;
}