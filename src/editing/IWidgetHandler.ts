import { IWidgetOrder, WidgetContext } from "../editing";
import { StyleDefinition } from "../styles";
import { IContextCommandSet } from "../ui";
import { DragSession } from "../ui/draggables";


/**
 * The widget handler gives the editor required context to manipulate the widget model. For example,
 * it describes how the widget gets created, how it responds to drag'n'drop events,
 * what contextual commands it supports, etc.
 */
export interface IWidgetHandler {
    /**
     * Creates model of the widget when it's being added into content.
     */
    getWidgetModel?<TModel>(): Promise<TModel>;

    /**
     * 
     * @param context 
     */
    getContextCommands?(context: WidgetContext): IContextCommandSet;

    /**
     * 
     * @param dragSession 
     */
    canAccept?(dragSession: DragSession): boolean;

    /**
     * 
     * @param dragSession 
     */
    onDragOver?(dragSession: DragSession): void;

    /**
     * 
     * @param dragSession 
     */
    onDragDrop?(dragSession: DragSession): void;

    /**
     * 
     */
    getStyleDefinitions?(): StyleDefinition;

    /**
     * @deprecated Please use `registerWidgetEditor` method and move widget model creation logic from `getWidgetOrder` to `getWidgetModel`.
     */
    getWidgetOrder?(): Promise<IWidgetOrder>;
}