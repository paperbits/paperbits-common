import { BalloonActivationMethod } from "./balloonActivationMethod";
import { BalloonHandle } from "./balloonHandle";
import { IComponent, ITemplate } from "..";


export interface BalloonOptions {
    /**
     * Preferred initial balloon position.
     */
    position: string;

    /**
     * A component to be displayed in the balloon (altenrative to a template).
     */
    component?: IComponent;

    /**
     * A template to be displayed in balloon (alternative to a component).
     */
    template?: ITemplate;

    /**
     * A function invoked when the balloon handle gets created.
     */
    onCreated?: (handle: BalloonHandle) => void;

    /**
     * A function invoked when the balloon gets opened.
     */
    onOpen?: () => void;

    /**
     * A function invoked when the balloon gets closed.
     */
    onClose?: () => void;

    /**
     * @deprecated Observable that closes the balloon when its value changes.
     */
    closeOn: ko.Subscribable;

    /**
     * Ballon closure timeout (in milliseconds).
     */
    closeTimeout?: number;

    /**
     *  The delay from the moment the trigger fires to the moment the balloon actually opens.
     */
    delay?: number;

    /**
     * Event that triggers balloon opening.
     */
    activateOn: BalloonActivationMethod;

    /**
     * Function that checks if balloon is disabled.
     */
    isDisabled?: () => boolean;
}