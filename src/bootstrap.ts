import { IInjectorModule, InversifyInjector } from "./injection";


export function bootstrapModule(module: IInjectorModule): void {
    const injector = new InversifyInjector();
    injector.bindModule(module);
    injector.resolve("autostart");
}
