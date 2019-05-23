import "reflect-metadata";
import { IInjector, IInjectorModule } from "../injection";
import { inject, injectable, Container, decorate, interfaces, multiInject, LazyServiceIdentifer } from "inversify";

export class InversifyInjector implements IInjector {
    private kernel: Container;

    constructor() {
        this.bindSingleton = this.bindSingleton.bind(this);
        this.bind = this.bind.bind(this);

        this.kernel = new Container();
    }

    public getFunctionArguments(func): string[] {
        if (!func) {
            throw new Error(`Parameter "func" cannot be empty`);
        }

        if (typeof func !== "function") {
            throw new Error(`Parameter "func" is not a function.`);
        }

        const signature = func.toString();

        const classMatches = signature.match(/constructor.*?\(([^)]*)\)/);

        if (classMatches && classMatches.length >= 1) {
            const args = classMatches[1];
            return args.split(",").map((arg) => arg.replace(/\/\*.*\*\//, "").trim()).filter((arg) => arg);
        }

        const functionMatches = signature.match(/function.*?\(([^)]*)\)/);

        if (functionMatches && functionMatches.length >= 1) {
            const args = functionMatches[1];
            return args.split(",").map((arg) => arg.replace(/\/\*.*\*\//, "").trim()).filter((arg) => arg);
        }

        return [];
    }

    private decorateComponent(name: string, component: any): void {
        try {
            decorate(injectable(), component);
        }
        catch (error) {
            console.warn(`Unable to decorate component "${name}". ${error}`);
        }

        const constructorArguments = this.getFunctionArguments(component);

        for (let i = 0; i < constructorArguments.length; i++) {
            try {
                decorate(inject(constructorArguments[i]), component, i);
            }
            catch (error) {
                console.warn(`Unable to decorate constructor argument "${constructorArguments[i]}" for component "${name}". ${error}`);
            }
        }
    }

    private bindInternal<T>(name: string, component: any): interfaces.BindingInWhenOnSyntax<T> {
        if (this.kernel.isBound(name)) {
            this.kernel.unbind(name);
        }

        this.decorateComponent(name, component);

        return this.kernel.bind<T>(name).to(component);
    }

    public bind(name: string, transient: any): void {
        this.bindInternal(name, transient);
    }

    public bindSingleton(name: string, singletone: any): void {
        this.bindInternal(name, singletone).inSingletonScope();
    }

    public bindFactory<T>(name, factory: (ctx: IInjector) => T): void {
        let injector = this;

        const construct: any = function () {
            return factory(injector);
        }
        this.bindInternal(name, construct);
    }

    public bindSingletonFactory<T>(name, factory: (ctx: IInjector) => T): void {
        const injector = this;

        const construct: any = function () {
            return factory(injector);
        }
        this.bindInternal(name, construct).inSingletonScope(); // TODO: Read how to bind factory
    }

    public bindInstance<T>(name: string, instance: T): void {
        if (this.kernel.isBound(name)) {
            this.kernel.unbind(name);
        }

        this.kernel.bind(name).toConstantValue(instance);
    }

    public resolve<TImplementationType>(runtimeIdentifier: string): TImplementationType {
        const component = this.kernel.get<TImplementationType>(runtimeIdentifier);

        if (!component) {
            throw new Error(`Component ${runtimeIdentifier} not found.`);
        }

        return component;
    }

    public bindModule(module: IInjectorModule): void {
        module.register(this);
    }

    public bindCollection(collectionName: string): void {
        const kernel = this.kernel;
        const result = [];

        @injectable()
        class Placeholder { }

        @injectable()
        class Collection {
            constructor() {
                setImmediate(() => {
                    try {
                        const collection = kernel.getAll(collectionName + "C");

                        result.push(...collection.slice(1));
                    }
                    catch (error) {
                        throw new Error(`Unable to resolve collection ${collectionName}: ${error}`);
                    }
                });

                return result;
            }
        }
        this.kernel.bind<any>(collectionName).to(Collection).inSingletonScope();
        this.kernel.bind<any>(collectionName + "C").to(Placeholder);
    }

    public bindToCollection(collectionName: string, component: any, name?: string): void {
        this.decorateComponent(collectionName + "C", component);
        this.kernel.bind<any>(collectionName + "C").to(component);

        if (name) {
            this.kernel.bind<any>(name).to(component);
        }
    }

    public bindInstanceToCollection(collectionName: string, instance: any, name?: string): void {
        this.kernel.bind<any>(collectionName + "C").toConstantValue(instance);

        if (name) {
            this.kernel.bind<any>(name).toConstantValue(instance);
        }
    }
}