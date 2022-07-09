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
    /**
     * Widget icon. Used in "Add widget" dialog.
     */
    iconClass?: string; // "widget-icon widget-icon-button";

    /**
     * Widget icon. Used in "Add widget" dialog.
     */
    iconUrl?: string;

    /**
     * Widget category, e.g. "Forms". Used in "Add widget" dialog.
     */
    category?: string;

    /**
     * List of features exposed by the container (given this widget has a container).
     */
    provides?: string[];

    /**
     * List of features required for this widget.
     */
    requires?: string[];

    /**
     * Indicates that the widget can be selected in the content editor.
     */
    selectable?: boolean;

    /**
     * Indicates that the widget can be dragged in the content editor.
     */
    draggable?: boolean;

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