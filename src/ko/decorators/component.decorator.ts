import "reflect-metadata";
import * as ko from "knockout";

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
}

export function Component(config: ComponentConfig): ClassDecorator {
    return function (target: new () => any): any {
        ko.components.register(config.selector, {
            template: config.template,
            viewModel: target,
            synchronous: false,
            encapsulation: config.encapsulation
        });

        Reflect.defineMetadata("knockout-component", { name: config.selector, constructor: target }, target);
    };
} 