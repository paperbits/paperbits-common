import * as ko from "knockout";
import { IWidgetBinding } from "@paperbits/common/editing";

export class GridHelper {
    private static GetSelfAndParentViewModels(element) {
        const context = ko.contextFor(element);

        if (!context) {
            return [];
        }

        const viewModels = [];

        let current = null;

        context.$parents.forEach(viewModel => {
            if (viewModel && viewModel !== current) {
                viewModels.push(viewModel);
                current = viewModel;
            }
        });

        return viewModels;
    }

    private static GetParentViewModels(element) {
        const context = ko.contextFor(element);

        if (!context) {
            return [];
        }

        const viewModels = [];

        let current = context.$data;

        context.$parents.forEach(viewModel => {
            if (viewModel && viewModel !== current) {
                viewModels.push(viewModel);
                current = viewModel;
            }
        });

        return viewModels;
    }

    public static getParentWidgetBinding(element: HTMLElement): IWidgetBinding {
        const viewModels = this.GetParentViewModels(element);

        if (viewModels.length === 0) {
            return null;
        }

        const parentViewModel = viewModels[0];
        return parentViewModel["widgetBinding"];
    }

    public static getParentWidgetBindings(element: HTMLElement): IWidgetBinding[] {
        const bindings = [];
        const parentViewModels = this.GetParentViewModels(element);

        parentViewModels.forEach(x => {
            const binding = x["widgetBinding"];

            if (binding) {
                bindings.push(binding);
            }
        });

        return bindings;
    }

    public static getComponentRoots(elements: Element[]): any[] {
        let current = null;
        const roots = [];

        elements.reverse().forEach(x => {
            const context = ko.contextFor(x);

            if (context && context !== current) {
                roots.push(x);
                current = context;
            }
        });

        return roots.reverse();
    }

    public static getWidgetBinding(element: Element): IWidgetBinding {
        const viewModels = this.GetSelfAndParentViewModels(element);

        if (viewModels.length > 0) {
            return viewModels[0]["widgetBinding"];
        }
        else {
            return null;
        }
    }

    public static getModel(element: Element): any {
        const widgetModel = GridHelper.getWidgetBinding(element);

        if (widgetModel && widgetModel["model"]) {
            return widgetModel["model"];
        }
        else {
            return null;
        }
    }
}