import "reflect-metadata";
import * as ko from "knockout";
import "../templateEngines/stringTemplateEngine";
import { Bag } from "../..";

export enum Encapsulation {
    none = "none",
    shadowDom = "shadowDom"
}

export interface ComponentConfig {
    /**
     * Component selector, e.g. "button".
     */
    selector: string;

    /**
     * Knockout template.
     */
    template: string;

    /**
     * @deprecated. This property is not used anymore and can be safely removed.
     */
    injectable?: string;

    /**
     * Indicated encapsulation mode.
     */
    encapsulation?: Encapsulation;

    /**
     * Child templates.
     */
    childTemplates?: Bag<string>;
}

export function Component(config: ComponentConfig): ClassDecorator {
    return function (target): any {
        ko.components.register(config.selector, {
            template: config.template,
            viewModel: target,
            synchronous: false,
            encapsulation: config.encapsulation
        });

        if (config.childTemplates) {
            Object.keys(config.childTemplates).forEach(templateName => {
                if (ko["templates"][templateName]) {
                    throw new Error(`Template "${templateName}" already defined.`);
                }

                ko["templates"][templateName] = config.childTemplates[templateName];
            });
        }

        Reflect.defineMetadata("paperbits-component", {
            name: config.selector,
            constructor: target
        }, target);
    };
} 