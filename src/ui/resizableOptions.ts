export interface ResizableOptions {
    /**
     * Allowed values: "none", "vertically", "horizontally", "left", "top".
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
