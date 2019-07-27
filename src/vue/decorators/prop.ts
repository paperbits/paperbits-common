export function Prop(): PropertyDecorator {
    return function (target: any, propertyKey: string) {
        let props: string[] = Reflect.getMetadata("props", target.constructor);
        if (!props) {
            props = [];
        }
        props.push(propertyKey);
        Reflect.defineMetadata("props", props, target.constructor);
    };
}
