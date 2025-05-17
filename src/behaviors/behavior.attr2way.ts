import { BehaviorHandle } from "./behavior";

export interface Attr2wayConfig {
    [attributeName: string]: (value: string | null) => void; // Callback to update the observable
}

export class Attr2wayBehavior {
    public static attach(element: HTMLElement, config: Attr2wayConfig): BehaviorHandle {
        const attributeNames = Object.keys(config);
        let observer: MutationObserver | null = null;

        const callback: MutationCallback = (mutations: MutationRecord[]) => {
            if (!observer) return; // Observer might have been disconnected

            for (const mutation of mutations) {
                if (mutation.type === "attributes" && attributeNames.includes(mutation.attributeName)) {
                    const value = element.getAttribute(mutation.attributeName);
                    const observableUpdater = config[mutation.attributeName];

                    if (observableUpdater) {
                        // We don't have the original observable here to check the current value,
                        // so we call the updater directly. The original binding handler did this check.
                        // If this becomes an issue, the config might need to pass the observable itself
                        // or a getter for its current value.
                        observableUpdater(value);
                    }
                }
            }
        };

        observer = new MutationObserver(callback);
        observer.observe(element, { attributes: true });

        return {
            detach: () => {
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
            }
        };
    }
}
