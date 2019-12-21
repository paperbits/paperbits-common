import * as ko from "knockout";
import "@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"; 

export function RuntimeComponent(config: any): (target: Function) => void {
    return (target) => {

        let onDispose: () => void;

        class RuntimeComponentProxy extends HTMLElement {
            constructor() {
                super();
                
                const element = <HTMLElement>this;

                setTimeout(() => {
                    ko.applyBindingsToNode(element, {
                        component: {
                            name: config.selector,
                            viewModel: target,
                            params: element.getAttribute("params"),
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