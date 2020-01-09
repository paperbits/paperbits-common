import { IWidgetOrder, WidgetContext } from "../editing";
import { IContextCommandSet } from "../ui";
import { DragSession } from "../ui/draggables";


/**
 * Handlers giving the editor required context to manupulate the widget. For example,
 * it describes how the widget gets created, how it responds to drag'n'drop events,
 * what contextual commands is supports, etc.
 */
export interface IWidgetHandler {
    getWidgetOrder?(): Promise<IWidgetOrder>;
    getContextualEditor?(context: WidgetContext): IContextCommandSet;
    canAccept?(dragSession: DragSession): boolean;
    onDragOver?(dragSession: DragSession): void;
    onDragDrop?(dragSession: DragSession): void;
}