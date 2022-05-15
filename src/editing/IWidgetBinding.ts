/**
 * Structure that binds widget view model to widget HTML element.
 */
export interface IWidgetBinding<TModel, TViewModel> {
    /**
     * Name of a widget.
     */
    name: string;

    /**
     * Widget display name.
     */
    displayName: string;

    /**
     * Widget model.
     */
    model?: TModel;

    /**
     * Registration name (tag name) of editor component.
     */
    editor?: string;

    /**
     * Editor window resizing options, e.g. `vertically horizontally`.
     */
    editorResize?: string;

    /**
     * Indicates that scroll is required on overflow. Default: `true`.
     */
    editorScroll?: boolean;

    /**
     * Propagates changes from widget model to widget view model.
     */
    applyChanges?: (model?: TModel, viewModel?: TViewModel) => void;

    /**
     * Indicates whethere the widget should appear uneditable in the designer.
     */
    readonly?: boolean;

    /**
     * Name of the layer the widget resides in.
     */
    layer: string;

    /**
     * Determines how component flows on the page. Possible values: "inline" or "block".
     */
    flow?: string;

    /**
     * List of features exposed by the container (given this widget has a container).
     */
    provides?: string[];

    /**
     * Widget handler used by the designer.
     */
    handler?: any;

    /**
     * Callback invoked when the widget view model gets created.
     */
    onCreate?: () => void;

    /**
     * Callback invoked when the widget view model gets displosed.
     */
    onDispose?: () => void;

    /**
     * Indicates whether the widget can be moved in the designer.
     */
    draggable: boolean;
}