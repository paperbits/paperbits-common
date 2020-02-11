/**
 * Structure that binds widget view model to widget HTML element.
 */
export interface IWidgetBinding<TModel> {
    /**
     * Name of a widget.
     */
    name: string;

    /**
     * Widget display name.
     */
    displayName: string;

    /**
     * Callback method invoked when HTML element is created.
     */
    oncreate?: (viewModel: any) => void;

    /**
     * Widget model.
     */
    model?: TModel;

    /**
     * Registration name (tag name) of editor component.
     */
    editor?: string;

    editorResize?: string;

    hideCloseButton?: boolean;

    /**
     * Propagates changes from widget model to widget view model.
     */
    applyChanges?: (changes?: TModel) => void;

    readonly: boolean;

    /**
     * Either "box" or "fluid".
     */
    flow?: string;

    /**
     * List of features exposed by the container (given this widget has a container).
     */
    provides?: string[];

    handler?: any;

    onCreate?: () => void;

    onDispose?: () => void;

    draggable: boolean;
}