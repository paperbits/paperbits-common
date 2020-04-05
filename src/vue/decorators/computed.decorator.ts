export function Computed(): MethodDecorator {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata("computed", propertyKey, target[propertyKey]);
    };
}
