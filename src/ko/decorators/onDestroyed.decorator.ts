import "reflect-metadata";

export function OnDestroyed(name?: string): MethodDecorator {
    return function (target: any, propertyKey: string) {
        let props: string[] = Reflect.getMetadata("ondestroyed", target.constructor);

        if (!props) {
            props = [];
        }

        props.push(propertyKey);

        Reflect.defineMetadata("ondestroyed", props, target.constructor);
    };
}