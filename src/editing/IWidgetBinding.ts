import { DragSession } from "../ui/draggables/dragSession";
import { IContextualEditor } from "../ui";

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
    * ???
    */
    params?: Object;

    /**
     * Callback method invoked when HTML element is created.
     */
    oncreate?: (viewModel: any) => void;

    /**
     * Widget model.
     */
    model?: Object;

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
    onDragOver?: (dragSession: DragSession) => boolean;
    onDragDrop?: (dragSession: DragSession) => void;

    /**
    * Either "box" or "fluid".
    */
    flow?: string;

    getContextualEditor?: (element: HTMLElement, half?: string, placeholderElement?: HTMLElement, placeholderHalf?: string) => IContextualEditor;

}