import { IComponent } from "./IComponent";
import { ResizableOptions } from "./resizableOptions";

export interface View {
    /**
     * View heading, e.g. "Picture editor".
     */
    heading?: string;

    /**
     * Definition of a UI component behind this view.
     */
    component?: IComponent;

    /**
     * Allowed values: `vertically`, `horizontally`.
     */
    resize?: string | ResizableOptions;

    /**
     * Help text.
     */
    helpText?: string;

    /**
     * Host element.
     */
    element?: HTMLElement;

    /**
     * Requests closing the view.
     */
    close?(): void;

    /**
     * Reference to an element that should receive focus when this view gets closed.
     */
    returnFocusTo?: HTMLElement;

    /**
     * Checks if speficied element belongs to this view.
     * @param element {HTMLElement} HTML element being checked.
     */
    hitTest?(element: HTMLElement): boolean;
}