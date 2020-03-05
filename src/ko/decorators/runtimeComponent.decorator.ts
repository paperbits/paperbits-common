import * as ko from "knockout";

export function RuntimeComponent(config: any): (target: Function) => void {
    return (target) => {
        class RuntimeComponentProxy extends HTMLElement {
            constructor() {
                super();
            }

            static get observedAttributes(): string[] {
                return ["params"];
            }

            public connectedCallback(): void {
                const element = <HTMLElement>this;

                setTimeout(() => {
                    const params = element.getAttribute("params");
                    const paramsObservable = ko.observable(params);

                    ko.applyBindingsToNode(element, {
                        component: {
                            name: config.selector,
                            viewModel: target,
                            params: paramsObservable
                        }
                    }, null);
                }, 10);
            }

            public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
                const element = <HTMLElement>this;
                const isBound = !!ko.contextFor(element);

                if (!isBound) {
                    return;
                }

                /*
                 * TODO: Update paramsObservable using name instead of re-connecting:
                 * paramsObservable[name](newValue);
                 */

                // Reinitialize bindings.
                this.disconnectedCallback();
                this.connectedCallback();
            }

            public disconnectedCallback(): void {
                ko.cleanNode(this);
            }
        }

        customElements.define(config.selector, RuntimeComponentProxy);
    };
}