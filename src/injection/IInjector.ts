import { IInjector, IInjectorModule } from "../injection";


export interface IInjector {
    bind(name: string, transient: any): void;
    bindSingleton(name: string, singletone: any): void;
    bindInstance<T>(name: string, instance: T): void;
    bindFactory<T>(name, factory: (ctx: IInjector) => T): void;
    bindSingletonFactory<T>(name, factory: (ctx: IInjector) => T): void;
    bindModule(module: IInjectorModule): void;
    resolve<TImplementationType>(runtimeIdentifier: string): TImplementationType;
    bindCollection<T>(collectionName: string): void;
    bindToCollection<T>(collectionName: string, component: any, name?: string): void;
    bindInstanceToCollection(collectionName: string, instance: any, name?: string): void;
}
