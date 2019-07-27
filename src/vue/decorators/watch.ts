export function Watch(propertyName: string): MethodDecorator {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata("watch", propertyName, target[propertyKey]);
    };
}
