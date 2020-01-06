import "reflect-metadata";

export function Watch(propertyName: string): MethodDecorator {
    return function (target: any, propertyKey: string): any {
        Reflect.defineMetadata("watch", propertyName, target[propertyKey]);
    };
}
