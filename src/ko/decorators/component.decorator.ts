import "reflect-metadata";
import * as ko from "knockout";

export enum Encapsulation {
    none = "none",
    shadowDom = "shadowDom"
}

export interface ComponentConfig {
    selector: string;
    template: string;
    injectable?: string;
    postprocess?: (element: Node, viewModel: any) => void;
    encapsulation?: Encapsulation; 
}

export function Component(config: ComponentConfig): ClassDecorator {
    return function (target: any) {
        ko.components.register(config.selector, {
            template: config.template,
            viewModel: { injectable: config.injectable || target.name },
            postprocess: config.postprocess,
            synchrounous: true,
            encapsulation: config.encapsulation
        });

        Reflect.defineMetadata("knockout-component", { name: config.selector, constructor: target }, target);
    };
} 