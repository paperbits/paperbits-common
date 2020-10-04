export interface ResizableOptions {
    /**
     * Allowed values: "none", "vertically", "horizontally".
     */
    directions: string;
    onresize?: () => void;
    initialWidth?: number;
    initialHeight?: number;
}
