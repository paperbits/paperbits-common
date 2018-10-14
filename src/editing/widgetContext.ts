import { WidgetModel } from "../widgets";
import { IWidgetBinding } from "./IWidgetBinding";


export interface WidgetContext {
    /**
     * Model attached to dragged (source) element.
     */
    model?: WidgetModel;

    /**
     * Widget binding attached to source element.
     */
    binding?: IWidgetBinding;

    /**
     * Model attached to parent of dragged element.
     */
    parentModel?: WidgetModel;

    /**
     * Widget bindhing of parent widget.
     */
    parentBinding?: IWidgetBinding;

    half?: string;

    providers?: string[];
}