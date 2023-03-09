import { BehaviorHandle } from "./behavior";

export interface FocusOptions {
    childSelector: string;
}

export class FocusBehavior {
    public static attach(element: HTMLElement, options: boolean | FocusOptions): BehaviorHandle {
        setTimeout(() => {
            const type = typeof options;

            if (type === "boolean" && options) {
                element.focus();
                return;
            }

            const extendedOptions = <FocusOptions>options;

            if (type === "object" && extendedOptions.childSelector) {
                element = <HTMLElement>element.querySelector(extendedOptions.childSelector);

                if (element) {
                    element.focus();
                }
            }
        }, 100);

        const handle: BehaviorHandle = {
            detach: () => { }
        }

        return handle;
    }
}