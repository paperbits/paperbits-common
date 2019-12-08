import { IWidgetBinding } from ".";

export interface WidgetStackItem {
    element: HTMLElement;
    binding: IWidgetBinding<any>;
}
