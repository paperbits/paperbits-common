import { IComponent } from "./IComponent";

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
     * Allowed values: "vertically", "horizontally".
     */
    resize?: string;

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

    hitTest?(element: HTMLElement): boolean;
}