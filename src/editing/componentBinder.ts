import { WidgetBinding } from "./widgetBinding";

export interface ComponentBinder {
    init(element: Element, binding: WidgetBinding): void;
    dispose?(element: Element, binding: WidgetBinding): void;
}