import { IInjector } from '../injection/IInjector';

export interface IRegistration {
    register(injector: IInjector): void;
}
