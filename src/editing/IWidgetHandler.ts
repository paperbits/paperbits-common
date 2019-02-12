import { IWidgetOrder, WidgetContext } from "../editing";
import { IContextCommandSet } from "../ui";
import { DragSession } from "../ui/draggables";


export interface IWidgetHandler {
    getWidgetOrder?(): Promise<IWidgetOrder>;
    getContextualEditor?(context: WidgetContext): IContextCommandSet;
    onDragOver?(dragSession: DragSession): boolean;
    onDragDrop?(dragSession: DragSession): void;
}