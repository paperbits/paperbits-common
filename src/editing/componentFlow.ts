/**
 * Defines the wrapper for component element. Certain frameworks (like Knockout) do not replace a root element
 * when initializing a component, and hence, may need a wrapper.
 */
export enum ComponentFlow {
    /**
     * The component resides along with other inline components in the same line, if there is available space.
     */
    Inline = "inline",

    /**
     * The component takes all availables space in the line.
     */
    Block = "block",

    /**
     * Doesn't apply any flows.
     */
    Placeholder = "placeholder",

    /**
     * Doesn't apply any flows.
     */
    None = "contents",

    /**
     * @deprecated
     */
    Legacy = "legacy"
}