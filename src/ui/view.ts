import { IComponent } from "./IComponent";
import { PositioningOptions } from "./positioningOptions";
import { ResizableOptions } from "./resizableOptions";

export interface View {
    /**
     * View name, e.g. `picture-editor`.
     */
    name?: string;

    /**
     * View heading, e.g. "Picture editor".
     */
    heading?: string;

    /**
     * Definition of a UI component behind this view.
     */
    component?: IComponent;

    /**
     * Help heading.
     */
    helpHeading?: string;

    /**
     * Help text.
     */
    helpText?: string;

    /**
     * Help article URL. If specified, a help icon will be displayed in the view heading.
     */ 
    helpArticle?: string;

    /**
     * Host element.
     */
    element?: HTMLElement;

    /**
     * Requests closing the view.
     */
    close?(): void;

    /**
     * Close event delegate.
     */
    onClose?(): void;

    /**
     * Reference to an element that should receive focus when this view gets closed.
     */
    returnFocusTo?: HTMLElement;

    /**
     * Checks if speficied element belongs to this view.
     * @param element {HTMLElement} HTML element being checked.
     */
    hitTest?(element: HTMLElement): boolean;

    /**
     * Indicates that scroll is required on overflow. Default: `true`.
     */
    scrolling?: boolean;

    /**
     * Allowed values: `vertically`, `horizontally`.
     */
    resizing?: string | ResizableOptions;

    /**
     * Initial positioning of the view. If user moves the view, this value will be ignored.
     */
    positioning?: string | PositioningOptions;
}