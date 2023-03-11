import { BehaviorHandle } from "./behavior";
import { Events } from "../events";
import { Keys } from "../keyboard";

export interface ActivateBehaviorOptions {
    data: unknown;
    onActivate: (data: unknown) => void;
}


export class ActivateBehavior {
    public static attach(element: HTMLElement, config: ActivateBehaviorOptions): BehaviorHandle {
        const onActivate = config.onActivate;
        const data = config.data;

        if (!onActivate) {
            console.warn(`Callback function for binding handler "activate" in undefined.`);
            const handle: BehaviorHandle = { detach: () => { } };
            return handle;
        }

        const callback = onActivate;

        const onClick = (event: MouseEvent): void => {
            event.preventDefault();
            event.stopImmediatePropagation();
            callback(data);
        };

        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key !== Keys.Enter && event.key !== Keys.Space) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();
            callback(data);
        };

        element.addEventListener(Events.KeyDown, onKeyDown);
        element.addEventListener(Events.Click, onClick);

        const handle: BehaviorHandle = {
            detach: () => {
                element.removeEventListener(Events.Click, onClick);
                element.removeEventListener(Events.KeyDown, onKeyDown);
            }
        }

        return handle;
    }
}