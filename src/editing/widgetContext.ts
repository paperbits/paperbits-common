import { WidgetModel } from "../widgets";
import { GridItem } from "./gridItem";
import { IWidgetBinding } from "./IWidgetBinding";


/**
 * Widget context used for configuring contextual editors.
 */
export interface WidgetContext {
    /**
     * Model attached to dragged (source) element.
     */
    model?: WidgetModel;

    /**
     * Widget binding attached to source element.
     */
    binding?: IWidgetBinding<any, any>;

    /**
     * Model attached to parent of dragged element.
     */
    parentModel?: WidgetModel;

    /**
     * Widget bindhing of parent widget.
     */
    parentBinding?: IWidgetBinding<any, any>;

    /**
     * Indicates which side of this widget the new widget shall land, e.g. `bottom`.
     */
    half?: string;

    /**
     * Feature provider tags used for filtering widgets in the widget selector, e.g. "html", "js", "email".
     */
    providers?: string[];

    /**
     * Switches widget selection to parent widget.
     */
    switchToParent: () => void;

    /**
     * Associated grid item.
     */
    gridItem: GridItem;
}