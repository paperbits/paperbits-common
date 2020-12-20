import * as ko from "knockout";
import { IWidgetBinding, WidgetBinding, WidgetStackItem } from "../editing";

export class GridHelper {

    private static getSelfAndParentElements(element: HTMLElement): HTMLElement[] {
        const stack = [];

        while (element) {
            stack.push(element);
            element = element.parentElement;
        }

        return stack;
    }

    public static getWidgetStack(element: HTMLElement): WidgetStackItem[] {
        const elements = this.getSelfAndParentElements(element);
        let lastAdded = null;
        const roots = [];

        elements.reverse().forEach(element => {
            const context = ko.contextFor(element);

            if (!context) {
                return;
            }

            const widgetBinding = context.$data instanceof WidgetBinding
                ? context.$data
                : context.$data?.widgetBinding;

            if (!widgetBinding || widgetBinding.readonly || lastAdded === widgetBinding) {
                return;
            }

            roots.push({
                element: element,
                binding: widgetBinding
            });

            lastAdded = widgetBinding;
        });

        return roots.reverse();
    }

    private static GetSelfAndParentBindings(element: HTMLElement): IWidgetBinding<any>[] {
        const context = ko.contextFor(element);

        if (!context) {
            return [];
        }

        const bindings: IWidgetBinding<any>[] = [];

        if (context.$data) {
            const widgetBinding = context.$data instanceof WidgetBinding
                ? context.$data // new
                : context.$data.widgetBinding; // legacy 

            bindings.push(widgetBinding);
        }

        let current = null;

        context.$parents.forEach(viewModel => {
            if (viewModel && viewModel !== current) {
                bindings.push(viewModel["widgetBinding"]);
                current = viewModel;
            }
        });

        return bindings;
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

    public static getWidgetBinding(element: HTMLElement): IWidgetBinding<any> {
        const bindings = this.GetSelfAndParentBindings(element);

        if (bindings.length > 0) {
            return bindings[0];
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