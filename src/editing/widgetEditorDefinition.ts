export interface WidgetEditorDefinition {
    /**
     * 
     */
    displayName: string; // Widget display name

    /**
     * 
     */
    componentDefinition: any;

    /**
     * 
     */
    componentBinder: Function;

    /**
     * 
     */
    handlerComponent: Function;

    /**
     * Widget icon CSS class, e.g. `widget-icon widget-icon-button`. Used in "Add widget" dialog.
     */
    iconClass?: string; 

    /**
     * Widget icon URL. Used in "Add widget" dialog.
     */
    iconUrl?: string;

    /**
     * Widget category, e.g. `Forms`. Used in "Add widget" dialog.
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
}
