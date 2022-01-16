import { IInjectorModule, InversifyInjector } from "./injection";

let initialized: boolean = false;

export function bootstrapModule(module: IInjectorModule): void {
    if (initialized) {
        console.warn(`No need to invoke "bootstrapModule" more than once. The application already bootstrapped.`);
        return;
    }

    const injector = new InversifyInjector();
    injector.bindModule(module);
    injector.resolve("autostart");
    initialized = true;
}
