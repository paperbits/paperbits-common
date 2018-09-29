import { IWidgetOrder } from "../editing";
import { IContextualEditor } from "../ui";
import { DragSession } from "../ui/draggables";

export interface IWidgetHandler {
    getWidgetOrder?(): Promise<IWidgetOrder>;
    getContextualEditor?(element: HTMLElement, half: string, placeholderElement?: HTMLElement, placeholderHalf?: string): IContextualEditor;
    onDragOver?(dragSession: DragSession): boolean;
    onDragDrop?(dragSession: DragSession): void;
}