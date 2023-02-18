import { ComponentBinder } from "../components";
import { IWidgetHandler } from "./IWidgetHandler";

/**
 * Widget editor definition.
 */
export interface WidgetEditorDefinition {
    /**
     * Name of the widget as it appears in the "Add widget" dialog and in the visual designer.
     */
    displayName: string; // Widget display name

    /**
     * Component definition is a class or object that is used to create a component instance. Depending on the
     * UI framework, it can be shaped differently. For example, in React it's a class that extends `React.Component`.
     * In Vue it is an object describing the component with composition API or declaration options.
     */
    componentDefinition: unknown;

    /**
     * Component binder is a UI framework-specific utility that helps to create an instance of the component
     * and attach it to an HTML element. For example, ReactComponentBinder used to handle React components,
     * or KnockoutComponentBinder handles Knockout components.
     */
    componentBinder: ComponentBinder | Function | string;

    /**
     * A widget handler gives the editor required context to manipulate the widget model. For example,
     * it describes how the widget gets created, what contextual commands it supports, etc.
     */
    handlerComponent: IWidgetHandler | Function | string;

    /**
     * A CSS class name, e.g. `widget-icon widget-icon-button`. Used to display widget icon in
     * the "Add widget" dialog.
     */
    iconClass?: string;

    /**
     * A URL of the image, e.g. `https://images.com/icon.png`. Used to display widget icon in the
     * "Add widget" dialog.
     */
    iconUrl?: string;

    /**
     * Widget category, e.g. `Forms`. Used for grouping in "Add widget" dialog.
     */
    category?: string;

    /**
     * List of features exposed by the container (given this widget can be a parent for other widgets).
     */
    provides?: string[];

    /**
     * List of features required for this widget.
     */
    requires?: string[];

    /**
     * This option indicates that the widget appears in "Add widget" dialog and can be selected in the
     * content editor. You may not want it to be selectable if a widget is part of another widget.
     * For example, the "Table cell" widget is a part of the "Table" widget, but it cannot be added or
     * deleted separately. Default: `true`.
     */
    selectable?: boolean;

    /**
     * This option indicates if the widget needs to be draggable in the content editor. You may not
     * want it to be draggable if a widget is part of another widget. For example, the Table cell widget
     * is a part of the Table widget, but it cannot not be dragged around. Default: `true`.
     */
    draggable?: boolean;

    /**
     * Specifies editor view resizing options. Default: `true`.
     */
    editorResizing?: boolean | string;

    /**
     * Specifies editor view scrolling options. Default: `true`.
     */
    editorScrolling?: boolean | string;
}
