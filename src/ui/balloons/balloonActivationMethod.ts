/**
 * Balloon activation method.
 */
export enum BalloonActivationMethod {
    /**
     * The balloon gets activated when the trigger control gets clicked or when it is foused and `Space` or `Enter` key gets pressed.
     */
    clickOrKeyDown = "clickOrKeyDown",

    /**
     * The balloon gets activated when the trigger control gets the focus or the pointer hovers over.
     */
    hoverOrFocus = "hoverOrFocus",

    /**
     * The balloon gets activated by receiving focus, hovering pointer, and `Space` or `Enter` key gets pressed.
     */
    all = "all"
}
