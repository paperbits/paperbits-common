import { IWidgetOrder, WidgetContext } from "../editing";
import { IContextCommandSet } from "../ui";
import { DragSession } from "../ui/draggables";


export interface IWidgetHandler {
    getWidgetOrder?(): Promise<IWidgetOrder>;
    getContextualEditor?(context: WidgetContext): IContextCommandSet;
    canAccept?(dragSession: DragSession): boolean;
    onDragOver?(dragSession: DragSession): void;
    onDragDrop?(dragSession: DragSession): void;
}