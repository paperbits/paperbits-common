import * as ko from "knockout";

export function RuntimeComponent(config: any): (target: Function) => void {
    return (target) => {

        let onDispose: () => void;

        class RuntimeComponentProxy extends HTMLElement {
            constructor() {
                super();
                const element = <any>this;

                setTimeout(() => {
                    ko.applyBindingsToNode(element, {
                        component: {
                            name: config.selector,
                            viewModel: target,
                            oncreate: (viewModelInstance) => {
                                onDispose = viewModelInstance.dispose;
                            }
                        }
                    }, null);
                }, 10);
            }

            public connectedCallback(): void { 
                // Not implemented
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