/**
 * Determines how component flows on the page, e.g. `inline` or `block`.
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
    Contents = "contents",

    /**
     * @deprecated
     */
    Legacy = "legacy"
}