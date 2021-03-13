/**
 * Returns closest element that satisfies the predicate.
 * @param node {Node} Node from which the search starts.
 * @param predicate {(node: Node) => boolean} Search predicate
 */
export function closest(node: Node, predicate: (node: Node) => boolean): Node {
    do {
        if (predicate(node)) {
            return node;
        }

        node = node.parentNode;
    }
    while (node);
}

export enum AriaAttributes {
    /**
     * Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.
     */
    expanded = "aria-expanded",

    /**
     * Defines a string value that labels the current element.
     */
    label = "aria-label",

    /**
     * Identifies the element (or elements) whose contents or presence are controlled by the current element.
     */
    controls = "aria-controls",

    /**
     * Indicates whether the element is exposed to an accessibility API.
     */
    hidden = "aria-hidden",

    /**
     * Indicates the current “selected” state of various widgets. See related aria-checked and aria-pressed.
     */
    selected = "aria-selected",

    /**
     * Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element.
     */
    hasPopup = "aria-haspopup",
}