import { IWidgetOrder, WidgetContext } from "../editing";
import { IContextualEditor } from "../ui";
import { DragSession } from "../ui/draggables";


export interface IWidgetHandler {
    getWidgetOrder?(): Promise<IWidgetOrder>;
    getContextualEditor?(context: WidgetContext): IContextualEditor;
    onDragOver?(dragSession: DragSession): boolean;
    onDragDrop?(dragSession: DragSession): void;
}