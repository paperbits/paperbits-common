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
    None = "none",

    /**
     * @deprecated
     */
    Legacy = "legacy"
}