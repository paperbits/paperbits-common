import { IWidgetBinding } from "@paperbits/common/editing";

export class GridHelper {
    public static getParentElementWithModel<T>(element: HTMLElement): HTMLElement {
        let parent = element.parentElement;

        if (!parent) {
            return null;
        }

        let model = GridHelper.getModel(parent);

        if (model) {
            return parent;
        }

        return GridHelper.getParentElementWithModel(parent);
    }

    public static getViewModel<TViewModel>(element: Element): TViewModel {
        if (element["attachedViewModel"]) {
            return element["attachedViewModel"]
        }
        else {
            return null;
        }
    }

    public static getWidgetBinding(element: Element): IWidgetBinding {
        if (element["attachedViewModel"] &&
            element["attachedViewModel"]["widgetBinding"]) {
            return element["attachedViewModel"]["widgetBinding"]
        }
        else {
            return null;
        }
    }

    public static getModel(element: Element): any {
        let widgetModel = GridHelper.getWidgetBinding(element);

        if (widgetModel && widgetModel["model"]) {
            return widgetModel["model"];
        }
        else {
            return null;
        }
    }
}