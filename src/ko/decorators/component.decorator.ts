import "reflect-metadata";
import * as ko from "knockout";

export interface ComponentConfig {
    selector: string;
    template: string;
    injectable?: string;
    postprocess?: (element: Node, viewModel) => void;
    encapsulation?: "none" | "shadowDom"; 
}

export function Component(config: ComponentConfig): ClassDecorator {
    return function (target) {
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