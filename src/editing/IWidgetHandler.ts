import { Bag } from "../bag";
import { IWidgetOrder, WidgetContext } from "../editing";
import { StyleDefinition } from "../styles";
import { IContextCommandSet } from "../ui";
import { DragSession } from "../ui/draggables";


/**
 * Handlers give the editor required context to manipulate the widget. For example,
 * it describes how the widget gets created, how it responds to drag'n'drop events,
 * what contextual commands is supports, etc.
 */
export interface IWidgetHandler {
    getWidgetOrder?(): Promise<IWidgetOrder>;
    getContextCommands?(context: WidgetContext): IContextCommandSet;
    canAccept?(dragSession: DragSession): boolean;
    onDragOver?(dragSession: DragSession): void;
    onDragDrop?(dragSession: DragSession): void;
    getStyleDefinitions?(): Bag<StyleDefinition>;
}