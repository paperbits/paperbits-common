import { IWidgetOrder, WidgetContext } from "../editing";
import { StyleDefinition } from "../styles";
import { IContextCommandSet } from "../ui";
import { DragSession } from "../ui/draggables";


/**
 * The widget handler gives the editor required context to manipulate the widget model. For example,
 * it describes how the widget gets created, how it responds to drag'n'drop events, what contextual
 * commands it supports, etc.
 */
export interface IWidgetHandler {
    /**
     * Creates model of the widget when it's being added into content.
     */
    getWidgetModel?<TModel>(): Promise<TModel>;

    /**
     * Returns set of commands used in the designer context menu,
     * @param context Widget context in the designer.
     */
    getContextCommands?(context: WidgetContext): IContextCommandSet;

    /**
     * Inicates if the dragged object can be dropped on the widget.
     * @param dragSession Drag session.
     */
    canAccept?(dragSession: DragSession): boolean;

    /**
     * Event firing when user hovers the dragged object over the widget.
     * @param dragSession Drag session.
     */
    onDragOver?(dragSession: DragSession): void;

    /**
     * Event firing when user drops the dragged object on the widget.
     * @param dragSession Drag session.
     */
    onDragDrop?(dragSession: DragSession): void;

    /**
     * Returns widget style definitions.
     */
    getStyleDefinitions?(): StyleDefinition;

    /**
     * @deprecated Please use `registerWidgetEditor` method and move widget model creation logic
     * from `getWidgetOrder` to `getWidgetModel`.
     */
    getWidgetOrder?(): Promise<IWidgetOrder>;
}