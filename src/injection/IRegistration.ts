import { IInjector } from '../injection/IInjector';

export interface IInjectorModule {
    register(injector: IInjector): void;
}
