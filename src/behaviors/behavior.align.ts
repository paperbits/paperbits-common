import { BehaviorHandle } from "./behavior";
import { Events } from "../events";

export interface AlignBehaviorOptions {
    /**
     * Callback function to be invoked when the element is activated (e.g., clicked).
     */
    onAlign: () => void;
}

export class AlignBehavior {
    public static attach(element: HTMLElement, options: AlignBehaviorOptions): BehaviorHandle {
        const handleClick = (event: MouseEvent) => {
            event.preventDefault();
            event.stopImmediatePropagation(); // Added to prevent other click handlers if necessary
            options.onAlign();
        };

        element.addEventListener(Events.Click, handleClick);

        return {
            detach: () => {
                element.removeEventListener(Events.Click, handleClick);
            }
        };
    }
}