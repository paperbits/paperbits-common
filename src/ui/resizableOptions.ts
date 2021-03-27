export interface ResizableOptions {
    /**
     * Allowed values: "none", "vertically", "horizontally".
     */
    directions: string;

    /**
     * Callback delegate invoked when element gets resized.
     */
    onresize?: () => void;

    /**
     * Initial width of resizable element.
     */
    initialWidth?: number;

    /**
     * Initial height of resizable element.
     */
    initialHeight?: number;
}
