import "reflect-metadata";
import { ComponentConfig } from "./componentConfig";
import Vue from "vue";


export function Component(config: ComponentConfig): ClassDecorator {
    return function (target) {
        const props = Reflect.getMetadata("props", target);

        const vueComponentConfig = {
            template: config.template,
            props: props,
            data: () => Component.prototype.getInstance(target),
            methods: {},
            computed: {},
            watch: {}
        };

        const propertyNames = Object.getOwnPropertyNames(target.prototype);

        propertyNames.forEach(name => {
            const method = target.prototype[name];

            if (typeof method !== "function" || name === "constructor") {
                return;
            }

            const lifecycleHook = Reflect.getMetadata("lifecycle", method);

            if (lifecycleHook) {
                vueComponentConfig[lifecycleHook] = method;
                return;
            }

            const computedPropertyName = Reflect.getMetadata("computed", method);

            if (computedPropertyName) {
                vueComponentConfig.computed[computedPropertyName] = method;
                return;
            }

            const watchPropertyName = Reflect.getMetadata("watch", method);

            if (watchPropertyName) {
                vueComponentConfig.watch[watchPropertyName] = method;
                return;
            }

            vueComponentConfig.methods[name] = method;
        });

        Vue.component(config.selector, vueComponentConfig);

        /*
            Just in case, async also supported:

            Vue.component(config.selector, function (resolve, reject) {
                setTimeout(function () {
                    resolve(vueComponentConfig)
                }, 1000)
            });
        */
    };
}
