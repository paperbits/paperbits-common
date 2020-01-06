/**
 * Vue JS lifecycle hook helper.
 * https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks
 * @param hookName Name of the instance lifecycle hooks
 */
export function LifecycleHook(hookName: string): any {
    return function (target: any, propertyKey: string): any {
        Reflect.defineMetadata("lifecycle", hookName, target[propertyKey]);
    };
}
