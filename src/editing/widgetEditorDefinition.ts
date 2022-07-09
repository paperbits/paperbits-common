export interface WidgetEditorDefinition {
    /**
     * 
     */
    displayName: string; // Widget display name

    /**
     * 
     */
    editorComponent: Function;

    /**
     * 
     */
    handlerComponent: Function;

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
}
