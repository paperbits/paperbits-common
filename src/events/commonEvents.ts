export enum Events {
    ContentUpdate = "onContentChange",
    ViewportChange = "onViewportChange",
    MouseUp = "mouseup",
    MouseDown = "mousedown",
    MouseEnter = "mouseenter",
    MouseLeave = "mouseleave",
    MouseMove = "mousemove",
    Click = "click",
    Scroll = "scroll",
    KeyUp = "keyup",
    KeyDown = "keydown",
    Focus = "focus",
    Blur = "blur",
    DragEnter = "dragenter",
    DragStart = "dragstart",
    DragOver = "dragover",
    DragLeave = "dragleave",
    Drop = "drop",
    DragEnd = "dragend",
    Paste = "paste",
    Error = "error",
    UnhandledRejection = "unhandledrejection"
}

export enum MouseButton {
    /**
     * Main button, usually the left button or the un-initialized state.
     */
    Main = 0,

    /**
     * Auxiliary button, usually the wheel button or the middle button (if present).
     */
    Auxiliary = 1,

    /**
     * Secondary button, usually the right button.
     */
    Secondary = 2
}