import { BalloonActivationMethod } from "./balloonActivationMethod";
import { BalloonState } from "./balloonState";

export interface BalloonHandle {
    /**
     * Opens the balloon.
     * @param returnFocusTo {HTMLElement} Element that should get the focus after the balloon closes.
     */
    open: (returnFocusTo?: HTMLElement) => void;

    /**
     * Closes the balloon.
     */
    close: () => void;

    /**
     * Opens (if closed) or closes (if open) the balloon.
     */
    toggle: () => void;

    /**
     * Triggers the balloon position recalculation.
     */
    updatePosition: () => void;

    activateOn: BalloonActivationMethod;

    balloonState: BalloonState;
}
