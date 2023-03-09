import { BehaviorHandle } from "./behavior";
import { Events } from "../events";
import { Keys } from "../keyboard";



export class ActivateBehavior {
    public static attach(element: HTMLElement, config: any): BehaviorHandle {
        const onActivate = config.onActivate;
        const data  = config.data;

        if (!onActivate) {
            console.warn(`Callback function for binding handler "activate" in undefined.`);
            return null;
        }

       
        const callback = onActivate; //.bind(viewModel);

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