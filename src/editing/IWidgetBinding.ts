import { DragSession } from "../ui/draggables";
import { WidgetModel } from "../widgets";

/**
 * Structure that binds widget view model to widget HTML element.
 */
export interface IWidgetBinding {
    name?: string;

    /**
     * Widget display name.
     */
    displayName?: string;

    /**
     * Callback method invoked when HTML element is created.
     */
    oncreate?: (viewModel: any) => void;

    /**
     * Widget model.
     */
    model?: WidgetModel;

    /**
     * Registration name (tag name) of editor component.
     */
    editor?: string;

    editorResize?: string;

    hideCloseButton?: boolean;

    /**
     * Propagates changes from widget model to widget view model.
     */
    applyChanges?: () => void;

    readonly?: boolean;

    /**
     * Either "box" or "fluid".
     */
    flow?: string;

    /**
     * List of features exposed by the container (given this widget has a container).
     */
    provides?: string[];

    handler?: any;
}