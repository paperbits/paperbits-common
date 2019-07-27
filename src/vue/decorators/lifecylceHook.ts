/**
 * https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks
 * @param hookName Name of the instance lifecycle hooks
 */
export function LifecylceHook(hookName: string) {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata("lifecycle", hookName, target[propertyKey]);
    };
}
