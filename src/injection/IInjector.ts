import { IInjector, IInjectorModule } from "../injection";

/**
 * A utility for building inversion of control containers.
 * @link https://paperbits.io/wiki/widget-anatomy#dependency-injection Dependency injection.
 */
export interface IInjector {
    /**
     * Binds a component.
     * @param name Name of the dependency, e.g. myComponent.
     * @param component A component being bound.
     */
    bind(name: string, component: any): void;

    /**
     * Binds a singletone component.
     * @param name Name of the dependency, e.g. myComponent.
     * @param singletone A singletone component being bound.
     */
    bindSingleton(name: string, singletone: any): void;

    /**
     * Binds an instance of a component (or any other entity that doesn't require inversion of control resolution).
     * @param name Name of the dependency, e.g. myInstance.
     * @param instance An instance being bound.
     */
    bindInstance<T>(name: string, instance: T): void;

    /**
     * Binds a module along with all the dependencies declared in it.
     * @param module A module being bound.
     */
    bindModule(module: IInjectorModule): void;

    /**
     * Binds a factory function that produces an instance of a component.
     * @param name Name of the dependency, e.g. myInstance.
     * @param factory A factory function.
     */
    bindFactory<T>(name: string, factory: (ctx: IInjector) => T): void;

    /**
     * Binds a singletone factory function that produces an instance of a component.
     * @param name Name of the dependency, e.g. myInstance.
     * @param factory A factory function.
     */
    bindSingletonFactory<T>(name: string, factory: (ctx: IInjector) => T): void;

    /**
     * Declares a collection of dependencies.
     * @param collectionName
     */
    bindCollection<T>(collectionName: string): void;

    /**
     * Declares a collection of dependencies that may contain with circular references.
     * @param collectionName Name of the collection, e.g. myCollection.
     */
    bindCollectionLazily<T>(collectionName: string): void;

    /**
     * Binds a particular component to a collection.
     * @param collectionName Name of the collection, e.g. myCollection.
     * @param component A component being bound.
     * @param componentName Name of the dependency, e.g. myComponent.
     */
    bindToCollection<T>(collectionName: string, component: any, componentName?: string): void;

    /**
     * Binds an instance of a component (or any other entity that doesn't require inversion of control resolution) to a collection.
     * @param collectionName 
     * @param instance 
     * @param componentName 
     */
    bindInstanceToCollection(collectionName: string, instance: any, componentName?: string): void;

    /**
     * Resolves specified dependecy by its name.
     * @param name Name of the dependency, e.g. myInstance.
     */
    resolve<T>(name: string): T;
}
