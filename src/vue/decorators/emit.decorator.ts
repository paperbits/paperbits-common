export function Emit(eventName: string): PropertyDecorator {
    return function (target: any, propertyKey: string) {
        target[propertyKey] = function (...args) {
            this.$emit(eventName, ...args);
        };
    };
}
