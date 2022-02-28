/**
 * Indicates an HTML element currently active in the editor.
 */
export interface ActiveElement {
    /**
     * Identifier.
     */
    key: string;

    /**
     * Currently active element in the editor.
     */
    element: HTMLElement;

    /**
     * Indicates the part of element area where the pointer (i.e. mouse cursor) is located.
     */
    half?: string;
}