import { IWidgetFactoryResult } from "../editing";

/**
 * Structure exposing methods to create HTML element or a model for particular widget.
 */
export interface IWidgetOrder {
    /**
     * Name of the widget, e.g. `form`.
     */
    name?: string;

    /**
     * Display name of the widget, e.g. `Form`.
     */
    displayName?: string;

    /**
     * Category of the widget, e.g. `Forms`.
     */
    category?: string;

    /**
     * Icon CSS class (alternative to `iconUrl` option), e.g. `widget-icon widget-icon-form`.
     */
    iconClass?: string;

    /**
     * Icon URL (alternative to `iconClass` option), e.g. `https://cdn.paperbits.io`.
     */
    iconUrl?: string;

    /**
     * Widget model factory method. Invoked when widget gets added to the content.
     */
    createModel?<TModel>(): Promise<TModel>;

    /**
     * List of features required for this widget.
     */
    requires?: string[];
}
