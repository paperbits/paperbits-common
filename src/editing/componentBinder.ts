import { WidgetBinding } from "./widgetBinding";

export interface ComponentBinder {
    init(element: Element, binding: WidgetBinding<any, any>): void;
    dispose?(element: Element, binding: WidgetBinding<any, any>): void;
}