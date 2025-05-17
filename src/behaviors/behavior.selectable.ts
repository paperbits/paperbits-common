import { BehaviorHandle } from "./behavior";

export class SelectableBehavior {
    public static attach(element: HTMLElement): BehaviorHandle {
        setImmediate(() => {
            if (element.classList.contains("selected")) {
                element.scrollIntoView({ block: "center" });
            }
        });

        return {
            detach: () => {
                // No specific cleanup needed for this behavior
            }
        };
    }
}