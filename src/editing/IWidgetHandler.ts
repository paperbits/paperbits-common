import { IWidgetOrder } from "../editing";
import { IContextualEditor } from "../ui";
import { DragSession } from "../ui/draggables";
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

export interface IWidgetHandler {
    getWidgetOrder?(): Promise<IWidgetOrder>;
    getContextualEditor?(context: WidgetContext): IContextualEditor;
    onDragOver?(dragSession: DragSession): boolean;
    onDragDrop?(dragSession: DragSession): void;
}