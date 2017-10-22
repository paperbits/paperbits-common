import { IWidgetBinding } from "./IWidgetBinding";
import { IWidgetFactoryResult } from '../editing/IWidgetFactoryResult';
import { IWidgetOrder } from '../editing/IWidgetOrder';

/**
 * Structure exposing methods to create HTML element or a model for particular widget.
 */
export interface IWidgetOrder { //to be displayed in UI and enough to build new HTML element
    /**
     * Name of a widget created by this widget order.
     */
    name: string;

    /**
     * Display name of the widget created by this widget order.
     */
    displayName: string;

    /**
     * Widget factory method.
     */
    createWidget?(): IWidgetFactoryResult;

    /**
     * Widget model factory method.
     */
    createModel(): any;
}
