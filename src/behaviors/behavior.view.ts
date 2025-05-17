import { View } from "@paperbits/common/ui";
import { BehaviorHandle } from "./behavior"; // Assuming BehaviorHandle is defined in behavior.ts in the same directory

export class ViewBehavior {
    public static attach(element: HTMLElement, view: View): BehaviorHandle {
        const component = view.component;
        const componentBinder = component.binder;

        if (!componentBinder) {
            // This behavior should only be called when a componentBinder exists.
            // The calling code (e.g., the Knockout binding handler) is responsible for
            // handling cases where componentBinder is undefined.
            throw new Error("ViewBehavior.attach was called, but view.component.binder is undefined. This indicates an issue with the calling code.");
        }

        // Bind the component using the custom binder
        componentBinder.bind(element, component.definition, component.params);

        // Return a BehaviorHandle with a dispose method for cleanup
        if (componentBinder.unbind) {
            return {
                detach: () => {
                    componentBinder.unbind(element);
                }
            };
        } else {
            // If there's no unbind method, provide a no-op dispose
            return {
                detach: () => { /* No operation */ }
            };
        }
    }
}
