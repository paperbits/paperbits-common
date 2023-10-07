import * as ko from "knockout";
import { IWidgetBinding, WidgetBinding } from "../editing";

export class GridHelper {
    public static getParentWidgetBindings(element: HTMLElement): IWidgetBinding<any, any>[] {
        const bindings = [];
        const parentViewModels = GridHelper.getParentViewModels(element);

        parentViewModels.forEach(x => {
            const binding = x["widgetBinding"];

            if (binding) {
                bindings.push(binding);
            }
        });

        return bindings;
    }

    private static getParentViewModels(element: HTMLElement): any[] {
        const context = ko.contextFor(element);

        if (!context) {
            return [];
        }

        const parentViewModels = context.$parents;
        const viewModels = [];

        let current = context.$data;

        parentViewModels.forEach(viewModel => {
            if (viewModel && viewModel !== current) {
                if (viewModel instanceof WidgetBinding) {
                    /**
                     * Hack to fix and issue. Need to figure out why widget binding is
                     * in the stack of view models.
                     */
                    return;
                }

                viewModels.push(viewModel);
                current = viewModel;
            }
        });

        return viewModels;
    }

    public static getParentWidgetBinding(element: HTMLElement): IWidgetBinding<any, any> {
        const parentViewModels = this.getParentViewModels(element);

        if (parentViewModels.length < 1) {
            return null;
        }

        const parentViewModel = parentViewModels[0]; // first parent view model

        return parentViewModel["widgetBinding"];
    }

    public static getWidgetBinding(element: HTMLElement): IWidgetBinding<any, any> {
        return GridHelper.getWidgetBindingFromElement(element)
    }

    public static getModel(element: HTMLElement): any {
        const widgetBinding = GridHelper.getWidgetBinding(element);
        return widgetBinding?.model || null;
    }

    public static getClosestParentBinding(element: HTMLElement): IWidgetBinding<any, any> {
        do {
            const widgetBinding = GridHelper.getWidgetBindingFromElement(element);

            if (widgetBinding) {
                return widgetBinding;
            }

            element = element.parentElement;
        }
        while (element)

        return null;
    }

    private static getWidgetBindingFromElement(element: HTMLElement): IWidgetBinding<any, any> {
        // Vue
        const vue = element["__vue__"];

        if (vue) {
            return vue["widgetBinding"];
        }

        // KO
        const context = ko.contextFor(element);

        if (context?.$data) {
            const widgetBinding = context.$data instanceof WidgetBinding
                ? context.$data // new
                : context.$data.widgetBinding; // legacy

            if (widgetBinding) {
                return widgetBinding;
            }
        }

        return null;
    }
}