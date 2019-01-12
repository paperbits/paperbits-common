import * as ko from "knockout";
// import "@webcomponents/webcomponentsjs/custom-elements-es5-adapter";
// import "@webcomponents/webcomponentsjs/webcomponents-bundle";

export function RuntimeComponent(config) {
    return (target) => {
        class RuntimeComponentProxy extends HTMLElement {
            constructor() {
                super();
                const element = <any>this;
                setTimeout(() => {
                     ko.applyBindingsToNode(element, { component: { name: config.selector, viewModel: target } });
                }, 10);
            }
        }

        customElements.define(config.selector, RuntimeComponentProxy);
    };
}