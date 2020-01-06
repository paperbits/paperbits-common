import Vue from "vue";

export function RuntimeComponent(config: any): (target: Function) => void {
    return (target) => {
        class RuntimeComponentProxy extends HTMLElement {
            private component: Vue;

            constructor() {
                super();
            }

            public connectedCallback(): void {
                const hostElement = document.createElement("vue-host");
                this.appendChild(hostElement);
                const construct = Vue.component(config.selector);
                this.component = new construct().$mount(hostElement);
            }

            public disconnectedCallback(): void {
                this.component.$destroy();
            }
        }

        customElements.define(config.selector, RuntimeComponentProxy);
    };
}