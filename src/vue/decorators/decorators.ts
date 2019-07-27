import "reflect-metadata";
import { Component } from "./Component";
import { LifecylceHook } from "./LifecylceHook";

export declare var Vue;

export const OnBeforeCreate = () => LifecylceHook("beforeCreate");
export const OnCreated = () => LifecylceHook("created");
export const OnBeforeMount = () => LifecylceHook("beforeMount");
export const OnMounted = () => LifecylceHook("mounted");
export const OnBeforeDestroy = () => LifecylceHook("beforeDestroy");
export const OnDestroyed = () => LifecylceHook("destroyed");
export const OnBeforeUpdate = () => LifecylceHook("beforeUpdate");
export const OnUpdated = () => LifecylceHook("updated");
export const OnActivated = () => LifecylceHook("activated");
export const OnDeactivated = () => LifecylceHook("deactivated");
export const OnRender = () => LifecylceHook("render");
export const OnErrorCaptured = () => LifecylceHook("errorCaptured");

Component.prototype.getInstance = (constructor) => {
    return new constructor();
};