export enum Events {
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
    Blur = "blur"
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