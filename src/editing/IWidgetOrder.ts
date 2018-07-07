import { IWidgetFactoryResult, IWidgetOrder } from "../editing";

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
     * Icon CSS class.
     */
    iconClass?: string;

    /**
     * Widget factory method.
     */
    createWidget?(): IWidgetFactoryResult;

    /**
     * Widget model factory method.
     */
    createModel(): Promise<any>;

    /**
     * List of features required for this widget.
     */
    requires?: string[];
}
