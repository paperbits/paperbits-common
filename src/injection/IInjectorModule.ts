import { IInjector } from "../injection";

export interface IInjectorModule {
    register(injector: IInjector): void;
}
