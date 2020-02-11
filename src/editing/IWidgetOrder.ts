import { IWidgetFactoryResult } from "../editing";

/**
 * Structure exposing methods to create HTML element or a model for particular widget.
 */
export interface IWidgetOrder {
    /**
     * Name of a widget created by this widget order.
     */
    name: string;

    /**
     * Display name of the widget created by this widget order.
     */
    displayName: string;

    /**
     * Category of the widget.
     */
    category?: string;

    /**
     * Icon CSS class.
     */
    iconClass?: string;

    /**
     * Widget factory method.
     */
    createWidget?(): IWidgetFactoryResult<any>;

    /**
     * Widget model factory method. Invoked when widget gets added to the content.
     */
    createModel(): Promise<any>;

    /**
     * List of features required for this widget.
     */
    requires: string[];
}
