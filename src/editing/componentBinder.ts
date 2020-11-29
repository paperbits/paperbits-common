import { WidgetBinding } from "./widgetBinding";

export interface ComponentBinder {
    init(element: HTMLElement, binding: WidgetBinding): void;
}