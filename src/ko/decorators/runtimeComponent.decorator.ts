import * as ko from "knockout";

export function RuntimeComponent(config: any) {
    return (target) => {

        let onDispose: () => void;

        class RuntimeComponentProxy extends HTMLElement {
            public connectedCallback(): void {
                const element = <any>this;

                ko.applyBindingsToNode(element, {
                    component: {
                        name: config.selector,
                        viewModel: target,
                        oncreate: (viewModelInstance) => {
                            onDispose = viewModelInstance.dispose;
                        }
                    }
                }, null);
            }

            public disconnectedCallback(): void {
                if (onDispose) {
                    onDispose();
                }
            }
        }

        customElements.define(config.selector, RuntimeComponentProxy);
    };
}