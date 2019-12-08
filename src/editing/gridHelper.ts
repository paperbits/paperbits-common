import * as ko from "knockout";
import { IWidgetBinding, WidgetStackItem } from "../editing";

export class GridHelper {
    public static getWidgetStack(element: HTMLElement): WidgetStackItem[] {
        const stack: WidgetStackItem[] = [];

        do {
            const context = ko.contextFor(element);

            if (!context || !context.$data || !context.$data.widgetBinding || context.$data.widgetBinding.readonly) {
                element = element.parentElement;
                continue;
            }

            const binding: IWidgetBinding<any> = context.$data.widgetBinding;

            stack.push({
                element: element,
                binding: binding
            });

            element = element.parentElement;
        }
        while (element);

        return stack;
    }

    private static GetSelfAndParentViewModels(element: HTMLElement): any[] {
        const context = ko.contextFor(element);

        if (!context) {
            return [];
        }

        const viewModels = [];

        if (context.$data) {
            viewModels.push(context.$data);
        }

        let current = null;

        context.$parents.forEach(viewModel => {
            if (viewModel && viewModel !== current) {
                viewModels.push(viewModel);
                current = viewModel;
            }
        });

        return viewModels;
    }

    private static GetParentViewModels(element: HTMLElement): any[] {
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

    public static getParentWidgetBinding(element: HTMLElement): IWidgetBinding<any> {
        const viewModels = this.GetParentViewModels(element);

        if (viewModels.length === 0) {
            return null;
        }

        const parentViewModel = viewModels[0];
        return parentViewModel["widgetBinding"];
    }

    public static getParentWidgetBindings(element: HTMLElement): IWidgetBinding<any>[] {
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

    public static getWidgetBinding(element: HTMLElement): IWidgetBinding<any> {
        const viewModels = this.GetSelfAndParentViewModels(element);

        if (viewModels.length > 0) {
            return viewModels[0]["widgetBinding"];
        }
        else {
            return null;
        }
    }

    public static getModel(element: HTMLElement): any {
        const widgetModel = GridHelper.getWidgetBinding(element);

        if (widgetModel && widgetModel["model"]) {
            return widgetModel["model"];
        }
        else {
            return null;
        }
    }
}