import * as ko from "knockout";

export function RuntimeComponent(config: any): (target: Function) => void {
    return (target) => {
        class RuntimeComponentProxy extends HTMLElement {
            constructor() {
                super();
            }

            public connectedCallback(): void {
                const element = <HTMLElement>this;

                setTimeout(() => {
                    ko.applyBindingsToNode(element, {
                        component: {
                            name: config.selector,
                            viewModel: target,
                            params: element.getAttribute("params")
                        }
                    }, null);
                }, 10);
            }

            public disconnectedCallback(): void {
                ko.cleanNode(this);
            }
        }

        customElements.define(config.selector, RuntimeComponentProxy);
    };
}